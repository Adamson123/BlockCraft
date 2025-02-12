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
    mainColor: string;
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
     * @param color
     */
    constructor(
        shape: BoxShape[],
        idleShape: BoxShape[],
        index: number,
        width: number,
        height: number,
        color: string
    ) {
        this.boxes = idleShape;
        this.mainShape = shape;
        // Use structuredClone to deep clone the array of boxes
        this.idleShape = idleShape;
        this.width = width || 100;
        this.height = height || 100;
        this.color = color;
        this.mainColor = color;
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
        this.color = this.mainColor;
    }
}

const getBoxYPosition = (times = 1, subBy: number = 0): number => {
    return boardHeight - (boxWidth - subBy) * times - 35;

    // return boardHeight - 60; //(boxWidth - subBy) * times;
};

const L3x3 = `🟥⬜⬜
              🟥⬜⬜
              🟥🟥🟥`;

const L2x2 = `🟥⬜
              🟥🟥`;

const J2x2 = `⬜🟥
              🟥🟥`;

const T3x3 = `🟥🟥🟥
              ⬜🟥⬜`;

const I3 = `🟥
            🟥
            🟥`;

const I2 = `🟥
            🟥`;

const I4 = `🟥
            🟥
            🟥
            🟥`;

const dot = "🟥";

const box2x2 = `🟥🟥
                🟥🟥`;

const box3x3 = `🟥🟥🟥
                🟥🟥🟥
                🟥🟥🟥`;

const line3 = "🟥🟥🟥";

const line4 = "🟥🟥🟥🟥";

const Z3x3 = `🟥🟥⬜
              ⬜🟥🟥`;

const Z2x2 = `🟥🟥
              ⬜🟥`;

const S3x3 = `⬜🟥🟥
              🟥🟥⬜`;

const S2x2 = `⬜🟥
              🟥🟥`;

const U2x2 = `🟥⬜
              🟥🟥`;

const Corner3 = `🟥🟥
                 🟥⬜`;

const Corner4 = `🟥🟥🟥
                 🟥⬜⬜`;

const SmallL = `🟥⬜
                🟥🟥`;

const SmallJ = `⬜🟥
                🟥🟥`;

const SmallT = `🟥🟥🟥
                ⬜🟥⬜`;

const SmallS = `⬜🟥🟥
                🟥🟥⬜`;

const SmallZ = `🟥🟥⬜
                ⬜🟥🟥`;

const TwoBlock = "🟥🟥";

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
    const allShapes = [
        dot,
        line4,
        line3,

        box2x2,
        box3x3,
        L3x3,
        L2x2,

        J2x2,
        T3x3,
        I3,
        I2,
        I4,
        Z3x3,
        Z2x2,
        S3x3,
        S2x2,

        U2x2,

        Corner3,
        Corner4,
        SmallL,
        SmallJ,
        SmallT,
        SmallS,
        SmallZ,
        TwoBlock,
    ]; //[two, twoT, twoTw];;
    const allColors = [matchedColor, "red", "yellow", "green", "purple"];
    const shapes: Shape[] = [];
    for (let i = 0; i < 3; i++) {
        const pickedShape =
            allShapes[Math.floor(Math.random() * allShapes.length)];

        const color = allColors[Math.floor(Math.random() * allColors.length)];

        // Adjust each idle shape's x position
        const { shape, idleShape, width, heigth } = generateShape(pickedShape);
        const adjustedShape = idleShape.map((box) => ({
            ...box,
            x: box.x + i * (boardWidth / 3) + boardWidth / 10 + 5,
        }));

        const shapeIns = new Shape(
            shape,
            adjustedShape,
            i,
            width,
            heigth,
            color
        );
        shapes.push(shapeIns);
    }
    return shapes;
};
