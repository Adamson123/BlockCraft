import { boxWidth, boxesOnHover, board, hoverColor } from "./globals.js";
import { populateShapes, Shape } from "./shapes.js";
import Box, { populateBoxes } from "./box.js";
import {
    draw,
    drawAllShapes,
    drawBoxes,
    drawBoxesBoardBorder,
} from "./draw.js";
import { clickedOnBox, getMousePosition } from "./utils.js";

let mousedown = false;
let currentShape: Shape | undefined;

let boxes: Box[] = populateBoxes();
let shapes: Shape[] = populateShapes();

const dragShape = (x: number, y: number) => {
    if (!currentShape) return;

    // Calculate differences based on the first box position
    const dx = x - currentShape.boxes[0].x - currentShape.width / 4;
    const dy = y - currentShape.boxes[0].y - currentShape.height - 10;

    currentShape.boxes.forEach((box: BoxShape) => {
        box.x = box.x + dx;
        box.y = box.y + dy;
    });

    draw(shapes, currentShape, boxes);
};

const selectShape = (event: MouseEvent | TouchEvent) => {
    mousedown = true;
    const { x, y } = getMousePosition(event);
    for (const shape of shapes) {
        let clicked = false;
        for (const box of shape.boxes) {
            if (clickedOnBox(x, y, box)) {
                clicked = true;
                break;
            }
        }
        if (clicked && shape.isAccomodable) {
            currentShape = shape;
            currentShape.toMainShape();
            break;
        }
    }

    if (currentShape) dragShape(x, y);
};

const moveShape = (event: MouseEvent | TouchEvent) => {
    if (mousedown && currentShape) {
        const { x, y } = getMousePosition(event);
        dragShape(x, y);
    }
};

const DeleteBoxesInOccupiedDimensions = () => {
    const hoveredOnAndOccupiedBoxes: Box[] = [];

    boxes.forEach((box) => {
        if (boxesOnHover.boxes.has(box.index) && box.isOccupied) {
            hoveredOnAndOccupiedBoxes.push(box);
        }
    });

    const matchedHorizontally: Box[] = [];
    const matchedVertically: Box[] = [];

    const occupiedBoxes: { [key: string]: Box[] } = {};
    hoveredOnAndOccupiedBoxes.forEach((box) => {
        occupiedBoxes[box.x + "x"] = [];
        occupiedBoxes[box.y + "y"] = [];
        boxes.forEach((box2) => {
            if (box2.y === box.y && box2.isOccupied) {
                occupiedBoxes[box.y + "y"].push(box2);
                matchedHorizontally.push(box2);
            }
            if (box2.x === box.x && box2.isOccupied) {
                occupiedBoxes[box.x + "x"].push(box2);
                matchedVertically.push(box2);
            }
        });
    });

    Object.keys(occupiedBoxes).forEach((boxes) => {
        const ocBoxes = occupiedBoxes[boxes];
        if (ocBoxes.length >= 10) {
            console.log("occupiedBoxes");
            ocBoxes.forEach((box) => {
                box.toUnOccupied();
            });
        }
    });
};

const useBoxesRelationship = (boxesRelationship: BoxesRelationship[]) => {
    let boxx: any[] = [];

    const occupiedBoxes = boxes.filter((box) => !box.isOccupied);
    const getCoor = (event: string, dimension: string, times: number) => {
        if (event === "increased") {
            return boxx[boxx.length - 1][dimension] + times * boxWidth;
        } else if (event === "decreased") {
            return boxx[boxx.length - 1][dimension] - times * boxWidth;
        } else {
            return boxx[boxx.length - 1][dimension];
        }
    };
    for (const box of occupiedBoxes) {
        boxx = [{ x: box.x, y: box.y }];

        for (const box2 of boxesRelationship) {
            if (boxx.length !== boxesRelationship.length + 1) {
                const newCoor = {
                    x: getCoor(box2.x.event, "x", box2.x.times),
                    y: getCoor(box2.y.event, "y", box2.y.times),
                };
                const isExist = occupiedBoxes.find(
                    (box) => box.x === newCoor.x && box.y === newCoor.y
                );
                if (isExist) {
                    boxx.push(newCoor);
                } else {
                    break;
                }
            } else {
                break;
            }
        }

        if (boxx.length === boxesRelationship.length + 1) {
            console.log("Yeah");
            break;
        } else {
            boxx = [];
        }
    }
    boxx.shift();
    return boxx;
};

const resetShapePosition = () => {
    mousedown = false;

    if (!currentShape) {
        return;
    }
    // Call the shape's method to reset its position
    currentShape.toIdleShape();

    if (boxesOnHover.boxes.size === currentShape.boxes.length) {
        boxesOnHover.boxes.forEach((boxNumber) => {
            boxes[(boxNumber as number) - 1].toOccupied();
        });
        DeleteBoxesInOccupiedDimensions();
        shapes = shapes.filter((shape) => shape.index !== currentShape!.index);
    }
    boxesOnHover.emptyBoxesOnHover();

    currentShape = undefined;
    if (!shapes.length) shapes = populateShapes();

    let isSpaceAvailable = false;
    //Checking if atleast one shape in the shape array is accomodatable
    for (const shape of shapes) {
        const occupiableBoxes = useBoxesRelationship(shape.boxesRelationship);
        if (occupiableBoxes.length) {
            isSpaceAvailable = true;
            shape.toAccomodable();
        } else {
            shape.toNotAccomodable();
        }
    }
    if (!isSpaceAvailable) {
        boxes.forEach((box) => {
            if (box.isOccupied) {
                box.color = hoverColor;
            }
        });
    }

    draw(shapes, currentShape, boxes);
};

drawAllShapes(shapes);
drawBoxes(boxes);
//drawBoxesBoardBorder();

//mouse events
board.addEventListener("mousemove", moveShape);
board.addEventListener("mousedown", selectShape);
board.addEventListener("mouseup", resetShapePosition);
board.addEventListener("mouseout", resetShapePosition);

//touch events
board.addEventListener("touchmove", moveShape);
board.addEventListener("touchstart", selectShape);
board.addEventListener("touchend", resetShapePosition);
board.addEventListener("touchcancel", resetShapePosition);
