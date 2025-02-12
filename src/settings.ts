import { gameScore } from "./globals.js";

// const whoosh = document.querySelector<HTMLAudioElement>(".whoosh")!;
// const glock = document.querySelector<HTMLAudioElement>(".glock")!;
// const descendingTones =
//     document.querySelector<HTMLAudioElement>(".descending-tones")!;

const getIcon = (name: string, alt: string) => {
    return `<img src="./src/assets/images/${name}.svg" alt="${alt}" />`;
};

let fullscreen = false;
export const toggleFullscreen = (fullscreenBtn: HTMLButtonElement) => {
   playSound()
    if (!fullscreen) {
        const elem = document.documentElement as HTMLElement & {
            mozRequestFullScreen?: () => Promise<void>;
            webkitRequestFullscreen?: () => Promise<void>;
            msRequestFullscreen?: () => Promise<void>;
        };
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            // Firefox
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullscreen) {
            // Chrome, Safari, Opera
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            // Edge/IE
            elem.msRequestFullscreen();
        }

        fullscreenBtn.innerHTML = getIcon("minimal", "screen");
        fullscreen = true;
    } else {
        const doc = document as {
            exitFullscreen?: () => Promise<void>;
            mozCancelFullScreen?: () => Promise<void>;
            webkitExitFullscreen?: () => Promise<void>;
            msExitFullscreen?: () => Promise<void>;
        };
        if (doc.exitFullscreen) {
            doc.exitFullscreen();
        } else if (doc.mozCancelFullScreen) {
            // Firefox
            doc.mozCancelFullScreen();
        } else if (doc.webkitExitFullscreen) {
            // Chrome, Safari, Opera
            doc.webkitExitFullscreen();
        } else if (doc.msExitFullscreen) {
            // Edge/IE
            doc.msExitFullscreen();
        }
        fullscreenBtn.innerHTML = getIcon("fullscreen", "screen");
        fullscreen = false;
    }

};

let soundOn = true;
export const toggleSoundMode = (soundBtn: HTMLButtonElement) => {
   playSound()
    if (soundOn) {
        soundBtn.innerHTML = getIcon("volume_off", "sound");
        soundOn = false;
    } else {
        soundBtn.innerHTML = getIcon("volume_up", "sound");
        soundOn = true;
    }
};

const getSound = (name: string) => {
    return new Audio(`./src/assets/audios/${name}.mp3`);
};
const whoosh = getSound("whoosh");
const nice = getSound("nice");
const glock = getSound("block");
const descendingTones = getSound("descending-tones");
const goodJob = getSound("good_job");
const amazing = getSound("amazing");
const incredible = getSound("incredible");
const click = getSound("click");
const woof = getSound("woof");

// amazing.load();
// glock.load();
// whoosh.load();
// nice.load();
// descendingTones.load();
// goodJob.load();

export const playSound = (
    sound:
        | "whoosh"
        | "glock"
        | "descending-tones"
        | "nice"
        | "amazing"
        | "incredible"
        | "good-job"
        | "click"
        | "woof" = "click"
) => {
    if (!soundOn) return;
    switch (sound) {
        case "whoosh":
            whoosh.play();
            break;
        case "glock":
            glock.play();
            break;
        case "descending-tones":
            descendingTones.play();
            break;
        case "nice":
            nice.play();
            break;
        case "good-job":
            goodJob.play();
            break;
        case "amazing":
            amazing.play();
            break;
        case "incredible":
            incredible.play();
            break;
        case "woof":
            woof.play();
            break;
        default:
            click.play();
            break;
    }
};
