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
            
    this.mStatus = new FontRenderable("Status: Number of DyePack:");
    this.mStatus.setFont(this.kFont);
    this._initText(this.mStatus, 2, 5, [0, 0, 0, 1], 4);
};

// Slow down all DyePack
Scene.prototype.slowDownDyePack = function () {
    if (this.mDyePackArr.length <= 0) {
        return;
    }
    
    // Traverse the DyePack array
    for (var i = 0; i < this.mDyePackArr.length; i++) {
        if (this.mDyePackArr[i] !== null) {
            // Slow down each DyePack in the array
            this.mDyePackArr[i].slowDown();
        }
    }
};

// Trigger hit on ALL DyePack
Scene.prototype.hitDyePack = function () {
    if (this.mDyePackArr.length <= 0) {
        return;
    }
    
        // Traverse the DyePack array
    for (var i = 0; i < this.mDyePackArr.length; i++) {
        if (this.mDyePackArr[i] !== null) {
            // Slow down each DyePack in the array
            this.mDyePackArr[i].hitDyePack();
        }
    }
};

// Call Update function on all DyePack
Scene.prototype.updateDyePacks = function () {
    var status = "Status: number of DyePack = " + this.mNumDyePack;
    this.mStatus.setText(status);
    if (this.mDyePackArr.length <= 0) {
        return;
    }
    
    for (var i = 0; i < this.mDyePackArr.length; i++) {
        if (this.mDyePackArr[i] !== null) {
            this.mDyePackArr[i].update();
        }
    }
};

// Terminate the DyePack if it's speed reaches 0 or reache outside the bound
Scene.prototype.checkDyePackTermination = function () {
    if (this.mDyePackArr.length <= 0) {
        return;
    }
    
    var boundX = this.mMainCam.getWCCenter()[0] + this.mMainCam.getWCWidth()/2;
    for (var i = 0; i < this.mDyePackArr.length; i++) {
        if (this.mDyePackArr[i] !== null) {
            var currentSpeed = this.mDyePackArr[i].getSpeed();
            if (currentSpeed <= 0.1 || this.mDyePackArr[i].getXPos() >= boundX) {
                this.mDyePackArr[i] = null;
                this.mNumDyePack--;
            }
        }
    }
};

// update function to be called form EngineCore.GameLoop
Scene.prototype.update = function () {
    // when done with this level should call:
    // GameLoop.stop() ==> which will call this.unloadScene();
    var x = this.mMainCam.mouseWCX();
    var y = this.mMainCam.mouseWCY();
    
    // Space bar clicked: spawn a DyePack from the Hero
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
        var dyePack = new DyePack(this.kSprite);
        dyePack.initialize(x,y);
        this.mDyePackArr.push(dyePack);
        this.mNumDyePack++;
    }
    
    // Q clicked: trigger a Hero hit event
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q)) {
        this.hitDyePack();
    }
    
    // D pressed: trigger DyePack slow down
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
        this.slowDownDyePack();
    }
    
    // S clicked: trigger a hit event for ALL DyePack currently in the world
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.S)) {
        
    }
    
    // P clicked: toggle auto spawning
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.P)) {
        
    }
    
    // C clicked: spawns a new patrol
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.C)) {
        
    }
    
    // B clicked: toggle the drawing of all bound for all the patrols.
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.B)) {
        
    }
    
    // J clicked: trigger the Heda Patrol hit event for ALL patrol objects in the world
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.J)) {
        
    }
    
    // Update all DyePack
    this.updateDyePacks();

    // Check if the DyePack's speed is less than 0
    this.checkDyePackTermination();
};

Scene.prototype.drawDyePack = function (cam) {
    if (this.mDyePackArr.length <= 0) {
        return;
    }
    
    for (var i = 0; i < this.mDyePackArr.length; i++) {
        if (this.mDyePackArr[i] !== null) {
            this.mDyePackArr[i].draw(cam);
        }
    }
};

// draw function to be called from EngineCore.GameLoop
Scene.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
    this.mMainCam.setupViewProjection();
    this.mStatus.draw(this.mMainCam);
    
    this.drawDyePack(this.mMainCam);
};

// Must unload all resources
Scene.prototype.unloadScene = function () {
    // .. unload all resources
    gEngine.Textures.unloadTexture(this.kSprite);
    gEngine.Fonts.unloadFont(this.kFont);
};
//</editor-fold>