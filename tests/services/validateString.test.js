const { UndefinedError, TypeError, MaxValueError, MinValueError  } = require('../../utils/errors/validation.errors');
const { validateString } = require('../../utils/validate');

describe('validateString', () => {
    it('should not throw any error if value is valid', () => {
        expect(() => validateString('field', 'valid', 10, 5)).not.toThrow();
    });
    it('should throw UndefinedError if value is undefined', () => {
        expect(() => validateString('field', undefined, 1)).toThrow(UndefinedError);
    });

    it('should throw TypeError if value is not a string', () => {
        expect(() => validateString('field', 123, 10)).toThrow(TypeError);
    });

    it('should throw MaxValueError if value length is greater than maxLength', () => {
        expect(() => validateString('field', 'long string', 5, 1)).toThrow(MaxValueError);
    });

    it('should throw MinValueError if hasMinLength is true and value length is less than minLength', () => {
        expect(() => validateString('field', 'short', 100, 10, true)).toThrow(MinValueError);
    });
});