// Shared sprite artwork and wall-texture initialization, no Canvas2D scene renderer.
const coopAvatarArt=createCoopAvatarArt();
const lockerArt=createLockerArt(),stairArt=createStairArt(),extraPickupArt=createPickupArt('#eba976','K');
const finalWallTexture=createFinalWall();
const staminaArt=createPickupArt('#a5ea8e','S'),shieldArt=createPickupArt('#85c9ff','+'),pigWallTexture=createPigWall(),pigFoodArt=createPigFood(),bloodArt=spriteFromSource(BLOOD_DECAL_PNG,createBloodArt()),hazardArt=spriteFromSource('assets/decals/plasm_3.png',createHazardArt());

// Atlas slot 21 remains reserved so enemy and item layers never shift.
const hardRockArt=extraPickupArt;
