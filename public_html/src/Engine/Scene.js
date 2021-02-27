/* 
 * The template for a scene.
 */

/*jslint node: true, vars: true */
/*global gEngine: false, Transform: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

// Constructor
function Scene() {
    // Sprite Sheet
    this.kSprite = "assets/SpriteSheet.png";
    // Font
    this.kFont = "assets/fonts/Consolas-24";
    
    // Cameras:
    this.mMainCam = null;
    
    // Hero:
    this.mHero = null;
    
    // Patrol Set:
    this.mPatrolSet = null;
    
    // Status:
    this.mStatus = null;
    
    // Array that stores the created DyePack
    this.mDyePackArr = []; 
    this.mNumDyePack = 0;
}

//<editor-fold desc="functions subclass should override">

// Begin Scene: must load all the scene contents
// when done 
//  => start the GameLoop
// The game loop will call initialize and then update/draw
Scene.prototype.loadScene = function () {
    // override to load scene specific contents
    gEngine.Textures.loadTexture(this.kSprite);
    gEngine.Fonts.loadFont(this.kFont);
};

Scene.prototype._initText = function (font, posX, posY, color, textH) {
    font.setColor(color);
    font.getXform().setPosition(posX, posY);
    font.setTextHeight(textH);
};

// Performs all initialization functions
//   => Should call gEngine.GameLoop.start(this)!
Scene.prototype.initialize = function () {
    // initialize the level (called from GameLoop)
    // Step A: set up the cameras
    this.mMainCam = new Camera(
        vec2.fromValues(100, 75), // position of the camera
        200,                       // width of camera
        [0, 0, 800, 600]           // viewport (orgX, orgY, width, height)
    );
    this.mMainCam.setBackgroundColor([0.8, 0.8, 0.8, 1]);
            // sets the background to gray
          
    // Hero:
    this.mHero = new Hero(this.kSprite);
    this.mHero.initialize(100,75);
    
    // Patrol Set:
    this.mPatrolSet = new PatrolSet(this.kSprite);
    this.mPatrolSet.initialize();
            
    this.mStatus = new FontRenderable("Status: Number of DyePack:");
    this.mStatus.setFont(this.kFont);
    this._initText(this.mStatus, 2, 5, [0, 0, 0, 1], 4);
};

// Check if Hero collide with any patrol's head
Scene.prototype._checkHeroCollision = function () {
    // Get the list of patrols
    var patrols = this.mPatrolSet.getPatrols();
    var heroBBox = this.mHero.getHeroBBox();
    if (patrols.length <= 0) {
        return;
    }
    
    // Traverse the patrols
    for (var i = 0; i < patrols.length; i++) {
        if (patrols[i] === null) {
            continue;
        }
        
        var patrolHeadBBox = patrols[i].getHeadBBox();
        if (heroBBox.intersectsBound(patrolHeadBBox)) {
            this.mHero.hitHero();
        }
    }
};

Scene.prototype._checkDyePackBoundCollision = function (dyePack, patrol) {
    if (dyePack === null || patrol === null) {
        return;
    }
    
    var dyePackBound = dyePack.getDyePackBBox();
    var patrolBound = patrol.getBigBoundBBox();
    
    if (dyePackBound.intersectsBound(patrolBound)) {
        dyePack.setIsSlowDown(true);
    }
    else {
        dyePack.setIsSlowDown(false);
    }        
};

// Check if the DyePack collide with head of patrol
Scene.prototype._checkHeadPatrolCollision = function (dyePack, patrol) {
    if (dyePack === null || patrol === null) {
        return;
    }
    
    var dyePackRen = dyePack.getRenderable();
    var dyePackBBox= dyePack.getDyePackBBox();
    var patrolHeadRen = patrol.getHeadRenderable();
    var patrolHeadBBox = patrol.getHeadBBox();
    
    if (dyePackRen === null || dyePack.getIsHit() || patrolHeadRen === null) {
        return;
    }
    
    var coord = [];
    if (window.pixelCollision(dyePackRen, dyePackBBox, patrolHeadRen, patrolHeadBBox, coord)) {
        dyePack.hitDyePack();
        patrol.hitByDyePack('head');
    }
};

// Check if the DyePack collide with the wing of patrol
Scene.prototype._checkWingPatrolCollision = function (dyePack, patrol) {
    if (dyePack === null || patrol === null) {
        return;
    }
    
    var dyePackRen = dyePack.getRenderable();
    var dyePackBBox= dyePack.getDyePackBBox();
    var patrolTopWingRen = patrol.getTopWingRenderable();
    var patrolTopWingBBox = patrol.getTopWingBBox();
    var patrolBottomWingRen = patrol.getBottomWingRenderable();
    var patrolBottomWingBBox = patrol.getBottomWingBBox();
    
    if (dyePackRen === null || dyePack.getIsHit()) {
        return;
    }
    
    if (patrolTopWingRen !== null) {
        var coord = [];
        if (window.pixelCollision(dyePackRen, dyePackBBox, patrolTopWingRen, patrolTopWingBBox, coord)) {
            dyePack.hitDyePack();
            patrol.hitByDyePack('top');
        }
    }
    
    if (patrolBottomWingRen !== null) {
        var coord = [];
        if (window.pixelCollision(dyePackRen, dyePackBBox, patrolBottomWingRen, patrolBottomWingBBox, coord)) {
            dyePack.hitDyePack();
            patrol.hitByDyePack('bottom');
        }
    }
};

// Check if any DyePack collide with the bound of the patrols
Scene.prototype._checkDyePackCollision = function () {
    // get the list of DyePack
    var dyePacks = this.mHero.getDyePacks();
    var patrols = this.mPatrolSet.getPatrols();
    
    if (dyePacks <= 0) {
        return;
    }
    
    // Traverse the dyePacks
    for (var i = 0; i < dyePacks.length; i++) {
        if (dyePacks[i] === null) {
            continue;
        }
        
        // Traverse the patrols
        for (var j = 0; j < patrols.length; j++) {
            if (patrols[j] === null) {
                continue;
            }
            
            // Case 2A: Check if the DyePack encounter the bound of patrol
            this._checkDyePackBoundCollision(dyePacks[i], patrols[j]);
            
            // Case 2B: Check if the DyePack pixel collide with the head of the patrol
            this._checkHeadPatrolCollision(dyePacks[i], patrols[j]);
            
            // Case 2C: CHeck if the DyePack pixel collide with the top and/or bottom wing of the patrol
            this._checkWingPatrolCollision(dyePacks[i], patrols[j]);
        }
    }
};

// Check if any collision happens between hero, dyepack, patrol's head, topWing, and bottomWing
Scene.prototype.checkCollision = function () {
    // Case 1: Hero collide with the head of the patrol, Hero Hit
    this._checkHeroCollision();

    // Case 2: DyePack encounter the bound of a Patrol
    this._checkDyePackCollision();
    
    // Case 3: DyePack collide with the head of the patrol
    // Case 4: DyePack collide with the wing of the patrol
};

// Call Update function on all DyePack
Scene.prototype.updateStatus = function () {
    var numPatrol = this.mPatrolSet.getPatrols().length;
    var status = "Status: DyePack (" + this.mHero.getNumDyePack() + "), Patrol (" + numPatrol + "), AutoSpawn (" + this.mPatrolSet.getIsAutoSpawn() + ")";
    this.mStatus.setText(status);
};

// update function to be called form EngineCore.GameLoop
Scene.prototype.update = function () {
    // when done with this level should call:
    // GameLoop.stop() ==> which will call this.unloadScene();
    var x = this.mMainCam.mouseWCX();
    var y = this.mMainCam.mouseWCY();
    
    this.mHero.update(this.mMainCam);
    this.mPatrolSet.update();
    
    this.checkCollision();
    
    this.updateStatus();
};

// draw function to be called from EngineCore.GameLoop
Scene.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
    this.mMainCam.setupViewProjection();
    this.mHero.draw(this.mMainCam);
    this.mPatrolSet.draw(this.mMainCam);
    this.mStatus.draw(this.mMainCam);
};

// Must unload all resources
Scene.prototype.unloadScene = function () {
    // .. unload all resources
    gEngine.Textures.unloadTexture(this.kSprite);
    gEngine.Fonts.unloadFont(this.kFont);
};
//</editor-fold>