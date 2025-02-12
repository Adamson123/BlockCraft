import { drawInsetShadow, resetShadowValues } from "./draw.js";
import { boxHeight, boxWidth, boxesOnHover, ctx, defaultColor, defaultStrokeColor, hoverColor, matchedStrokeColor, start, } from "./globals.js";
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
    toOccupied(color) {
        this.color = color; //matchedColor;
        this.isOccupied = true;
        this.strokeColor = matchedStrokeColor;
    }
    toUnOccupied() {
        this.color = defaultColor;
        this.isOccupied = false;
        this.strokeColor = defaultStrokeColor;
    }
    animate(callback = () => { }, index) {
        let width = this.width - 2;
        let height = this.height - 2;
        let currentFrame = 0;
        const animation = (frame) => {
            if (width <= 0 || height <= 0) {
                console.log("Animation stopped at frame:", currentFrame);
                this.toUnOccupied();
                if (index === 10) {
                    callback();
                }
                return;
            }
            if (frame - currentFrame >= 5) {
                currentFrame = frame;
                ctx.clearRect(this.x - 1, this.y - 1, this.width, this.height);
                ctx.strokeStyle = defaultStrokeColor;
                ctx.fillStyle = defaultColor;
                ctx.strokeRect(this.x, this.y, this.width - 2, this.height - 2);
                ctx.fillRect(this.x, this.y, this.width - 2, this.height - 2);
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x + (this.width - width) / 2, this.y + (this.height - height) / 2, (width -= 3), (height -= 3));
                drawInsetShadow({
                    x: this.x + (this.width - (width - 5)) / 2,
                    y: this.y + (this.height - (height - 5)) / 2,
                    width,
                    height,
                });
                resetShadowValues();
            }
            requestAnimationFrame(animation);
        };
        animation(0);
    }
}
const row = 10; //boardWidth / boxWidth;
const column = 10; // boardHeight / boxHeight - 4;
export const populateBoxes = () => {
    let count = 0;
    const boxes = [];
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < column; j++) {
            count++;
            boxes.push(new Box(i * boxWidth + start, j * boxHeight + 10, count));
        }
    }
    return boxes;
};
