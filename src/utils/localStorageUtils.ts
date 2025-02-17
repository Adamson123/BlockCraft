import Box from "../box/box.js";
import { Shape } from "../shape/shapes.js";

type Keys = "boxes" | "shapes" | "score" | "items";

export function saveToLocalStorage(key: Keys, data: any) {
    const dataString = JSON.stringify(data);
    localStorage.setItem(key, dataString);
}

export function getFromLocalStorage(key: Keys): any {
    const dataString = localStorage.getItem(key);
    switch (key) {
        case "boxes":
            const boxes = JSON.parse(dataString as string) as Box[];
            return boxes ? boxes.map((box) => new Box({ ...box })) : "";
        case "shapes":
            const shapes = JSON.parse(dataString as string) as Shape[];
            return shapes ? shapes.map((shape) => new Shape({ ...shape })) : "";
        default:
            return JSON.parse(dataString as string);
    }
}
