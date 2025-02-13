import { boxesOnHover, board, hoverColor, gameScore, } from "./globals.js";
import { populateShapes } from "./shapes.js";
import { populateBoxes } from "./box.js";
import { draw } from "./draw.js";
import { clickedOnBox, getMousePosition } from "./utils/utils.js";
import { playSound, toggleFullscreen, toggleSoundMode } from "./settings.js";
import { checkLose, toggleGameState } from "./gameState.js";
import { resetBoxesInOccupiedDimensions } from "./utils/boxUtils.js";
import { updateScore } from "./scoring.js";
const fullscreenBtn = document.querySelector(".fullscreenBtn");
const soundBtn = document.querySelector(".soundBtn");
const rotateShapeBtn = document.querySelector(".rotateShapeBtn");
let mousedown = false;
let rotate = false;
let currentShape;
let boxes = populateBoxes();
let shapes = populateShapes();
const updateShapePosition = (x, y) => {
    if (!currentShape)
        return;
    // Calculate differences based on the first box position
    const dx = x - currentShape.boxes[0].x - currentShape.width / 2;
    const dy = y - currentShape.boxes[0].y - currentShape.height - 15;
    console.log(currentShape.width);
    currentShape.boxes.forEach((box) => {
        box.x = box.x + dx;
        box.y = box.y + dy;
    });
    draw(shapes, currentShape, boxes);
};
rotateShapeBtn.addEventListener("click", () => {
    rotate = rotate ? false : true;
});
const checkLoseCallback = (box, lastBox) => {
    box.color = hoverColor;
    draw(shapes, currentShape, boxes);
    if (lastBox.index === box.index)
        toggleGameState();
};
const handleShapeSelection = (event) => {
    mousedown = true;
    const { x, y } = getMousePosition(event);
    for (const shape of shapes) {
        let clicked = false;
        for (const box of shape.boxes) {
            if (clickedOnBox(x, y, box)) {
                clicked = true;
                break;
            }
        }
        if (clicked) {
            currentShape = shape;
            !rotate && currentShape.toMainShape();
            break;
        }
    }
    if (currentShape) {
        if (!rotate && currentShape.isAccomodable) {
            updateShapePosition(x, y);
        }
        else {
            currentShape.toIdleShape();
            if (rotate) {
                currentShape.rotate();
                checkLose(boxes, shapes, checkLoseCallback);
            }
            draw(shapes, currentShape, boxes);
            currentShape = undefined;
        }
    }
};
const handleShapeDrag = (event) => {
    if (mousedown && currentShape) {
        const { x, y } = getMousePosition(event);
        updateShapePosition(x, y);
    }
};
const resetBoxesCallback = () => {
    checkLose(boxes, shapes, checkLoseCallback);
    draw(shapes, currentShape, boxes);
    //  displayRemark();
    // const cb = () => {
    //     draw(shapes, currentShape, boxes);
    // };
    // drawRemark(cb);
};
const resetShapePosition = () => {
    mousedown = false;
    if (!currentShape) {
        return;
    }
    // Call the shape's method to reset its position
    currentShape.toIdleShape();
    let noOccupiedDimension;
    if (boxesOnHover.boxes.size === currentShape.boxes.length) {
        boxesOnHover.boxes.forEach((boxNumber) => {
            boxes[boxNumber - 1]?.toOccupied(currentShape.color);
        });
        noOccupiedDimension = resetBoxesInOccupiedDimensions(boxes, resetBoxesCallback);
        shapes = shapes.filter((shape) => shape.index !== currentShape.index);
        playSound("glock");
    }
    else {
        playSound("woof");
    }
    //"remove boxes that changed color when shape was dragged over them"
    boxesOnHover.emptyBoxesOnHover();
    currentShape = undefined;
    if (!shapes.length)
        shapes = populateShapes();
    if (!noOccupiedDimension)
        checkLose(boxes, shapes, checkLoseCallback);
    draw(shapes, currentShape, boxes);
};
draw(shapes, currentShape, boxes);
fullscreenBtn?.addEventListener("click", () => {
    toggleFullscreen(fullscreenBtn);
});
soundBtn?.addEventListener("click", () => {
    toggleSoundMode(soundBtn);
});
//pause
document
    .querySelector(".pauseBtn")
    ?.addEventListener("click", () => toggleGameState());
//play
document
    .querySelector(".playBtn")
    ?.addEventListener("click", () => toggleGameState());
//restart
document
    .querySelector(".restartBtn")
    ?.addEventListener("click", () => {
    gameScore.score = 0;
    gameScore.surpassedHighScore = false;
    boxes = populateBoxes();
    shapes = populateShapes();
    updateScore(true);
    toggleGameState();
    draw(shapes, currentShape, boxes);
});
//mouse events
board.addEventListener("mousemove", handleShapeDrag);
board.addEventListener("mousedown", handleShapeSelection);
board.addEventListener("mouseup", resetShapePosition);
board.addEventListener("mouseout", resetShapePosition);
//touch events
board.addEventListener("touchmove", handleShapeDrag);
board.addEventListener("touchstart", handleShapeSelection);
board.addEventListener("touchend", resetShapePosition);
board.addEventListener("touchcancel", resetShapePosition);
