/*
 * The template for a scene.
 */

/*jslint node: true, vars: true */
/*global gEngine: false, Transform: false */
/* find out more about jslint: http://www.jslint.com/help.html */

'use strict'; // Operate in Strict mode such that variables must be declared before used!

// Constructor
function Scene() {
  // Sprite Sheet
  this.kSprite = 'assets/SpriteSheet.png';
  // Font
  this.kFont = 'assets/fonts/Consolas-24';

  // Cameras:
  this.mMainCam = null;
  this.mZoomCam = [];
  this.mNumZoomCam = 4;

  // Hero:
  this.mHero = null;

  // Patrol Set:
  this.mPatrolSet = null;

  // Status:
  this.mStatus = null;

  // Array that stores the created DyePack
  this.mDyePackArr = [];
  this.mNumDyePack = 0;

  // cameras
  this.cam0Force = false;
  this.cam1Force = false;
  this.cam2Force = false;
  this.cam3Force = false;
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

// Performs all initialization functions
//   => Should call gEngine.GameLoop.start(this)!
Scene.prototype.initialize = function () {
  // initialize the level (called from GameLoop)
  // Step A: set up the cameras
  this.mMainCam = new Camera(
    vec2.fromValues(100, 75), // position of the camera
    200, // width of camera
    [0, 0, 800, 600] // viewport (orgX, orgY, width, height)
  );
  this.mMainCam.setBackgroundColor([0.8, 0.8, 0.8, 1]);
  // sets the background to gray

  this._initZoomCam();

  // Hero:
  this.mHero = new Hero(this.kSprite);
  this.mHero.initialize(100, 75);

  // Patrol Set:
  this.mPatrolSet = new PatrolSet(this.kSprite);
  this.mPatrolSet.initialize();

  this.mStatus = new FontRenderable('Status: Number of DyePack:');
  this.mStatus.setFont(this.kFont);
  this._initText(this.mStatus, 2, 5, [0, 0, 0, 1], 4);
};

// Check if any collision happens between hero, dyepack, patrol's head, topWing, and bottomWing
Scene.prototype.checkCollision = function () {
  // Case 1: Hero collide with the head of the patrol, Hero Hit
  this._checkHeroCollision();

  // Case 2: DyePack encounter the bound of a Patrol
  this._checkDyePackCollision();
};

Scene.prototype.updateZoomCam = function () {
  // Check if Hero is hitted
  this._checkIsHeroHitted();

  // Check if the DyePack is hitted
  this._checkIsDyePackHitted();

  // Update the interpolation of the camera
  for (var i = 0; i < this.mZoomCam.length; i++) {
    this.mZoomCam[i].update();
  }
};

// Call Update function on all DyePack
Scene.prototype.updateStatus = function () {
  var numPatrol = this.mPatrolSet.getPatrols().length;
  var status =
    'Status: DyePack (' +
    this.mHero.getNumDyePack() +
    '), Patrol (' +
    numPatrol +
    '), AutoSpawn (' +
    this.mPatrolSet.getIsAutoSpawn() +
    ')';
  this.mStatus.setText(status);
};

Scene.prototype.setZoomCamActive = function (index, isActive) {
  if (index >= this.mZoomCam.length) {
    return;
  }
  this.mZoomCam[index].setIsVisible(isActive);
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

  this.updateZoomCam();
  this._checkCameraInput();
};

Scene.prototype.drawZoomCam = function () {
  // Traverse the zoom cam
  for (var i = 0; i < this.mZoomCam.length; i++) {
    if (!this.mZoomCam[i].getIsVisible()) {
      continue;
    }

    this.mZoomCam[i].setupViewProjection();
    this.mHero.draw(this.mZoomCam[i]);
    this.mPatrolSet.draw(this.mZoomCam[i]);
    this.mStatus.draw(this.mZoomCam[i]);
  }
};

// draw function to be called from EngineCore.GameLoop
Scene.prototype.draw = function () {
  // Step A: clear the canvas
  gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray

  this.mMainCam.setupViewProjection();
  this.mHero.draw(this.mMainCam);
  this.mPatrolSet.draw(this.mMainCam);
  this.mStatus.draw(this.mMainCam);

  // Draw Zoom Cam
  this.drawZoomCam();
};

// Must unload all resources
Scene.prototype.unloadScene = function () {
  // .. unload all resources
  gEngine.Textures.unloadTexture(this.kSprite);
  gEngine.Fonts.unloadFont(this.kFont);
};

Scene.prototype._initText = function (font, posX, posY, color, textH) {
  font.setColor(color);
  font.getXform().setPosition(posX, posY);
  font.setTextHeight(textH);
};

Scene.prototype._initZoomCam = function () {
  var deltaX = 200;

  var heroCam = new Camera(
    vec2.fromValues(100, 75), // position of the camera
    15, // width of camera
    [deltaX * 0, 600, 200, 200] // viewport (orgX, orgY, width, height)
  );
  heroCam.setBackgroundColor([0.8, 0.8, 0.8, 1]);
  this.mZoomCam.push(heroCam);

  // Traverse the number of zoom camera
  for (var i = 1; i < this.mNumZoomCam; i++) {
    // set up the zoom cam
    var cam = new Camera(
      vec2.fromValues(100, 75), // position of the camera
      6, // width of camera
      [deltaX * i, 600, 200, 200] // viewport (orgX, orgY, width, height)
    );
    cam.setBackgroundColor([0.8, 0.8, 0.8, 1]);
    this.mZoomCam.push(cam);
  }
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
  } else {
    dyePack.setIsSlowDown(false);
  }
};

Scene.prototype._zoomDyePackCam = function (dyePack) {
  if (dyePack === null) {
    return;
  }

  for (var j = 1; j < this.mZoomCam.length; j++) {
    // If Zoom cam i is not active
    if (!this.mZoomCam[j].getIsVisible()) {
      var x = dyePack.getXPos();
      var y = dyePack.getYPos();
      // Set position once
      this.mZoomCam[j].setWCCenter(x, y);
      this.mZoomCam[j].setFocusDyePack(dyePack);
      this.mZoomCam[j].setIsVisible(true);
      break;
    }
  }
};

// Check if the DyePack collide with head of patrol
Scene.prototype._checkHeadPatrolCollision = function (dyePack, patrol) {
  if (dyePack === null || patrol === null) {
    return;
  }

  var dyePackRen = dyePack.getRenderable();
  var dyePackBBox = dyePack.getDyePackBBox();
  var patrolHeadRen = patrol.getHeadRenderable();
  var patrolHeadBBox = patrol.getHeadBBox();

  if (dyePackRen === null || dyePack.getIsHit() || patrolHeadRen === null) {
    return;
  }

  var coord = [];
  if (
    window.pixelCollision(
      dyePackRen,
      dyePackBBox,
      patrolHeadRen,
      patrolHeadBBox,
      coord
    )
  ) {
    dyePack.hitDyePack();
    this._zoomDyePackCam(dyePack);
    patrol.hitByDyePack('head');
  }
};

// Check if the DyePack collide with the wing of patrol
Scene.prototype._checkWingPatrolCollision = function (dyePack, patrol) {
  if (dyePack === null || patrol === null) {
    return;
  }

  var dyePackRen = dyePack.getRenderable();
  var dyePackBBox = dyePack.getDyePackBBox();
  var patrolTopWingRen = patrol.getTopWingRenderable();
  var patrolTopWingBBox = patrol.getTopWingBBox();
  var patrolBottomWingRen = patrol.getBottomWingRenderable();
  var patrolBottomWingBBox = patrol.getBottomWingBBox();

  if (dyePackRen === null || dyePack.getIsHit()) {
    return;
  }

  if (patrolTopWingRen !== null) {
    var coord = [];
    if (
      window.pixelCollision(
        dyePackRen,
        dyePackBBox,
        patrolTopWingRen,
        patrolTopWingBBox,
        coord
      )
    ) {
      dyePack.hitDyePack();
      this._zoomDyePackCam(dyePack);
      patrol.hitByDyePack('top');
    }
  }

  if (patrolBottomWingRen !== null) {
    var coord = [];
    if (
      window.pixelCollision(
        dyePackRen,
        dyePackBBox,
        patrolBottomWingRen,
        patrolBottomWingBBox,
        coord
      )
    ) {
      dyePack.hitDyePack();
      this._zoomDyePackCam(dyePack);
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

Scene.prototype._checkIsHeroHitted = function () {
  if (this.mHero === null) {
    return;
  }

  if (this.mHero.getIsHitted()) {
    if (!this.mZoomCam[0].getIsVisible()) {
      this.mZoomCam[0].setIsVisible(true);
    }
    var center = this.mHero.getHeroPosition();
    this.mZoomCam[0].setWCCenter(center[0], center[1]);
  } else {
    this.mZoomCam[0].setIsVisible(this.cam0Force || false);
  }
};

Scene.prototype._checkIsDyePackHitted = function () {
  for (var j = 1; j < this.mZoomCam.length; j++) {
    // If Zoom cam i is not active
    var dyePack = this.mZoomCam[j].getFocusDyePack();
    if (
      this.mZoomCam[j].getIsVisible() && 
      dyePack !== null &&
      // check if dyepack exists
      dyePack.getIsTerminated()
    ) {
      // Set position once
      this.mZoomCam[j].setIsVisible(false);
    }
  }
};

Scene.prototype._checkCameraInput = function () {
  if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Zero)) {
    this.cam0Force = !this.cam0Force;
    this.setZoomCamActive(0, this.cam0Force);
  }

  if (gEngine.Input.isKeyClicked(gEngine.Input.keys.One)) {
    this.cam1Force = !this.cam1Force;
    this.setZoomCamActive(1, this.cam1Force);
  }

  if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Two)) {
    this.cam2Force = !this.cam2Force;
    this.setZoomCamActive(2, this.cam2Force);
  }

  if (gEngine.Input.isKeyClicked(gEngine.Input.keys.Three)) {
    this.cam3Force = !this.cam3Force;
    this.setZoomCamActive(3, this.cam3Force);
  }
};
//</editor-fold>
