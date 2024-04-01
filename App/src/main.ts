import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'; // Importe o GLTFLoader a partir do local correto
import TWEEN from '@tweenjs/tween.js'

import * as THREE from 'three';
import './style.css';
//@ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";

import {buttons_dictionary, buttons_numbers} from "./dict.ts"
import { Calculator, calculatorButtons } from "./calculator.ts";




const calculator = new Calculator();


// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0e67c7);



// Carregando o modelo 3D a partir do arquivo glb
const loader = new GLTFLoader();
loader.load('./src/model.glb', (gltf) => {
    gltf.scene.traverse((child) => {
        if (buttons_dictionary[child.name]) {
            child.userData.isButton = true;
            child.userData.value = buttons_dictionary[child.name];
        }
    });
    
    gltf.scene.scale.set(6, 6, 6);
    gltf.scene.rotation.y = Math.PI;
    scene.add(gltf.scene);
});




// Mouse movement
const mouse: THREE.Vector2 = new THREE.Vector2();
document.addEventListener('mousemove', onMouseMove);

function onMouseMove(event: MouseEvent) {
    mouse.x = (event.clientX / sizes.width) * 2 - 1;
    mouse.y = -(event.clientY / sizes.height) * 2 + 1;

    raycast();
}


let isMovedDown = false;

document.addEventListener('mousedown', () => {
    if (INTERSECTED && !isMovedDown) {

        const button_value: calculatorButtons = INTERSECTED.userData.value;
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
});

document.addEventListener('mouseup', () => {
    if (INTERSECTED && isMovedDown) {
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
});




// Raycaster para detectar a interseção do mouse com os botões da calculadora
let raycaster: THREE.Raycaster;
raycaster = new THREE.Raycaster();

let originalMaterial: any = null;
let INTERSECTED: any = null;

function raycast() {

    raycaster.setFromCamera(mouse, camera); 

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        const object: any = intersects[0].object;

        if (object.userData && object.userData.isButton) {
            addSelectedColorEffect( object );
        } 
    } 
}


// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Light
const light = new THREE.PointLight(0xffffff, 0.5, 200);
light.position.set(0, 10, -10);
scene.add(light)

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

// Enable shadows
light.castShadow = true;

// Configure shadows
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
light.shadow.camera.near = 0.1;
light.shadow.camera.far = 50;

// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 20;
scene.add(camera);

// Renderer
const canvas = document.querySelector('.webgl') as HTMLCanvasElement;
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.enabled = true;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);


// Controles orbitais
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = true;
controls.enablePan = false;
controls.target.set(0, 0, 0); // Define o ponto de interesse inicial para onde a câmera estará olhando
// definir o angulo inicial da câmera
controls.maxPolarAngle = 0.8;



// Resize
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
});



// Função para atualizar o texto no canvas
function updateTextOnCanvas(text: string) {
    const canvas_texture: HTMLCanvasElement = document.createElement('canvas');
    canvas_texture.width = 512; // Aumente a resolução do canvas conforme necessário
    canvas_texture.height = 256;
    const context: CanvasRenderingContext2D | null = canvas_texture.getContext('2d');
    if (context) {
        // cor de fundo do canvas
        context.font = 'bold 150px "VT323"'; // Tamanho da fonte maior
        context.fillStyle = '#4AF626'; // Cor do texto

        // Calcula a largura do texto
        const textWidth = context.measureText(text).width;

        // Define a posição x para alinhar o texto à direita do canvas
        const x = canvas_texture.width - textWidth - 10; // 10 pixels de margem à direita

        // Centraliza verticalmente
        const y = (canvas_texture.height / 2) + 40;

        // Desenha o texto
        context.fillText(text, x, y);
    }

    return canvas_texture;
}

// Função para atualizar dinamicamente a textura do material com base no texto atualizado no canvas
function updateTextureWithText(text: string) {
    const texture = new THREE.Texture(updateTextOnCanvas(text));
    texture.needsUpdate = true;
    return texture;
}

// Atualiza o texto inicial
let currentText = 'Initial Text';
let material = new THREE.MeshBasicMaterial({
    map: updateTextureWithText(currentText), // Cria uma textura inicial com o texto atual
    side: THREE.FrontSide,
});
material.transparent = true;
let mesh = new THREE.Mesh(new THREE.PlaneGeometry(5.2,1.2), material);
mesh.position.set(0, 0, -3.75);
mesh.rotation.x = -120.26;
scene.add(mesh);





const loop = () => {
    controls.update();
    currentText = calculator.getScreenText();
    material.map = updateTextureWithText(currentText);
    renderer.render(scene, camera);
    TWEEN.update();
    window.requestAnimationFrame(loop);
};
loop();

// Timeline
const tl = gsap.timeline({ defaults: { duration: 1 } });
tl.fromTo('.title', { opacity: 0 }, { opacity: 1 });



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

