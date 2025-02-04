import {
    boardHeight,
    boardWidth,
    boxHeight,
    boxWidth,
    boxesOnHover,
    defaultColor,
    defaultStrokeColor,
    hoverColor,
    matchedColor,
    matchedStrokeColor,
} from "./globals.js";

export default class Box {
    x: number;
    y: number;
    color: string;
    width: number;
    height: number;
    index: number;
    occupied: boolean;
    strokeColor: string;

    constructor(x: number, y: number, index: number) {
        this.x = x;
        this.y = y;
        this.color = defaultColor;
        this.width = boxWidth;
        this.height = boxHeight;
        this.index = index;
        this.occupied = false;
        this.strokeColor = defaultStrokeColor;
    }

    // `shape` is an array of objects matching the ShapeBox interface.
    shapeOver(shape: BoxShape[] | undefined) {
        if (!shape || this.occupied) return;

        for (const box of shape) {
            const gapX = box.x - this.x;
            const gapY = box.y - this.y;

            const maxGap = this.width / 2;

            const isHorizontallyAligned =
                gapX <= maxGap && gapX >= -(maxGap - 1);
            const isVerticallyAligned = gapY <= maxGap && gapY >= -(maxGap - 1);

            if (isHorizontallyAligned && isVerticallyAligned) {
                boxesOnHover.boxes.add(this.index);
                if (boxesOnHover.boxes.size === shape.length) {
                    this.color = hoverColor;
                }
                break;
            } else {
                boxesOnHover.boxes.delete(this.index);
                this.color = defaultColor;
            }
        }
        if (boxesOnHover.boxes.size !== shape.length && !this.occupied) {
            this.color = defaultColor;
        }
    }

    // Marks the box as occupied and updates its style
    toOccupied() {
        this.color = matchedColor;
        this.occupied = true;
        this.strokeColor = matchedStrokeColor;
    }
    toUnOccupied() {
        this.color = defaultColor;
        this.occupied = false;
        this.strokeColor = defaultStrokeColor;
    }
}

const row = boardWidth / boxWidth;
const column = boardHeight / boxHeight - 4;
let count = 0;

export const populateBoxes = (): Box[] => {
    const boxes: Box[] = [];
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < column; j++) {
            count++;
            boxes.push(new Box(i * boxWidth, j * boxHeight, count));
        }
    }
    return boxes;
};
