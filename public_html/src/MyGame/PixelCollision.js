/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// Check if two Objects are collided
window.pixelCollision = function (obj1Ren, obj1BBox, obj2Ren, obj2BBox, wcTouchPos) {
    // only continue if both objects have getColorArray defined 
    // if defined, should have other texture intersection support!
    var pixelTouch = false;
    var myRen = obj1Ren;
    var otherRen = obj2Ren;

    if ((typeof myRen.pixelTouches === "function") && (typeof otherRen.pixelTouches === "function")) {
        if ((myRen.getXform().getRotationInRad() === 0) && (otherRen.getXform().getRotationInRad() === 0)) {
            // no rotation, we can use bbox ...
            var otherBbox = obj2BBox;
            if (otherBbox.intersectsBound(obj1BBox)) {
                myRen.setColorArray();
                otherRen.setColorArray();
                pixelTouch = myRen.pixelTouches(otherRen, wcTouchPos);
            }
        } else {
            // One or both are rotated, compute an encompassing circle
            // by using the hypotenuse as radius
            var mySize = myRen.getXform().getSize();
            var otherSize = otherRen.getXform().getSize();
            var myR = Math.sqrt(0.5*mySize[0]*0.5*mySize[0] + 0.5*mySize[1]*0.5*mySize[1]);
            var otherR = Math.sqrt(0.5*otherSize[0]*0.5*otherSize[0] + 0.5*otherSize[1]*0.5*otherSize[1]);
            var d = [];
            vec2.sub(d, myRen.getXform().getPosition(), otherRen.getXform().getPosition());
            if (vec2.length(d) < (myR + otherR)) {
                myRen.setColorArray();
                otherRen.setColorArray();
                pixelTouch = myRen.pixelTouches(otherRen, wcTouchPos);
            }
        }
    }
    return pixelTouch;
};


