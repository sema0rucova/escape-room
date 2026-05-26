import * as THREE from 'three';
// Global variables to track the currently highlighted object
let intermediateRaycaster = new THREE.Raycaster();
let centerVector = new THREE.Vector2(0, 0);
let lastHoveredObject = null;

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
                
                console.log("An object was clicked.", selectedObject);
                
                // Add a subtle emissive glow without breaking the original texture/color
                // 0x555555 gives a nice, slightly bright white/gray glow. 
                selectedObject.material.emissive.setHex(0x555555);
            }
        }
    });
}

// This function dynamically modifies material values to create a responsive glowing effect on focus
export function handleHighlight(camera, interactableObjects) {
    intermediateRaycaster.setFromCamera(centerVector, camera);
    const intersects = intermediateRaycaster.intersectObjects(interactableObjects, true);

    if (intersects.length > 0) {
        const hoveredObject = intersects[0].object;

        // Run highlight logic only if the focused object has changed this frame
        if (lastHoveredObject !== hoveredObject) {
            // Reset emissive glow on the object we just moved away from
            if (lastHoveredObject && lastHoveredObject.material) {
                lastHoveredObject.material.emissive.setHex(0x000000); // Back to default (dark)
            }

            lastHoveredObject = hoveredObject;

            // Material highlight implementation: 
            // UPDATED: Glow intensity reduced from 0x222222 to 0x111111 based on user feedback
            if (hoveredObject.material && hoveredObject.name !== "key") {
                // Adds a very subtle light gray glow to identify focused objects in the dark
                hoveredObject.material.emissive.setHex(0x111111); 
            }
        }
    } else {
        // If the crosshair is pointing at empty space, remove glow from the last hovered item
        if (lastHoveredObject && lastHoveredObject.material) {
            lastHoveredObject.material.emissive.setHex(0x000000);
        }
        lastHoveredObject = null;
    }
}