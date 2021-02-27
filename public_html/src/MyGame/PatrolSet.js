class PatrolSet {
  constructor(spriteSrc) {
    this.spriteSrc = spriteSrc;
    this.makeNewPatrol = false;
    this.makerCount = 0;
    this.vectorDirections = {};
    this.patrols = [];
    this.autoSpawn = false;
  }
  
  getPatrols() {
      return this.patrols;
  }
  
  getIsAutoSpawn() {
      return this.autoSpawn;
  }

  initialize() {
    this._generateNewPatrol(100, 75);
  }

  update() {
    for (const patrol of this.patrols) {
      patrol.update();
    }
    this._determineMake();
    this._userInput();
    this._checkPatrolHealth();
  }

  draw(cam) {
    for (const patrol of this.patrols) {
      patrol.draw(cam);
    }
  }

  _userInput() {
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.P)) {
      this.autoSpawn = !this.autoSpawn;
      this.makerCount = 0;
    }

    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.C)) {
      this._generateNewPatrol();
    }

    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.B)) {
      this.patrols.forEach((patrol) => {
        patrol.drawBounds = !patrol.drawBounds;
      });
    }

    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.J)) {
      this.patrols.forEach((patrol) => {
        patrol.hitByDyePack('head');
      });
    }
  }

  _checkPatrolHealth() {
    for (let i = 0; i < this.patrols.length; i++) {
      if (this.patrols[i].isDead) {
        this.patrols.splice(i, 1);
        i--; // i is outdated since length got shorter by one
      }
    }
  }

  _generateNewPatrol(xPos, yPos) {
    if (xPos == undefined || yPos == undefined) {
      yPos =
        Math.random() > 0.5
          ? this._randomNumber(112.5, 150)
          : this._randomNumber(0, 37.5);

      xPos = this._randomNumber(100, 200);
    }
    this.patrols.push(new Patrol(xPos, yPos));
  }

  _determineMake() {
    if (!this.autoSpawn) return;
    this.makerCount++;
    if (this.makeNewPatrol) {
      this.makeNewPatrol = false;
      this._generateNewPatrol();
    }
    if (this.makerCount > this._randomNumber(120, 180)) {
      this.makeNewPatrol = true;
      this.makerCount = 0;
    }
  }

  _randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
