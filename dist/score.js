import { gameScore } from "./globals.js";
const highestScoreText = document.querySelector(".highestScore");
const scoreText = document.querySelector(".score");
const remarkDisplay = document.querySelector(".remark");
export const updateScore = (reset = false) => {
    if (gameScore.score <= 0 && !reset) {
        return;
    }
    if (gameScore.score > gameScore.highestScore) {
        gameScore.surpassedHighScore = true;
        gameScore.highestScore = gameScore.score;
    }
    scoreText.textContent = gameScore.score.toString();
    highestScoreText.textContent = gameScore.highestScore.toString();
};
export const displayRemark = () => {
    remarkDisplay.style.scale = String(1);
    setTimeout(() => {
        remarkDisplay.style.scale = String(0);
    }, 2000);
};
