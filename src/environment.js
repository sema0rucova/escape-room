import * as THREE from 'three';

export function createSamaRoom(scene) {
    
    // --- 1. TEXTURE LOADING (Using exact filenames from visual folder) ---
    const textureLoader = new THREE.TextureLoader();

    // Stone Wall Texture
    const wallTexture = textureLoader.load('/textures/wall_brick.jpg');
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(4, 2); // Tiles brick pattern realism

    // Floor Stone Texture
    const floorTexture = textureLoader.load('/textures/floor_tiles.jpg');
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(5, 5); // Repeats pattern on the large floor plane

    // Table Wood Texture
    const tableTexture = textureLoader.load('/textures/table_wood.jpg');
    
    // Mystery Box Wood Texture (Updated concept)
    const boxTexture = textureLoader.load('/textures/box.png');

    // Heavy Door Wood Texture
    const doorTexture = textureLoader.load('/textures/door.jpg');

    //Metallic texture for the key 
    const keyMetalTexture = textureLoader.load('/textures/metal_key.jpg'); 


    // --- 2. MATERIALS CONFIGURATION ---
    const wallMaterial = new THREE.MeshStandardMaterial({ 
        map: wallTexture, 
        side: THREE.DoubleSide,
        roughness: 0.8,
        metalness: 0.1
    });

    const floorMaterial = new THREE.MeshStandardMaterial({
        map: floorTexture,
        side: THREE.DoubleSide,
        roughness: 0.7,
        metalness: 0.2
    });

    const ceilingMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x111111, // Dark matte ceiling to concentrate flashlight focus
        side: THREE.DoubleSide,
        roughness: 0.9,
        metalness: 0.0
    });
    
    const wallHeight = 6;


    // --- 3. ROOM STRUCTURE ---
    // Floor
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = Math.PI / 2;
    scene.add(floor);

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


    // --- 4. INTERIOR OBJECTS ---

    // A. The Escape Door (Pivot setup for rotation + NEW Handle prop)
    const doorPivot = new THREE.Group();
    doorPivot.position.set(-1.1, 0, -9.9); // Hinge location on the wall (Left edge)
    doorPivot.name = "door_pivot"; // Tagged for collection/interaction check
    scene.add(doorPivot);

    // Main Door Panel Mesh
    const doorGeo = new THREE.BoxGeometry(2.2, 3.8, 0.1);
    const doorMat = new THREE.MeshStandardMaterial({ 
        map: doorTexture,
        roughness: 0.6,
        metalness: 0.1
    });
    const escapeDoor = new THREE.Mesh(doorGeo, doorMat);
    escapeDoor.position.set(1.1, 3.8 / 2, 0); // Offset mesh rightwards so hinge is at pivot origin
    escapeDoor.name = "door"; 
    doorPivot.add(escapeDoor);

    // Classic Keyhole Structure (Replaced handle knob and moved higher)
    const keyholeGroup = new THREE.Group();
    // Positioned ergonomically higher (y: -0.4 instead of -0.9) and near the right opening edge (x: 0.85)
    keyholeGroup.position.set(0.85, -0.4, 0.051); 
    escapeDoor.add(keyholeGroup);

    // Keyhole Metallic Escutcheon Plate
    const plateGeo = new THREE.CylinderGeometry(0.07, 0.07, 0.01, 16);
    const plateMat = new THREE.MeshStandardMaterial({
        color: 0x222222, // Dark iron metal finish
        metalness: 0.9,
        roughness: 0.4
    });
    const plate = new THREE.Mesh(plateGeo, plateMat);
    plate.rotation.x = Math.PI / 2; // Align flat on the door surface
    keyholeGroup.add(plate);

    // Keyhole Void - Top Circle (Pure matte black to simulate depth/hole)
    const holeMat = new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 1.0, metalness: 0.0 });
    
    const holeTopGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.012, 12);
    const holeTop = new THREE.Mesh(holeTopGeo, holeMat);
    holeTop.rotation.x = Math.PI / 2;
    holeTop.position.set(0, 0.01, 0.002); // Slightly shifted up on the plate
    keyholeGroup.add(holeTop);

    // Keyhole Void - Bottom Slot
    const holeBottomGeo = new THREE.BoxGeometry(0.016, 0.04, 0.012);
    const holeBottom = new THREE.Mesh(holeBottomGeo, holeMat);
    holeBottom.position.set(0, -0.015, 0.002); // Tapered down from the circle
    keyholeGroup.add(holeBottom);

    // B. The Table
    const tableGroup = new THREE.Group();

    // Table Top
    const tableTopGeo = new THREE.BoxGeometry(4, 0.1, 2.5);
    const tableTopMat = new THREE.MeshStandardMaterial({ 
        map: tableTexture,
        roughness: 0.6,
        metalness: 0.1
    });
    const tableTop = new THREE.Mesh(tableTopGeo, tableTopMat);
    tableTop.position.y = 1.2; // Height of table from ground
    tableTop.name = "table";
    tableGroup.add(tableTop);

    // Table Legs (Using table wood texture)
    const legGeo = new THREE.BoxGeometry(0.1, 1.2, 0.1);
    const legMat = new THREE.MeshStandardMaterial({ map: tableTexture, roughness: 0.6 });
    
    const legPositions = [
        [-1.8, 0.6, -1.1], [1.8, 0.6, -1.1],
        [-1.8, 0.6, 1.1],  [1.8, 0.6, 1.1]
    ];

    legPositions.forEach(pos => {
        const leg = new THREE.Mesh(legGeo, legMat);
        leg.position.set(pos[0], pos[1], pos[2]);
        tableGroup.add(leg);
    });

    tableGroup.position.set(0, 0, -3); // Table placed in front of initial spawn
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
    // Position the whole key Group on the table top surface (y=1.2 table top height + 0.05 thickness)
    keyGroup.position.set(0, 1.26, -3);
    keyGroup.name = "key"; // Tagged for interaction/collection logic
    scene.add(keyGroup);

    // --- Key Construction ---
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
        map: boxTexture,
        roughness: 0.7,
        metalness: 0.0
    });
    const mysteryBox = new THREE.Mesh(boxGeo, boxMat);
    mysteryBox.position.set(-4, 0.5, -4); // Placed in the corner
    mysteryBox.name = "box";
    scene.add(mysteryBox);


    // --- 5. RETURN INTERACTABLE OBJECTS ---
    // Objects that can receive highlights or collection clicks are returned to main scene
    return [mysteryBox, tableTop, escapeDoor, keyGroup];
}