/**
 * Field class
 * @param {number} value
 */
class Field {

    /**
     * Prepare an element to enter a field
     * @param {element} element element to prepare
     * @returns {element} The prepared element
     * @example Element 42 enters the field mod 40, it should now take the value  2.
     */
    init(element) {
        throw new Error('method init not implemented');
    }

    /**
     * Fields must implement the addition operation
     * @param {element} element1 first element to add
     * @param {element} element2 second element to add
     * @returns {element} Result of the addition
     */
    add(element1, element2) {
        throw new Error('method add not implemented');
    }

    /**
     * Fields must implement additiveInv
     * @param {element} element element to inverse
     * @returns {element} element inversed
     */
    additiveInv(element) {
        throw new Error('method additiveInv not implemented');
    }

    /**
     * Substraction operation
     * @param {element} element1 first element
     * @param {element} element2  element to add
     * @returns {element} Result of the substraction
     */
    sub(element1, element2) {
        throw new Error('method sub not implemented');
    }

    /**
     * Fields must implement the multiplication operation
     * @param {element} element1 first element to multiply
     * @param {element} element2 second element to multiply
     * @returns {element} Result of the multiplication
     */
    mul(element1, element2) {
        throw new Error('method mul not implemented');
    }

    /**
     * Fields must implement multiplicativeInv
     * @param {element} element element to inverse
     * @returns {element} element inversed
     */
    multiplicativeInv(element) {
        throw new Error('method multiplicativeInv not implemented');
    }

    /**
     * Division operation
     * @param {element} element1 quotient
     * @param {element} element2 dividend
     * @returns {element} Result of the division
     */
    div(element1, element2) {
        throw new Error('method div not implemented');
    }

    /**
     * Pow operation
     * @param {element} base base
     * @param {element} exponent exponent
     * @returns {element} Result of the pow
     */
    pow(base, exponent) {
        throw new Error('method pow not implemented');
    }

    /**
     * Square root operation
     * @param {element} element base
     * @returns {element} Result of the pow
     */
    sqrt(element) {
        throw new Error('method sqrt not implemented');
    }

    /**
     * Fields must implement equality
     * @param {element} element1 first element to compare
     * @param {element} element2 second element to compare
     * @returns {element} Result of the comparison
     */
    eq(element1, element2) {
        throw new Error('method eq not implemented');
    }


}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') module.exports = Field;
