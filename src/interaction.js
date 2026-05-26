import * as THREE from 'three';

// GAME STATE VARIABLES
let isBoxOpen = false;
let hasKey = false;
let isDoorOpen = false;

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
                let target = intersects[0].object;
                
                // Traverse up to find the main named parent group (interactable object)
                while (target && !interactableObjects.includes(target)) {
                    target = target.parent;
                }
                if (!target) return;

                // 1. BOX LOGIC
                if (target.name === "box" && !isBoxOpen) {
                    // Find the hinge group inside the box
                    const lid = target.getObjectByName("lidPivot");
                    if (lid) {
                        // Rotate the lid backwards by 120 degrees on the X-axis
                        lid.rotation.x = -Math.PI / 1.5; 
                    }
                    isBoxOpen = true;
                    console.log("The box is opened! There is a hidden key inside.");
                }
                // 2. KEY LOGIC
                else if (target.name === "key" && isBoxOpen && !hasKey) {
                    target.visible = false; // Remove key from scene (added to inventory)
                    hasKey = true;
                    console.log("You picked up the key! Now you can open the door.");
                }
                // 3. DOOR LOGIC
                else if (target.name === "door" && !isDoorOpen) {
                    if (hasKey) {
                        // Rotate the door 90 degrees around its pivot
                        target.parent.rotation.y = -Math.PI / 2; 
                        target.parent.position.x += 0.5;

                        const scene = target.parent.parent; // Pivot -> Scene
                        const panel = scene.getObjectByName("depthPanel");
                        if (panel) panel.visible = true;
                        
                        isDoorOpen = true;
                        console.log("DOOR OPENED! ESCAPE SUCCESSFUL!");
                        alert("CONGRATULATIONS! You have successfully escaped the room! 🎉");
                    } else {
                        console.log("The door is locked. You need to find the key first!");
                    }
                }
            }
        }
    });
}

// This function dynamically modifies material values to create a responsive glowing effect on focus
export function handleHighlight(camera, interactableObjects) {
    intermediateRaycaster.setFromCamera(centerVector, camera);
    const intersects = intermediateRaycaster.intersectObjects(interactableObjects, true);

    if (intersects.length > 0) {
        let target = intersects[0].object;
        
        // Traverse up to find the main named parent group
        while (target && !interactableObjects.includes(target)) {
            target = target.parent;
        }
        if (!target) return;

        // Run highlight logic only if the focused object has changed this frame
        if (lastHoveredObject !== target) {
            // Reset emissive glow on all children of the object we just moved away from
            if (lastHoveredObject) {
                lastHoveredObject.traverse((child) => {
                    if (child.isMesh && child.material && child.material.emissive) {
                        child.material.emissive.setHex(0x000000);
                    } 
                });
            }
            
            lastHoveredObject = target;
            
            // Add emissive glow to all children of the newly focused object
            // Prevent the key from glowing if the box is not opened yet
            if (target.name !== "key" || isBoxOpen) {
                target.traverse((child) => {
                    if (child.isMesh && child.material && child.material.emissive) {
                        child.material.emissive.setHex(0x111111);
                    }
                });
            }
        }
    } else {
        // If the crosshair is pointing at empty space, remove glow from the last hovered item
        if (lastHoveredObject) {
            lastHoveredObject.traverse((child) => {
                if (child.isMesh && child.material && child.material.emissive) {
                    child.material.emissive.setHex(0x000000);
                }
            });
            lastHoveredObject = null;
        }
    }
}