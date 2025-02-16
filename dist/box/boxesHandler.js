import { boxesOnHover, boxWidth } from "../globals.js";
import { displayRemark, updateScore } from "../scoring.js";
import { playSound } from "../settings.js";
//: { [key: string]: Box[] }
export const resetBoxesInOccupiedDimensions = (boxes, callback) => {
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
    let points = 0;
    let comboPoints = -1;
    let occupiedDimensionsCount = 0;
    let dimensionColorMatchedCount = 0;
    Object.keys(occupiedBoxes).forEach((boxes) => {
        const ocBoxes = occupiedBoxes[boxes];
        if (ocBoxes.length >= 10) {
            occupiedDimensionsCount++;
        }
    });
    const noOccupiedDimension = occupiedDimensionsCount;
    if (occupiedDimensionsCount) {
        const boxAnimationCallback = () => {
            displayRemark(comboPoints, dimensionColorMatchedCount);
            callback();
        };
        Object.keys(occupiedBoxes).forEach((boxes) => {
            const ocBoxes = occupiedBoxes[boxes];
            if (ocBoxes.length >= 10) {
                occupiedDimensionsCount--;
                points += 100;
                comboPoints++;
                let firstColor = ocBoxes[0].color;
                let dimensionColorMatched = true;
                playSound("whoosh");
                ocBoxes.forEach((box, index) => {
                    if (box.color !== firstColor) {
                        dimensionColorMatched = false;
                    }
                    box.animate(boxAnimationCallback, !occupiedDimensionsCount && index + 1 === 10
                        ? true
                        : false); //toUnOccupied();
                });
                if (dimensionColorMatched) {
                    dimensionColorMatchedCount++;
                }
            }
        });
    }
    comboPoints *= 50;
    dimensionColorMatchedCount *= 100;
    updateScore(comboPoints, points, dimensionColorMatchedCount);
    return noOccupiedDimension; //occupiedBoxes;
};
export const findOccupiableBoxes = (boxes, boxesRelationship) => {
    let occupiableBoxes = [];
    const unOccupiedBoxes = boxes.filter((box) => !box.isOccupied);
    const getCoor = (event, dimension, times) => {
        if (event === "increased") {
            return (occupiableBoxes[occupiableBoxes.length - 1][dimension] +
                times * boxWidth);
        }
        else if (event === "decreased") {
            return (occupiableBoxes[occupiableBoxes.length - 1][dimension] -
                times * boxWidth);
        }
        else {
            return occupiableBoxes[occupiableBoxes.length - 1][dimension];
        }
    };
    for (const box of unOccupiedBoxes) {
        occupiableBoxes = [{ x: box.x, y: box.y }];
        for (const box2 of boxesRelationship) {
            if (occupiableBoxes.length !== boxesRelationship.length + 1) {
                const newCoor = {
                    x: getCoor(box2.x.event, "x", box2.x.times),
                    y: getCoor(box2.y.event, "y", box2.y.times),
                };
                const isExist = unOccupiedBoxes.find((box) => box.x === newCoor.x && box.y === newCoor.y);
                if (isExist) {
                    occupiableBoxes.push(newCoor);
                }
                else {
                    break;
                }
            }
            else {
                break;
            }
        }
        if (occupiableBoxes.length === boxesRelationship.length + 1) {
            break;
        }
        else {
            occupiableBoxes = [];
        }
    }
    occupiableBoxes.shift();
    return occupiableBoxes;
};
