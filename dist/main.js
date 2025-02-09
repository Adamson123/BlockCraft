import { boxWidth, boxesOnHover, board, hoverColor, } from "./globals.js";
import { populateShapes } from "./shapes.js";
import { populateBoxes } from "./box.js";
import { draw } from "./draw.js";
import { clickedOnBox, getMousePosition } from "./utils.js";
let mousedown = false;
let currentShape;
let boxes = populateBoxes();
let shapes = populateShapes();
const dragShape = (x, y) => {
    if (!currentShape)
        return;
    // Calculate differences based on the first box position
    const dx = x - currentShape.boxes[0].x - currentShape.width / 4;
    const dy = y - currentShape.boxes[0].y - currentShape.height - 10;
    currentShape.boxes.forEach((box) => {
        box.x = box.x + dx;
        box.y = box.y + dy;
    });
    draw(shapes, currentShape, boxes);
};
const selectShape = (event) => {
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
    if (currentShape)
        dragShape(x, y);
};
const moveShape = (event) => {
    if (mousedown && currentShape) {
        const { x, y } = getMousePosition(event);
        dragShape(x, y);
    }
};
const DeleteBoxesInOccupiedDimensions = () => {
    const hoveredOnAndOccupiedBoxes = [];
    boxes.forEach((box) => {
        if (boxesOnHover.boxes.has(box.index) && box.isOccupied) {
            hoveredOnAndOccupiedBoxes.push(box);
        }
    });
    const matchedHorizontally = [];
    const matchedVertically = [];
    const occupiedBoxes = {};
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
    return occupiedBoxes;
};
const useBoxesRelationship = (boxesRelationship) => {
    let boxx = [];
    const occupiedBoxes = boxes.filter((box) => !box.isOccupied);
    const getCoor = (event, dimension, times) => {
        if (event === "increased") {
            return boxx[boxx.length - 1][dimension] + times * boxWidth;
        }
        else if (event === "decreased") {
            return boxx[boxx.length - 1][dimension] - times * boxWidth;
        }
        else {
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
                const isExist = occupiedBoxes.find((box) => box.x === newCoor.x && box.y === newCoor.y);
                if (isExist) {
                    boxx.push(newCoor);
                }
                else {
                    break;
                }
            }
            else {
                break;
            }
        }
        if (boxx.length === boxesRelationship.length + 1) {
            console.log("Yeah");
            break;
        }
        else {
            boxx = [];
        }
    }
    boxx.shift();
    return boxx;
};
const annimateBoxesInOccupiedDimensions = (occupiedBoxes) => {
    const callback = () => {
        draw(shapes, currentShape, boxes);
        console.log("Called last");
    };
    Object.keys(occupiedBoxes).forEach((boxes) => {
        const ocBoxes = occupiedBoxes[boxes];
        if (ocBoxes.length >= 10) {
            // const lastBoxIndex = ocBoxes[ocBoxes.length - 1].index;
            ocBoxes.forEach((box, index) => {
                box.animate(callback, index + 1);
            });
        }
    });
    //draw(shapes, currentShape, boxes);
};
const resetShapePosition = () => {
    mousedown = false;
    if (!currentShape) {
        return;
    }
    // Call the shape's method to reset its position
    currentShape.toIdleShape();
    let occupiedBoxes = {};
    if (boxesOnHover.boxes.size === currentShape.boxes.length) {
        boxesOnHover.boxes.forEach((boxNumber) => {
            boxes[boxNumber - 1].toOccupied();
        });
        occupiedBoxes = DeleteBoxesInOccupiedDimensions();
        shapes = shapes.filter((shape) => shape.index !== currentShape.index);
    }
    boxesOnHover.emptyBoxesOnHover();
    currentShape = undefined;
    if (!shapes.length)
        shapes = populateShapes();
    let isSpaceAvailable = false;
    //Checking if atleast one shape in the shape array is accomodatable
    for (const shape of shapes) {
        const occupiableBoxes = useBoxesRelationship(shape.boxesRelationship);
        if (occupiableBoxes.length) {
            isSpaceAvailable = true;
            shape.toAccomodable();
        }
        else {
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
    annimateBoxesInOccupiedDimensions(occupiedBoxes);
};
draw(shapes, currentShape, boxes);
// window.addEventListener("resize", () => {
//     resetBoardSize();
//     console.log({ boardWidth }, window.innerWidth, start);
//     boxes = populateBoxes();
//     shapes = populateShapes();
//     draw(shapes, currentShape, boxes);
// });
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
