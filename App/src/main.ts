import TWEEN from '@tweenjs/tween.js'
import { camera } from "./three";


const startButton : any  = document.getElementById("startButton")
startButton.addEventListener("click", startInteraction);

export function startInteraction( ) {
    // transition of the camera starting z position 100
    // to 30
    const text = document.getElementById("text")
    const main = document.getElementById("main")
    text?.classList.add("fadeOut");
    setTimeout(() => {
        text?.remove();
        main?.remove();

    }, 1000);

     // @ts-ignore
    const tween = new TWEEN.Tween(camera.position)
        .to({ z: 30, y: 20 }, 1000)
        .easing(TWEEN.Easing.Quadratic.Out)
        .start()
}

