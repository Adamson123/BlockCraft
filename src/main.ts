import { boxesOnHover, board, hoverColor, gameScore } from "./globals.js";
import { populateShapes, Shape } from "./shape/shapes.js";
import Box, { populateBoxes } from "./box/box.js";
import { draw } from "./draw.js";
import { clickedItem, getMousePosition } from "./utils/utils.js";
import { playSound, toggleFullscreen, toggleSoundMode } from "./settings.js";
import { checkLose, toggleGameState } from "./gameState.js";
import { resetBoxesInOccupiedDimensions } from "./box/boxesHandler.js";
import { updateScore } from "./scoring.js";
import {
    bomb,
    specialtems,
    updateSpecialItemsCountDisplay,
} from "./specialtems.js";

const fullscreenBtn =
    document.querySelector<HTMLButtonElement>(".fullscreenBtn");
const soundBtn = document.querySelector<HTMLButtonElement>(".soundBtn");
const spinShapeItem = document.querySelector<HTMLDivElement>(".spinShapeItem")!;
const resetShapesItem =
    document.querySelector<HTMLDivElement>(".resetShapesItem")!;
const bombItem = document.querySelector<HTMLDivElement>(".bombItem")!;
let mousedown = false;
let spinMode = false;
//let bomb.bombMode = false;

let currentShape: Shape | undefined;

let boxes: Box[] = populateBoxes();
let shapes: Shape[] = populateShapes();

const updateShapePosition = (x: number, y: number) => {
    if (!currentShape || spinMode) return;

    // Calculate differences based on the first box position
    const dx = x - currentShape.boxes[0].x - currentShape.width / 2;
    const dy = y - currentShape.findHeight() - 10;

    // const dy = y - currentShape.boxes[0].y - currentShape.height - 15;

    currentShape.boxes.forEach((box: BoxShape) => {
        box.x = box.x + dx;
        box.y = box.y + dy;
    });

    draw(shapes, currentShape, boxes);
};

const handleShapeSelection = (event: MouseEvent | TouchEvent) => {
    const { x, y } = getMousePosition(event);
    for (const shape of shapes) {
        let clicked = false;
        for (const box of shape.boxes) {
            if (clickedItem(x, y, box)) {
                clicked = true;
                break;
            }
        }
        if (clicked) {
            currentShape = shape;
            if (!spinMode) currentShape.toMainShape();
            break;
        }
    }

    if (currentShape) {
        updateShapePosition(x, y);
        if (spinMode) {
            currentShape.spin();
            checkLose(boxes, shapes, checkLoseCallback);
        }
    }
};

const handleBombSelection = (event: MouseEvent | TouchEvent) => {
    const { x, y } = getMousePosition(event);
    if (clickedItem(x, y, bomb, bomb.size)) {
        console.log("Clicked bomb");
        bomb.bombSelected = true;
        updateBombPosition(x, y);
    } else {
        bomb.bombSelected = false;
    }
};

const updateBombPosition = (x: number, y: number) => {
    bomb.x = x - bomb.size / 2;
    bomb.y = y - bomb.size;
    bomb.updateImagePosition();
    draw(shapes, currentShape, boxes);
};

const handleMouseDown = (event: MouseEvent | TouchEvent) => {
    mousedown = true;
    if (bomb.bombMode) {
        handleBombSelection(event);
    } else {
        handleShapeSelection(event);
    }
};

const handleMouseMovement = (event: MouseEvent | TouchEvent) => {
    const { x, y } = getMousePosition(event);
    if (mousedown && currentShape && !spinMode) {
        updateShapePosition(x, y);
    }
    if (mousedown && bomb.bombMode && bomb.bombSelected) {
        updateBombPosition(x, y);
    }
};

const checkLoseCallback = (box: Box, lastBox: Box) => {
    box.color = hoverColor;
    draw(shapes, currentShape, boxes);
    if (lastBox.index === box.index) toggleGameState();
};
const resetBoxesCallback = () => {
    checkLose(boxes, shapes, checkLoseCallback);
    draw(shapes, currentShape, boxes);
};

const handleMouseOut = () => {
    mousedown = false;
    if (!spinMode && !bomb.bombMode) {
        if (!currentShape) {
            return;
        }
        // Call the shape's method to reset its position
        currentShape.toIdleShape();

        let noOccupiedDimension;
        if (boxesOnHover.boxes.size === currentShape.boxes.length) {
            boxesOnHover.boxes.forEach((boxNumber) => {
                boxes[(boxNumber as number) - 1]?.toOccupied(
                    (currentShape as Shape).color
                );
            });
            noOccupiedDimension = resetBoxesInOccupiedDimensions(
                boxes,
                resetBoxesCallback
            );
            shapes = shapes.filter(
                (shape) => shape.index !== currentShape!.index
            );
            playSound("glock");
        } else {
            playSound("woof");
        }
        //remove boxes that changed color when shape was dragged over them"
        boxesOnHover.emptyBoxesOnHover();

        currentShape = undefined;
        if (!shapes.length) shapes = populateShapes();

        if (!noOccupiedDimension) checkLose(boxes, shapes, checkLoseCallback);
        draw(shapes, currentShape, boxes);
    } else {
        if (currentShape || (bomb.bombSelected && !bomb.size))
            playSound("click");
        if (bomb.bombMode) {
            if (bomb.boxes.size) {
                const boxesToBomb = [...bomb.boxes].filter(
                    (boxIndex) => boxes[boxIndex - 1].isOccupied
                );
                const lastBox = boxesToBomb[boxesToBomb.length - 1];
                playSound("bomb");
                boxesToBomb.forEach((boxIndex) => {
                    boxes[boxIndex - 1].animate(
                        resetBoxesCallback,
                        lastBox === boxIndex
                    );
                });
                updateScore(0, boxesToBomb.length * 50, 0);
                bomb.bombMode = false;
                bombItem.style.border = "2px solid transparent";
            }
            bomb.resetBomb();
        }

        draw(shapes, currentShape, boxes, spinMode);
        currentShape = undefined;
    }
};

draw(shapes, currentShape, boxes);
updateSpecialItemsCountDisplay();

spinShapeItem.addEventListener("click", () => {
    //we have spin left? enter!
    //we are out of spin but we are in spinMode? enter!
    //we are out of spin and not in spinMode? Don't enter!!!
    if (specialtems.spin || spinMode) {
        //if we are trying tobv
        if (spinMode) {
            const rotatedShape = shapes.find(
                (shape) => !shape.isInDefaultShape()
            );
            if (rotatedShape) {
                console.log(rotatedShape.boxesChange);

                shapes.forEach((shape) => {
                    shape.updateDefaultBoxesChange();
                });
            } else {
                specialtems.spin++;
            }
            //if no shape was rotated increase the score back
        }
        spinMode = spinMode ? false : true;

        if (spinMode) {
            specialtems.spin--;
        }
        updateSpecialItemsCountDisplay();
        draw(shapes, currentShape, boxes, spinMode);
        spinShapeItem.style.border = spinMode
            ? "2px solid yellow"
            : "2px solid transparent";
    }
    playSound("click");
});

resetShapesItem.addEventListener("click", () => {
    if (specialtems.resetShapes) {
        specialtems.resetShapes--;
        updateSpecialItemsCountDisplay();
        shapes = populateShapes();
        draw(shapes, currentShape, boxes, spinMode);
    }
    playSound("click");
});

bombItem.addEventListener("click", () => {
    bomb.bombMode = bomb.bombMode ? false : true;
    // draw(shapes, currentShape, boxes, bomb.bombMode);
    bombItem.style.border = bomb.bombMode
        ? "2px solid rgb(221,72,68)"
        : "2px solid transparent";

    draw(shapes, currentShape, boxes, spinMode);
    playSound("click");
});

fullscreenBtn?.addEventListener("click", () => {
    toggleFullscreen(fullscreenBtn);
});
soundBtn?.addEventListener("click", () => {
    toggleSoundMode(soundBtn);
});
//pause
document
    .querySelector<HTMLButtonElement>(".pauseBtn")
    ?.addEventListener("click", () => toggleGameState());

//play
document
    .querySelector<HTMLButtonElement>(".playBtn")
    ?.addEventListener("click", () => toggleGameState());
//restart
document
    .querySelector<HTMLButtonElement>(".restartBtn")
    ?.addEventListener("click", () => {
        gameScore.score = 0;
        gameScore.surpassedHighScore = false;
        boxes = populateBoxes();
        shapes = populateShapes();
        updateScore(0, 0, 0, true);
        toggleGameState();
        draw(shapes, currentShape, boxes);
    });

//TODO: Fix for devices that might support both touchscreen and mouse
const isTouchscreen = window.matchMedia("(pointer:coarse)").matches;

if (!isTouchscreen) {
    //mouse events
    board.addEventListener("mousemove", handleMouseMovement);
    board.addEventListener("mousedown", handleMouseDown);
    board.addEventListener("mouseup", handleMouseOut);
    board.addEventListener("mouseout", handleMouseOut);
}

//touch events
board.addEventListener("touchmove", handleMouseMovement);
board.addEventListener("touchstart", handleMouseDown);
board.addEventListener("touchend", handleMouseOut);
board.addEventListener("touchcancel", handleMouseOut);
