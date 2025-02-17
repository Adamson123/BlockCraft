import { drawInsetShadow, resetShadowValues } from "../draw.js";
import {
    boxHeight,
    boxWidth,
    boxesOnHover,
    ctx,
    defaultColor,
    defaultStrokeColor,
    hoverColor,
    matchedStrokeColor,
    start,
} from "../globals.js";
import { bomb } from "../specialtems.js";
import { saveToLocalStorage } from "../utils/localStorageUtils.js";

type BoxTypes = ClassField<Box>;
export default class Box {
    x: number;
    y: number;
    color: string = defaultColor;
    width: number;
    height: number;
    index: number;
    isOccupied: boolean = false;
    strokeColor: string = defaultColor;

    constructor({
        x,
        y,
        index,
        isOccupied = false,
        strokeColor = defaultStrokeColor,
        color = defaultColor,
    }: BoxTypes) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.width = boxWidth;
        this.height = boxHeight;
        this.index = index;
        this.isOccupied = isOccupied;
        this.strokeColor = strokeColor;
    }

    // `shape` is an array of objects matching the ShapeBox interface.
    shapeOver(shape: BoxShape[] | undefined) {
        if (!shape || this.isOccupied) return;

        for (const box of shape) {
            const gapX = box.x - this.x;
            const gapY = box.y - this.y;
            const maxGap = this.width / 2;

            const isHorizontallyColliding =
                gapX <= maxGap && gapX >= -(maxGap - 1);
            const isVerticallyColliding =
                gapY <= maxGap && gapY >= -(maxGap - 1);

            if (isHorizontallyColliding && isVerticallyColliding) {
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
        if (boxesOnHover.boxes.size !== shape.length && !this.isOccupied) {
            this.color = defaultColor;
        }
    }

    bombOver() {
        const maxGap = bomb.x + bomb.size - this.x;
        const isHorizontallyColliding =
            bomb.x < this.x + this.width && bomb.x + bomb.size >= this.x;
        const isVerticallyColliding =
            bomb.y < this.y + this.height && bomb.y + bomb.size >= this.y;

        if (isHorizontallyColliding && isVerticallyColliding) {
            bomb.boxes.add(this.index);
            ctx.globalAlpha = 0.5;
        } else {
            bomb.boxes.delete(this.index);
            ctx.globalAlpha = 1;
        }
    }

    toOccupied(color: string) {
        this.color = color; //matchedColor;
        this.isOccupied = true;
        this.strokeColor = matchedStrokeColor;
    }
    toUnOccupied() {
        this.color = defaultColor;
        this.isOccupied = false;
        this.strokeColor = defaultStrokeColor;
    }
    animate(callback: (...param: any) => void = () => {}, clear: boolean) {
        let width = this.width - 2;
        let height = this.height - 2;
        let currentFrame = 0;
        const animation = (frame: number) => {
            if (width <= 0 || height <= 0) {
                console.log("Animation stopped at frame:", currentFrame);
                this.toUnOccupied();
                if (clear) {
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
                ctx.fillRect(
                    this.x + (this.width - width) / 2,
                    this.y + (this.height - height) / 2,
                    (width -= 3),
                    (height -= 3)
                );
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

export const populateBoxes = (): Box[] => {
    let count = 0;
    const boxes: Box[] = [];
    for (let i = 0; i < row; i++) {
        for (let j = 0; j < column; j++) {
            count++;
            boxes.push(
                new Box({
                    x: i * boxWidth + start,
                    y: j * boxHeight + 10,
                    index: count,
                } as BoxTypes)
            );
        }
    }
    saveToLocalStorage("boxes", boxes);
    return boxes;
};
