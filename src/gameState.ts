import Box from "./box/box.js";
import { gameScore } from "./globals.js";

import { playSound } from "./settings.js";
import { Shape } from "./shape/shapes.js";
import { findOccupiableBoxes } from "./box/boxesHandler.js";

const pauseContainer =
    document.querySelector<HTMLDivElement>(".pauseContainer")!;
const gameState = document.querySelector(".gameState")!;
const gameScoreHTML = document.querySelector(".gameScore")!;
const scoreLabel = document.querySelector(".scoreLabel")!;

export const checkLose = (
    boxes: Box[],
    shapes: Shape[],
    callback: (box: Box, lastBox: Box) => void
) => {
    let isSpaceAvailable = false;
    //Checking if atleast one shape in the shape array is accomodatable

    for (const shape of shapes) {
        const occupiableBoxes = findOccupiableBoxes(
            boxes,
            shape.boxesRelationship
        );
        if (occupiableBoxes.length) {
            isSpaceAvailable = true;
            shape.toAccomodable();
        } else {
            shape.toNotAccomodable();
        }
    }

    if (!isSpaceAvailable) {
        playSound("descending-tones");
        const occupiedBoxes = boxes.filter((box) => box.isOccupied);
        const lastBox = occupiedBoxes[occupiedBoxes.length - 1];
        occupiedBoxes.forEach((box, index) => {
            setTimeout(() => {
                callback(box, lastBox);
            }, index * 10);
        });
    }
};

let pause = false;
export const toggleGameState = (gameOver: boolean = false) => {
    playSound();
    if (pause) {
        pauseContainer.style.display = "none";
        pause = false;
    } else {
        pauseContainer.style.display = "flex";
        pause = true;
    }
    if (gameOver) {
        gameState.textContent = "GAME OVER";
    } else {
        gameState.textContent = "PAUSE";
    }
    if (gameScore.surpassedHighScore) {
        scoreLabel.textContent = "NEW HIGHEST SCORE:";
    } else {
        scoreLabel.textContent = "SCORE:";
    }
    gameScoreHTML.textContent = gameScore.score.toString();
};
