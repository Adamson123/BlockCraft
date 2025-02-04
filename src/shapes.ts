import {
    boxWidth,
    boardHeight,
    matchedColor,
    matchedStrokeColor,
    boxHeight,
    boardWidth,
    idle,
} from "./globals.js";

export class Shape {
    boxes: BoxShape[];
    mainShape: BoxShape[];
    idleShape: BoxShape[];
    width: number;
    height: number;
    color: string;
    strokeColor: string;
    index: number;

    /**
     * @param shape
     * @param idleShape
     * @param index
     * @param width
     * @param height
     */
    constructor(
        shape: BoxShape[],
        idleShape: BoxShape[],
        index: number,
        width: number,
        height?: number
    ) {
        this.boxes = idleShape;
        this.mainShape = shape;
        // Use structuredClone to deep clone the array of boxes.
        this.idleShape = idleShape;
        this.width = width || 100;
        this.height = height || 100;
        this.color = matchedColor;
        this.strokeColor = matchedStrokeColor;
        this.index = index;
    }

    toIdleShape() {
        this.boxes = structuredClone(this.idleShape);
    }
    toMainShape() {
        this.boxes = structuredClone(this.mainShape);
    }
}

const getBoxYPos = (times = 1, subBy: number = 0): number => {
    return boardHeight - (boxWidth - subBy) * times;
};

const L = `🟥⬜⬜
           🟥⬜⬜
           🟥🟥🟥`;

const l = `🟥⬜
           🟥🟥`;

const J = `⬜🟥
           ⬜🟥
           🟥🟥`;

const j = `⬜🟥
           🟥🟥`;

const T = `🟥🟥🟥
           ⬜🟥⬜`;

const I = `🟥
           🟥
           🟥`;

const i = `🟥
           🟥`;

const dot = "🟥";

const generateShape = (shape: string) => {
    let x = 0;
    let y = 2;
    const shapeArr = [];
    const idleShape = [];
    let width = 0;
    let heigth = 0;
    for (const box of shape) {
        if (box === "\n") {
            y++;
        }
    }
    heigth = y * boxHeight;

    for (const box of shape) {
        if (box === "🟥") {
            shapeArr.push({
                x: x * boxWidth,
                y: getBoxYPos(y),
                width: boxWidth,
                height: boxHeight,
            });
            idleShape.push({
                x: x * (boxWidth - idle),
                y: getBoxYPos(y, idle) - 30,
                width: boxWidth - idle,
                height: boxHeight - idle,
            });
        }
        if (box === "🟥" || box === "⬜") {
            x++;
        }
        if (box === "\n") {
            y--;
            if (x * boxWidth > width) width = x * boxWidth;
            x = 0;
        }
    }
    return {
        shape: shapeArr,
        idleShape,
        width,
        heigth: heigth - boxHeight,
    };
};

export const populateShapes = (): Shape[] => {
    const allShapes = [L, l, J, j, dot, I, T];
    const shapes: Shape[] = [];
    for (let i = 0; i < 3; i++) {
        const pickedShape =
            allShapes[Math.floor(Math.random() * allShapes.length)];
        // Adjust each idle shape's x position
        const { shape, idleShape, width, heigth } = generateShape(pickedShape);
        // const adjustedShape = idleShape.map((box) => ({
        //     ...box,
        //     x: box.x + i * (i ? boardWidth / 3 : 0) + 30,
        // }));
        const adjustedShape = idleShape.map((box) => ({
            ...box,
            x: box.x + i * (boardWidth / 3) + boxWidth,
        }));

        const shapeIns = new Shape(shape, adjustedShape, i, width, heigth);
        shapes.push(shapeIns);
    }
    return shapes;
};
