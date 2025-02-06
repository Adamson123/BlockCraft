import { boardHeight, boardWidth, boxHeight, boxWidth, ctx, } from "./globals.js";
// Draw all boxes
export const drawBoxes = (boxes, shapeBoxes) => {
    ctx.lineWidth = 2;
    for (const box of boxes) {
        ctx.strokeStyle = box.strokeColor;
        box.shapeOver(shapeBoxes);
        ctx.fillStyle = box.color;
        ctx.strokeRect(box.x, box.y, box.width, box.height);
        ctx.fillRect(box.x, box.y, box.width, box.height);
    }
};
export const drawShape = (shape) => {
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
export const drawAllShapes = (shapes) => {
    for (const shape of shapes) {
        drawShape(shape);
    }
};
export const drawBoxesBoardBorder = () => {
    ctx.fillStyle = "white";
    ctx.lineWidth = 2;
    ctx.fillRect(0, 0, boxWidth * 10, boxHeight * 10);
    ctx.strokeRect(0, 0, boxWidth * 10, boxHeight * 10);
};
/**
 * @param shapes
 * @param currentShape
 * @param boxes
 */
export const draw = (shapes, currentShape, boxes) => {
    ctx.clearRect(0, 0, boardWidth, boardHeight);
    drawAllShapes(shapes);
    drawBoxes(boxes, currentShape?.boxes);
    drawShape(currentShape);
};
