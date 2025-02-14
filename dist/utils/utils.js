import { board, boxHeight, boxWidth } from "../globals.js";
export const getMousePosition = (event) => {
    let clientX, clientY;
    if ("touches" in event && event.touches.length > 0) {
        clientX = event.touches[0].clientX;
        clientY = event.touches[0].clientY;
    }
    else if ("clientX" in event) {
        clientX = event.clientX;
        clientY = event.clientY;
    }
    else {
        clientX = 0;
        clientY = 0;
    }
    const rect = board.getBoundingClientRect();
    return {
        x: clientX - rect.left,
        y: clientY - rect.top,
    };
};
export const clickedOnBox = (mouseX, mouseY, obj) => {
    const insideHorizontally = mouseX >= obj.x && mouseX <= obj.x + boxWidth + 30;
    const insideVertically = mouseY >= obj.y && mouseY <= obj.y + boxHeight + 30;
    return insideHorizontally && insideVertically;
};
