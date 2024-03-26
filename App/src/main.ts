import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'; // Importe o GLTFLoader a partir do local correto

import * as THREE from 'three';
import './style.css';
//@ts-ignore
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";

// Scene
const scene = new THREE.Scene();



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

    gltf.scene.scale.set(5, 5, 5);
    scene.add(gltf.scene);
});


raycaster = new THREE.Raycaster();

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Light
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 10, 10);
scene.add(light);

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

let originalMaterial: THREE.Material | null = null;
let INTERSECTED: any = null;

function raycast() {
    raycaster.setFromCamera(mouse, camera); 

    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        // Se o raio interseccionar com um objeto
        const object = intersects[0].object;

        // Verificar se o objeto é um botão
        if (object.userData && object.userData.isButton) {
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
                copyOfOriginal.color.setRGB(originalMaterial.color.r + 0.5, originalMaterial.color.g + 0.5, originalMaterial.color.b + 0.5)


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
    window.requestAnimationFrame(loop);
};
loop();

// Timeline
const tl = gsap.timeline({ defaults: { duration: 1 } });
tl.fromTo('.title', { opacity: 0 }, { opacity: 1 });

// Mouse animation color
let mouseDown = false;
window.addEventListener('mousedown', () => {
    mouseDown = true;
});
window.addEventListener('mouseup', () => {
    mouseDown = false;
});

