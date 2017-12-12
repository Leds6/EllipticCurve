if (typeof require === 'function') {
    Scalar = require('./Scalar');
    Point = require('./Point');
    ModuloField = require('./fields/ModuloField');
}

/**
 * Elliptic Curve class
 * @param {number} a
 * @param {number} b
 * @example
 * let ec = new Elliptic(-7, 10);
 */
class EllipticCurve {

	constructor(a, b) {
		this.a = a;
		this.b = b;
	}

    /**
     * Return points on the curve for a given x
     * @param {number} x any number
     * @returns {undefined} array of points
	 * @example
     * ec.calc(4)
     */
	calc(x) {
        let y =  x.mul(this.a).add(x.mul(x.mul(x))).add(this.b);

		if(x.field instanceof ModuloField) {
            let points = [];
            for(let i = 0; i < y.field.m; i++) {
                if(y.eq(Math.pow(i, 2))) points.push(new Point(x, new Scalar(y.field, i)));
			}
			return points;
		}

		y = y.sqrt();

        if(!(y instanceof Scalar)) return [];


        if(y === y.additiveInv()) {
		    return [new Point(x, y)]
        } else {
            return [new Point(x, y), new Point(x, new Scalar(y.field, -y.value))];
        }
	}

    /**
     * Sums two points of the curve
     * @param {Point} p1 First point to add
     * @param {Point} p2 Second point to add
     * @returns {Point} Result point
     * @example
     * let p = new Point(3, 2);
     * let q = new Point(0, 1, 0); // Neutral
     * ec.sum(p, q); // x = 3, y = 2, z = 1
     */
	sum(p1, p2) {
        // Check if p1 is neutral
        if(p1.z.isZero()) { return p2;}

        // Check if p2 is neutral
        if(p2.z.isZero()) { return p1;}

		// If p1 and p2 are the same point
        //if(p1.eq(p2)) {

        //} else { // If p1 and p2 are not the same point
			let u = p1.x.mul(p2.z).sub(p2.x.mul(p1.z));
			let v = p1.y.mul(p2.z).sub(p2.y.mul(p1.z));
			let w = p1.x.mul(p2.y).sub(p2.x.mul(p1.y));
			let s = p1.x.mul(p2.z).add(p2.x.mul(p1.z));
			let t = p1.z.mul(p2.z);
			let z = t.mul(u.pow(3));
			if(z.isZero()) {
                return new Point(
                    (t.mul(u).mul(v.pow(2)).sub(s.mul(u.pow(3)))),
                    (s.mul(u.pow(2)).mul(v).sub(t.mul(u.pow(2)).mul(w)).sub(t.mul(v.pow(3)))),
                    z);
            } else {
                return new Point(
                    (t.mul(u).mul(v.pow(2)).sub(s.mul(u.pow(3)))).div(z),
                    (s.mul(u.pow(2)).mul(v).sub(t.mul(u.pow(2)).mul(w)).sub(t.mul(v.pow(3)))).div(z));
            }
		//}

		/*
		let m;

		// If same point
		if(p1.x === p2.x && p1.y === p2.y) {

		    // Infinity
			if(p1.y === 0) return new Point(0, 1, 0);


			if(this.m !== null) {
				m = (3 * Math.pow(p1.x, 2) + this.a ) * this.inverseOf( 2 * p1.y );
			} else {
                m = (3 * Math.pow(p1.x, 2) + this.a) / (2 * p1.y);
            }

		} else {
			
			if(this.m !== null)  {
				m = (p2.y - p1.y) * this.inverseOf(p2.x - p1.x);
			} else {
				m = (p2.y - p1.y) / (p2.x - p1.x);
			}
		}

        let x3 = Math.pow(m, 2) - p1.x - p2.x;
        let y3 = m * (p1.x - x3) - p1.y;

        if(this.m !== null) {
			x3 %= this.m;
			if(x3 < 0) x3 += this.m;
			y3 %= this.m;
			if(y3 < 0) y3 += this.m;
		}

		return new Point(x3, y3);

		*/
	}

    /**
     * Multiplies two points of the curve
     * @param {Point} p point to multiply
     * @param {Number} d value to multiply
     * @param {Enum} d value to multiply
     * @returns {Point} Result point
     * @example
     * let ellipticCurve = new Elliptic(-7, 10);
     * let point = new Point(1, 2);
     * ellipticCurve.mult(point, 2);
     * // Return  Point(x = -1, y = -4, z = 1)
     */
	mul(p, d, mode=null) {

	    switch (mode) {
            case 'repeatedSums':
                let result = p;
                while(d > 1) {
                    result = this.sum(result, p);
                    d--;
                }
                return result;
                break;

            case 'exp3':

                break;

            default:
                // exp2

                let n = p;
                let q = 0;
                let binaryString = d.toString(2);
                for (let i = 0; i < binaryString.length; i++) {
                    if(binaryString[binaryString.length - i - 1] === '1') {
                        if (q === 0) {
                            q =  n;
                        } else {
                            q = this.sum(q, n);
                        }
                    }
                    n = this.sum(n, n);
                }
                return q;
                break;
        }
	}

    /**
    * Divides an end point nP by the start point P in order to find n.
    * @param {Point} nP point to divide
    * @param {Point} P start point of the multiplication which found nP
    * @param {String} mode for the division
    * @returns {int} n number of multiplication to find nP
    * @example
    *
    */
    div(endPoint, startPoint, mode) {
        switch (mode) {
            default:
                let n = 1;
                while(mul(startPoint, n) != endPoint){
                    n++;
                }
                return n;
                break;
        }
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') module.exports = EllipticCurve;