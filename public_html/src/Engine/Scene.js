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
            
    this.mHero = new Hero(this.kSprite);
    this.mHero.initialize(100,75);
            
    this.mStatus = new FontRenderable("Status: Number of DyePack:");
    this.mStatus.setFont(this.kFont);
    this._initText(this.mStatus, 2, 5, [0, 0, 0, 1], 4);
};

// Call Update function on all DyePack
Scene.prototype.updateStatus = function () {
    var status = "Status: number of DyePack = " + this.mHero.getNumDyePack();
    this.mStatus.setText(status);
};

// update function to be called form EngineCore.GameLoop
Scene.prototype.update = function () {
    // when done with this level should call:
    // GameLoop.stop() ==> which will call this.unloadScene();
    var x = this.mMainCam.mouseWCX();
    var y = this.mMainCam.mouseWCY();
    
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
    
    this.mHero.update(this.mMainCam);
    
    this.updateStatus();
};

// draw function to be called from EngineCore.GameLoop
Scene.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
    this.mMainCam.setupViewProjection();
    this.mHero.draw(this.mMainCam);
    this.mStatus.draw(this.mMainCam);
};

// Must unload all resources
Scene.prototype.unloadScene = function () {
    // .. unload all resources
    gEngine.Textures.unloadTexture(this.kSprite);
    gEngine.Fonts.unloadFont(this.kFont);
};
//</editor-fold>