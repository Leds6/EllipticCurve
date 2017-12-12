if (typeof require === 'function') Field = require('./Field');

class RealField extends Field {

    constructor() {
        super();
    }

    /* Implement init method */
    init(element) {
        return element;
    }

    /* Implement add method */
    add(element1, element2) {
        return element1 + element2;
    }

    /* Implement additiveInv method */
    additiveInv(element) {
       return  -element;
    }

    /* Implement sub method */
    sub(element1, element2) {
        return element1 - element2;
    }

    /* Implement mul method */
    mul(element1, element2) {
        return element1 * element2;
    }

    /* Implement multiplicativeInv method */
    multiplicativeInv(element) {
        return  1/element;
    }

    /* Implement div method */
    div(element1, element2) {
        return element1 / element2;
    }

    /* Implement pow method */
    pow(base, exponent) {
        return Math.pow(base, exponent);
    }

    /* Implement sqrt method */
    sqrt(element) {
        return Math.sqrt(element);
    }

    /* Implement eq method */
    eq(element1, element2) {
        return Math.abs(this.sub(element1, element2)) < RealField.EPSILON;
    }

    /* Implement isZero method */
    isZero(element) {
        return this.eq(element, 0);
    }

    /* Implement isOne method */
    isOne(element) {
        return this.eq(element, 1)
    }
}

RealField.EPSILON = 0.0001;

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') module.exports = RealField;