import {
    boxHeight,
    boxWidth,
    boardHeight,
    boardWidth,
    boxesOnHover,
} from "./globals.js";
import { populateShapes, Shape } from "./shapes.js";
import Box, { populateBoxes } from "./box.js";

const board = document.querySelector<HTMLCanvasElement>(".board")!;
const ctx = board.getContext("2d")!;

board.width = boardWidth;
board.height = boardHeight;

let mousedown = false;
let currentShape: Shape | undefined;

let boxes: Box[] = populateBoxes();
let shapes: Shape[] = populateShapes();

// Draw all boxes. Optionally, you can pass in shape boxes (for hover effects, etc.)
const drawBoxes = (shapeBoxes?: { x: number; y: number }[]) => {
    ctx.lineWidth = 5;
    for (const box of boxes) {
        ctx.strokeStyle = box.strokeColor;
        box.shapeOver(shapeBoxes);
        ctx.fillStyle = box.color;
        ctx.strokeRect(box.x, box.y, box.width, box.height);
        ctx.fillRect(box.x, box.y, box.width, box.height);
    }
};

const drawShape = (shape?: Shape) => {
    if (!shape) return;
    ctx.strokeStyle = shape.strokeColor;
    ctx.lineWidth = 5;
    ctx.fillStyle = shape.color;
    for (const box of shape.boxes) {
        ctx.strokeRect(box.x, box.y, boxWidth, boxHeight);
        ctx.fillRect(box.x, box.y, boxWidth, boxHeight);
    }
};

const drawAllShapes = () => {
    for (const shape of shapes) {
        drawShape(shape);
    }
};

drawAllShapes();
drawBoxes();

const draw = () => {
    ctx.clearRect(0, 0, boardWidth, boardHeight);
    drawAllShapes();
    drawBoxes(currentShape?.boxes);
    drawShape(currentShape);
};

interface MousePos {
    x: number;
    y: number;
}

const getMousePos = (event: MouseEvent | TouchEvent): MousePos => {
    let clientX: number, clientY: number;
    if ("touches" in event && event.touches.length > 0) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
    } else if ("clientX" in event) {
        clientX = event.clientX;
        clientY = event.clientY;
    } else {
        clientX = 0;
        clientY = 0;
    }

    const rect = board.getBoundingClientRect();
    return {
        x: clientX - rect.left,
        y: clientY - rect.top,
    };
};

const dragShape = (x: number, y: number) => {
    if (!currentShape) return;
    // Calculate differences based on the first box position
    const dx = x - currentShape.boxes[0].x - currentShape.width / 2;
    const dy = y - currentShape.boxes[0].y - currentShape.height - 10;

    currentShape.boxes.forEach((box) => {
        box.x = box.x + dx;
        box.y = box.y + dy;
    });

    draw();
};

const clickedOnBox = (
    mouseX: number,
    mouseY: number,
    obj: { x: number; y: number }
): boolean => {
    const insideHorizontally = mouseX >= obj.x && mouseX <= obj.x + boxWidth;
    const insideVertically = mouseY >= obj.y && mouseY <= obj.y + boxHeight;
    return insideHorizontally && insideVertically;
};

const moveShape = (event: MouseEvent | TouchEvent) => {
    if (mousedown && currentShape) {
        const { x, y } = getMousePos(event);
        dragShape(x, y);
    }
};

const holdShape = (event: MouseEvent | TouchEvent) => {
    mousedown = true;
    const { x, y } = getMousePos(event);
    for (const shape of shapes) {
        let clicked = false;
        for (const box of shape.boxes) {
            if (clickedOnBox(x, y, box)) {
                clicked = true;
                break;
            }
        }
        if (clicked) {
            console.log({ clicked });
            currentShape = shape;
            break;
        }
    }

    if (currentShape) dragShape(x, y);
};

const moveShapeToDefaultPos = () => {
    mousedown = false;

    if (!currentShape) {
        return;
    }
    // Call the shape's method to reset its position
    currentShape.toDefaultPos();

    if (boxesOnHover.size === currentShape.boxes.length) {
        boxesOnHover.forEach((boxNumber) => {
            boxes[(boxNumber as number) - 1].toMatched();
        });
        shapes = shapes.filter((shape) => shape.index !== currentShape!.index);
    }
    currentShape = undefined;
    if (!shapes.length) shapes = populateShapes();
    draw();
};

//mouse events
board.addEventListener("mousemove", moveShape);
board.addEventListener("mousedown", holdShape);
board.addEventListener("mouseup", moveShapeToDefaultPos);
board.addEventListener("mouseout", moveShapeToDefaultPos);

//touch events
board.addEventListener("touchmove", moveShape);
board.addEventListener("touchstart", holdShape);
board.addEventListener("touchend", moveShapeToDefaultPos);
board.addEventListener("touchcancel", moveShapeToDefaultPos);
