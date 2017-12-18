if (typeof require === 'function') {
    Scalar = require('./Scalar');
}

/**
 * Represent a 3 dimensions point
 * @param {Scalar} x
 * @param {Scalar} y
 * @param {Scalar} z
 * @example
 * let mod97Field = new ModuloField(97);
 * let point = new Point(new Scalar(mod97Field, 17), new Scalar(mod97Field, 10));
 */
class Point {
	constructor(x, y, z = null) {

        if(z === null) z = new Scalar(x.field, 1);

        // Check if x, y, z are on the same Field
	    if(x.field !== y.field || (z!== null && y.field !== z.field)) {
            throw 'PointWithCoordOnDifferentFields';
        }

        if(!z.isZero()) {
	        x = x.div(z)
	        y = y.div(z)
            z = new Scalar(x.field, 1);
        }

        this.x = x;
        this.y = y;
        this.z = z;
    }

    /**
     * Check if two points are equal
     * @param {Point} p Point to compare with
     * @returns {Boolean} If the points are equal
     * @example
     * let mod5Field = new ModuloField(5);
     * let p1 = new Point(new Scalar(mod5Field, 2), new Scalar(mod5Field, 2));
     * let p2 = new Point(new Scalar(mod5Field, 7), new Scalar(mod5Field, 7));
     * p2.eq(p1) // True
     */
	eq(p) {
        return (this.x.mul(p.y).sub(p.x.mul(this.y)).isZero() &&
            this.y.mul(p.z).sub(p.y.mul(this.z)).isZero() &&
            this.x.mul(p.z).sub(p.x.mul(this.z)).isZero());
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') module.exports = Point;