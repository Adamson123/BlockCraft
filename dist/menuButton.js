const whoosh = document.querySelector(".whoosh");
const glock = document.querySelector(".glock");
const descendingTones = document.querySelector(".descending-tones");
const getIcon = (name, alt) => {
    return `<img src="./src/assets/images/${name}.svg" alt="${alt}" />`;
};
let fullscreen = false;
export const toggleFullscreen = (fullscreenBtn) => {
    if (!fullscreen) {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        }
        else if (elem.mozRequestFullScreen) {
            // Firefox
            elem.mozRequestFullScreen();
        }
        else if (elem.webkitRequestFullscreen) {
            // Chrome, Safari, Opera
            elem.webkitRequestFullscreen();
        }
        else if (elem.msRequestFullscreen) {
            // Edge/IE
            elem.msRequestFullscreen();
        }
        fullscreenBtn.innerHTML = getIcon("minimal", "screen");
        fullscreen = true;
    }
    else {
        const doc = document;
        if (doc.exitFullscreen) {
            doc.exitFullscreen();
        }
        else if (doc.mozCancelFullScreen) {
            // Firefox
            doc.mozCancelFullScreen();
        }
        else if (doc.webkitExitFullscreen) {
            // Chrome, Safari, Opera
            doc.webkitExitFullscreen();
        }
        else if (doc.msExitFullscreen) {
            // Edge/IE
            doc.msExitFullscreen();
        }
        fullscreenBtn.innerHTML = getIcon("fullscreen", "screen");
        fullscreen = false;
    }
};
let soundOn = true;
export const toggleSoundMode = (soundBtn) => {
    if (soundOn) {
        soundBtn.innerHTML = getIcon("volume_off", "sound");
        soundOn = false;
    }
    else {
        soundBtn.innerHTML = getIcon("volume_up", "sound");
        soundOn = true;
    }
};
//const whooshSound = new Audio("./src/assets/audios/whoosh.mp3");
export const playSound = (sound = "glock") => {
    if (!soundOn)
        return;
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
        default:
            glock.play();
            break;
    }
};
