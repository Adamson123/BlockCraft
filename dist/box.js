import { boardHeight, boardWidth, boxHeight, boxWidth, boxesOnHover, defaultColor, defaultStrokeColor, hoverColor, matchedColor, matchedStrokeColor, } from "./globals.js";
export default class Box {
    x;
    y;
    color;
    width;
    height;
    index;
    matched;
    strokeColor;
    constructor(x, y, index) {
        this.x = x;
        this.y = y;
        this.color = defaultColor;
        this.width = boxWidth;
        this.height = boxHeight;
        this.index = index;
        this.matched = false;
        this.strokeColor = defaultStrokeColor;
    }
    // `shape` is an array of objects matching the ShapeBox interface.
    shapeOver(shape) {
        if (!shape)
            return;
        for (const box of shape) {
            const gapX = box.x - this.x;
            const gapY = box.y - this.y;
            const maxGap = this.width / 2;
            const isHorizontallyAligned = gapX <= maxGap && gapX >= -(maxGap - 1);
            const isVerticallyAligned = gapY <= maxGap && gapY >= -(maxGap - 1);
            if (isHorizontallyAligned && isVerticallyAligned && !this.matched) {
                boxesOnHover.add(this.index);
                if (boxesOnHover.size === shape.length) {
                    this.color = hoverColor;
                }
                break;
            }
            else {
                boxesOnHover.delete(this.index);
                if (!this.matched) {
                    this.color = defaultColor;
                }
            }
        }
        if (boxesOnHover.size !== shape.length && !this.matched) {
            this.color = defaultColor;
        }
    }
    // Marks the box as matched and updates its style
    toMatched() {
        this.color = matchedColor;
        this.matched = true;
        this.strokeColor = matchedStrokeColor;
    }
}
const row = boardWidth / boxWidth;
const column = boardHeight / boxHeight - 4;
let count = 0;
export const populateBoxes = () => {
    const boxes = [];
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < column; j++) {
            count++;
            boxes.push(new Box(i * boxWidth, j * boxHeight, count));
        }
    }
    return boxes;
};
