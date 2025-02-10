const whoosh = document.querySelector<HTMLAudioElement>(".whoosh")!;
const glock = document.querySelector<HTMLAudioElement>(".glock")!;
const descendingTones =
    document.querySelector<HTMLAudioElement>(".descending-tones")!;

const getIcon = (name: string, alt: string) => {
    return `<img src="./src/assets/images/${name}.svg" alt="${alt}" />`;
};

let fullscreen = false;
export const toggleFullscreen = (fullscreenBtn: HTMLButtonElement) => {
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
    if (soundOn) {
        soundBtn.innerHTML = getIcon("volume_off", "sound");
        soundOn = false;
    } else {
        soundBtn.innerHTML = getIcon("volume_up", "sound");
        soundOn = true;
    }
};

//const whooshSound = new Audio("./src/assets/audios/whoosh.mp3");

export const playSound = (
    sound: "whoosh" | "glock" | "descending-tones" = "glock"
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
        default:
            glock.play();
            break;
    }
};
