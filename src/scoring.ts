import { gameScore } from "./globals.js";
import { playSound } from "./settings.js";

const highestScoreText = document.querySelector(".highestScore")!;
const scoreText = document.querySelector(".score")!;
const remarkContainer =
    document.querySelector<HTMLDivElement>(".remarkContainer")!;
const points = document.querySelector(".points")!;
const remark = document.querySelector(".remark")!;

export const updateScore = (
    comboPoints: number,
    points: number,
    dimensionColorMatchedCount: number,
    reset: boolean = false
) => {
    gameScore.score += comboPoints > 0 ? comboPoints + points : points;
    gameScore.score += dimensionColorMatchedCount;

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

export const displayRemark = (
    comboCount: number,
    dimensionColorMatchedCount: number
) => {
    if (comboCount > 0) {
        let remarkText = "";
        console.log(comboCount / 50);

        switch (comboCount / 50) {
            case 1:
                remarkText = "NICE!";
                playSound("nice");
                break;
            case 2:
                remarkText = "GOOD JOB!";
                playSound("good-job");
                break;
            case 3:
                remarkText = "AMAZING!";
                playSound("amazing");
                break;
            case 4:
                remarkText = "INCREDIBLE!";
                playSound("incredible");
                break;
            default:
                remarkText = "INCREDIBLE!";
                playSound("incredible");
                break;
        }
        remark.textContent = remarkText;
        points.textContent = comboCount + "+";
        remarkContainer.style.scale = String(1);

        setTimeout(() => {
            remarkContainer.style.scale = String(0);
        }, 2000);
    }
};
