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

    // --- Back Wall (Split to create a doorway opening) 
    const sideWallWidth = 8.9; // (20 total width - 2.2 door width) / 2
    const backWallSideGeo = new THREE.PlaneGeometry(sideWallWidth, wallHeight);

    // Left side of the back wall
    const backWallLeft = new THREE.Mesh(backWallSideGeo, wallMaterial);
    backWallLeft.position.set(-1.1 - (sideWallWidth / 2), wallHeight / 2, -10);
    scene.add(backWallLeft);

    // Right side of the back wall
    const backWallRight = new THREE.Mesh(backWallSideGeo, wallMaterial);
    backWallRight.position.set(1.1 + (sideWallWidth / 2), wallHeight / 2, -10);
    scene.add(backWallRight);

    // Top piece above the door (Door is 3.8 high, Wall is 6)
    const backWallTopGeo = new THREE.PlaneGeometry(2.2, 6 - 3.8);
    const backWallTop = new THREE.Mesh(backWallTopGeo, wallMaterial);
    backWallTop.position.set(0, 3.8 + ((6 - 3.8) / 2), -10);
    scene.add(backWallTop);

    // --- HIDDEN CORRIDOR BEHIND THE DOOR ---
    const corridorGroup = new THREE.Group();
    corridorGroup.name = "corridorGroup";
    corridorGroup.visible = false; // Keep it hidden until the door opens
    scene.add(corridorGroup);

    // Corridor Floor (Extends 20 units deep into the background)
    const corridorFloorGeo = new THREE.PlaneGeometry(2.2, 20); 
    const corridorFloor = new THREE.Mesh(corridorFloorGeo, floorMaterial);
    corridorFloor.rotation.x = -Math.PI / 2;
    corridorFloor.position.set(0, 0.01, -20); // Positioned right behind the back wall 
    corridorGroup.add(corridorFloor);

    // Corridor Left Wall
    const corridorSideWallGeo = new THREE.PlaneGeometry(20, wallHeight); 
    const corridorLeftWall = new THREE.Mesh(corridorSideWallGeo, wallMaterial);
    corridorLeftWall.position.set(-1.1, wallHeight / 2, -20); 
    corridorLeftWall.rotation.y = Math.PI / 2;
    corridorGroup.add(corridorLeftWall);

    // Corridor Right Wall
    const corridorRightWall = new THREE.Mesh(corridorSideWallGeo, wallMaterial);
    corridorRightWall.position.set(1.1, wallHeight / 2, -20); 
    corridorRightWall.rotation.y = -Math.PI / 2;
    corridorGroup.add(corridorRightWall);

    // Corridor Ceiling
    const corridorCeilingGeo = new THREE.PlaneGeometry(2.2, 20);
    const corridorCeiling = new THREE.Mesh(corridorCeilingGeo, ceilingMaterial);
    corridorCeiling.rotation.x = Math.PI / 2;
    corridorCeiling.position.set(0, wallHeight, -20);
    corridorGroup.add(corridorCeiling);


    // 4. INTERIOR OBJECTS
    // A. The Escape Door (Pivot setup for rotation + NEW Handle prop)
    const doorPivot = new THREE.Group();
    // Menteşeyi tam sol duvarın bittiği yere (-1.1) ve Z ekseninde arka duvara (-9.95) yerleştiriyoruz.
    doorPivot.position.set(-1.1, 0, -9.95); 
    doorPivot.name = "door_pivot"; 
    scene.add(doorPivot);

    // Main Door Panel Mesh
    // Genişliği tam kapı boşluğu kadar (2.2) yapıyoruz! (2.6 çok genişti)
    const doorGeo = new THREE.BoxGeometry(2.2, 3.8, 0.1); 
    const doorMat = new THREE.MeshStandardMaterial({ 
        map: doorTexture,
        roughness: 0.6,
        metalness: 0.1
    });
    const escapeDoor = new THREE.Mesh(doorGeo, doorMat);
    
    // Kapıyı menteşeye göre tam genişliğinin yarısı (1.1) kadar sağa kaydırıyoruz.
    // Böylece sol kenarı tam menteşeye (-1.1 koordinatına) sıfırlanmış oluyor.
    escapeDoor.position.set(1.1, 3.8 / 2, 0); 
    escapeDoor.name = "door"; 
    doorPivot.add(escapeDoor);

    const depthPanelGeo = new THREE.PlaneGeometry(2.2, 3.8);
    const depthPanelMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const depthPanel = new THREE.Mesh(depthPanelGeo, depthPanelMat);
    // Siyah panelin kapının arkasında kalması için X ekseninde 0 (merkez) noktasına alıyoruz
    depthPanel.position.set(0, 3.8 / 2, -9.98); 
    depthPanel.visible = false;
    depthPanel.name = "depthPanel";
    scene.add(depthPanel);

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
    // Lowered y-position from 0.91 to 0.15 so it sits inside the hollow box
    keyGroup.position.set(-4, 0.15, -4);
    const hitBoxGeo = new THREE.BoxGeometry(0.8, 0.5, 0.8);
    const hitBoxMat = new THREE.MeshBasicMaterial({ visible: false });
    const hitBox = new THREE.Mesh(hitBoxGeo, hitBoxMat);
    keyGroup.add(hitBox);
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


 // D. The Mystery Box (Hollow Chest Build)
    const mysteryBox = new THREE.Group();
    mysteryBox.position.set(-4, 0, -4);
    mysteryBox.name = "box";

    const boxMat = new THREE.MeshStandardMaterial({ 
        map: boxTexture,
        roughness: 0.7,
        metalness: 0.0
    });

    // Material for the inner walls to look dark and deep
    const innerMat = new THREE.MeshStandardMaterial({
        color: 0x221105,
        roughness: 0.9
    });

    const t = 0.04; // Thickness of the box walls
    const w = 1.2;  // Total width
    const h = 0.9;  // Total height
    const d = 1.2;  // Total depth

    // 1. Box Bottom Plate
    const bottomGeo = new THREE.BoxGeometry(w, t, d);
    const bottomMesh = new THREE.Mesh(bottomGeo, boxMat);
    bottomMesh.position.y = t / 2;
    mysteryBox.add(bottomMesh);

    // 2. Box Left Wall
    const sideGeoY = new THREE.BoxGeometry(t, h - t, d);
    const leftMesh = new THREE.Mesh(sideGeoY, boxMat);
    leftMesh.position.set(-w / 2 + t / 2, (h + t) / 2, 0);
    mysteryBox.add(leftMesh);

    // 3. Box Right Wall
    const rightMesh = new THREE.Mesh(sideGeoY, boxMat);
    rightMesh.position.set(w / 2 - t / 2, (h + t) / 2, 0);
    mysteryBox.add(rightMesh);

    // 4. Box Front Wall
    const frontGeoX = new THREE.BoxGeometry(w - t * 2, h - t, t);
    const frontMesh = new THREE.Mesh(frontGeoX, boxMat);
    frontMesh.position.set(0, (h + t) / 2, d / 2 - t / 2);
    mysteryBox.add(frontMesh);

    // 5. Box Back Wall
    const backMesh = new THREE.Mesh(frontGeoX, boxMat);
    backMesh.position.set(0, (h + t) / 2, -d / 2 + t / 2);
    mysteryBox.add(backMesh);

    // 6. Box Inner Floor (Visual polish for the inside base)
    const innerBottomGeo = new THREE.BoxGeometry(w - t * 2, 0.01, d - t * 2);
    const innerBottom = new THREE.Mesh(innerBottomGeo, innerMat);
    innerBottom.position.y = t + 0.005;
    mysteryBox.add(innerBottom);

    // Lid Pivot (Positioned exactly at the top back edge)
    const lidPivot = new THREE.Group();
    lidPivot.name = "lidPivot";
    lidPivot.position.set(0, h, -d / 2); 
    mysteryBox.add(lidPivot);

    // Box Lid (Moves with the pivot)
    const lidGeo = new THREE.BoxGeometry(w, t * 2, d);
    const boxLid = new THREE.Mesh(lidGeo, boxMat);
    boxLid.position.set(0, t, d / 2); 
    lidPivot.add(boxLid);

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


    // 8. MYSTERY PAINTINGS (Wall Art with Frames)

    // Helper function to create a framed painting to avoid code repetition
    function createWallPainting(imagePath, width, height, posX, posY, posZ, rotationY) {
        const paintingGroup = new THREE.Group();

        // 1. Load the artwork texture
        const paintingTexture = textureLoader.load(imagePath);
        
        // 2. Create the artwork plane (The actual picture)
        const artGeo = new THREE.PlaneGeometry(width, height);
        const artMat = new THREE.MeshStandardMaterial({
            map: paintingTexture,
            roughness: 0.5, // Not too shiny, it's an old painting
            metalness: 0.1
        });
        const artMesh = new THREE.Mesh(artGeo, artMat);
        
        // Push the artwork slightly forward in the Z axis so it sits on top of the frame
        // This prevents Z-fighting (flickering) between the picture and the frame
        artMesh.position.z = 0.03; 
        paintingGroup.add(artMesh);

        // 3. Create the wooden frame behind the picture
        const frameThickness = 0.2; // 10cm extra border on all sides
        const frameDepth = 0.05;    // How much it sticks out from the wall
        
        const frameGeo = new THREE.BoxGeometry(width + frameThickness, height + frameThickness, frameDepth);
        const frameMat = new THREE.MeshStandardMaterial({
            color: 0x221100, // Dark vintage wood color for the frame
            roughness: 0.8
        });
        const frameMesh = new THREE.Mesh(frameGeo, frameMat);
        paintingGroup.add(frameMesh);

        // 4. Position and rotate the entire framed painting in the room
        paintingGroup.position.set(posX, posY, posZ);
        paintingGroup.rotation.y = rotationY;

        scene.add(paintingGroup);
    }

    function createRug(posX, posY, posZ) {
        const rugGeo = new THREE.PlaneGeometry(4, 6); // 4x6 meters
        const rugMat = new THREE.MeshStandardMaterial({ 
            color: 0x4a2a2a, // Deep red/brown for mystery vibe
            roughness: 0.9,
            side: THREE.DoubleSide
    });
        const rug = new THREE.Mesh(rugGeo, rugMat);
        rug.rotation.x = Math.PI / 2; // Flat on floor
        rug.position.set(posX, posY + 0.01, posZ); // Slightly above floor to prevent z-fighting
        scene.add(rug);
}

    createRug (0, 0.01, -3);


    // --- PLACING THE PAINTINGS ON THE WALLS ---
    // Note: Ensure you have painting1.jpg, painting2.jpg, etc., in your textures folder!

    // Painting 1: Placed on the LEFT Wall (Facing right towards the room)
    // Position X is -9.9 (almost touching the -10 wall). Y is 3 (eye level).
    createWallPainting(
        '/textures/painting1.jpg', // Path to the specific painting
        1.6, 2.0,                  // Dimensions (width, height)
        5.0, 3.0, -9.9,            // X=3.0 (right of door), Y=3.0 (eye level), Z=-9.9 (back wall)
        0                          // Rotation: 0 means it faces directly into the room
    );

    // Painting 2: Placed on the RIGHT Wall (Facing left towards the room)
    createWallPainting(
        '/textures/painting2.jpg', 
        2.5, 1.5,                  // Wider landscape painting
        9.9, 3.2, 2.0,             
        -Math.PI / 2               // Rotated -90 degrees for the right wall
    );

    // Painting 3: Placed on the FRONT Wall (Facing the player when they spawn)
    createWallPainting(
        '/textures/painting3.jpg', 
        1.2, 1.6, 
        -4.0, 2.8, 9.9,            // Placed at Z = 9.9 (Front wall is at Z = 10)
        Math.PI                    // Rotated 180 degrees to face inside the room
    );

    

    // 5. RETURN INTERACTABLE OBJECTS
    // Objects that can receive highlights or collection clicks are returned to main scene
    return [mysteryBox, tableTop, escapeDoor, keyGroup, chairGroup, bookshelfGroup, tripodGroup];
}