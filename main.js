import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Scene and Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Load GLTF Model
const loader = new GLTFLoader();
loader.load('/Models/untitled.glb', (gltf) => {
  const model = gltf.scene;
  model.scale.set(3, 3, 3);
  model.position.set(0, 0, 0);
  scene.add(model);
}, undefined, (error) => {
  console.error('An error occurred while loading the model:', error);
});

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Low-poly platformer character (cube + sphere)
const body = new THREE.Mesh(
  new THREE.BoxGeometry(0.8, 1.5, 0.8),
  new THREE.MeshStandardMaterial({ color: 0x3498db })
);

const eyes = new THREE.Mesh(
  new THREE.SphereGeometry(0.1, 16, 16),
  new THREE.MeshStandardMaterial({ color: 0x000000 })
);
eyes.position.set(0.3, 0.2, 0.5);

const player = new THREE.Group();
player.add(body, eyes);
player.position.y = 5; // Spawn above ground
scene.add(player);

// Platforms
const platforms = [];
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('/textures/stone.jpg', undefined, undefined, () => {
  console.warn("Texture '/textures/stone.jpg' not found. Using fallback.");
});
const platformMaterial = new THREE.MeshStandardMaterial({ map: texture });

function createPlatform(x, y, z, width, depth) {
  const geometry = new THREE.BoxGeometry(width, 0.5, depth);
  const mesh = new THREE.Mesh(geometry, platformMaterial);
  mesh.receiveShadow = true;
  mesh.position.set(x, y, z);
  scene.add(mesh);
  platforms.push(mesh);
  return mesh;
}

// Coins
const coins = [];
const coinGeometry = new THREE.SphereGeometry(0.2, 16, 16);
const coinMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700 });

function createCoin(x, y, z) {
  const coin = new THREE.Mesh(coinGeometry, coinMaterial);
  coin.position.set(x, y + 0.3, z);
  coin.castShadow = true;
  scene.add(coin);
  coins.push(coin);
}

// Create Platforms and Coins
createPlatform(-9, -0.3, -0.5, 18 , 30);
createPlatform( 20, 0, 0, 25, 10);

// Goal Platform
const goalPlatform = createPlatform(10, 8, -12, 6, 6);
goalPlatform.material = new THREE.MeshStandardMaterial({ color: 0xffd700 });

// Physics and State
let velocityY = 0;
const gravity = -9.8;
let onGround = false;
let jumpCooldown = 0;

let score = 0;
const scoreDisplay = document.getElementById('score');

// Controls
const keys = {};
document.addEventListener('keydown', (e) => (keys[e.code] = true));
document.addEventListener('keyup', (e) => (keys[e.code] = false));

// Game Start
let gameStarted = false;
document.getElementById('startButton').addEventListener('click', () => {
  document.getElementById('mainMenu').style.display = 'none';
  gameStarted = true;
});

// Game Loop
function animate() {
  requestAnimationFrame(animate);
  if (!gameStarted) return;

  const delta = 0.016;
  const moveSpeed = 5 * delta;

  if (keys['ArrowLeft']) player.position.x -= moveSpeed;
  if (keys['ArrowRight']) player.position.x += moveSpeed;
  if (keys['ArrowUp']) player.position.z -= moveSpeed;
  if (keys['ArrowDown']) player.position.z += moveSpeed;

  // Apply gravity
  velocityY += gravity * delta;
  player.position.y += velocityY * delta;

  // Collision with platforms
  const playerBox = new THREE.Box3().setFromObject(player);
  onGround = false;

  for (const platform of platforms) {
    const platformBox = new THREE.Box3().setFromObject(platform);
    if (playerBox.intersectsBox(platformBox)) {
      const platformTop = platform.position.y + 0.25;
      const playerBottom = player.position.y - 0.5;

      if (velocityY <= 0 && playerBottom <= platformTop + 0.05 && playerBottom >= platformTop - 0.3) {
        player.position.y = platformTop + 0.5;
        velocityY = 0;
        onGround = true;
        break;
      }
    }
  }

  jumpCooldown -= delta;
  if (keys['Space'] && onGround && jumpCooldown <= 0) {
    velocityY = 8;
    onGround = false;
    jumpCooldown = 0.3;
  }

  // Coin collection
  for (let i = coins.length - 1; i >= 0; i--) {
    const coin = coins[i];
    if (player.position.distanceTo(coin.position) < 0.7) {
      scene.remove(coin);
      coins.splice(i, 1);
      score += 1;
      scoreDisplay.textContent = `Score: ${score}`;
    }
  }

  // Fall detection
  if (player.position.y < -10) {
    player.position.set(0, 5, 0);
    velocityY = 0;
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
  }

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  camera.position.lerp(
    new THREE.Vector3(player.position.x, player.position.y + 5, player.position.z + 10),
    0.1
  );
  camera.lookAt(player.position);

  renderer.render(scene, camera);
}

animate();