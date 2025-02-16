import { boardHeight, boardWidth, ctx, defaultColor, defaultStrokeColor, start, strokeWidth, } from "./globals.js";
import { bomb } from "./specialtems.js";
export const drawInsetShadow = (box) => {
    ctx.shadowColor = "rgba(0,0,0,0.5)";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;
    ctx.fillRect(box.x, box.y, box.width - 5, box.height - 5);
};
export const resetShadowValues = () => {
    ctx.shadowColor = "";
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 0;
};
// Draw all boxes
export const drawBoxes = (boxes, shapeBoxes) => {
    ctx.lineWidth = strokeWidth;
    for (const box of boxes) {
        ctx.strokeStyle = box.strokeColor;
        box.shapeOver(shapeBoxes);
        if (bomb.bombMode)
            box.bombOver();
        ctx.fillStyle = box.color;
        ctx.strokeRect(box.x, box.y, box.width - 2, box.height - 2);
        ctx.fillRect(box.x, box.y, box.width - 2, box.height - 2);
        if (box.isOccupied) {
            drawInsetShadow(box);
            resetShadowValues();
        }
    }
};
export const drawShape = (shape, drawSpinIcon = false) => {
    if (!shape)
        return;
    ctx.strokeStyle = shape.strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.fillStyle = shape.color;
    for (const box of shape.boxes) {
        ctx.fillRect(box.x, box.y, box.width - 2, box.height - 2);
        drawInsetShadow(box);
    }
    resetShadowValues();
    drawSpinIcon && shape.drawSpinningIcon();
};
export const drawAllShapes = (shapes, drawSpinIcon = false) => {
    for (const shape of shapes) {
        drawShape(shape, drawSpinIcon);
    }
};
const bombImg = new Image();
bombImg.src = "./src/assets/images/Bomb.png";
const crosshairSvg = new Image();
crosshairSvg.src = "./src/assets/images/crosshair.svg";
export const drawBomb = () => {
    bomb.bombImageSize = 80;
    if (bomb.bombSelected) {
        // ctx.strokeStyle = "yellow";
        bomb.bombImageSize = 30;
        ctx.drawImage(crosshairSvg, bomb.x, bomb.y, bomb.cursorImageSize, bomb.size);
    }
    ctx.drawImage(bombImg, bomb.imageX(), bomb.imageY(), bomb.bombImageSize, bomb.bombImageSize);
    ctx.globalAlpha = 1;
};
export const drawBoxesBoardBorder = () => {
    ctx.fillStyle = defaultStrokeColor;
    ctx.fillRect(0, 0, boardWidth, boardWidth);
};
export const drawShapesSpaceBorder = () => {
    ctx.strokeStyle = defaultStrokeColor;
    ctx.fillStyle = defaultColor;
    ctx.lineWidth = strokeWidth;
    ctx.strokeRect(start, boardWidth, boardWidth - 12, boardHeight - boardWidth);
    ctx.fillRect(start, boardWidth, boardWidth - 12, boardHeight - boardWidth);
};
/**
 * @param shapes
 * @param currentShape
 * @param boxes
 * @param clear
 */
export const draw = (shapes, currentShape, boxes, drawSpinIcon = false) => {
    ctx.clearRect(0, 0, boardWidth, boardHeight);
    drawShapesSpaceBorder();
    !bomb.bombMode && drawAllShapes(shapes, drawSpinIcon);
    drawBoxes(boxes, currentShape?.boxes);
    !bomb.bombMode && drawShape(currentShape, drawSpinIcon);
    bomb.bombMode && drawBomb();
};
