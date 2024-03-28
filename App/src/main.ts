import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'; // Importe o GLTFLoader a partir do local correto
import TWEEN from '@tweenjs/tween.js'

import * as THREE from 'three';
import './style.css';
//@ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";

// Scene
const scene = new THREE.Scene();

scene.background = new THREE.Color(0x0e67c7);



const buttons_dictionary: { [key: string]: string }  = {
    "mesh2058303266": "7",
    "mesh502161026": "8",
    "mesh1297306164_1": "9",
    "mesh1587545857_1": "4",
    "mesh1020324790_1": "5",
    "mesh318797025_1": "6",
    "mesh1296408862_1": "1",
    "group1730796089": "2",
    "group293917853": "3",
    "mesh2033548222_1": "00",
    "group1280017540": "0",
    "group454468518": ".",
    "group1294525603": "/",
    "group389477461": "-",
    "group23065195": "+="
}

const buttons_numbers: { [key: string]: Array<string> } = {
    "7": ["mesh2058303266_1"],
    "8": ["mesh502161026_1"],
    "9": ["mesh1297306164"],
    "4": ["mesh1587545857"],
    "5": ["mesh1020324790"],
    "6": ["mesh318797025"],
    "1": ["mesh1296408862"],
    "2": ["group51909272", "group2060062126", "group450101333", "group991849902", "group1455072456"],
    "3": ["group1621648348", "group1303773984", "group1370157279", "group1454253446"],
    "00": ["mesh2033548222"],
    "0": ["group1011208216", "group1814558664", "group1638635107", "group901693912"],
    ".": ["group1105652737"],
    "/": ["group8797649", "group1752570532", "group1173938501"],
    "-": ["group1643812943"],
    "+=": ["group133655897", "group1271219890", "group466515903", "group836615341"]
};

// Instantiate a loader
const loader = new GLTFLoader();

let raycaster: THREE.Raycaster;

// Load the GLB model
loader.load('./src/model.glb', (gltf) => {
    gltf.scene.traverse((child) => {
        if (buttons_dictionary[child.name]) {
            child.userData.isButton = true;
        }
    });

    gltf.scene.scale.set(6, 6, 6);
    scene.add(gltf.scene);
});


raycaster = new THREE.Raycaster();

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


// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = false;
controls.enablePan = false;


// Raycaster
raycaster = new THREE.Raycaster();

// Mouse movement
const mouse: THREE.Vector2 = new THREE.Vector2();
document.addEventListener('mousemove', onMouseMove);

function onMouseMove(event: MouseEvent) {
    mouse.x = (event.clientX / sizes.width) * 2 - 1;
    mouse.y = -(event.clientY / sizes.height) * 2 + 1;

    raycast();
}

let originalMaterial: any = null;
let INTERSECTED: any = null;

function raycast() {


    raycaster.setFromCamera(mouse, camera); 

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        // Se o raio interseccionar com um objeto
        const object: any = intersects[0].object;

        // Verificar se o objeto é um botão
        if (object.userData && object.userData.isButton) {

            const buttonBody = buttons_numbers[buttons_dictionary[object.name]];
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
        } else {
            // Se o objeto não é um botão, restaurar o material original do objeto anteriormente interseccionado
            if (INTERSECTED) {
                INTERSECTED.material = originalMaterial;
                INTERSECTED = null;
            }
        }
    } else {
        // Se não há interseção, restaurar o material original do objeto anteriormente interseccionado
        if (INTERSECTED) {
            INTERSECTED.material = originalMaterial;
            INTERSECTED = null;
        }
    }
}

let isMovedDown = false;

window.addEventListener('mousedown', () => {
    if (INTERSECTED && !isMovedDown) {
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

window.addEventListener('mouseup', () => {
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

const loop = () => {
    controls.update();
    renderer.render(scene, camera);
    TWEEN.update();
    window.requestAnimationFrame(loop);
};
loop();

// Timeline
const tl = gsap.timeline({ defaults: { duration: 1 } });
tl.fromTo('.title', { opacity: 0 }, { opacity: 1 });