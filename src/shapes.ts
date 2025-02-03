import {
    boxWidth,
    boardHeight,
    matchedColor,
    matchedStrokeColor,
} from "./globals.js";

export interface BoxShape {
    x: number;
    y: number;
}

export class Shape {
    boxes: BoxShape[];
    default: BoxShape[];
    width: number;
    height: number;
    color: string;
    strokeColor: string;
    index: number;

    /**
     * @param shape
     * @param index
     * @param width
     * @param height
     */
    constructor(
        shape: BoxShape[],
        index: number,
        width: number,
        height?: number
    ) {
        this.boxes = shape;
        // Use structuredClone to deep clone the array of boxes.
        this.default = structuredClone(shape);
        this.width = width || 100;
        this.height = height || 100;
        this.color = matchedColor;
        this.strokeColor = matchedStrokeColor;
        this.index = index;
    }

    toDefaultPos() {
        this.boxes = structuredClone(this.default);
    }
}

const getBoxYPos = (times = 1): number => {
    return boardHeight - boxWidth * times;
};

export const shortOShapeObj: BoxShape[] = [
    {
        x: boxWidth,
        y: getBoxYPos(3),
    },
    {
        x: boxWidth + boxWidth,
        y: getBoxYPos(3),
    },
    {
        x: boxWidth,
        y: getBoxYPos(2),
    },
    {
        x: boxWidth + boxWidth,
        y: getBoxYPos(2),
    },
];

const L = `🟥⬜
           🟥⬜
           🟥🟥`;

const l = `🟥⬜
           🟥🟥`;

const J = `⬜🟥
           ⬜🟥
           🟥🟥`;

const j = `⬜🟥
           🟥🟥`;

export const populateShapes = (): Shape[] => {
    const allShapes = [L, l, J, j];
    const shapes: Shape[] = [];
    for (let i = 0; i < 3; i++) {
        const adjustedShape = shortOShapeObj.map((box) => ({
            ...box,
            x: box.x + i * (i ? boxWidth * 3 : 0),
        }));

        const shape = new Shape(adjustedShape, i, 100, 100);
        shapes.push(shape);
    }
    return shapes;
};
