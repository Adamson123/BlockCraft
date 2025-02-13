import { boxWidth, boardHeight, matchedColor, matchedStrokeColor, boxHeight, boardWidth, idle, hoverColor, } from "./globals.js";
import { shapesRotations } from "./shapesRotation.js";
export class Shape {
    boxes;
    mainShape;
    idleShape;
    rotationsMain;
    rotationsIdle;
    width;
    height;
    color;
    mainColor;
    strokeColor;
    index;
    currentShapeIndex;
    boxesRelationship;
    isAccomodable;
    /**
     * @param rotationsMain
     * @param rotationsIdle
     * @param shape
     * @param idleShape
     * @param currentShapeIndex
     * @param width
     * @param height
     * @param color
     */
    constructor(rotationsMain, rotationsIdle, shape, idleShape, index, currentShapeIndex, height, color) {
        this.rotationsMain = rotationsMain;
        this.rotationsIdle = rotationsIdle;
        this.boxes = idleShape;
        this.mainShape = shape;
        // Use structuredClone to deep clone the array of boxes
        this.idleShape = idleShape;
        this.width = this.findWidth();
        this.height = height || 100;
        this.color = color;
        this.mainColor = color;
        this.strokeColor = matchedStrokeColor;
        this.index = index;
        this.currentShapeIndex = currentShapeIndex;
        this.boxesRelationship = this.getBoxesRelationship(shape);
        this.isAccomodable = true;
    }
    findWidth() {
        return (this.mainShape.reduce((sum, { x }) => (sum = x > sum ? x : sum), 0) + boxWidth);
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
    rotate() {
        if (this.currentShapeIndex === this.rotationsIdle.length - 1) {
            this.currentShapeIndex = 0;
        }
        else {
            this.currentShapeIndex++;
        }
        const { height, shapes } = this.rotationsMain[this.currentShapeIndex];
        this.mainShape = shapes;
        this.idleShape = this.rotationsIdle[this.currentShapeIndex].shapes;
        this.boxes = this.idleShape;
        this.width = this.findWidth();
        this.height = height;
        this.boxesRelationship = this.getBoxesRelationship(this.mainShape);
    }
}
const getBoxYPosition = (times = 1, subBy = 0) => {
    return boardHeight - (boxWidth - subBy) * times - 35;
    // return boardHeight - 60; //(boxWidth - subBy) * times;
};
const generateShape = (shape) => {
    let x = 0;
    let y = 2;
    const mainShape = [];
    const idleShape = [];
    let height = 0;
    for (const box of shape) {
        if (box === "\n") {
            y++;
        }
    }
    height = y * boxHeight;
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
        height: height - boxHeight,
    };
};
export const populateShapes = () => {
    const allColors = [matchedColor, "red", "yellow", "green", "purple"];
    const shapes = [];
    for (let i = 0; i < 3; i++) {
        const pickedShape = shapesRotations[Math.floor(Math.random() * shapesRotations.length)];
        const color = allColors[Math.floor(Math.random() * allColors.length)];
        const rotationsMain = [];
        const rotationsIdle = [];
        for (const shape of pickedShape.rotations) {
            const { shape: rotation, idleShape, height, } = generateShape(shape);
            const adjustedRotation = idleShape.map((box) => ({
                ...box,
                x: box.x + i * (boardWidth / 3) + boardWidth / 10 + 5,
            }));
            rotationsIdle.push({ shapes: adjustedRotation, height });
            rotationsMain.push({ shapes: rotation, height });
        }
        // Adjust each idle shape's x position
        const shapeToPickIndex = Math.floor(Math.random() * rotationsMain.length);
        const shapeIns = new Shape(rotationsMain, rotationsIdle, rotationsMain[shapeToPickIndex].shapes, rotationsIdle[shapeToPickIndex].shapes, i, shapeToPickIndex, rotationsMain[shapeToPickIndex].height, color);
        console.log({ shapeIns });
        shapes.push(shapeIns);
    }
    return shapes;
};
