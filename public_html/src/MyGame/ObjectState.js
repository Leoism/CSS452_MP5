/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

class ObjectState {
    constructor(center, width) {
        this.kCycles = 300;     // number of cycles to complete the transition
        this.kRate = 0.1;  // rate of change for each cycle
        this.mCenter = new InterpolateVec2(center, this.kCycles, this.kRate);
        this.mWidth = new Interpolate(width, this.kCycles, this.kRate);
    }
    
    getCenter() { return this.mCenter.getValue(); }
    setCenter(c) { this.mCenter.setFinalValue(c); }
    
    getWidth() { return this.mWidth.getValue(); }
    setWidth(w) { this.mWidth.setFinalValue(w); }
    
    setCycle(c) { 
        this.kCycles = c; 
        this.mCenter = new InterpolateVec2(this.getCenter(), this.kCycles, this.kRate);
        this.mWidth = new Interpolate(this.getWidth(), this.kCycles, this.kRate);
    }
    setRate(r) { 
        this.kRate = r; 
        this.mCenter = new InterpolateVec2(this.getCenter(), this.kCycles, this.kRate);
        this.mWidth = new Interpolate(this.getWidth(), this.kCycles, this.kRate);
    }
    
    updateObjectState() {
        this.mCenter.updateInterpolation();
        this.mWidth.updateInterpolation();
    }
    
    configInterpolation(stiffness, duration) {
        this.mCenter.configInterpolation(stiffness, duration);
        this.mWidth.configInterpolation(stiffness, duration);
    }
}