import {
    boxWidth,
    boardHeight,
    matchedColor,
    matchedStrokeColor,
    boxHeight,
    boardWidth,
    idle,
    hoverColor,
    ctx,
} from "../globals.js";
import { shapesEmoji } from "./shapesEmoji.js";

const spinSvg = new Image();
spinSvg.src = "./src/assets/images/spin-3.svg";
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
    boxesChange: { x: string; y: string }[];
    defaultBoxesChange: { x: string; y: string }[];
    isAccomodable: boolean;
    Pivots: {
        pivotX: number;
        pivotY: number;
        idlePivotX: number;
        idlePivotY: number;
    };

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
        color: string
    ) {
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
        this.boxesChange = this.getBoxesChange();
        this.defaultBoxesChange = this.getBoxesChange();
        this.isAccomodable = true;
        this.Pivots = {
            idlePivotX: this.findPivotX(idleShape),
            idlePivotY: this.findPivotY(idleShape),
            pivotX: this.findPivotX(shape),
            pivotY: this.findPivotY(shape),
        };
    }

    findWidth() {
        return (
            this.mainShape.reduce(
                (sum, { x }) => (sum = x > sum ? x : sum),
                0
            ) + boxWidth
        );
    }
    findHeight() {
        return (
            this.boxes.reduce(
                (biggest, { y }) => (biggest = biggest > y ? biggest : y),
                0
            ) + boxHeight
        );
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
    getBoxesChange() {
        return this.boxesRelationship.map((box) => ({
            x: box.x.event === "neutral" ? "unchanged" : "changed",
            y: box.y.event === "neutral" ? "unchanged" : "changed",
        }));
    }

    isInDefaultShape() {
        const arrayMatch =
            JSON.stringify(this.defaultBoxesChange) ===
            JSON.stringify(this.boxesChange);

        console.log(this.boxes.length, Math.sqrt(this.boxes.length), "len");
        if (arrayMatch || !Number.isInteger(Math.sqrt(this.boxes.length))) {
            return arrayMatch;
        }
        let changedCount = 0;
        let unChangedCount = 0;
        this.boxesChange.forEach((box) => {
            if (box.x === "changed") {
                changedCount++;
            } else if (box.x === "unchanged") {
                unChangedCount++;
            }

            if (box.y === "changed") {
                changedCount++;
            } else if (box.y === "unchanged") {
                unChangedCount++;
            }
        });
        console.log(`Passes u:${changedCount}, c: ${unChangedCount}`);

        return changedCount === unChangedCount;
    }

    updateDefaultBoxesChange() {
        this.defaultBoxesChange = this.boxesChange;
    }
    toNotAccomodable() {
        this.isAccomodable = false;
        this.color = hoverColor;
    }
    toAccomodable() {
        this.isAccomodable = true;
        this.color = this.mainColor;
    }
    findPivotX(shape: BoxShape[]) {
        return Math.round(
            shape.reduce((sum, { x }) => sum + x, 0) / shape.length
        );
    }
    findPivotY(shape: BoxShape[]) {
        return Math.round(
            shape.reduce((sum, { y }) => sum + y, 0) / shape.length
        );
    }

    spin() {
        const spinShape = (
            shape: BoxShape[],
            pivotX: number,
            pivotY: number,
            idle: number = 0
        ) => {
            return shape.map(({ x, y }) => {
                const translatedX = x - pivotX;
                const translatedY = y - pivotY;

                // Adjust the rotation to be clockwise
                const rotatedX = -translatedY + pivotX;
                const rotatedY = translatedX + pivotY;

                return {
                    x: Math.round(rotatedX),
                    y: Math.round(rotatedY),
                    width: boxWidth - idle,
                    height: boxHeight - idle,
                };
            });
        };
        const { pivotX, pivotY, idlePivotX, idlePivotY } = this.Pivots;
        // Rotate the main shape and idle shape

        this.mainShape = spinShape(this.mainShape, pivotX, pivotY);
        this.idleShape = spinShape(this.boxes, idlePivotX, idlePivotY, idle);
        this.boxes = this.idleShape;
        this.width = this.findWidth();
        this.height = this.findHeight();
        this.boxesRelationship = this.getBoxesRelationship(this.idleShape);
        this.boxesChange = this.getBoxesChange();
    }
    drawSpinningIcon() {
        const pivotX = this.findPivotX(this.idleShape);
        const pivotY = this.findPivotY(this.idleShape);

        ctx.drawImage(spinSvg, pivotX - 6, pivotY - 2, 25, 30);
    }
}

const getBoxYPosition = (times = 1, subBy: number = 0): number => {
    return boardHeight - (boxWidth - subBy) * times - 23;
    // return boardHeight - 60; //(boxWidth - subBy) * times;
};

//Generates array of objects from shape emoji
const generateShape = (shape: string) => {
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
export const populateShapes = (): Shape[] => {
    const allColors = [matchedColor, "red", "yellow", "green", "purple"];
    const shapes: Shape[] = [];
    for (let i = 0; i < 3; i++) {
        const pickedShape =
            shapesEmoji[Math.floor(Math.random() * shapesEmoji.length)];

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
