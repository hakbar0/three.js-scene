import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

THREE.ColorManagement.enabled = false;

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Models
 */

const loader = new THREE.TextureLoader();
const texture = loader.load("sky/3.png");

const skyboxMaterial = new THREE.MeshBasicMaterial({
  map: texture,
  side: THREE.BackSide,
});

const skyboxGeometry = new THREE.SphereGeometry(500, 60, 40);

const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
scene.add(skybox);

const dracoLoader = new DRACOLoader();
//faster worker isntance
dracoLoader.setDecoderPath("/draco/");

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

let mixer = null;

let foxClips = [];
let currentAction = null;

gltfLoader.load("/models/Fox/glTF/Fox.gltf", (gltf) => {
  mixer = new THREE.AnimationMixer(gltf.scene);

  foxClips = gltf.animations; // Store all the animation clips

  // Set default action (assuming there's at least one animation)
  if (foxClips.length > 0) {
    currentAction = mixer.clipAction(foxClips[0]);
    currentAction.play();
  }

  // Fox scaling
  gltf.scene.scale.set(0.025, 0.025, 0.025);
  scene.add(gltf.scene);
});

const debugObject = {};

debugObject.switchFoxAnimation = (animationIndex) => {
  if (currentAction) {
    currentAction.stop();
  }

  if (foxClips[animationIndex]) {
    currentAction = mixer.clipAction(foxClips[animationIndex]);
    currentAction.play();
  } else {
    console.warn(`No animation found for index ${animationIndex}`);
  }
};

const foxAnimations = {
  "Animation 0": 0,
  "Animation 1": 1,
  "Animation 2": 2,
};

gui
  .add(debugObject, "switchFoxAnimation", foxAnimations)
  .name("Fox Animations")
  .onChange(debugObject.switchFoxAnimation);

gltfLoader.load("/models/Duck/glTF-Draco/Duck.gltf", (gltf) => {
  scene.add(gltf.scene);
  gltf.scene.position.x += 2;
  gltf.scene.rotation.y = -Math.PI / 2; // 90 degrees in radians
});

gltfLoader.load("/models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
  scene.add(gltf.scene);
  gltf.scene.scale.set(3, 3, 3);
  gltf.scene.position.x -= 2;
});

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1500
);
camera.position.set(2, 2, 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0.75, 0);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  if (mixer) {
    mixer.update(deltaTime);
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
