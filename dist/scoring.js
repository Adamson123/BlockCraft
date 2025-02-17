import { playSound } from "./settings.js";
import { specialtems, updateSpecialItemsCountDisplay } from "./specialtems.js";
import { getFromLocalStorage, saveToLocalStorage, } from "./utils/localStorageUtils.js";
import { modifyElementDisplay } from "./utils/utils.js";
const highestScoreText = document.querySelector(".highestScore");
const scoreText = document.querySelector(".score");
const remarkContainer = document.querySelector(".remarkContainer");
const points = document.querySelector(".points");
const remark = document.querySelector(".remark");
const colorMatched = document.querySelector(".colorMatched");
const specialItemsRewardDisplay = document
    .querySelector(".specialItemsRewardDisplay")
    .querySelectorAll("div");
const bombCount2 = document.querySelector(".bombCount2");
const spinCount2 = document.querySelector(".spinCount2");
const resetShapesCount2 = document.querySelector(".resetShapesCount2");
const colorMatchedText = colorMatched.querySelector("h4");
export const gameScore = getFromLocalStorage("score") || {
    highestScore: 0,
    score: 0,
    surpassedHighScore: false,
};
export const updateScore = (comboPoints, points, dimensionColorMatchedCount, reset = false) => {
    gameScore.score += comboPoints > 0 ? comboPoints + points : points;
    //gameScore.score += dimensionColorMatchedCount;
    highestScoreText.textContent = gameScore.highestScore.toString();
    if (gameScore.score <= 0 && !reset) {
        return;
    }
    if (gameScore.score > gameScore.highestScore) {
        gameScore.surpassedHighScore = true;
        gameScore.highestScore = gameScore.score;
    }
    saveToLocalStorage("score", gameScore);
    scoreText.textContent = gameScore.score.toString();
    highestScoreText.textContent = gameScore.highestScore.toString();
};
export const displayRemark = (comboCount, dimensionColorMatchedCount) => {
    if (comboCount > 0 || dimensionColorMatchedCount) {
        let remarkText = "";
        comboCount /= 50;
        let spin = dimensionColorMatchedCount;
        let bomb = dimensionColorMatchedCount;
        let resetShapes = dimensionColorMatchedCount;
        switch (comboCount) {
            case 1:
                remarkText = "NICE!";
                playSound("nice");
                break;
            case 2:
                remarkText = "GOOD JOB!";
                spin++;
                playSound("good-job");
                break;
            case 3:
                remarkText = "AMAZING!";
                bomb++;
                playSound("amazing");
                break;
            case 4:
                remarkText = "INCREDIBLE!";
                resetShapes++;
                playSound("incredible");
                break;
            default:
                if (comboCount > 4) {
                    remarkText = "INCREDIBLE!";
                    resetShapes += comboCount - 4;
                    playSound("incredible");
                }
                break;
        }
        if (dimensionColorMatchedCount) {
            modifyElementDisplay(colorMatchedText, "block");
            colorMatchedText.textContent = `COLOR MATCHED!! x${dimensionColorMatchedCount}`;
        }
        else {
            modifyElementDisplay(colorMatchedText, "none");
        }
        //if bomb,resetShapes,spin
        if (comboCount) {
            modifyElementDisplay(remark, "block");
            modifyElementDisplay(points, "block");
            remark.textContent = remarkText;
            points.textContent = comboCount * 50 + "+";
        }
        else {
            modifyElementDisplay(remark, "none");
            modifyElementDisplay(points, "none");
        }
        //Spin
        if (spin) {
            spinCount2.textContent = String(spin);
            specialtems.spin += spin;
            modifyElementDisplay(specialItemsRewardDisplay[0], "block");
        }
        else {
            modifyElementDisplay(specialItemsRewardDisplay[0], "none");
        }
        //Reset shapes
        if (resetShapes) {
            resetShapesCount2.textContent = String(resetShapes);
            specialtems.resetShapes += resetShapes;
            modifyElementDisplay(specialItemsRewardDisplay[1], "block");
        }
        else {
            modifyElementDisplay(specialItemsRewardDisplay[1], "none");
        }
        //Bomb
        if (bomb) {
            bombCount2.textContent = String(bomb);
            specialtems.bomb += bomb;
            modifyElementDisplay(specialItemsRewardDisplay[2], "block");
        }
        else {
            modifyElementDisplay(specialItemsRewardDisplay[2], "none");
        }
        if (!bomb && !spin && !resetShapes) {
            modifyElementDisplay(colorMatched, "none");
        }
        else {
            modifyElementDisplay(colorMatched, "block");
        }
        saveToLocalStorage("items", specialtems);
        updateSpecialItemsCountDisplay();
        remarkContainer.style.scale = String(1);
        setTimeout(() => {
            remarkContainer.style.scale = String(0);
        }, 3500);
    }
};
