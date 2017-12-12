/**
 * Scalar class
 * @param {Field} field
 * @param {number} value
 * @example
 * let moduloField = new ModuloField(n)
 * new Scalar(moduloField, 10);
 */
class Scalar {
    constructor(field, value) {
        this.field = field;
        this.value = field.init(value);
    }

    add(other) {

        // If other is a Scalar instance
        if(other instanceof Scalar) {
            if(this.field.constructor.name !== other.field.constructor.name)  throw 'OperationOnDifferentFields';
            return new Scalar(this.field, this.field.add(this.value, other.value));
        }

        // other should be a number
        return new Scalar(this.field, this.field.add(this.value, other));
    }


    additiveInv() {
        return new Scalar(this.field, this.field.additiveInv(this.value));
    }

    sub(other) {

        // If other is a Scalar instance
        if(other instanceof Scalar) {
            if(this.field.constructor.name !== other.field.constructor.name)  throw 'OperationOnDifferentFields';
            return new Scalar(this.field, this.field.sub(this.value, other.value));
        }

        // other should be a number
        return new Scalar(this.field, this.field.sub(this.value, other));
    }

    mul(other) {

        // If other is a Scalar instance
        if(other instanceof Scalar) {
            if(this.field.constructor.name !== other.field.constructor.name)  throw 'OperationOnDifferentFields';
            return new Scalar(this.field, this.field.mul(this.value, other.value));
        }

        // other should be a number
        return new Scalar(this.field, this.field.mul(this.value, other));
    }

    multiplicativeInv() {
        return new Scalar(this.field, this.field.multiplicativeInv(this.value));
    }

    div(other) {

        // If other is a Scalar instance
        if(other instanceof Scalar) {
            if(this.field.constructor.name !== other.field.constructor.name)  throw 'OperationOnDifferentFields';
            return new Scalar(this.field, this.field.div(this.value, other.value));
        }

        // other should be a number
        return new Scalar(this.field, this.field.div(this.value, other));
    }

    pow(exponent) {
        // If other is a Scalar instance
        if(exponent instanceof Scalar) {
            if(this.field.constructor.name !== exponent.field.constructor.name)  throw 'OperationOnDifferentFields';
            return new Scalar(this.field, this.field.pow(this.value, exponent.value));
        }

        // other should be a number
        return new Scalar(this.field, this.field.pow(this.value, exponent));
    }

    sqrt() {
        return new Scalar(this.field, this.field.sqrt(this.value));
    }

    eq(other) {
        // If other is a Scalar instance
        if(other instanceof Scalar) {
            if(this.field.constructor.name !== other.field.constructor.name)  throw 'OperationOnDifferentFields';
            return this.field.eq(this.value, other.value);
        }

        // other should be a number
        return this.field.eq(this.value, other);
    }

    isZero() {
        return this.field.isZero(this.value);
    }

    isOne() {
        return this.field.isOne(this.value);
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') module.exports = Scalar;