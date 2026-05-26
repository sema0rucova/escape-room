import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import './style.css'; // Included our CSS file
import { createSamaRoom } from './environment.js';
import { setupInteraction, handleHighlight } from './interaction.js'; // Imported highlight handler

// 1. Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

// 2. Camera - Height set to an average human height (1.6m)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.6, 5); 

// 3. Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 4. Floor - Enlarged a bit
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x444444, side: THREE.DoubleSide });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = Math.PI / 2;
scene.add(floor);
const interactableObjects = createSamaRoom(scene);

// 5. FPS CONTROLS (PointerLockControls)
const controls = new PointerLockControls(camera, document.body);

// Lock the mouse and start the game upon clicking the screen
document.body.addEventListener('click', () => {
    controls.lock();
});
scene.add(camera);

// 6. LIGHTING (FLASHLIGHT AND ATMOSPHERE)
// ----------------------------------------------------------------------
// 1. First, we make the general room lighting very dim (Escape room atmosphere)
// Without AmbientLight, places not hit by the spotlight would be pitch black
const ambientLight = new THREE.AmbientLight(0xffffff, 0.05); // Very low white light
scene.add(ambientLight);

// 2. Creating the flashlight (SpotLight)
const flashLight = new THREE.SpotLight(0xffffff, 100); // Color (white) and initial brightness
flashLight.position.set(0, 0, 0); // Will be positioned exactly at the center of the camera
flashLight.target.position.set(0, 0, -1); // Will point in the direction the camera is looking (forward)
flashLight.angle = Math.PI / 6; // Angle of the light cone (how wide the illuminated area will be)
flashLight.penumbra = 0.5; // Softness/blur effect on the edges of the light
flashLight.distance = 30; // The maximum range of the light

// 3. Adding the light and its target to the camera
// (This way, no matter where we rotate the mouse, the light will follow)
camera.add(flashLight);
camera.add(flashLight.target);

// 4. Brightness control via Mouse Wheel (Scroll)
window.addEventListener('wheel', (event) => {
    // Scrolling up (negative deltaY) increases brightness, scrolling down decreases it
    if (event.deltaY < 0) {
        flashLight.intensity += 20;
        if (flashLight.intensity > 200) flashLight.intensity = 200; // Maximum limit
    } else {
        flashLight.intensity -= 20;
        if (flashLight.intensity < 0) flashLight.intensity = 0; // Minimum limit (completely off)
    }
});
// ----------------------------------------------------------------------

// 7. Walking Logic (WASD)
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

const onKeyDown = (event) => {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW': moveForward = true; break;
        case 'ArrowLeft':
        case 'KeyA': moveLeft = true; break;
        case 'ArrowDown':
        case 'KeyS': moveBackward = true; break;
        case 'ArrowRight':
        case 'KeyD': moveRight = true; break;
    }
};

const onKeyUp = (event) => {
    switch (event.code) {
        case 'ArrowUp':
        case 'KeyW': moveForward = false; break;
        case 'ArrowLeft':
        case 'KeyA': moveLeft = false; break;
        case 'ArrowDown':
        case 'KeyS': moveBackward = false; break;
        case 'ArrowRight':
        case 'KeyD': moveRight = false; break;
    }
};

document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

// 9. RAYCASTING (INTERACTION)
// -----------------------------------------------------------------------
setupInteraction(camera, controls, interactableObjects);

// 8. Animation Loop
let prevTime = performance.now();

function animate() {
    requestAnimationFrame(animate);

    const time = performance.now();
    const delta = (time - prevTime) / 1000; 

    if (controls.isLocked === true) {
        // Friction
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        // Determine direction
        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize(); 

        // Add acceleration
        if (moveForward || moveBackward) velocity.z -= direction.z * 40.0 * delta;
        if (moveLeft || moveRight) velocity.x -= direction.x * 40.0 * delta;

        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);
        handleHighlight(camera, interactableObjects);
    }

    prevTime = time;
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});