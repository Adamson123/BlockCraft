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
import { gameScore } from "../scoring.js";
import { saveToLocalStorage } from "../utils/localStorageUtils.js";
import { shapesEmoji } from "./shapesEmoji.js";

const spinSvg = new Image();
spinSvg.src = "./src/assets/images/spin-3.svg";

type ShapeTypes = ClassField<Shape>;

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
    Pivots: {
        pivotX: number;
        pivotY: number;
        idlePivotX: number;
        idlePivotY: number;
    };
    rotates: number;
    currentRotate: number;

    /**
     * @param shape
     * @param idleShape
     * @param index
     * @param width
     * @param height
     * @param color
     */
    constructor({
        idleShape,
        mainShape,
        index,
        color,
        isAccomodable,
        rotates,
    }: ShapeTypes) {
        this.boxes = idleShape;
        this.mainShape = mainShape;
        // Use structuredClone to deep clone the array of boxes
        this.idleShape = idleShape;
        this.width = this.findWidth();
        this.height = this.findHeight(); //height || 100;
        this.color = color;
        this.mainColor = color;
        this.strokeColor = matchedStrokeColor;
        this.index = index;
        this.boxesRelationship = this.getBoxesRelationship(mainShape);
        this.isAccomodable = isAccomodable;
        this.Pivots = {
            idlePivotX: this.findPivotX(idleShape),
            idlePivotY: this.findPivotY(idleShape),
            pivotX: this.findPivotX(mainShape),
            pivotY: this.findPivotY(mainShape),
        };
        this.rotates = rotates; //TODO
        this.currentRotate = 0;
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

        this.currentRotate++;
        if (this.currentRotate > this.rotates) {
            this.currentRotate = 0;
        }

        // Rotate the main shape and idle shape
        this.mainShape = spinShape(this.mainShape, pivotX, pivotY);
        this.idleShape = spinShape(this.boxes, idlePivotX, idlePivotY, idle);
        this.boxes = this.idleShape;
        this.width = this.findWidth();
        this.height = this.findHeight();
        this.boxesRelationship = this.getBoxesRelationship(this.mainShape);
    }

    drawSpinningIcon() {
        const { idlePivotX, idlePivotY } = this.Pivots;
        ctx.drawImage(spinSvg, idlePivotX - 6, idlePivotY - 2, 25, 30);
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
        mainShape,
        idleShape,
    };
};

const shapesInArray = shapesEmoji.map((shape) => {
    const { idleShape, mainShape } = generateShape(shape.emoji);
    return { mainShape, idleShape, rotates: shape.rotates };
});

const getMaxBoxes = () => {
    if (gameScore.score >= 1500 && gameScore.score < 2500) {
        return 5;
    } else if (gameScore.score >= 2500) {
        return 9;
    } else {
        return 4;
    }
};
//Populates shapes array
export const populateShapes = (): Shape[] => {
    const allColors = [matchedColor, "red", "yellow", "green", "purple"];
    const shapes: Shape[] = [];
    const maxBoxes = getMaxBoxes();
    const shapesToAdd = shapesInArray.filter(
        (shape) => shape.mainShape.length <= maxBoxes
    );

    for (let i = 0; i < 3; i++) {
        const { mainShape, idleShape, rotates } =
            shapesToAdd[Math.floor(Math.random() * shapesToAdd.length)];

        const color = allColors[Math.floor(Math.random() * allColors.length)];

        // Adjust each idle idelShape's x position
        const adjustedShape = idleShape.map((box) => ({
            ...box,
            x: box.x + i * (boardWidth / 3) + boardWidth / 10 + 5,
        }));

        const shapeIns = new Shape({
            mainShape,
            idleShape: adjustedShape,
            index: i,
            color,
            isAccomodable: true,
            rotates,
        } as ShapeTypes);
        shapes.push(shapeIns);
    }
    saveToLocalStorage("shapes", shapes);
    return shapes;
};
