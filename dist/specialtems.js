import { getFromLocalStorage } from "./utils/localStorageUtils.js";
import { boardWidth, boxWidth } from "./globals.js";
import { modifyElementDisplay } from "./utils/utils.js";
const bombCount = document.querySelector(".bombCount");
const spinCount = document.querySelector(".spinCount");
const resetShapesCount = document.querySelector(".resetShapesCount");
const itemInfoDisplay = document.querySelector(".itemInfoDisplay");
const itemName = itemInfoDisplay.querySelector("h3");
const aboutItem = itemInfoDisplay.querySelector("p");
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
export const specialtems = getFromLocalStorage("items") || {
    spin: 3,
    resetShapes: 3,
    bomb: 3,
};
export const updateSpecialItemsCountDisplay = () => {
    bombCount.textContent = String(specialtems.bomb);
    spinCount.textContent = String(specialtems.spin);
    resetShapesCount.textContent = String(specialtems.resetShapes);
};
const about = (num) => {
    return `
    <h4 style="text-decoration: underline;">Ways to Get ?</h4>
    <ul style="text-align: left;">
        <li>Clear ${num}${num === 6 ? " or more" : ""} dimensions.</li>
        <li>Clear a dimension with a matching color.</li>
    </ul>
`;
};
const itemsInfo = [
    {
        name: "SPIN",
        about: about(3),
    },
    {
        name: "RESET SHAPES",
        about: about(5),
    },
    {
        name: "BOMB",
        about: about(4),
    },
];
export const toggleItemInfoDisplay = (display = "flex", index = 0) => {
    const itemInfo = itemsInfo[index];
    itemName.textContent = itemInfo.name;
    aboutItem.innerHTML = itemInfo.about;
    modifyElementDisplay(itemInfoDisplay, display);
};
