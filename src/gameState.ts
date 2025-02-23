import Box from "./box/box.js";

import { playSound } from "./settings.js";
import { Shape } from "./shape/shapes.js";
import { findOccupiableBoxes } from "./box/boxesHandler.js";
import { modifyElementDisplay } from "./utils/utils.js";
import { saveToLocalStorage } from "./utils/localStorageUtils.js";
import { gameScore } from "./scoring.js";

const pauseContainer =
    document.querySelector<HTMLDivElement>(".pauseContainer")!;
const gameState = document.querySelector(".gameState")!;
const gameScoreHTML = document.querySelector(".gameScore")!;
const scoreLabel = document.querySelector(".scoreLabel")!;
const playBtn = document.querySelector<HTMLButtonElement>(".playBtn")!;

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
    saveToLocalStorage("shapes", shapes);

    if (!isSpaceAvailable) {
        playSound("descending-tones");
        const occupiedBoxes = boxes.filter((box) => box.isOccupied);
        const lastBox = occupiedBoxes[occupiedBoxes.length - 1];
        occupiedBoxes.forEach((box, index) => {
            setTimeout(() => {
                callback(box, lastBox);
            }, index * 20);
        });
    }
};

let pause = false;
export const toggleGameState = (gameOver: boolean = false) => {
    playSound();
    if (pause) {
        modifyElementDisplay(pauseContainer, "none");
        pause = false;
    } else {
        modifyElementDisplay(pauseContainer, "flex");
        pause = true;
    }
    if (gameOver) {
        modifyElementDisplay(playBtn, "none");
        gameState.textContent = "GAME OVER";
    } else {
        modifyElementDisplay(playBtn, "inherit");
        gameState.textContent = "PAUSE";
    }
    if (gameScore.surpassedHighScore) {
        scoreLabel.textContent = "NEW HIGHEST SCORE:";
    } else {
        scoreLabel.textContent = "SCORE:";
    }
    gameScoreHTML.textContent = gameScore.score.toString();
};
