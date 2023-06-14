import * as THREE from 'three';
import './style.css'
//@ts-ignore
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import gsap from "gsap";

// Scene
const scene = new THREE.Scene();

// Create our Sphere
const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({ color: "#00ff83" , roughness: 0.5});
const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

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
sphere.castShadow = true;
sphere.receiveShadow = true;

// Configure shadows
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
light.shadow.camera.near = 0.5;
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
controls.autoRotate = true;
controls.autoRotateSpeed = 5;


// Resize
window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
})
const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop();

//Timeline
const tl = gsap.timeline({ defaults: { duration: 1 } });
tl.fromTo( sphere.scale, { z: 0 , x: 0, y: 0}, { z: 1, x: 1, y: 1} );
tl.fromTo('nav', {y: "-100%"}, { y: "0%"})
tl.fromTo( '.title', { opacity: 0 }, { opacity: 1 });


// Mouse animation color
let mouseDown = false;
let rgb = [0, 0, 0];
window.addEventListener('mousedown', () => {
    mouseDown = true;
})
window.addEventListener('mouseup', () => {
    mouseDown = false;
})

window.addEventListener('mousemove', (e) => {
    if(mouseDown) {
      rgb = [ 
        Math.round(e.pageX / sizes.width * 255),
        Math.round(e.pageY / sizes.height * 255),
        150,
      ]
      // Animate color
      let newColor = new THREE.Color(`rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`);
      gsap.to(sphere.material.color, newColor);
    }
})

