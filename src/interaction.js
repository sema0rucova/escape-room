import * as THREE from 'three';

export function setupInteraction(camera, controls, interactableObjects) {
    const raycaster = new THREE.Raycaster();
    const center = new THREE.Vector2(0, 0); // Center of the screen (for FPS)

    window.addEventListener('mousedown', (event) => {
        // If the game is active (mouse locked) and left-click is pressed (button === 0)
        if (controls.isLocked === true && event.button === 0) {
            
            // Shoot the ray from the center of the camera
            raycaster.setFromCamera(center, camera);

            // Find the objects intersected by the ray
            const intersects = raycaster.intersectObjects(interactableObjects, true);

            if (intersects.length > 0) {
                const selectedObject = intersects[0].object;
                
                console.log("An object was clicked!", selectedObject);
                
                // Change the object's color randomly for testing purposes
                selectedObject.material.color.setHex(Math.random() * 0xffffff);
            }
        }
    });
}