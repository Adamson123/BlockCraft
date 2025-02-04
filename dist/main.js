import { boxHeight, boxWidth, boardHeight, boardWidth, boxesOnHover, } from "./globals.js";
import { populateShapes } from "./shapes.js";
import { populateBoxes } from "./box.js";
const board = document.querySelector(".board");
const ctx = board.getContext("2d");
board.width = boardWidth;
board.height = boardHeight;
let mousedown = false;
let currentShape;
let boxes = populateBoxes();
let shapes = populateShapes();
// Draw all boxes
const drawBoxes = (shapeBoxes) => {
    ctx.lineWidth = 2;
    for (const box of boxes) {
        ctx.strokeStyle = box.strokeColor;
        box.shapeOver(shapeBoxes);
        ctx.fillStyle = box.color;
        ctx.strokeRect(box.x, box.y, box.width, box.height);
        ctx.fillRect(box.x, box.y, box.width, box.height);
    }
};
const drawShape = (shape) => {
    if (!shape)
        return;
    ctx.strokeStyle = shape.strokeColor;
    ctx.lineWidth = 2;
    ctx.fillStyle = shape.color;
    for (const box of shape.boxes) {
        ctx.strokeRect(box.x, box.y, box.width, box.height);
        ctx.fillRect(box.x, box.y, box.width, box.height);
    }
};
const dragShape = (x, y) => {
    if (!currentShape)
        return;
    // Calculate differences based on the first box position
    const dx = x - currentShape.boxes[0].x - currentShape.width / 4;
    const dy = y - currentShape.boxes[0].y - currentShape.height - 10;
    currentShape.boxes.forEach((box) => {
        box.x = box.x + dx;
        box.y = box.y + dy;
    });
    draw();
};
const drawAllShapes = () => {
    for (const shape of shapes) {
        drawShape(shape);
    }
};
const holdShape = (event) => {
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
            currentShape = shape;
            currentShape.toMainShape();
            break;
        }
    }
    if (currentShape)
        dragShape(x, y);
};
const draw = () => {
    ctx.clearRect(0, 0, boardWidth, boardHeight);
    drawAllShapes();
    drawBoxes(currentShape?.boxes);
    drawShape(currentShape);
};
const getMousePos = (event) => {
    let clientX, clientY;
    if ("touches" in event && event.touches.length > 0) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
    }
    else if ("clientX" in event) {
        clientX = event.clientX;
        clientY = event.clientY;
    }
    else {
        clientX = 0;
        clientY = 0;
    }
    const rect = board.getBoundingClientRect();
    return {
        x: clientX - rect.left,
        y: clientY - rect.top,
    };
};
const clickedOnBox = (mouseX, mouseY, obj) => {
    const insideHorizontally = mouseX >= obj.x && mouseX <= obj.x + boxWidth + 20;
    const insideVertically = mouseY >= obj.y && mouseY <= obj.y + boxHeight + 20;
    return insideHorizontally && insideVertically;
};
const moveShape = (event) => {
    if (mousedown && currentShape) {
        const { x, y } = getMousePos(event);
        dragShape(x, y);
    }
};
const breakOccupiedBoxes = (matchedBox, dimension) => {
    const diffBox = {};
    matchedBox.forEach((box) => {
        if (!Object.keys(diffBox).includes(String(box[dimension]))) {
            diffBox[String(box[dimension])] = [];
        }
        if (!diffBox[String(box[dimension])].includes(box))
            diffBox[String(box[dimension])].push(box);
    });
    Object.keys(diffBox).forEach((boxes) => {
        if (diffBox[boxes].length === 10) {
            diffBox[boxes].forEach((box) => {
                box.toUnOccupied();
            });
        }
    });
};
const findOccupiedBoxes = () => {
    const hoveredOnAndOccupiedBoxes = [];
    boxes.forEach((box) => {
        if (boxesOnHover.boxes.has(box.index) && box.occupied) {
            hoveredOnAndOccupiedBoxes.push(box);
        }
    });
    const matchedHorizontally = [];
    const matchedVertically = [];
    hoveredOnAndOccupiedBoxes.forEach((box) => {
        boxes.forEach((box2) => {
            if (box2.y === box.y && box2.occupied) {
                matchedHorizontally.push(box2);
            }
            if (box2.x === box.x && box2.occupied) {
                matchedVertically.push(box2);
            }
        });
    });
    breakOccupiedBoxes(matchedHorizontally, "y");
    breakOccupiedBoxes(matchedVertically, "x");
};
const moveShapeToDefaultPos = () => {
    mousedown = false;
    if (!currentShape) {
        return;
    }
    // Call the shape's method to reset its position
    currentShape.toIdleShape();
    if (boxesOnHover.boxes.size === currentShape.boxes.length) {
        boxesOnHover.boxes.forEach((boxNumber) => {
            boxes[boxNumber - 1].toOccupied();
        });
        findOccupiedBoxes();
        shapes = shapes.filter((shape) => shape.index !== currentShape.index);
    }
    boxesOnHover.emptyBoxesOnHover();
    currentShape = undefined;
    if (!shapes.length)
        shapes = populateShapes();
    draw();
};
drawAllShapes();
drawBoxes();
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
