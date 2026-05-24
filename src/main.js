import * as THREE from 'three';

// 1. Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111); // Kaçış odası teması için şimdilik loş bir gri

// 2. Camera - Positioned at an angle to provide a 3D view
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 5, 5); // Diagonal position on the x, y, and z axes
camera.lookAt(0, 0, 0); // Looking at the center (origin)

// 3. Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// A simple plane representing the floor of the room
const floorGeometry = new THREE.PlaneGeometry(10, 10);
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x444444, side: THREE.DoubleSide });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = Math.PI / 2; // Rotated horizontally to act as a floor
scene.add(floor);

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Update the camera and renderer when the window is resized
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});