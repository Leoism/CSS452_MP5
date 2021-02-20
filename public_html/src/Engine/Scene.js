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
    
    // Cameras:
    this.mMainCam = null;
    
}

//<editor-fold desc="functions subclass should override">

// Begin Scene: must load all the scene contents
// when done 
//  => start the GameLoop
// The game loop will call initialize and then update/draw
Scene.prototype.loadScene = function () {
    // override to load scene specific contents
    gEngine.Textures.loadTexture(this.kSprite);
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
    
};

// update function to be called form EngineCore.GameLoop
Scene.prototype.update = function () {
    // when done with this level should call:
    // GameLoop.stop() ==> which will call this.unloadScene();
    
    // Space bar clicked: spawn a DyePack from the Hero
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
        
    }
    
    // Q clicked: trigger a Hero hit event
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q)) {
        
    }
    
    // D pressed: trigger slow down
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
        
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
};

// draw function to be called from EngineCore.GameLoop
Scene.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
    this.mMainCam.setupViewProjection();
};

// Must unload all resources
Scene.prototype.unloadScene = function () {
    // .. unload all resources
    gEngine.Textures.unloadTexture(this.kSprite);
};
//</editor-fold>