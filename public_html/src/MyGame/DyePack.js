/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

"use strict";

function DyePack() {
    // Reference to DyPack sprite (might not be used)
    this.kSprite = null;
    
    // Texture Renderable
    this.mRenderable = null;
    
    // Parameters:
    this.mWidth = 2;
    this.mHeight = 3.25;
    this.mInitSpeed = 120;
    this.mMaxLifespan = 5;
}

// Pre-condition: sprite must be loaded before initializing DyePack
// Initialize DyePack
DyePack.prototype.initialize = function (sprite, Xpos, Ypos) {
    // Store the sprite
    this.kSprite = sprite;
    
    // Create the renderable
    this.mRenderable = new SpriteRenderable(this.kSprite);
    this.mRenderable.setColor([1, 1, 1, 0]);
    this.mRenderable.getXform().setPosition(Xpos, Ypos);
    this.mRenderable.getXform().setSize(this.mWidth, this.mHeight);
    this.mRenderable.setElementPixelPositions(500, 100, 0, 180);
    
};


