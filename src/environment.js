import * as THREE from 'three';

export function createSamaRoom(scene) {
    // 1. TEXTURE LOADING
    const textureLoader = new THREE.TextureLoader();

    // Stone Wall Texture
    const wallTexture = textureLoader.load('/textures/wall_brick.jpg');
    wallTexture.wrapS = THREE.RepeatWrapping;
    wallTexture.wrapT = THREE.RepeatWrapping;
    wallTexture.repeat.set(4, 2);

    // Floor Stone Texture
    const floorTexture = textureLoader.load('/textures/floor_tiles.jpg');
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(5, 5);

    // Table Wood Texture
    const tableTexture = textureLoader.load('/textures/table_wood.jpg');

    // Mystery Box Wood Texture 
    const boxTexture = textureLoader.load('/textures/box.png');

    // Heavy Door Wood Texture
    const doorTexture = textureLoader.load('/textures/door.jpg');

    // Metallic texture for the key 
    const keyMetalTexture = textureLoader.load('/textures/metal_key.jpg');

    // 2. MATERIALS CONFIGURATION
    const wallMaterial = new THREE.MeshStandardMaterial({ 
        map: wallTexture, 
        side: THREE.DoubleSide,
        roughness: 0.8, // Roughness ratio (0 shiny, 1 matte)
        metalness: 0.1  // Metallic reflection ratio
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

    // 3. ROOM STRUCTURE
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


    // 4. INTERIOR OBJECTS
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
        map: boxTexture,
        roughness: 0.7,
        metalness: 0.0
    });
    const mysteryBox = new THREE.Mesh(boxGeo, boxMat);
    mysteryBox.position.set(-4, 0.5, -4); // Positioned in the corner
    mysteryBox.name = "box";
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


    // F. The Abandoned Bookshelf (Added for morphology variety and room atmosphere)
    const bookshelfGroup = new THREE.Group();
    bookshelfGroup.name = "bookshelf";
    const shelfMat = tableTopMat.clone(); // Reusing the wood texture

    // Backboard of the bookshelf
    const backBoardGeo = new THREE.BoxGeometry(3, 4, 0.1);
    const backBoard = new THREE.Mesh(backBoardGeo, shelfMat);
    bookshelfGroup.add(backBoard);

    // Left and Right Side Panels
    const sideGeo = new THREE.BoxGeometry(0.1, 4, 1);
    const leftSide = new THREE.Mesh(sideGeo, shelfMat);
    leftSide.position.set(-1.45, 0, 0.45);
    bookshelfGroup.add(leftSide);
    
    const rightSide = new THREE.Mesh(sideGeo, shelfMat);
    rightSide.position.set(1.45, 0, 0.45);
    bookshelfGroup.add(rightSide);

    // Horizontal Shelves
    const shelfGeo = new THREE.BoxGeometry(2.8, 0.1, 0.9);
    for (let i = -1.5; i <= 1.5; i += 1) {
        const shelf = new THREE.Mesh(shelfGeo, shelfMat);
        shelf.position.set(0, i, 0.4);
        bookshelfGroup.add(shelf);
    }
    
    bookshelfGroup.position.set(7.5, 2, 9.5); 
    bookshelfGroup.rotation.y = Math.PI; // Rotated 180 degrees to face the center of the room
    scene.add(bookshelfGroup);


    // G. Aluminum Tripod & Camera
    const tripodGroup = new THREE.Group();
    tripodGroup.name = "tripod";
    
    // Aluminum Material for professional tripod legs
    const aluminumMat = new THREE.MeshStandardMaterial({
        color: 0xd9d9d9,
        metalness: 0.8,
        roughness: 0.2
    });
    
    // Tripod Legs (Cylinders rotated to form a stand)
    const tripLegGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.5, 8);
    
    const leg1 = new THREE.Mesh(tripLegGeo, aluminumMat);
    leg1.position.set(0, 0.75, 0.25);
    leg1.rotation.x = -0.2;
    tripodGroup.add(leg1);
    
    const leg2 = new THREE.Mesh(tripLegGeo, aluminumMat);
    leg2.position.set(-0.25, 0.75, -0.2);
    leg2.rotation.x = 0.2;
    leg2.rotation.z = -0.2;
    tripodGroup.add(leg2);
    
    const leg3 = new THREE.Mesh(tripLegGeo, aluminumMat);
    leg3.position.set(0.25, 0.75, -0.2);
    leg3.rotation.x = 0.2;
    leg3.rotation.z = 0.2;
    tripodGroup.add(leg3);

    // Camera Body
    const camBodyGeo = new THREE.BoxGeometry(0.4, 0.3, 0.2);
    const camMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.9 });
    const camBody = new THREE.Mesh(camBodyGeo, camMat);
    camBody.position.set(0, 1.6, 0);
    tripodGroup.add(camBody);

    // Camera Lens
    const lensGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 16);
    const lens = new THREE.Mesh(lensGeo, camMat);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(0, 1.6, 0.15); // Protruding from the body
    tripodGroup.add(lens);

    // Detailed Prop: High-capacity Micro SD card and Card Reader adapter placed on top
    const cardReaderGeo = new THREE.BoxGeometry(0.08, 0.02, 0.12);
    const cardReaderMat = new THREE.MeshStandardMaterial({ color: 0x000000 });
    const cardReader = new THREE.Mesh(cardReaderGeo, cardReaderMat);
    cardReader.position.set(0, 1.76, 0); // Resting exactly on top of the camera body
    tripodGroup.add(cardReader);

    const sdCardGeo = new THREE.BoxGeometry(0.04, 0.01, 0.06);
    const sdCardMat = new THREE.MeshStandardMaterial({ color: 0xcc0000 }); // Red colored SD card
    const sdCard = new THREE.Mesh(sdCardGeo, sdCardMat);
    sdCard.position.set(0, 1.775, 0.02); // Inserted slightly into the card reader
    tripodGroup.add(sdCard);

    // Placed in the front-left corner
    tripodGroup.position.set(-7, 0, 7); 
    tripodGroup.rotation.y = Math.PI / 4; // Angled to point towards the center of the room
    scene.add(tripodGroup);

    // 5. RETURN INTERACTABLE OBJECTS
    // Objects that can receive highlights or collection clicks are returned to main scene
    return [mysteryBox, tableTop, escapeDoor, keyGroup, chairGroup, bookshelfGroup, tripodGroup];
}