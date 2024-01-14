// Description: Defines custom validation errors

/** 
 * Base class for validation errors
 * 
 * @extends Error
 * 
 * @example
 * throw new ValidationError('Invalid value');
 * // ValidationError: Invalid value
 */ 
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * UndefinedError: thrown when a value is undefined
 * 
 * @extends ValidationError
 * 
 * @param {string} field The name of the field that was undefined
 * 
 * @example
 * throw new UndefinedError('title');
 * // UndefinedError: Title is undefined
 */
class UndefinedError extends ValidationError {
    constructor(field,) {
        super(field + ' is undefined');
        this.name = 'UndefinedError';
    }
};

/**
 * TypeError: thrown when a value is not of the expected type
 * 
 * @extends ValidationError
 * 
 * @param {string} field The name of the field that was invalid
 * @param {string} type The expected type of the field
 * @param {string[]} type An array of expected types for the field
 * @param {none} type If no type is provided, the error message will be generic
 *
 * @example
 * throw new TypeError('title', 'string');
 * // TypeError: Title must be of type string
 * 
 * @example
 * throw new TypeError('title', ['string', 'number']);
 * // TypeError: Title must be of one types: string, number
 * 
 * @example
 * throw new TypeError('title');
 * // TypeError: Invalid type for title
 */ 
class TypeError extends ValidationError {
  constructor(field, type) {
    let errorMessage;
    
    if (typeof type === 'string') {
      errorMessage = `${field.charAt(0).toUpperCase() + field.slice(1)} must be of type ${type}`;
    } else if (Array.isArray(type)) {
      errorMessage = `${field.charAt(0).toUpperCase() + field.slice(1)} must be of one types: ${type.join(', ')}`;
    } else {
      errorMessage = `Invalid type for ${field.charAt(0).toUpperCase() + field.slice(1)}`;
    }

    super(errorMessage);
    this.name = 'TypeError';
  }
};

/**
 * NoIntegerError: thrown when a value is not an integer
 * 
 * @extends ValidationError
 * 
 * @param {string} field The name of the field that was invalid
 * 
 * @example
 * throw new NoIntegerError('id');
 * // NoIntegerError: Id must be an integer
 */
class NotIntegerError extends ValidationError {
    constructor(field) {
        super(`${field.charAt(0).toUpperCase() + field.slice(1)} must be an integer`);
        this.name = 'NoIntegerError';
    }
};

/**
 * InvalidNumberStringError: thrown when a value is not a valid number string
 * 
 * @extends ValidationError
 * 
 * @param {string} field The name of the field that was invalid
 * 
 * @example
 * throw new InvalidNumberStringError('id');
 * // InvalidNumberStringError: Id must be a valid number string
 */
class InvalidNumberStringError extends ValidationError {
    constructor(field) {
        super(`Invalid number string for ${field}`);
        this.name = 'InvalidNumberStringError';
    }
};

/**
 * EmptyValueError: thrown when a required value is empty
 * Especially useful for fields with a minimum length of 1
 * 
 * @extends ValidationError
 * 
 * @param {string} field The name of the field that was empty
 * 
 * @example
 * throw new EmptyValueError('title');
 * // EmptyValueError: Title must not be empty
 * 
 */
class EmptyValueError extends ValidationError {
  constructor(field) {
    super(`${field.charAt(0).toUpperCase() + field.slice(1)} must not be empty`);
    this.name = 'EmptyValueError';
  }
};

/**
 * MaxValueError: thrown when a value is greater than a maximum value
 * 
 * @extends ValidationError
 * 
 * @param {string} field The name of the field that was invalid
 * @param {number} maxValue The maximum value allowed for the field
 * 
 * @example
 * throw new MaxValueError('title', 100);
 * // MaxValueError: Title must not be greater than 100
 */
class MaxValueError extends ValidationError {
  constructor(field, maxValue) {
    super(`${field.charAt(0).toUpperCase() + field.slice(1)} must not be greater than ${maxValue}`);
    this.name = 'ExceededValueError';
  }
};

/**
 * MinValueError: thrown when a value is less than a minimum value
 * 
 * @extends ValidationError
 * 
 * @param {string} field The name of the field that was invalid
 * @param {number} minValue The minimum value allowed for the field
 * 
 * @example
 * throw new MinValueError('title', 100);
 * // MinValueError: Title must not be less than 100
 */
class MinValueError extends ValidationError {
  constructor(field, minValue) {
    super(`${field.charAt(0).toUpperCase() + field.slice(1)} must not be less than ${minValue}`);
    this.name = 'MinValueError';
  }
} 

module.exports = {
    ValidationError,
    UndefinedError,
    TypeError,
    NotIntegerError,
    InvalidNumberStringError,
    EmptyValueError,
    MaxValueError,
    MinValueError
};