/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";

function DyePack(sprite) {
    // Reference to DyPack sprite (might not be used)
    this.kSprite = sprite;
    
    // Texture Renderable
    this.mRenderable = null;
    
    // Parameters:
    this.mWidth = 2;            // size width
    this.mHeight = 3.25;        // size height
    this.mInitSpeed = 120;      // initial speed
    this.mHitXAmplitude = 4;    // hit x amplitude
    this.mHitYAmplitude = 0.2;  // hit y amplitude
    this.mHitFrequency = 20;    // hit frequency
    this.mHitDuration = 300;    // hit duration
    this.mMaxLifespan = 5;      // Max lifespan seconds
    this.mIsTerminate = false;  // Does the DyePack need to be terminated?
    
    // Timer for Lifespan
    this.mTimer = 0;
    
    // Current Speed
    this.mCurSpeed = 0;
}

// Pre-condition: sprite must be loaded before initializing DyePack
// Initialize DyePack
DyePack.prototype.initialize = function (Xpos, Ypos) {    
    // Create the renderable
    this.mRenderable = new SpriteRenderable(this.kSprite);
    this.mRenderable.setColor([1, 1, 1, 0]);
    this.mRenderable.getXform().setPosition(Xpos, Ypos);
    this.mRenderable.getXform().setSize(this.mWidth, this.mHeight);
    this.mRenderable.setElementPixelPositions(500, 100, 0, 180);
    
    this.mCurSpeed = this.mInitSpeed;   
};

// Hit trigger
DyePack.prototype.HitDyePack = function () {
    
};

// Return true if this.mIsTerminate is true. This DyePack need to terminate.
DyePack.prototype.getIsTerminate = function () {
    return this.mIsTerminate;
};

// Update the DyePack
DyePack.prototype.update = function () {
    var deltaTime = gEngine.GameLoop.getElapsedTime();
    this.mTimer += deltaTime; // add delta time
    
    // If the DyePack reaches it's life span, terminate the DyePack
    if (this.mTimer >= this.mMaxLifespan) {
        this.mIsTerminate = true;
    }
    
    // Move to the right by current speed
    var xForm = this.mRenderable.getXform();
    xForm.incXPosBy(this.mCurSpeed * deltaTime);
    
    // If hit by a patrol's Bound
};

// Pre-condition: Must be a valid camera input
// Draw the DyePack renderable
DyePack.prototype.draw = function (cam) {
    this.mRenderable.draw(cam.getVPMatrix());
};


