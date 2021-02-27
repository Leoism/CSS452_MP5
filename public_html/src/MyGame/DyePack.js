/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
class DyePack {
  constructor(sprite) {
    // Reference to DyPack sprite (might not be used)
    this.kSprite = sprite;

    // Object State
    this.mOriginalPos = null;
    this.mObjectState = null;
    this.mObjectShake = null;

    // Texture Renderable
    this.mRenderable = null;

    // Parameters:
    this.mWidth = 2; // size width
    this.mHeight = 3.25; // size height
    this.mInitSpeed = 120; // initial speed
    this.mSlowDownUnit = 0.1; // speed decceleration
    this.mHitXAmplitude = 4; // hit x amplitude
    this.mHitYAmplitude = 0.2; // hit y amplitude
    this.mHitFrequency = 20; // hit frequency
    this.mHitDuration = 300; // hit duration
    this.mMaxLifespan = 5; // Max lifespan seconds
    this.mIsTerminated = false; // Does the DyePack need to be terminated?
    this.mIsHitted = false;
    this.mIsSlowed = false;

    // Timer for Lifespan
    this.mTimer = 0;

    // Current Speed
    this.mCurSpeed = 0;
  }

  // Pre-condition: sprite must be loaded before initializing DyePack
  // Initialize DyePack
  initialize(xPos, yPos) {
    // Create the renderable
    this.mRenderable = new SpriteRenderable(this.kSprite);
    this.mRenderable.setColor([1, 1, 1, 0]);
    this.mRenderable.getXform().setPosition(xPos, yPos);
    this.mRenderable.getXform().setSize(this.mWidth, this.mHeight);
    this.mRenderable.setElementPixelPositions(510, 595, 23, 153);

    this.mCurSpeed = 2;
  }

  // Slow down DyePack
  slowDown() {
    this.mCurSpeed -= this.mSlowDownUnit;
  }

  // Update Shake
  updateShake() {
    if (this.mObjectShake !== null) {
      if (this.mObjectShake.shakeDone()) {
        this.mObjectShake = null;
        this.mObjectState = null;
        this.mIsTerminated = true;
      } else {
        this.mObjectShake.setRefCenter(this.mObjectState.getCenter());
        this.mObjectShake.updateShakeState();
        var center = this.mObjectShake.getCenter();
        this.mRenderable.getXform().setPosition(center[0], center[1]);
      }
    }
    if (this.mObjectState !== null) {
      this.mObjectState.updateObjectState();
    }
  }

  // Hit trigger
  hitDyePack() {
    if (!this.mIsHitted) {
      // Initialize ObjectState
      var xForm = this.mRenderable.getXform();
      var xPos = xForm.getXPos();
      var yPos = xForm.getYPos();
      var p = vec2.fromValues(xPos, yPos);
      this.mObjectState = new ObjectState(p, this.mWidth);
      this.mObjectShake = new ObjectShake(
        this.mObjectState,
        this.mHitXAmplitude,
        this.mHitYAmplitude,
        this.mHitFrequency,
        this.mHitDuration
      );
      this.mIsHitted = true;
    }
  }

  // Set the slow down
  setIsSlowDown(isSlowDown) {
    this.mIsSlowed = isSlowDown;
  }

  // Get the renderable
  getRenderable() {
    return this.mRenderable;
  }

  // Get the renderable Bound
  getDyePackBBox() {
    var xform = this.mRenderable.getXform();
    var b = new BoundingBox(
      xform.getPosition(),
      xform.getWidth(),
      xform.getHeight()
    );
    return b;
  }

  // Get is the DyePack hit
  getIsHit() {
    return this.mIsHitted;
  }

  // Return true if this.mIsTerminate is true. This DyePack need to terminate.
  getIsTerminated() {
    return this.mIsTerminated;
  }

  // Get X position of the DyePack
  getXPos() {
    return this.mRenderable.getXform().getXPos();
  }

  // Get Y position of the DyePack
  getYPos() {
    return this.mRenderable.getXform().getYPos();
  }

  // Get the current speed of the DyePack
  getSpeed() {
    return this.mCurSpeed;
  }

  // Update the DyePack
  update() {
    var deltaTime = gEngine.GameLoop.getElapsedTime();
    this.mTimer += deltaTime; // add delta time

    // If the DyePack reaches it's life span, terminate the DyePack
    if (this.mTimer >= this.mMaxLifespan && !this.mIsHitted) {
      this.mIsTerminated = true;
    }

    // Move to the right by current speed
    var xForm = this.mRenderable.getXform();
    xForm.incXPosBy(this.mCurSpeed);

    // If hit by a patrol's Bound
    this.updateShake();
  }

  // Pre-condition: Must be a valid camera input
  // Draw the DyePack renderable
  draw(cam) {
    if (this.mIsSlowed) {
      this.slowDown();
    }

    this.mRenderable.draw(cam);
  }
}
