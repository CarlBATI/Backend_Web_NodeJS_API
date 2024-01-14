const { EmptyValueError, UndefinedError, TypeError, MinValueError, NotIntegerError, InvalidNumberStringError } = require('../../utils/errors');
const { validateString, validateId } = require('../../utils/validate');

/** 
 * ValidateId Test Suite
 * 
 * Test cases:
 * 1. should not throw an error when id is a valid number
 * 2. should not throw an error when id is a valid numeric string
 * 3. should throw UndefinedError when id is undefined
 * 4. should throw TypeError when id is null
 * 5. should throw a EmptyValueError when id is an empty string
 * Note: this test will fail if the database is not running
 *
 */
describe('validateId', () => {
    it ('should not throw an error when id is a valid number', () => {
        expect(() => validateId(1)).not.toThrow();
        expect(() => validateId(9999)).not.toThrow();
    });
    it ('should not throw an error when id is a valid numeric string', () => {
        expect(() => validateId('1')).not.toThrow();
        expect(() => validateId('9999')).not.toThrow();
    });
    it('should throw UndefinedError when id is undefined', () => {
        expect(() => validateId(undefined)).toThrow(UndefinedError);
    });
    it('should throw TypeError when id is null', () => {
        expect(() => validateId(null)).toThrow(TypeError);
    });
    it('should throw a MinValueError when id is less than 1', () => {
        expect(() => validateId(0)).toThrow(MinValueError);
        expect(() => validateId(-99)).toThrow(MinValueError);
        expect(() => validateId('0')).toThrow(MinValueError);
        expect(() => validateId('-99')).toThrow(MinValueError);
    });
    it('should throw TypeError when id is an invalid number string', () => {
        expect(() => validateId('123 not a number')).toThrow(InvalidNumberStringError);
    });
    it('should throw NotIntegerError when id is a floating point number', () => {
        expect(() => validateId(99.99)).toThrow(NotIntegerError);
        expect(() => validateId('99.99')).toThrow(NotIntegerError);
    });
});