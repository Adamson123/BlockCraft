const size = window.innerWidth > 450 ? 40 : 38;
export const boxHeight = size;
export const boxWidth = size;
export const board = document.querySelector(".board");
export const ctx = board.getContext("2d");
export let boardWidth = boxWidth * 10 + 10;
export let boardHeight = boxWidth * 13 + 20;
board.width = boardWidth;
board.height = boardHeight;
export const idle = 21;
export const boxesOnHover = {
    boxes: new Set(),
    emptyBoxesOnHover() {
        this.boxes = new Set();
    },
};
export const defaultColor = "rgba(0,0,0,0.7)";
export const defaultStrokeColor = "rgba(0,0,0,0.3)";
export const hoverColor = "rgb(0,0,0, 0.5)";
export const matchedColor = "rgb(237, 95, 0)";
export const matchedStrokeColor = "rgba(0,0,0,0.7)";
export const strokeWidth = 2;
export let start = (boardWidth - 10 * boxWidth) / 2;
