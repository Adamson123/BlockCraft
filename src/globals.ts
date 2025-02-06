export const boxHeight = 38;
export const boxWidth = 38;

export const boardWidth = boxWidth * 10 + 50;
export const boardHeight = boxWidth * 14 + 25;
export const idle = 17;

export const boxesOnHover = {
    boxes: new Set(),
    emptyBoxesOnHover() {
        this.boxes = new Set();
    },
};

export const defaultColor = "rgb(250, 240, 221)";
export const defaultStrokeColor = "rgb(241, 140, 140)";
export const hoverColor = "rgb(241, 140, 140, 0.7)"; //"rgb(180,180,180)";
export const matchedColor = "rgb(200, 0, 0)";
export const matchedStrokeColor = "rgb(241, 140, 140)";

export const board = document.querySelector<HTMLCanvasElement>(".board")!;
export const ctx = board.getContext("2d")!;

board.width = boardWidth;
board.height = boardHeight;
