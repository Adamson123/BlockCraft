import {
    boxWidth,
    boardHeight,
    matchedColor,
    matchedStrokeColor,
    boxHeight,
    boardWidth,
    idle,
    hoverColor,
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
    boxesRelationship: BoxesRelationship[];
    isAccomodable: boolean;

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
        // Use structuredClone to deep clone the array of boxes
        this.idleShape = idleShape;
        this.width = width || 100;
        this.height = height || 100;
        this.color = matchedColor;
        this.strokeColor = matchedStrokeColor;
        this.index = index;
        this.boxesRelationship = this.getBoxesRelationship(shape);
        this.isAccomodable = true;
    }

    toIdleShape() {
        this.boxes = structuredClone(this.idleShape);
    }
    toMainShape() {
        this.boxes = structuredClone(this.mainShape);
    }
    getBoxesRelationship(shape: BoxShape[]) {
        const firstBox: any = structuredClone(shape[0]);
        const boxesRelationship: {
            x: { event: string; times: number };
            y: { event: string; times: number };
        }[] = [];

        const getEventAndTimes = (value: number, dimension: string) => {
            if (value > firstBox[dimension]) {
                const eventAndTimes = {
                    event: "increased",
                    times: (value - firstBox[dimension]) / boxWidth,
                };

                firstBox[dimension] = value;
                return eventAndTimes;
            } else if (value < firstBox[dimension]) {
                const eventAndTimes = {
                    event: "decreased",
                    times: (firstBox[dimension] - value) / boxWidth,
                };
                firstBox[dimension] = value;
                return eventAndTimes;
            } else {
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
        this.color = matchedColor;
    }
}

const getBoxYPosition = (times = 1, subBy: number = 0): number => {
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
const _ = `🟥⬜🟥
           ⬜⬜⬜
           🟥⬜🟥`;

const box = `🟥🟥🟥
             🟥🟥🟥
            `;

const ___ = "🟥🟥🟥";

const ____ = "🟥🟥🟥🟥";

const generateShape = (shape: string) => {
    let x = 0;
    let y = 2;
    const mainShape = [];
    const idleShape = [];
    let width = boxWidth;
    let heigth = 0;
    for (const box of shape) {
        if (box === "\n") {
            y++;
        }
    }
    heigth = y * boxHeight;

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
            if (x * boxWidth > width) width = x * boxWidth;
            x = 0;
        }
    }
    return {
        shape: mainShape,
        idleShape,
        width,
        heigth: heigth - boxHeight,
    };
};

export const populateShapes = (): Shape[] => {
    const allShapes = [I, dot, ___, ____]; //[L, l, J, j, dot, I, T];
    const shapes: Shape[] = [];
    for (let i = 0; i < 3; i++) {
        const pickedShape =
            allShapes[Math.floor(Math.random() * allShapes.length)];
        // Adjust each idle shape's x position
        const { shape, idleShape, width, heigth } = generateShape(pickedShape);
        const adjustedShape = idleShape.map((box) => ({
            ...box,
            x: box.x + i * (boardWidth / 3) + boardWidth / 10 + 5,
        }));

        const shapeIns = new Shape(shape, adjustedShape, i, width, heigth);
        shapes.push(shapeIns);
    }
    return shapes;
};
