import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'; // Importe o GLTFLoader a partir do local correto
import TWEEN from '@tweenjs/tween.js'
import * as THREE from 'three';
import './style.css';
//@ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { buttons_dictionary, buttons_numbers, other_objs, LEDsCodes, paperName, paperRollName} from "./dict.ts"
import { Calculator, calculatorButtons } from "./calculator.ts";
import { addStarsToScene, controlDisplayOnOff, loadModel, onResize, playAudio, sleep, turnLEDOnOff, updateScreenTextureWithText } from "./utils.ts";


const calculator = new Calculator();

let textColor = '#4AF626';
// maxSize 100 - minSize 40 - midSize 70
let textSize = 100;
let isFirstStart = true;
let printerCounter = 0;
let fatorEscalaPapel = 1.5;
let sliderCounter = 0;
let SliderDirectionValue = -0.1;
let isOn = false
let glbModelPath = './src/calculator.glb';
let displayText = '';
let mouse: THREE.Vector2 = new THREE.Vector2();
let isMovedDown = false;
let raycaster: THREE.Raycaster = new THREE.Raycaster()
let originalMaterial: any = null;
export let INTERSECTED: any = null;
let loader = new GLTFLoader();
let scene = new THREE.Scene();
export const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}


// Configuração da texto
let textMaterial = new THREE.MeshBasicMaterial({
    map: updateScreenTextureWithText(displayText, textSize ,textColor), 
    side: THREE.FrontSide,
});
textMaterial.transparent = true;
let textMesh = new THREE.Mesh(new THREE.PlaneGeometry(6.8,1.2), textMaterial);
textMesh.position.set(-0.15, -0.02, -1.98);
textMesh.rotation.x = -120.26;
scene.add(textMesh);


scene.background = new THREE.Color(0x000000);
loader.load(glbModelPath, (gltf: GLTF) => loadModel(gltf, scene));


// Configuração da luz
const light = new THREE.PointLight(0xffffff, 0.5, 200);
light.position.set(0, 10, -10);
scene.add(light)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// Configuração da sombra
light.castShadow = true;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = 50;

// Configuração da câmera
export const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 2000);
camera.position.z = 500;
camera.position.y = 20;
scene.add(camera);


// Renderizador
const canvas = document.querySelector('.webgl') as HTMLCanvasElement;
export const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.enabled = true;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);


// Configurando controles orbitais
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = true;
controls.enablePan = false;


document.addEventListener('mousemove', onMouseMove);

document.addEventListener('mousedown', onMouseDown);

document.addEventListener('mouseup', onMouseUp);

window.addEventListener('resize', onResize);


function loop() {
    controls.update();
    controlDisplayOnOff(isOn,calculator, textMaterial, textSize, textColor, displayText);
    renderer.render(scene, camera);
    TWEEN.update();
    window.requestAnimationFrame(loop);
};


// Raycaster para detectar a interseção do mouse com os botões da calculadora
function raycast() {
    raycaster.setFromCamera(mouse, camera); 
    
    const intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
        const object: any = intersects[0].object;
        if ((object.userData && (object.userData.isButton || object.userData.isOtherObj)) || object.name == paperName) {
                addSelectedColorEffect( object );
        } else if(INTERSECTED) {
                INTERSECTED.material = originalMaterial;
                INTERSECTED = null;
        }
    }  else if(INTERSECTED) {
        INTERSECTED.material = originalMaterial;
        INTERSECTED = null;
    }
}

function addSelectedColorEffect(object: any) {
            if (INTERSECTED !== object) {
                if (INTERSECTED) {
                    // Restaurar o material original do objeto anteriormente interseccionado
                    INTERSECTED.material = originalMaterial;
                }

                // Salvar o material original do objeto interseccionado
                originalMaterial = object.material;

                if (originalMaterial)
                var copyOfOriginal = originalMaterial.clone()

                // get original color from original material and make it brighter
                if (copyOfOriginal)
                copyOfOriginal.color.setRGB(originalMaterial.color.r + 0.3, originalMaterial.color.g + 0.3, originalMaterial.color.b + 0.3)


                // Criar um novo material com a cor desejada para o objeto interseccionado
                const newMaterial = copyOfOriginal

                // Aplicar o novo material ao objeto interseccionado
                INTERSECTED = object;
                INTERSECTED.material = newMaterial;
            }
}

function onMouseDown(){
        ripPaper();
        onONOFFChange();
        onSliderChange();
        onButtonDown();
}

function onMouseUp() {
        onButtonUp();
}

function onMouseMove(event: MouseEvent) {
    updateMousePosition(event);
    raycast();
}

async function onONOFFChange() {
    if(INTERSECTED && INTERSECTED.userData && INTERSECTED.userData.isOtherObj) {
        if(other_objs[INTERSECTED.name] == "on/off") {
            let selectedObject = INTERSECTED
            if(isFirstStart) {
                playAudio("carEngine");
                await sleep(1.1);
                isFirstStart = false;
            } else {
                playAudio("switch");
            }
            isOn = !isOn;
            turnLEDOnOff("led1", isOn, scene);
            // Verifica se o objeto INTERSECTED está definido
            if (selectedObject !== undefined) {
                // Cria uma nova animação Tween para rotacionar o objeto em 20 graus no eixo x
                const tween = new TWEEN.Tween(selectedObject.rotation)
                .to({ y: selectedObject.rotation.y +(isOn ? 0.3  : -0.3 )}, 100) // Rotação de 20 graus em radianos
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();
            }
        }
}
}

 function onSliderChange() {
    if(INTERSECTED && INTERSECTED.userData && INTERSECTED.userData.isOtherObj) {
        if(other_objs[INTERSECTED.name] == "slider") {
            let selectedObject = INTERSECTED
            if (selectedObject !== undefined) {
                if(sliderCounter == 2) {
                    SliderDirectionValue = SliderDirectionValue * -1;
                }
                const finalX= selectedObject.position.x + SliderDirectionValue;
                const tween = new TWEEN.Tween(selectedObject.position)
                .to({ x: finalX}, 100) // Rotação de 20 graus em radianos
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();
                switch(finalX) {
                        case 0:
                            textSize = 100;
                            break;
                        case -0.1:
                            textSize = 85;
                            break;
                        case -0.2:
                            textSize = 70;
                            break;
                    }
                if(sliderCounter != 2) {
                    sliderCounter++;
                } else {
                    sliderCounter = 1;
                }
            }
        }
}
}

function onButtonDown() {
          if (INTERSECTED && !isMovedDown && INTERSECTED.userData.isButton) {
        playAudio("button");

        const button_value: calculatorButtons = INTERSECTED.userData.value;
        if (button_value == "=") {
            turnLEDOnOff("led2", true, scene);
            increasePaperSize();
        }

        calculator.buttonClick(button_value);


        const button = buttons_dictionary[INTERSECTED.name];
        // mover o Intersected e os buttons_numbers para baixo no eixo y usando 
        // Tween
        const tween = new TWEEN.Tween(INTERSECTED.position)
            .to({ y: - 0.05 }, 100)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();

        const buttons = buttons_numbers[button];
        buttons.forEach((button) => {
            const object: any = scene.getObjectByName(button);
            const tween = new TWEEN.Tween(object.position)
                .to({ y: - 0.05 }, 100)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();
        });


        isMovedDown = true;

    }
}

function onButtonUp() { 
          if (INTERSECTED && isMovedDown && INTERSECTED.userData.isButton) {
            turnLEDOnOff("led2", false, scene);
        // mover o Intersected e os buttons_numbers para cima no eixo y usando 
        // Tween
        const tween = new TWEEN.Tween(INTERSECTED.position)
            .to({ y: 0 }, 100)
            .easing(TWEEN.Easing.Quadratic.Out)
            .start();

        const button = buttons_dictionary[INTERSECTED.name];
        const buttons = buttons_numbers[button];
        buttons.forEach((button) => {
            const object: any = scene.getObjectByName(button);
            const tween = new TWEEN.Tween(object.position)
                .to({ y: 0 }, 100)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start();
        });


        isMovedDown = false;

    }
}

function updateMousePosition(event: MouseEvent) {
    // Normaliza a posição do mouse para variar de -1 a 1
    mouse.x = (event.clientX / sizes.width) * 2 - 1;
    mouse.y = -(event.clientY / sizes.height) * 2 + 1;
}




function increasePaperSize() {
    if (isOn) {
        if (printerCounter < 5) {
            let paper: any = scene.getObjectByName(paperName);
            let paperRoll: any = scene.getObjectByName(paperRollName);
            
            
            // Aumenta apenas a escala no eixo Y (altura)
            console.log(fatorEscalaPapel);
            var newScale = paper.scale.clone().setY(paper.scale.y * fatorEscalaPapel);
            fatorEscalaPapel *= 0.92;
            
            playAudio("printer");
            
            new TWEEN.Tween(paper.scale)
            .to(newScale, 2000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();
            
            // Rotaciona o rolo de papel no eixo X
            var newRotationX = paperRoll.rotation.x + Math.PI / 3; // ou outro valor de rotação desejado
            new TWEEN.Tween(paperRoll.rotation)
            .to({x: newRotationX}, 2000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();
            
            // Rotaciona o papel no eixo Y para trás
            var newYRotation = paper.rotation.x + Math.PI / 30; // Rotação muito pequena para trás (em radianos)
            new TWEEN.Tween(paper.rotation)
            .to({x: newYRotation}, 1000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();
            
            
            
            printerCounter++;
        } else {
            ripPaper(true);
            printerCounter = 0;
            fatorEscalaPapel = 1.5;
        }
    }
    }


export function ripPaper(dontNeedIntersected = false) {

    if((INTERSECTED && INTERSECTED.name == paperName) || dontNeedIntersected) {
    playAudio("paperRip");
    printerCounter = 0;
    let paper: any = scene.getObjectByName(paperName);
    paper.scale.setY(1);
    paper.rotation. x = 0;
    }
}


addStarsToScene(6000, 3000, scene);

loop();
