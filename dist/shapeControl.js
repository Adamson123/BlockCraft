// import Box from "./box.js";
// import { draw } from "./draw.js";
// import { Shape } from "./shapes.js";
// import { clickedOnBox, getMousePosition } from "./utils/utils.js";
export {};
// /**
//  *
//  * @param x
//  * @param y
//  * @param shapes
//  * @param currentShape
//  * @param boxes
//  * @returns
//  */
// const updateShapePosition = (
//     x: number,
//     y: number,
//     shapes: Shape[],
//     currentShape: Shape,
//     boxes: Box[]
// ) => {
//     if (!currentShape) return;
//     // Calculate differences based on the first box position
//     const dx = x - currentShape.boxes[0].x - currentShape.width / 4;
//     const dy = y - currentShape.boxes[0].y - currentShape.height - 30;
//     currentShape.boxes.forEach((box: BoxShape) => {
//         box.x = box.x + dx;
//         box.y = box.y + dy;
//     });
//     draw(shapes, currentShape, boxes);
// };
// const handleShapeSelection = (
//     event: MouseEvent | TouchEvent,
//     mousedown: boolean,
//     shapes: Shape[],
//     currentShape: Shape
// ) => {
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
//         if (clicked && shape.isAccomodable) {
//             currentShape = shape;
//             currentShape.toMainShape();
//             break;
//         }
//     }
//     if (currentShape) updateShapePosition(x, y);
// };
// const handleShapeDrag = (event: MouseEvent | TouchEvent) => {
//     if (mousedown && currentShape) {
//         const { x, y } = getMousePosition(event);
//         updateShapePosition(x, y);
//     }
// };
