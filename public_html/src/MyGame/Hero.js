/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class Hero {
    constructor(sprite) {
        // Sprite
        this.kSprite = sprite;
        
        // Renderable
        this.mHeroRenderable = null;
        
        // Object State and Shake
        this.mObjectState = null;
        this.mObjectShake = null;
        this.mIsHeroHit = false;
        
        // Array that stores the created DyePack
        this.mDyePackArr = []; 
        this.mNumDyePack = 0;
        this.mIsDyePacksSlow = false;
        
        // Parameters
        this.mWidth = 9;
        this.mHeight = 12;
        this.mMotionRate = 0.05;
        this.mMotionCycles = 120;
        this.mHitXAmplitude = 4.5;
        this.mHitYAmplitude = 6;
        this.mHitFrequency = 4;
        this.mHitDuration = 60;  
    }
    
    initialize(xPos, yPos) {
        // Create the renderable
        this.mHeroRenderable = new SpriteRenderable(this.kSprite);   
        this.mHeroRenderable.setColor([1, 1, 1, 0]);
        this.mHeroRenderable.getXform().setPosition(xPos, yPos);
        this.mHeroRenderable.getXform().setSize(this.mWidth, this.mHeight);
        this.mHeroRenderable.setElementPixelPositions(0, 120, 0, 180);
        
        // Initialize ObjectState
        var p = vec2.fromValues(xPos, yPos);
        this.mObjectState = new ObjectState(p,this.mWidth);
        this.mObjectState.setCycle(this.mMotionCycles);
        this.mObjectState.setRate(this.mMotionRate);
    }
    
    // Get the number of DyePack in the Scene
    getNumDyePack() {
        return this.mNumDyePack;
    }
    
    // Get the renderable
    getHeroRenderable() {
        return this.mHeroRenderable;
    }
    
    // Get Hero bounding box
    getHeroBBox() {
        var xform = this.mHeroRenderable.getXform();
        var b = new BoundingBox(xform.getPosition(), xform.getWidth(), xform.getHeight());
        return b;
    }
    
    // Get is hero hitted
    getIsHitted() {
        return this.mIsHeroHit;
    }
    
    getDyePacks() {
        return this.mDyePackArr;
    }
    
    getHeroPosition() {
        return this.mObjectState.getCenter();
    }
    
    // Set the position of the Hero
    setHeroPosition(x,y) {
        if (this.mObjectState === null) {
            return;
        }
        
        var p = vec2.fromValues(x,y);
        this.mObjectState.setCenter(p);
    }
    
    // Trigger hit on Hero
    hitHero() {
        if (!this.mIsHeroHit) {
            this.mObjectShake = new ObjectShake(this.mObjectState, 
                                                this.mHitXAmplitude, 
                                                this.mHitYAmplitude, 
                                                this.mHitFrequency, 
                                                this.mHitDuration);
            this.mObjectShake.setRefCenter(vec2.fromValues(this.mWidth,this.mHeight));
            this.mObjectShake.setShakeCenter(vec2.fromValues(this.mWidth,this.mHeight));
            this.mIsHeroHit = true;
        }
    }
    
    // Slow down all DyePack
    slowDownDyePack() {
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
    }

    // Trigger hit on ALL DyePack
    hitDyePack() {
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
    }
    
    // Update the State and/or Shake of the Hero
    updateHero() {
        if (this.mObjectShake !== null) {
            if (this.mObjectShake.shakeDone()) {
                this.mObjectState.setWidth(this.mWidth);                
                this.mObjectShake = null;
                this.mIsHeroHit = false;
            }
            else {
                this.mObjectShake.setRefCenter(vec2.fromValues(this.mWidth,this.mHeight));
                this.mObjectShake.updateShakeState();
                var sizeRef = this.mObjectShake.getCenter()[0];
                var w = this.mHeroRenderable.getXform().getWidth();
                var frac = sizeRef/w;
                this.mObjectState.setWidth(w *frac);
                //this.mHeroRenderable.getXform().setSize(w * frac, h *frac);
            }
        }
        this.mObjectState.updateObjectState();
        var center = this.mObjectState.getCenter();
        var width = this.mObjectState.getWidth();
        this.mHeroRenderable.getXform().setPosition(center[0],center[1]);
        this.mHeroRenderable.getXform().setSize(width, (width/this.mWidth)*this.mHeight);
    }

    // Call Update function on all DyePack
    updateDyePacks() {
        if (this.mDyePackArr.length <= 0) {
            return;
        }

        for (var i = 0; i < this.mDyePackArr.length; i++) {
            if (this.mDyePackArr[i] !== null) {
                this.mDyePackArr[i].update();
            }
        }
    }

    // Terminate the DyePack if it's speed reaches 0 or reache outside the bound
    checkDyePackTermination(cam) {
        if (this.mDyePackArr.length <= 0) {
            return;
        }

        var boundX = cam.getWCCenter()[0] + cam.getWCWidth()/2;
        for (var i = 0; i < this.mDyePackArr.length; i++) {
            if (this.mDyePackArr[i] !== null) {
                var currentSpeed = this.mDyePackArr[i].getSpeed();
                if (currentSpeed <= 0 || this.mDyePackArr[i].getXPos() >= boundX || this.mDyePackArr[i].getIsTerminated()) {
                    this.mDyePackArr[i] = null;
                    this.mNumDyePack--;
                }
            }
        }
    }   
    
    update(cam) {
        // Get the position of the mouse
        var x = cam.mouseWCX();
        var y = cam.mouseWCY();
        
        // If the mouse is in view port, Hero lerp to the mouse position
        if (cam.isMouseInViewport()) {
            this.setHeroPosition(x,y);
        }
        
        // Space bar clicked: spawn a DyePack from the Hero
        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Space)) {
            var dyePack = new DyePack(this.kSprite);
            var heroX = this.mHeroRenderable.getXform().getXPos();
            var heroY = this.mHeroRenderable.getXform().getYPos();
            dyePack.initialize(heroX,heroY);
            this.mDyePackArr.push(dyePack);
            this.mNumDyePack++;
        }
        
        // Q clicked: trigger a Hero hit event
        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Q)) {
            this.hitHero();
        }
        
        // D pressed: trigger DyePack slow down
        if (gEngine.Input.isKeyPressed(gEngine.Input.keys.D)) {
            this.mIsDyePacksSlow = true;
        }
        else {
            this.mIsDyePacksSlow = false;
        }

        // S clicked: trigger a hit event for ALL DyePack currently in the world
        if (gEngine.Input.isKeyClicked(gEngine.Input.keys.S)) {
            this.hitDyePack();
        }
        
        // Update hero state
        this.updateHero();
        
        // Update all DyePack
        this.updateDyePacks();

        // Check if the DyePack's speed is less than 0
        this.checkDyePackTermination(cam);
    }
    
    drawDyePack(cam) {
        if (this.mDyePackArr.length <= 0) {
            return;
        }

        for (var i = 0; i < this.mDyePackArr.length; i++) {
            if (this.mDyePackArr[i] !== null) {
                this.mDyePackArr[i].draw(cam);
            }
        }
    }
    
    draw(cam) {
        // Slow the DyePack if D is pressed
        if (this.mIsDyePacksSlow) {
            this.slowDownDyePack();
        }
        
        this.mHeroRenderable.draw(cam);
        
        this.drawDyePack(cam);
    }
}


