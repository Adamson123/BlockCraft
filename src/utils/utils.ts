import { board, boxWidth } from "../globals.js";

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

export const clickedItem = (
    mouseX: number,
    mouseY: number,
    item: { x: number; y: number },
    itemSize: number = boxWidth
) => {
    const insideHorizontally =
        mouseX >= item.x && mouseX <= item.x + itemSize + 30;
    const insideVertically =
        mouseY >= item.y && mouseY <= item.y + itemSize + 30;
    return insideHorizontally && insideVertically;
};

export const modifyElementDisplay = (
    element: HTMLParagraphElement | HTMLDivElement | HTMLHeadElement,
    display: "none" | "block" | "flex" | "inline-block"
) => {
    element.style.display = display;
};
