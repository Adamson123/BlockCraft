import { boardHeight, boardWidth, ctx, defaultColor, defaultStrokeColor, start, strokeWidth, } from "./globals.js";
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
        ctx.fillStyle = box.color;
        ctx.strokeRect(box.x, box.y, box.width - 2, box.height - 2);
        ctx.fillRect(box.x, box.y, box.width - 2, box.height - 2);
        if (box.isOccupied) {
            drawInsetShadow(box);
            resetShadowValues();
        }
    }
};
export const drawShape = (shape) => {
    if (!shape)
        return;
    ctx.strokeStyle = shape.strokeColor;
    ctx.lineWidth = strokeWidth;
    ctx.fillStyle = shape.color;
    for (const box of shape.boxes) {
        //ctx.strokeRect(box.x, box.y, box.width - 2, box.height);
        ctx.fillRect(box.x, box.y, box.width - 2, box.height - 2);
        drawInsetShadow(box);
        // drawWoodBlock(box.x, box.y, box.width, box.height);
    }
    resetShadowValues();
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
    ctx.strokeRect(start, boardWidth, boardWidth - 12, 105);
    ctx.fillRect(start, boardWidth, boardWidth - 12, 105);
};
// export const drawRemark = (draw: () => void) => {
//     let HfontSize = 1;
//     let PfontSize = 0;
//     let InMax = false;
//     let pause = false;
//     const animate = () => {
//         if (!pause)
//             if (InMax) {
//                 HfontSize -= 3;
//             } else {
//                 HfontSize += 3;
//             }
//         //ctx.clearRect(0, 0, boardHeight, boardWidth);
//         draw();
//         ctx.font = `${HfontSize}px boldFont`;
//         ctx.lineWidth = 4;
//         ctx.strokeStyle = "black";
//         ctx.fillStyle = "skyblue";
//         ctx.textAlign = "center";
//         ctx.textBaseline = "middle";
//         let text = "Good!";
//         const position = boardWidth / 2;
//         ctx.strokeText(text, position, position);
//         ctx.fillText(text, position, position);
//         if (!pause)
//             if (InMax && PfontSize > 0) {
//                 PfontSize -= 3;
//             } else if (!InMax && PfontSize < 28) {
//                 PfontSize += 3;
//             }
//         ctx.font = `${PfontSize}px boldFont`;
//         // console.log({ PfontSize, HfontSize });
//         ctx.lineWidth = 2;
//         ctx.strokeStyle = "black";
//         ctx.fillStyle = matchedColor;
//         text = "+300";
//         ctx.strokeText(text, position, position + 30);
//         ctx.fillText(text, position, position + 30);
//         if (HfontSize >= 48) {
//             pause = true;
//             setTimeout(() => {
//                 pause = false;
//                 InMax = true;
//             }, 1000);
//         }
//         if (HfontSize <= 0) return;
//         requestAnimationFrame(animate);
//     };
//     animate();
// };
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
    // resetShadowValues();
    //drawRemark();
};
