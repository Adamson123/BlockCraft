const size = window.innerWidth > 450 ? 40 : 38;
export const boxHeight = size;
export const boxWidth = size;

export const board = document.querySelector<HTMLCanvasElement>(".board")!;
export const ctx = board.getContext("2d")!;

export const boardWidth = boxWidth * 10 + 10;
export const boardHeight = boxWidth * 13 + 25; //* 14; //+ 25;

board.width = boardWidth;
board.height = boardHeight;

export const idle = 20;

export const boxesOnHover = {
    boxes: new Set(),
    emptyBoxesOnHover() {
        this.boxes = new Set();
    },
};

export const defaultColor = "rgba(0,0,0,0.50)"; //"rgb(250, 240, 221)";
export const defaultStrokeColor = "rgba(0,0,0,0.3)"; //"rgba(139, 90, 43, 0.5)"; //"rgb(241, 140, 140)";
export const hoverColor = "rgb(0,0,0, 0.7)"; //"rgb(180,180,180)";
export const matchedColor = "rgb(237, 180, 0)"; //"rgb(200, 0, 0)";
export const matchedStrokeColor = "rgba(0,0,0,0.7)"; // "rgb(241, 140, 140)";
export const strokeWidth = 2;
