import Box from "../box/box.js";
import { Shape } from "../shape/shapes.js";
export function saveToLocalStorage(key, data) {
    const dataString = JSON.stringify(data);
    localStorage.setItem(key, dataString);
}
export function getFromLocalStorage(key) {
    const dataString = localStorage.getItem(key);
    switch (key) {
        case "boxes":
            const boxes = JSON.parse(dataString);
            return boxes ? boxes.map((box) => new Box({ ...box })) : "";
        case "shapes":
            const shapes = JSON.parse(dataString);
            return shapes ? shapes.map((shape) => new Shape({ ...shape })) : "";
        default:
            return JSON.parse(dataString);
    }
}
