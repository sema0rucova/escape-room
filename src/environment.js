import * as THREE from 'three';

// This function will hold all of Sama's Day 1 structures
export function createSamaRoom(scene) {
    
    // --- 1. WALLS AND CEILING MATERIAL ---
    // Using basic materials with different shades for Day 1 placeholders
    const wallMaterial = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });
    const ceilingMaterial = new THREE.MeshBasicMaterial({ color: 0x222222, side: THREE.DoubleSide });
    
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


    // --- 3. INTERIOR GEOMETRIES (Table & Box) ---
    const woodColor = 0x8B4513; // Placeholder color for wood
    const metalColor = 0x708090; // Placeholder color for metal box

    // A. The Table (Grouped structure)
    const tableGroup = new THREE.Group();

    // Table Top
    const tableTopGeo = new THREE.BoxGeometry(4, 0.1, 2.5);
    const tableTopMat = new THREE.MeshBasicMaterial({ color: woodColor });
    const tableTop = new THREE.Mesh(tableTopGeo, tableTopMat);
    tableTop.position.y = 1.2; // Height of the table
    tableGroup.add(tableTop);

    // Table Legs (4 morphologically simple cylinders/boxes)
    const legGeo = new THREE.BoxGeometry(0.1, 1.2, 0.1);
    const legMat = new THREE.MeshBasicMaterial({ color: 0x5c2e0b });
    
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


    // B. The Box/Chest (A simple cube morphology for now)
    const boxGeo = new THREE.BoxGeometry(1.2, 1, 1.2);
    const boxMat = new THREE.MeshBasicMaterial({ color: metalColor });
    const mysteryBox = new THREE.Mesh(boxGeo, boxMat);
    mysteryBox.position.set(-4, 0.5, -4); // Positioned in the corner
    scene.add(mysteryBox);
}