/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class ObjectShake {
    constructor(state, xDelta, yDelta, shakeFrequency, shakeDuration) {
        this.mOrgCenter = vec2.clone(state.getCenter());
        this.mShakeCenter = vec2.clone(this.mOrgCenter);
        this.mShake = new ShakePosition(xDelta, yDelta, shakeFrequency, shakeDuration);
        this.mShakeResult = null;
    }
    
    updateShakeState() {
        this.mShakeResult = this.mShake.getShakeResults();
        vec2.add(this.mShakeCenter, this.mOrgCenter, this.mShakeResult);
    }
    
    shakeDone() {
        return this.mShake.shakeDone();
    }
    
    getCenter() {
        return this.mShakeCenter;
    }
    
    getShakeResult() {
        return this.mShakeResult;
    }
    
    setRefCenter(c) {
        this.mOrgCenter[0] = c[0];
        this.mOrgCenter[1] = c[1];
    }
    
    setShakeCenter(c) {
        this.mShakeCenter[0] = c[0];
        this.mShakeCenter[1] = c[1];
    }
}
