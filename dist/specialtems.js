import { boardWidth, boxWidth } from "./globals.js";
const bombCount = document.querySelector(".bombCount");
const spinCount = document.querySelector(".spinCount");
const resetShapesCount = document.querySelector(".resetShapesCount");
const times = 3;
export const bomb = {
    x: (boardWidth - boxWidth * times) / 2,
    y: boardWidth + 5,
    bombImageSize: 30,
    imageX() {
        return (boardWidth - this.bombImageSize) / 2;
    },
    imageY() {
        return boardWidth + (boxWidth * times - this.bombImageSize) / 2;
    }, //boardWidth + 23,
    size: boxWidth * times,
    cursorImageSize: boxWidth * times,
    bombSelected: false,
    bombMode: false,
    boxes: new Set(),
    resetBomb() {
        this.x = (boardWidth - boxWidth * times) / 2;
        this.y = boardWidth + 5;
        this.imageX = () => this.x + (this.size - this.bombImageSize) / 2;
        this.imageY = () => this.y + (this.size - this.bombImageSize) / 2;
        this.bombSelected = false;
    },
    updateImagePosition() {
        this.imageX = () => this.x + (this.size - this.bombImageSize) / 2;
        this.imageY = () => this.y + (this.size - this.bombImageSize) / 2;
    },
};
export const specialtems = {
    spin: 2,
    resetShapes: 3,
    bomb: 2,
};
export const updateSpecialItemsCountDisplay = () => {
    bombCount.textContent = String(specialtems.bomb);
    spinCount.textContent = String(specialtems.spin);
    resetShapesCount.textContent = String(specialtems.resetShapes);
};
