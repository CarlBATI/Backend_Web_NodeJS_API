const { UndefinedError, TypeError, NotIntegerError, InvalidNumberStringError, EmptyValueError, MaxValueError, MinValueError } = require('../utils/errors');

/** 
 * Validate a string value
 * 
 * @param {string} field - The name of the field to validate
 * @param {string} value - The value to validate
 * @param {number} [maxLength=null] - The maximum length of the string
 * @param {number} [minLength=null] - The minimum length of the string
 * 
 * @throws {UndefinedError|TypeError|MaxValueError|MinValueError} Will throw an error if the value does not meet the validation criteria
 * 
 * @example
 * validateString('title', 'My note', 100, 1);
 * // No error
 * 
 * @example
 * validateString('title', 'My note', 100, 10);
 * // MinValueError: title must be at least 10 characters long
 * 
 * @example
 * validateString('title', 'My note', 10, 1);
 * // MaxValueError: title must be at most 10 characters long
*/
function validateString(field, value, maxLength = null, minLength = null) {
    console.log(typeof value)
    if (value === undefined) {
        throw new UndefinedError(field);
    }
    if (typeof value !== 'string') {
        throw new TypeError(field, 'string');
    }
    if (maxLength !== null && value.length > maxLength) {
        throw new MaxValueError(field, maxLength);
    }
    if (minLength !== null && value.length < minLength) {
        throw new MinValueError(field, minLength);
    }
}

/**
 * Validate a valid ID
 * Can be a number or a numeric string.
 * 
 * @param {string|number} id - The ID to validate
 * 
 * @throws {UndefinedError|TypeError|NotIntegerError|InvalidNumberStringError|MinValueError} Will throw an error if the ID does not meet the validation criteria
 * 
 * @example
 * validateId(1);
 * // No error
 * 
 * @example
 * validateId('1');
 * // No error
 * 
 * @example
 * validateId(null);
 * // EmptyValueError: ID must not be empty
 */
function validateId(id) {
    if (id === undefined) {
        throw new UndefinedError('id');
    }
    if (typeof id !== 'string' && typeof id !== 'number') {
        throw new TypeError('id', ['string', 'number']);
    }
    if (typeof id === 'string') {
        if (id.trim() === '') {
            throw new EmptyValueError('id');
        }
        if (isNaN(Number(id))) {
            throw new InvalidNumberStringError('id');
        }
        if (!Number.isInteger(Number(id))) {
            throw new NotIntegerError('id');
        }
        if (Number(id) < 1) {
            throw new MinValueError('id', 1);
        }
    }
    if (typeof id === 'number') {
        if (!Number.isInteger(id)) {
            throw new NotIntegerError('id');
        }
        if (id < 1) {
            throw new MinValueError('id', 1);
        }
    }
}

module.exports = {
    validateString,
    validateId,
};