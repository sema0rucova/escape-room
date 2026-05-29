import * as THREE from 'three';

// GAME STATE VARIABLES
let isBoxOpen = false;
let hasKey = false;
let isDoorOpen = false;

//SOUND EFFECTS
const soundBox = new Audio('/sounds/box_open.mp3');
const soundKey = new Audio('/sounds/key_pickup.mp3');
const soundDoor = new Audio('/sounds/door_open.mp3');
const soundUnlock = new Audio('/sounds/lock_unlock.mp3');

//VOLUMES
soundBox.volume = 0.7;
soundKey.volume = 0.7;
soundDoor.volume = 0.9;
soundUnlock.volume = 0.7;

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
        // Rotate the lid backwards by 150 degrees (-Math.PI / 1.2)
        // This ensures the lid is fully opened for better visibility
                    lid.rotation.x = -Math.PI / 1.5; 
                    soundBox.play();
    }
    
                isBoxOpen = true;
                console.log("The box is opened! There is a hidden key inside.");
}
                // 2. KEY LOGIC
                else if (target.name === "key" && isBoxOpen && !hasKey) {
                    target.visible = false; // Remove key from scene (added to inventory)
                    hasKey = true;
                    soundKey.play();
                    console.log("You picked up the key! Now you can open the door.");
                }
                // 3. DOOR LOGIC
                else if (target.name === "door" && !isDoorOpen) {
                    if (hasKey) {
            // STEP 1: Play the key turning/unlocking sound immediately
                        soundUnlock.play();
                        console.log("Key turned in the lock...");

            // Cash references immediately to safely preserve them inside the asynchronous timeout scope
                        const doorPivot = target.parent;
                        const scene = doorPivot.parent; 

            // STEP 2: Wait 600ms for the lock click sound, then trigger the door opening sequence
                        setTimeout(() => {
                // Rotate the door around its pivot (keeping your negative rotation direction)
                            doorPivot.rotation.y = -Math.PI / 2.2; 

                // Play the heavy creaking door opening sound
                            soundDoor.play();

                // Find the long corridor group and reveal it
                            const corridor = scene.getObjectByName("corridorGroup");
                            if (corridor) {
                                corridor.visible = true;
                }

                // Hide the depth panel so players can look into the newly revealed corridor
                            const panel = scene.getObjectByName("depthPanel");
                            if (panel) {
                                panel.visible = false; 
                }
                
                            isDoorOpen = true;
                            console.log("DOOR OPENED! ESCAPE SUCCESSFUL!");
                
                // STEP 3: Wait another 1000ms to let the door sound finish before freezing the screen with alert()
                            setTimeout(() => {
                                alert("CONGRATULATIONS! You have successfully escaped the room! 🎉");
                }, 1000);

            }, 600); // 600ms is the perfect delay for the lock sound to finish clicking
            
        }           else {
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