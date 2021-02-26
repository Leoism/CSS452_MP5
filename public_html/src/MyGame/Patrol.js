class Patrol {
  constructor(xPos, yPos) {
    this.head = null;
    this.topWing = null;
    this.bottomWing = null;
    this.direction = [];
    this.position = [xPos, yPos];
    this.spriteSrc = 'assets/SpriteSheet.png';

    this.headBound = null;
    this.topBound = null;
    this.bottomBound = null;
    this.bigBound = null;

    this.isHit = false;
    this.drawBounds = true;
    this.isDead = false;
    this.initialize();
  }

  get headPosition() {
    return this.head.getXform().getPosition();
  }

  get headWidth() {
    return this.head.getXform().getSize()[0];
  }

  get headHeight() {
    return this.head.getXform().getSize()[1];
  }

  get topWingPosition() {
    return this.topWing.getXform().getPosition();
  }

  get topWingWidth() {
    return this.topWing.getXform().getSize()[0];
  }

  get topWingHeight() {
    return this.topWing.getXform().getSize()[1];
  }

  get bottomWingPosition() {
    return this.bottomWing.getXform().getPosition();
  }

  get bottomWingWidth() {
    return this.bottomWing.getXform().getSize()[0];
  }

  get bottomWingHeight() {
    return this.bottomWing.getXform().getSize()[1];
  }

  get minYPosition() {
    const bwXform = this.bottomWing.getXform();
    return bwXform.getPosition()[1] - bwXform.getSize()[1] / 2;
  }

  get maxYPosition() {
    const twXform = this.topWing.getXform();
    return twXform.getPosition()[1] + twXform.getSize()[1] / 2;
  }

  get minXPosition() {
    const hdXform = this.head.getXform();
    return hdXform.getPosition()[0] - hdXform.getSize()[0] / 2;
  }

  get maxXPosition() {
    const twXform = this.topWing.getXform();
    return twXform.getPosition()[0] + twXform.getSize()[0] / 2;
  }

  get bigBoundPosition() {
    return [
      (this.maxXPosition + this.minXPosition) / 2,
      (this.maxYPosition + this.minYPosition) / 2,
    ];
  }

  get bigBoundMaxYPosition() {
    return this.maxYPosition + this.height * 0.5;
  }

  get height() {
    return this.maxYPosition - this.minYPosition;
  }

  get width() {
    return this.maxXPosition - this.minXPosition;
  }

  initialize() {
    this.head = this._generateNewHead(this.position[0], this.position[1]);
    const wings = this._generateNewWings(this.position[0], this.position[1]);
    this.topWing = wings[0];
    this.bottomWing = wings[1];
    vec2.normalize(this.direction, [
      this._randomNumber(-10, 10),
      this._randomNumber(-10, 10),
    ]);

    vec2.multiply(this.direction, this.direction, [0.05, 0.05]);
    this.headBound = this._createBound(
      this.headPosition,
      this.headWidth,
      this.headHeight
    );

    this.bottomBound = this._createBound(
      this.bottomWingPosition,
      this.bottomWingWidth,
      this.bottomWingHeight
    );

    this.topBound = this._createBound(
      this.topWingPosition,
      this.topWingWidth,
      this.topWingHeight
    );

    this.bigBound = this._createBound(
      [this.bigBoundPosition[0], this.bigBoundPosition[1] + this.height * 0.25],
      this.width,
      this.height + this.height * 0.5
    );

    this.bigBoundWidth = this.width;
    this.bigBoundHeight = this.height + this.height * 0.5;
  }

  draw(cam) {
    this.head.draw(cam);
    this.topWing.draw(cam);
    this.bottomWing.draw(cam);

    if (!this.drawBounds) return;
    this.headBound.top.draw(cam);
    this.headBound.bottom.draw(cam);
    this.headBound.left.draw(cam);
    this.headBound.right.draw(cam);

    this.bottomBound.top.draw(cam);
    this.bottomBound.bottom.draw(cam);
    this.bottomBound.left.draw(cam);
    this.bottomBound.right.draw(cam);

    this.topBound.top.draw(cam);
    this.topBound.bottom.draw(cam);
    this.topBound.left.draw(cam);
    this.topBound.right.draw(cam);

    this.bigBound.top.draw(cam);
    this.bigBound.bottom.draw(cam);
    this.bigBound.left.draw(cam);
    this.bigBound.right.draw(cam);
  }

  update() {
    this._updateMovement();
    this._updateBound(
      this.headBound,
      this.headPosition,
      this.headWidth,
      this.headHeight
    );

    this._updateBound(
      this.bottomBound,
      this.bottomWingPosition,
      this.bottomWingWidth,
      this.bottomWingHeight
    );

    this._updateBound(
      this.topBound,
      this.topWingPosition,
      this.topWingWidth,
      this.topWingHeight
    );

    this._updateBound(
      this.bigBound,
      [this.bigBoundPosition[0], this.bigBoundPosition[1] + this.height * 0.25],
      this.bigBoundWidth,
      this.bigBoundHeight
    );
    this.topWing.updateAnimation();
    this.bottomWing.updateAnimation();

    this._isColliding();
  }

  /**
   * Triggers a hit event on the appropriate location
   * @param {string} location - 'head': hit on head, 'bottom': hit on bottom wing
   *                            'top': hit on top wing
   */
  hitByDyePack(location) {
    if (location === 'head') {
      const headPos = this.head.getXform().getPosition();
      this.head.getXform().setPosition(headPos[0] + 5, headPos[1]);
    }

    const wingColor = this.bottomWing.getColor();
    if (location === 'bottom') {
      this.bottomWing.setColor([
        wingColor[0],
        wingColor[1],
        wingColor[2],
        wingColor[3] + 0.2,
      ]);
    }

    if (location === 'top') {
      this.topWing.setColor([
        wingColor[0],
        wingColor[1],
        wingColor[2],
        wingColor[3] + 0.2,
      ]);
    }
    this._checkHealth();
  }

  _updateMovement() {
    const hdXform = this.head.getXform();
    const twXform = this.topWing.getXform();
    const bwXform = this.bottomWing.getXform();

    const newHeadPos = [];
    vec2.add(newHeadPos, hdXform.getPosition(), this.direction);
    hdXform.setPosition(newHeadPos[0], newHeadPos[1]);

    if (vec2.distance(twXform.getPosition(), hdXform.getPosition()) > 10) {
      twXform.setPosition(newHeadPos[0] + 10, newHeadPos[1] + 8);
    }
    if (vec2.distance(bwXform.getPosition(), hdXform.getPosition()) > 10) {
      bwXform.setPosition(newHeadPos[0] + 10, newHeadPos[1] - 8);
    }
  }

  _updateBound(bound, pos, width, height) {
    bound.top.getXform().setPosition(pos[0], pos[1] + height / 2);
    bound.bottom.getXform().setPosition(pos[0], pos[1] - height / 2);
    bound.left.getXform().setPosition(pos[0] - width / 2, pos[1]);
    bound.right.getXform().setPosition(pos[0] + width / 2, pos[1]);
  }

  _generateNewHead(xPos, yPos) {
    const newHead = new SpriteRenderable(this.spriteSrc);
    newHead.setColor([1, 1, 1, 0]);
    newHead.setElementPixelPositions(130, 310, 0, 180);
    newHead.getXform().setSize(7.5, 7.5);
    newHead.getXform().setPosition(xPos, yPos);

    return newHead;
  }

  _generateNewWings(xPos, yPos) {
    const newTW = new SpriteAnimateRenderable(this.spriteSrc);
    newTW.setColor([1, 1, 1, 0]);
    newTW.setSpriteSequence(518, 0, 204, 164, 5, 0);
    newTW.setAnimationSpeed(30);
    newTW.getXform().setSize(10, 8);
    newTW.getXform().setPosition(xPos + 10, yPos + 8);

    const newBW = new SpriteAnimateRenderable(this.spriteSrc);
    newBW.setColor([1, 1, 1, 0]);
    newBW.setSpriteSequence(348, 0, 204, 164, 5, 0);
    newBW.setAnimationSpeed(30);
    newBW.getXform().setSize(10, 8);
    newBW.getXform().setPosition(xPos + 10, yPos - 8);

    return [newTW, newBW];
  }

  _createBound(pos, width, height) {
    const top = new Renderable();
    const bottom = new Renderable();
    const left = new Renderable();
    const right = new Renderable();
    top.getXform().setPosition(pos[0], pos[1]);
    top.getXform().setSize(width, 0.5);
    bottom.getXform().setPosition(pos[0], pos[1]);
    bottom.getXform().setSize(width, 0.5);
    left.getXform().setPosition(pos[0], pos[1]);
    left.getXform().setSize(0.5, height);
    right.getXform().setPosition(pos[0], pos[1]);
    right.getXform().setSize(0.5, height);
    return { top, bottom, left, right };
  }

  _checkHealth() {
    const wingHealth = this.bottomWing.getColor()[3];
    if (wingHealth >= 1) {
      this.isDead = true;
      return;
    }

    const isOutOfBounds =
      this.minXPosition >= 200 ||
      this.maxXPosition <= 0 ||
      this.bigBoundMaxYPosition >= 150 ||
      this.minYPosition <= 0;

    if (isOutOfBounds) {
      this.isDead = true;
      return;
    }
  }

  _isColliding() {
    if (this.maxXPosition >= 200) {
      this._reflectDirection('right');
    }
    if (this.minXPosition <= 0) {
      this._reflectDirection('left');
    }
    if (this.bigBoundMaxYPosition >= 150) {
      this._reflectDirection('top');
    }
    if (this.minYPosition <= 0) {
      this._reflectDirection('bottom');
    }
  }

  _reflectDirection(location) {
    const normal = [];
    let newDir = [];
    if (location === 'right') {
      vec2.normalize(normal, [-(this.maxYPosition - this.minYPosition), 0]);
    }

    if (location === 'left') {
      vec2.normalize(normal, [this.maxYPosition - this.minYPosition, 0]);
    }

    if (location === 'top') {
      vec2.normalize(normal, [0, -(this.maxXPosition - this.minXPosition)]);
    }

    if (location === 'bottom') {
      vec2.normalize(normal, [0, this.maxXPosition - this.minXPosition]);
    }
    const eq1 = 2 * vec2.dot(this.direction, normal);
    const mult = [];
    vec2.mul(mult, [eq1, eq1], normal);
    vec2.sub(newDir, this.direction, mult);
    vec2.normalize(newDir, newDir);
    this.direction = newDir;
    vec2.multiply(this.direction, this.direction, [0.05, 0.05]);
  }

  _randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
