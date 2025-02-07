import { start } from "./box.js";
import { boardHeight, boardWidth, boxHeight, ctx, defaultColor, defaultStrokeColor, strokeWidth, } from "./globals.js";
// Draw all boxes
export const drawBoxes = (boxes, shapeBoxes) => {
    ctx.lineWidth = strokeWidth;
    for (const box of boxes) {
        ctx.strokeStyle = box.strokeColor;
        box.shapeOver(shapeBoxes);
        ctx.fillStyle = box.color;
        ctx.strokeRect(box.x, box.y, box.width - 2, box.height - 2);
        ctx.fillRect(box.x, box.y, box.width - 2, box.height - 2);
    }
};
export const drawShape = (shape) => {
    if (!shape)
        return;
    ctx.strokeStyle = shape.strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.fillStyle = shape.color;
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    for (const box of shape.boxes) {
        //ctx.strokeRect(box.x, box.y, box.width - 2, box.height);
        ctx.fillRect(box.x, box.y, box.width - 2, box.height - 2);
        ctx.fillRect(box.x, box.y, box.width - 5, box.height - 5);
        // drawWoodBlock(box.x, box.y, box.width, box.height);
    }
    ctx.shadowColor = "";
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 0;
};
export const drawAllShapes = (shapes) => {
    for (const shape of shapes) {
        drawShape(shape);
    }
};
export const drawBoxesBoardBorder = () => {
    ctx.fillStyle = defaultStrokeColor;
    //ctx.lineWidth = strokeWidth;
    ctx.fillRect(0, 0, boardWidth, boardWidth);
};
export const drawShapesSpaceBorder = () => {
    ctx.strokeStyle = defaultStrokeColor;
    ctx.fillStyle = defaultColor;
    ctx.lineWidth = strokeWidth;
    //ctx.strokeRect(start, boardWidth + (boxHeight - 5), boardWidth - 10, 105);
    ctx.fillRect(start, boardWidth + (boxHeight - 10), boardWidth - 10, 105);
};
/**
 * @param shapes
 * @param currentShape
 * @param boxes
 * @param clear
 */
export const draw = (shapes, currentShape, boxes, clear = { x: 0, y: 0 }) => {
    const { x, y } = clear;
    ctx.clearRect(x, y, boardWidth, boardHeight);
    drawShapesSpaceBorder();
    drawAllShapes(shapes);
    drawBoxes(boxes, currentShape?.boxes);
    drawShape(currentShape);
};
