import * as THREE from 'three';

export function createSamaRoom(scene) {
    
    // --- 1. WALLS AND CEILING MATERIALS (Light-reactive) ---
    const wallMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x333333, 
        side: THREE.DoubleSide,
        roughness: 0.7, // Roughness ratio (0 shiny, 1 matte)
        metalness: 0.1  // Metallic reflection ratio
    });

    const ceilingMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x222222, 
        side: THREE.DoubleSide,
        roughness: 0.6,
        metalness: 0.0
    });
    
    // The floor is 20x20 in main.js, so walls will be placed at the edges (10 units away from center)
    const wallHeight = 6;

    // --- 2. CREATING THE WALLS ---
    // Back Wall
    const backWallGeo = new THREE.PlaneGeometry(20, wallHeight);
    const backWall = new THREE.Mesh(backWallGeo, wallMaterial);
    backWall.position.set(0, wallHeight / 2, -10);
    scene.add(backWall);

    // Front Wall
    const frontWallGeo = new THREE.PlaneGeometry(20, wallHeight);
    const frontWall = new THREE.Mesh(frontWallGeo, wallMaterial);
    frontWall.position.set(0, wallHeight / 2, 10);
    frontWall.rotation.y = Math.PI;
    scene.add(frontWall);

    // Left Wall
    const leftWallGeo = new THREE.PlaneGeometry(20, wallHeight);
    const leftWall = new THREE.Mesh(leftWallGeo, wallMaterial);
    leftWall.position.set(-10, wallHeight / 2, 0);
    leftWall.rotation.y = Math.PI / 2;
    scene.add(leftWall);

    // Right Wall
    const rightWallGeo = new THREE.PlaneGeometry(20, wallHeight);
    const rightWall = new THREE.Mesh(rightWallGeo, wallMaterial);
    rightWall.position.set(10, wallHeight / 2, 0);
    rightWall.rotation.y = -Math.PI / 2;
    scene.add(rightWall);

    // Ceiling
    const ceilingGeo = new THREE.PlaneGeometry(20, 20);
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMaterial);
    ceiling.position.set(0, wallHeight, 0);
    ceiling.rotation.x = Math.PI / 2;
    scene.add(ceiling);


    // --- 3. INTERIOR GEOMETRIES (Table & Box with physical materials) ---
    const woodColor = 0x8B4513;  // Placeholder color for wood
    const metalColor = 0x708090; // Placeholder color for metal box

    // A. The Table (Grouped structure)
    const tableGroup = new THREE.Group();

    // Table Top
    const tableTopGeo = new THREE.BoxGeometry(4, 0.1, 2.5);
    const tableTopMat = new THREE.MeshStandardMaterial({ 
        color: woodColor,
        roughness: 0.6,
        metalness: 0.0
    });
    const tableTop = new THREE.Mesh(tableTopGeo, tableTopMat);
    tableTop.position.y = 1.2; // Height of the table
    tableGroup.add(tableTop);

    // Table Legs (4 morphologically simple cylinders/boxes)
    const legGeo = new THREE.BoxGeometry(0.1, 1.2, 0.1);
    const legMat = new THREE.MeshStandardMaterial({ 
        color: 0x5c2e0b,
        roughness: 0.6,
        metalness: 0.0
    });
    
    const legPositions = [
        [-1.8, 0.6, -1.1],
        [1.8, 0.6, -1.1],
        [-1.8, 0.6, 1.1],
        [1.8, 0.6, 1.1]
    ];

    legPositions.forEach(pos => {
        const leg = new THREE.Mesh(legGeo, legMat);
        leg.position.set(pos[0], pos[1], pos[2]);
        tableGroup.add(leg);
    });

    tableGroup.position.set(0, 0, -3); // Place the table in front of the initial view
    scene.add(tableGroup);


    // B. The Box/Chest (A simple cube morphology with metallic properties)
    const boxGeo = new THREE.BoxGeometry(1.2, 1, 1.2);
    const boxMat = new THREE.MeshStandardMaterial({ 
        color: metalColor,
        roughness: 0.3, // Shinier surface for metal
        metalness: 0.8  // High metallic appearance
    });
    const mysteryBox = new THREE.Mesh(boxGeo, boxMat);
    mysteryBox.position.set(-4, 0.5, -4); // Positioned in the corner
    scene.add(mysteryBox);

    // Return the interactable objects for later use in interaction.js
    return [mysteryBox, tableGroup];
}