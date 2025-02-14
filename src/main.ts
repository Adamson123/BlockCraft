import {
    boxesOnHover,
    board,
    hoverColor,
    gameScore,
    boxWidth,
} from "./globals.js";
import { populateShapes, Shape } from "./shapes.js";
import Box, { populateBoxes } from "./box.js";
import { draw } from "./draw.js";
import { clickedOnBox, getMousePosition } from "./utils/utils.js";
import { playSound, toggleFullscreen, toggleSoundMode } from "./settings.js";
import { checkLose, toggleGameState } from "./gameState.js";
import { resetBoxesInOccupiedDimensions } from "./utils/boxUtils.js";
import { updateScore } from "./scoring.js";

const fullscreenBtn =
    document.querySelector<HTMLButtonElement>(".fullscreenBtn");
const soundBtn = document.querySelector<HTMLButtonElement>(".soundBtn");
const spinShapeBtn =
    document.querySelector<HTMLButtonElement>(".spinShapeBtn")!;
let mousedown = false;
let rotate = false;
let currentShape: Shape | undefined;

let boxes: Box[] = populateBoxes();
let shapes: Shape[] = populateShapes();

const updateShapePosition = (x: number, y: number) => {
    if (!currentShape || rotate) return;

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

spinShapeBtn.addEventListener("click", () => {
    rotate = rotate ? false : true;
});

const checkLoseCallback = (box: Box, lastBox: Box) => {
    box.color = hoverColor;
    draw(shapes, currentShape, boxes);
    if (lastBox.index === box.index) toggleGameState();
};

// const handleShapeSelection = (event: MouseEvent | TouchEvent) => {
//     mousedown = true;
//     const { x, y } = getMousePosition(event);
//     for (const shape of shapes) {
//         let clicked = false;
//         for (const box of shape.boxes) {
//             if (clickedOnBox(x, y, box)) {
//                 clicked = true;
//                 break;
//             }
//         }
//         if (clicked) {
//             currentShape = shape;
//             !rotate && currentShape.toMainShape();
//             break;
//         }
//     }

//     if (currentShape) {
//         if (!rotate && currentShape.isAccomodable) {
//             updateShapePosition(x, y);
//         } else {
//             // currentShape.toIdleShape();
//             if (rotate) {
//                 currentShape.rotate();
//                 checkLose(boxes, shapes, checkLoseCallback);
//             }
//             draw(shapes, currentShape, boxes);
//             currentShape = undefined;
//         }
//     }
// };

const handleShapeSelection = (event: MouseEvent | TouchEvent) => {
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
            if (!rotate) currentShape.toMainShape();
            break;
        }
    }

    if (currentShape) {
        updateShapePosition(x, y);
        if (rotate) {
            currentShape.rotate();
        }
    }
};

// const handleShapeRotationSelection = (event: MouseEvent) => {
//     mousedown = true;
//     const { x, y } = getMousePosition(event);
//     for (const shape of shapes) {
//         let clicked = false;
//         for (const box of shape.boxes) {
//             if (clickedOnBox(x, y, box)) {
//                 clicked = true;
//                 break;
//             }
//         }
//         if (clicked) {
//             currentShape = shape;
//             break;
//         }
//     }

//     if (currentShape) {
//         currentShape.rotate();
//         draw(shapes, currentShape, boxes);
//     }
// };

const handleShapeDrag = (event: MouseEvent | TouchEvent) => {
    if (mousedown && currentShape && !rotate) {
        const { x, y } = getMousePosition(event);
        updateShapePosition(x, y);
    }
};

const resetBoxesCallback = () => {
    checkLose(boxes, shapes, checkLoseCallback);
    draw(shapes, currentShape, boxes);
};

const resetShapePosition = () => {
    mousedown = false;

    if (!currentShape) {
        return;
    }
    if (!rotate) {
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
        playSound("click");
        draw(shapes, currentShape, boxes);
        currentShape = undefined;
    }
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
        updateScore(true);
        toggleGameState();
        draw(shapes, currentShape, boxes);
    });

const isTouchscreen = window.matchMedia("(pointer:coarse)").matches;

console.log({ isTouchscreen });

if (!isTouchscreen) {
    //mouse events
    board.addEventListener("mousemove", handleShapeDrag);
    board.addEventListener("mousedown", handleShapeSelection);
    board.addEventListener("mouseup", resetShapePosition);
    board.addEventListener("mouseout", resetShapePosition);
}

//touch events
board.addEventListener("touchmove", handleShapeDrag);
board.addEventListener("touchstart", handleShapeSelection);
board.addEventListener("touchend", resetShapePosition);
board.addEventListener("touchcancel", resetShapePosition);
