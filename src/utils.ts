import { board, boxHeight, boxWidth } from "./globals.js";

interface MousePos {
    x: number;
    y: number;
}

export const getMousePosition = (event: MouseEvent | TouchEvent): MousePos => {
    let clientX: number, clientY: number;
    if ("touches" in event && event.touches.length > 0) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
    } else if ("clientX" in event) {
        clientX = event.clientX;
        clientY = event.clientY;
    } else {
        clientX = 0;
        clientY = 0;
    }

    const rect = board.getBoundingClientRect();
    return {
        x: clientX - rect.left,
        y: clientY - rect.top,
    };
};

export const clickedOnBox = (
    mouseX: number,
    mouseY: number,
    obj: { x: number; y: number }
) => {
    const insideHorizontally =
        mouseX >= obj.x && mouseX <= obj.x + boxWidth + 20;
    const insideVertically =
        mouseY >= obj.y && mouseY <= obj.y + boxHeight + 20;
    return insideHorizontally && insideVertically;
};
