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


    // C. The Key Prop
    //Applying the metallic texture (must exist) and giving it a high metallic/reflective property
    const keyMat = new THREE.MeshStandardMaterial({
        map: keyMetalTexture, // Yukarıda yüklediğin doku haritası bağlandı
        color: 0xffffff,      // Dokunun kendi renklerini koruması için beyaz yapıldı
        metalness: 1.0,       // Tam metalik yansıma
        roughness: 0.1        // Parlak ve pürüzsüz bir yüzey (fener ışığı vurunca parlasın diye)
    });
    const keyGroup = new THREE.Group();
    // Key placed at the exact coordinates of the box (Hidden Key)
    keyGroup.position.set(-4, 0.5, -4);
    keyGroup.name = "key"; // Tagged for interaction/collection logic
    scene.add(keyGroup);

    // Key Construction
    // Handle Loop (Toruslying flat on table surface)
    const handleLoopGeo = new THREE.TorusGeometry(0.12, 0.02, 16, 32);
    const handleLoop = new THREE.Mesh(handleLoopGeo, keyMat);
    handleLoop.rotation.x = Math.PI / 2; // Rotate torus to lie flat horizontally
    handleLoop.position.set(0, 0, 0); // Position at group center within parent group XZ coordinates
    keyGroup.add(handleLoop);

    // Stem Shaft connection piece (Cylinder, connect ring to stem)
    const shaftConnectGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.05, 16);
    const shaftConnect = new THREE.Mesh(shaftConnectGeo, keyMat);
    shaftConnect.position.set(0.1, 0, 0); // Position horizontally relative to torus center
    keyGroup.add(shaftConnect);

    // Long Stem Shaft (Cylinderlying horizontal)
    const shaftGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.35, 16);
    const shaft = new THREE.Mesh(shaftGeo, keyMat);
    shaft.rotation.z = Math.PI / 2; // Rotate cylinder mesh horizontally
    // Position horizontally starting after handle connection, extending down X-axis of keyGroup
    shaft.position.set(0.25, 0, 0); 
    keyGroup.add(shaft);

    // Decorative Rings on shaft
    const decoRingGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.01, 16);
    const decoRing1 = new THREE.Mesh(decoRingGeo, keyMat);
    decoRing1.rotation.z = Math.PI / 2;
    decoRing1.position.set(0.15, 0, 0); // Position near handle end
    keyGroup.add(decoRing1);

    const decoRing2 = new THREE.Mesh(decoRingGeo, keyMat);
    decoRing2.rotation.z = Math.PI / 2;
    decoRing2.position.set(0.35, 0, 0); // Position near bit end
    keyGroup.add(decoRing2);

    // Bit (Lock-engaging part constructed from boxes to form steps)
    const bitGroup = new THREE.Group();
    keyGroup.add(bitGroup);

    // Main bit block (at the end of the shaft)
    const bitBlockGeo = new THREE.BoxGeometry(0.04, 0.012, 0.07);
    const bitBlock = new THREE.Mesh(bitBlockGeo, keyMat);
    // Align horizontally and vertically within group at the end of the stem
    bitBlock.position.set(0.425, 0, 0.035); 
    bitGroup.add(bitBlock);

    // Lower step (smaller box to form stepped profile)
    const bitStepGeo = new THREE.BoxGeometry(0.02, 0.012, 0.03);
    const bitStep = new THREE.Mesh(bitStepGeo, keyMat);
    // Position next to the main bit block horizontally, and offset vertically downwards to form step
    bitStep.position.set(0.405, 0, 0.05);
    bitGroup.add(bitStep);


    // D. The Mystery Box (morphology + concept prop)
    const boxGeo = new THREE.BoxGeometry(1.2, 1, 1.2);
    const boxMat = new THREE.MeshStandardMaterial({ 
        color: metalColor,
        roughness: 0.3, // Shinier surface for metal
        metalness: 0.8  // High metallic appearance
    });
    const mysteryBox = new THREE.Mesh(boxGeo, boxMat);
    mysteryBox.position.set(-4, 0.5, -4); // Positioned in the corner
    scene.add(mysteryBox);

    // E. The Chair (Added to increase furniture variety)
    const chairGroup = new THREE.Group();
    chairGroup.name = "chair";
    
    // Create an independent clone of the table material to prevent shared emissive bugs
    const chairMat = tableTopMat.clone();
    
    // Seat
    const seatGeo = new THREE.BoxGeometry(0.8, 0.05, 0.8);
    const seat = new THREE.Mesh(seatGeo, chairMat);
    seat.position.y = 0.6;
    chairGroup.add(seat);
    
    // Backrest
    const backGeo = new THREE.BoxGeometry(0.8, 0.8, 0.05);
    const back = new THREE.Mesh(backGeo, chairMat);
    back.position.set(0, 1.0, -0.375);
    chairGroup.add(back);

    // Chair Legs
    const chairLegGeo = new THREE.BoxGeometry(0.05, 0.6, 0.05);
    const cLegPositions = [
        [-0.35, 0.3, -0.35], [0.35, 0.3, -0.35],
        [-0.35, 0.3, 0.35],  [0.35, 0.3, 0.35]
    ];
    cLegPositions.forEach(pos => {
        const leg = new THREE.Mesh(chairLegGeo, chairMat);
        leg.position.set(pos[0], pos[1], pos[2]);
        chairGroup.add(leg);
    });

    chairGroup.position.set(1.5, 0, -1); // Pulled the chair back to avoid clipping into the table
    chairGroup.rotation.y = Math.PI; // Rotated the chair 180 degrees to face the table
    scene.add(chairGroup);

    // 5. RETURN INTERACTABLE OBJECTS
    // Objects that can receive highlights or collection clicks are returned to main scene
    return [mysteryBox, tableTop, escapeDoor, keyGroup, chairGroup];
}