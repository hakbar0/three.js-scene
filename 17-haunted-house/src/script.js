import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

THREE.ColorManagement.enabled = false;

/**
 * Base
 */
// Debug
// const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

//fog
//fog
const fog = new THREE.Fog("#262837", 1, 15);
scene.fog = fog;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const bricksColorTexture = textureLoader.load("/textures/bricks/color.jpg");
const bricksAmbientOcclusionTexture = textureLoader.load(
  "/textures/bricks/ambientOcclusion.jpg"
);
const bricksNormalTexture = textureLoader.load("/textures/bricks/normal.jpg");
const bricksRoughnessTexture = textureLoader.load(
  "/textures/bricks/roughness.jpg"
);

const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

const grassColorTexture = textureLoader.load("/textures/grass/color.jpg");
const grassAmbientOcclusionTexture = textureLoader.load(
  "/textures/grass/ambientOcclusion.jpg"
);
const grassNormalTexture = textureLoader.load("/textures/grass/normal.jpg");
const grassRoughnessTexture = textureLoader.load(
  "/textures/grass/roughness.jpg"
);

grassColorTexture.repeat.set(8, 8);
grassAmbientOcclusionTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);

grassColorTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

grassColorTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

/**
 * House
 */
const house = new THREE.Group();
scene.add(house);

// walls

const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: bricksColorTexture,
    aoMap: bricksAmbientOcclusionTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture,
  })
);
walls.position.y = 2.5 / 2;
house.add(walls);

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeBufferGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: "#b35f45" })
);
roof.position.y = 2.5 + 1 / 2;
roof.rotation.y = Math.PI / 4;
house.add(roof);

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
  })
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
floor.receiveShadow = true;
scene.add(floor);

// Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);
door.position.y = 1;
door.position.z = 4 / 2 + 0.01;
house.add(door);

//bushes
const bushesGeomery = new THREE.SphereBufferGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });

const bush1 = new THREE.Mesh(bushesGeomery, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushesGeomery, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushesGeomery, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);

const bush4 = new THREE.Mesh(bushesGeomery, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);

house.add(bush3, bush2, bush1, bush4);

// Graves
const graves = new THREE.Group();
scene.add(graves);

const graveGemery = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });

for (let i = 0; i < 50; i++) {
  const radius = 3 + Math.random() * 6;
  const angle = Math.random() * Math.PI * 2;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  const grave = new THREE.Mesh(graveGemery, graveMaterial);
  grave.castShadow = true;
  grave.position.set(x, 0.8 / 2, z);
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  graves.add(grave);
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12);
// gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12);
moonLight.position.set(4, 5, -2);
// gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
// gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
// gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
// gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);
scene.add(moonLight);

// Door light
const doorLight = new THREE.PointLight("#ff7d46", 1, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

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
  100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor("#262837");

renderer.shadowMap.enabled = true;
moonLight.castShadow = true;
doorLight.castShadow = true;

// Spooky Ghost
const ghostGeometry = new THREE.SphereBufferGeometry(0.5, 32, 32);
const ghostMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.5,
});

const offsetFromWall = 2; // Adjust this to set the distance away from the house.

// Create the ghost mesh
const spookyGhost = new THREE.Mesh(ghostGeometry, ghostMaterial);

// Set the ghost's position to be in front of the house
spookyGhost.position.set(
  0,
  house.position.y + 1,
  house.position.z + walls.geometry.parameters.depth / 2 + offsetFromWall
);
scene.add(spookyGhost);

// Ghost Mouth
const mouthGeometry = new THREE.SphereBufferGeometry(0.15, 32, 32);
const mouthMaterial = new THREE.MeshStandardMaterial({
  color: 0x333333,
  transparent: true,
  opacity: 0.75,
});

const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
mouth.position.set(0, -0.1, 0.4); // Adjust to place the mouth correctly
mouth.scale.setY(0.3); // Makes the sphere elongated vertically to resemble a mouth
spookyGhost.add(mouth);

// Ghost Eyes
const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
const leftEye = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.05),
  eyeMaterial
);
leftEye.position.set(-0.15, 0.1, 0.5);
spookyGhost.add(leftEye);

const rightEye = leftEye.clone();
rightEye.position.set(0.15, 0.1, 0.5);
spookyGhost.add(rightEye);

let initialGhostY = spookyGhost.position.y;
let ghostDirection = 1;
function updateGhost() {
  // Floating logic
  if (spookyGhost.position.y > initialGhostY + 0.2) ghostDirection = -1;
  if (spookyGhost.position.y < initialGhostY - 0.2) ghostDirection = 1;
  spookyGhost.position.y += ghostDirection * 0.01;

  // Make the ghost face the camera
  spookyGhost.lookAt(camera.position);

  // Request the next frame
  requestAnimationFrame(updateGhost);
}
updateGhost();

/**
 * Ghosts
 */
const ghost1Body = new THREE.Mesh(ghostGeometry, ghostMaterial);
scene.add(ghost1Body);
const ghost1 = new THREE.PointLight("#ff00ff", 2, 3);
scene.add(ghost1);

const ghost2Body = new THREE.Mesh(ghostGeometry, ghostMaterial);
scene.add(ghost2Body);
const ghost2 = new THREE.PointLight("#00ffff", 2, 3);
scene.add(ghost2);

const ghost3Body = new THREE.Mesh(ghostGeometry, ghostMaterial);
scene.add(ghost3Body);
const ghost3 = new THREE.PointLight("#ffff00", 2, 3);
scene.add(ghost3);

ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

const eyeGeometry = new THREE.SphereBufferGeometry(0.1, 32, 32);

function createEyes(parent) {
  const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
  leftEye.position.set(-0.2, 0, 0.5); // Adjust the position as per your ghost body size
  parent.add(leftEye);

  const rightEye = leftEye.clone();
  rightEye.position.x = 0.2;
  parent.add(rightEye);

  return [leftEye, rightEye];
}

createEyes(ghost1Body);
createEyes(ghost2Body);
createEyes(ghost3Body);

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Ghosts
  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y = Math.sin(elapsedTime * 3);
  ghost1Body.position.copy(ghost1.position); // Copy position from light to body

  const ghost2Angle = -elapsedTime * 0.32;
  ghost2.position.x = Math.cos(ghost2Angle) * 5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5;
  ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);
  ghost2Body.position.copy(ghost2.position); // Copy position from light to body

  const ghost3Angle = -elapsedTime * 0.18;
  ghost3.position.x =
    Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
  ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
  ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);
  ghost3Body.position.copy(ghost3.position); // Copy position from light to body

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
