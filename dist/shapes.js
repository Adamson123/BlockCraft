import { boxWidth, boardHeight, matchedColor, matchedStrokeColor, boxHeight, boardWidth, idle, hoverColor, ctx, } from "./globals.js";
import { shapesEmoji } from "./shapesEmoji.js";
const spinSvg = new Image();
spinSvg.src = "./src/assets/images/spin-3.svg";
export class Shape {
    boxes;
    mainShape;
    idleShape;
    width;
    height;
    color;
    mainColor;
    strokeColor;
    index;
    boxesRelationship;
    isAccomodable;
    /**
     * @param shape
     * @param idleShape
     * @param index
     * @param width
     * @param height
     * @param color
     */
    constructor(shape, idleShape, index, color) {
        this.boxes = idleShape;
        this.mainShape = shape;
        // Use structuredClone to deep clone the array of boxes
        this.idleShape = idleShape;
        this.width = this.findWidth();
        this.height = this.findHeight(); //height || 100;
        this.color = color;
        this.mainColor = color;
        this.strokeColor = matchedStrokeColor;
        this.index = index;
        this.boxesRelationship = this.getBoxesRelationship(shape);
        this.isAccomodable = true;
    }
    findWidth() {
        return (this.mainShape.reduce((sum, { x }) => (sum = x > sum ? x : sum), 0) + boxWidth);
    }
    findHeight() {
        // return (
        //     this.mainShape.reduce((acc: number[], { y }) => {
        //         if (!acc.includes(y)) {
        //             acc.push(y);
        //         }
        //         return acc;
        //     }, []).length * boxHeight
        // );
        return (this.boxes.reduce((biggest, { y }) => (biggest = biggest > y ? biggest : y), 0) + boxHeight);
    }
    toIdleShape() {
        this.boxes = structuredClone(this.idleShape);
    }
    toMainShape() {
        this.boxes = structuredClone(this.mainShape);
    }
    getBoxesRelationship(shape) {
        const firstBox = structuredClone(shape[0]);
        const boxesRelationship = [];
        const getEventAndTimes = (value, dimension) => {
            if (value > firstBox[dimension]) {
                const eventAndTimes = {
                    event: "increased",
                    times: (value - firstBox[dimension]) / boxWidth,
                };
                firstBox[dimension] = value;
                return eventAndTimes;
            }
            else if (value < firstBox[dimension]) {
                const eventAndTimes = {
                    event: "decreased",
                    times: (firstBox[dimension] - value) / boxWidth,
                };
                firstBox[dimension] = value;
                return eventAndTimes;
            }
            else {
                const eventAndTimes = {
                    event: "neutral",
                    times: 1,
                };
                firstBox[dimension] = value;
                return eventAndTimes;
            }
        };
        shape.forEach((box) => {
            const eventAndTimesX = getEventAndTimes(box.x, "x");
            const eventAndTimesY = getEventAndTimes(box.y, "y");
            boxesRelationship.push({ x: eventAndTimesX, y: eventAndTimesY });
        });
        return boxesRelationship;
    }
    toNotAccomodable() {
        this.isAccomodable = false;
        this.color = hoverColor;
    }
    toAccomodable() {
        this.isAccomodable = true;
        this.color = this.mainColor;
    }
    findPivotX(shape) {
        return Math.round(shape.reduce((sum, { x }) => sum + x, 0) / shape.length);
    }
    findPivotY(shape) {
        return Math.round(shape.reduce((sum, { y }) => sum + y, 0) / shape.length);
    }
    rotate() {
        const rotateShape = (shape, idle = 0) => {
            // Calculate the pivot point (center of the shape)
            const pivotX = this.findPivotX(shape);
            const pivotY = this.findPivotY(shape);
            return shape.map(({ x, y }) => {
                const translatedX = x - pivotX;
                const translatedY = y - pivotY;
                // Adjust the rotation to be clockwise
                const rotatedX = -translatedY + pivotX; // Change here for clockwise
                const rotatedY = translatedX + pivotY; // Change here for clockwise
                return {
                    x: Math.round(rotatedX),
                    y: Math.round(rotatedY),
                    width: boxWidth - idle,
                    height: boxHeight - idle,
                };
            });
        };
        // Rotate the main shape and idle shape
        this.mainShape = rotateShape(this.mainShape);
        this.idleShape = rotateShape(this.boxes, idle);
        this.boxes = this.idleShape;
        this.width = this.findWidth();
        this.height = this.findHeight();
        this.boxesRelationship = this.getBoxesRelationship(this.mainShape);
    }
    drawSpinningIcon() {
        const pivotX = this.findPivotX(this.idleShape);
        const pivotY = this.findPivotY(this.idleShape);
        ctx.drawImage(spinSvg, pivotX - 7, pivotY - 6, 30, 30);
    }
}
const getBoxYPosition = (times = 1, subBy = 0) => {
    return boardHeight - (boxWidth - subBy) * times - 23;
    // return boardHeight - 60; //(boxWidth - subBy) * times;
};
//Generates array of objects from shape emoji
const generateShape = (shape) => {
    let x = 0;
    let y = 2;
    const mainShape = [];
    const idleShape = [];
    for (const box of shape) {
        if (box === "\n") {
            y++;
        }
    }
    for (const box of shape) {
        if (box === "🟥") {
            mainShape.push({
                x: x * boxWidth,
                y: getBoxYPosition(y),
                width: boxWidth,
                height: boxHeight,
            });
            idleShape.push({
                x: x * (boxWidth - idle),
                y: getBoxYPosition(y, idle),
                width: boxWidth - idle,
                height: boxHeight - idle,
            });
        }
        if (box === "🟥" || box === "⬜") {
            x++;
        }
        if (box === "\n") {
            y--;
            x = 0;
        }
    }
    return {
        shape: mainShape,
        idleShape,
    };
};
//Populates shapes array
export const populateShapes = () => {
    const allColors = [matchedColor, "red", "yellow", "green", "purple"];
    const shapes = [];
    for (let i = 0; i < 3; i++) {
        const pickedShape = shapesEmoji[Math.floor(Math.random() * shapesEmoji.length)];
        const color = allColors[Math.floor(Math.random() * allColors.length)];
        // Adjust each idle shape's x position
        const { shape, idleShape } = generateShape(pickedShape);
        const adjustedShape = idleShape.map((box) => ({
            ...box,
            x: box.x + i * (boardWidth / 3) + boardWidth / 10 + 5,
        }));
        const shapeIns = new Shape(shape, adjustedShape, i, color);
        shapes.push(shapeIns);
    }
    return shapes;
};
