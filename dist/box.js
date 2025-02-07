import { boardHeight, boardWidth, boxHeight, boxWidth, boxesOnHover, ctx, defaultColor, defaultStrokeColor, hoverColor, matchedColor, matchedStrokeColor, } from "./globals.js";
export default class Box {
    x;
    y;
    color;
    width;
    height;
    index;
    isOccupied;
    strokeColor;
    constructor(x, y, index) {
        this.x = x;
        this.y = y;
        this.color = defaultColor;
        this.width = boxWidth;
        this.height = boxHeight;
        this.index = index;
        this.isOccupied = false;
        this.strokeColor = defaultStrokeColor;
    }
    // `shape` is an array of objects matching the ShapeBox interface.
    shapeOver(shape) {
        if (!shape || this.isOccupied)
            return;
        for (const box of shape) {
            const gapX = box.x - this.x;
            const gapY = box.y - this.y;
            const maxGap = this.width / 2;
            const isHorizontallyAligned = gapX <= maxGap && gapX >= -(maxGap - 1);
            const isVerticallyAligned = gapY <= maxGap && gapY >= -(maxGap - 1);
            if (isHorizontallyAligned && isVerticallyAligned) {
                boxesOnHover.boxes.add(this.index);
                if (boxesOnHover.boxes.size === shape.length) {
                    this.color = hoverColor;
                }
                break;
            }
            else {
                boxesOnHover.boxes.delete(this.index);
                this.color = defaultColor;
            }
        }
        if (boxesOnHover.boxes.size !== shape.length && !this.isOccupied) {
            this.color = defaultColor;
        }
    }
    // Marks the box as isOccupied and updates its style
    toOccupied() {
        this.color = matchedColor;
        this.isOccupied = true;
        this.strokeColor = matchedStrokeColor;
    }
    toUnOccupied() {
        // requestAnimationFrame(animate);
        this.color = defaultColor;
        this.isOccupied = false;
        this.strokeColor = defaultStrokeColor;
    }
    animate(callback = () => { }) {
        let x = this.x;
        let y = this.y;
        ctx.strokeStyle = matchedStrokeColor;
        const animation = (currentTime) => {
            ctx.clearRect(0, 0, boardWidth, boardHeight);
            callback(boardWidth, boardHeight);
            ctx.fillStyle = matchedColor;
            ctx.fillRect(x, (y += 5), this.width - 2, this.height - 2);
            requestAnimationFrame(animation);
        };
        animation(0);
    }
}
const row = 10; //boardWidth / boxWidth;
const column = 10; // boardHeight / boxHeight - 4;
let count = 0;
export const start = (boardWidth - row * boxWidth) / 2;
export const populateBoxes = () => {
    const boxes = [];
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < column; j++) {
            count++;
            boxes.push(new Box(i * boxWidth + start, j * boxHeight + start, count));
        }
    }
    return boxes;
};
