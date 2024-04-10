import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { LEDs, LEDsCodes, buttons_dictionary, other_objs } from "./dict";
import {  camera, renderer, sizes } from "./three";
import * as THREE from 'three';



//------------------------- THREE JS FUNCTIONS -------------------------

/**
 * Adiciona pequenas esferas brancas espalhadas pela cena de maneira aleatória
 * @param quantity define a quantidade de pontos a serem adicionados
 * @param spread define o espaço que os pontos ocuparão
 */
export function addStarsToScene(quantity: number, spread: number = 1000, scene: any) {
    for (let i = 0; i < quantity; i++) {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff });
    const star = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array(3).fill(0).map(() => THREE.MathUtils.randFloatSpread(1000));
    star.position.set(x, y, z);
    scene.add(star);
    }
}


/**
 * Adiciona ou remove a propriedade de emissive dos objetos LED
 * @param led String que representa o led a ser aceso 
 * @param isOn Define se o led será aceso ou apagado
 */
export function turnLEDOnOff(led: "led1" | "led2" | "led3", isOn: boolean, scene: any) {
    const ledColors = {
        led3: 0xff0000,
        led1: 0x00ff00,
        led2: 0x00ff00
    }
    const ledObject: any = scene.getObjectByName(LEDs[led]);
    if (ledObject !== undefined) {
        // faz com que o led brilhe
        ledObject.material.emissiveIntensity = isOn ? 1 : 0;
        ledObject.material.emissive = new THREE.Color(isOn ? ledColors[led] : 0x000000);

    }
}

/**
 * Função para atualizar as informaçãos da cena 
 * quando a tela é redimensionada
 */
export function onResize() {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
}


// Função para atualizar o texto no canvas
function updateTextScreenOnCanvas(text: string,textSize:number,textColor:string ) {
    const canvas_texture: HTMLCanvasElement = document.createElement('canvas');
    canvas_texture.width = 680; // Aumente a resolução do canvas conforme necessário
    canvas_texture.height = 120;
    const context: CanvasRenderingContext2D | null = canvas_texture.getContext('2d');
    if (context) {
        // cor de fundo do canvas
        context.font = 'bold ' + textSize + 'px ' + "Workbench"; // Tamanho da fonte maior
        context.fillStyle = textColor; // Cor do texto

        // Calcula a largura do texto
        const textWidth = context.measureText(text).width;

        // Define a posição x para alinhar o texto à direita do canvas
        const x = canvas_texture.width - textWidth - 10; // 10 pixels de margem à direita

        // Centraliza verticalmente
        const y = (canvas_texture.height / 2) + 45;

        // Desenha o texto
        context.fillText(text, x, y);
    }

    return canvas_texture;
}

export function updateScreenTextureWithText(text: string , textSize:number, textColor:string) {
    const texture = new THREE.Texture(updateTextScreenOnCanvas(text,textSize,textColor));
    texture.needsUpdate = true;
    return texture;
}

// Função para atualizar o texto no canvas
 function updatePaperScreenOnCanvas(text: string,textSize:number,textColor:string ) {
    const canvas_texture: HTMLCanvasElement = document.createElement('canvas');
    canvas_texture.width = 680; // Aumente a resolução do canvas conforme necessário
    canvas_texture.height = 120;
    const context: CanvasRenderingContext2D | null = canvas_texture.getContext('2d');
    if (context) {
        // cor de fundo do canvas
        context.font = 'bold ' + textSize + 'px ' + "VT323"; // Tamanho da fonte maior
        context.fillStyle = textColor; // Cor do texto

        // Calcula a largura do texto
        const textWidth = context.measureText(text).width;

        // Define a posição x para alinhar o texto à direita do canvas
        const x = canvas_texture.width - textWidth - 10; // 10 pixels de margem à direita

        // Centraliza verticalmente
        const y = (canvas_texture.height / 2) + 45;

        // Desenha o texto
        context.fillText(text, x, y);
    }

    return canvas_texture;
}

export function updatePaperTextureWithText(text: string , textSize:number, textColor:string) {
    const texture = new THREE.Texture(updatePaperScreenOnCanvas(text,textSize,textColor));
    texture.needsUpdate = true;
    return texture;
}


// função para carregar o modelo 3D a partir do arquivo glb
export function loadModel(gltf: GLTF, scene: any){
        gltf.scene.traverse((child: any) => {
        if (buttons_dictionary[child.name]) {
            child.userData.isButton = true;
            child.userData.value = buttons_dictionary[child.name];
        }
        if(other_objs[child.name]) {
            child.userData.isOtherObj = true;
        }
        if(LEDsCodes[child.name]) {
            child.material = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x000000 });
        }
    });
    
    gltf.scene.scale.set(6, 6, 6);
    gltf.scene.rotation.y = Math.PI;
    scene.add(gltf.scene);

}


export function controlDisplayOnOff(isOn: boolean, calculator: any, textMaterial: any, textSize: number, textColor: string, displayText: string) {
      if(isOn) {
        displayText = calculator.getScreenText();
        textMaterial.map = updateScreenTextureWithText(displayText, textSize ,textColor);
        if(displayText == "")
        calculator.setScreenText("0");
    }
    if(!isOn) {
        displayText = '';
        calculator.setScreenText(displayText);
        textMaterial.map = updateScreenTextureWithText(displayText, textSize ,textColor);
    }
}


// ------------------------- GENERAL FUNCTIONS -------------------------

  /** 
  * Função para tocar um mp3
  * @param type tipo do som a ser tocado
  */
  export function playAudio(type: "button" | "switch" | "carEngine" | "paperRip" | "printer") {
      const file_path = {
          button: "./src/soundEffects/btnsfx.mp3",
          switch: "./src/soundEffects/switchsfx.mp3",
          carEngine : "./src/soundEffects/carEnginesfx.mp3",
          paperRip : "./src/soundEffects/paperRipsfx.mp3",
          printer: "./src/soundEffects/printersfx.mp3"
      }
      var audio = new Audio(file_path[type]);
      audio.play();
    }

/** 
 * Função que cria uma promisse que resolve após um determinado tempo
 * @param seconds tempo em segundos para a promisse ser resolvida
*/
   export function sleep(seconds: number) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}





