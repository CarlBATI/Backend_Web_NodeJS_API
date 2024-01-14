/**
 * Custom error classes
 * Basic Errors with custom names and messages
 */

/**
 * UndefinedError: thrown when a value is undefined
 * 
 * @param {string} field The name of the field that was undefined
 * 
 * @example
 * throw new UndefinedError('title');
 * // UndefinedError: Title is undefined
 */
class UndefinedError extends Error {
    constructor(field,) {
        super(field + ' is undefined');
        this.name = 'UndefinedError';
    }
};

/**
 * TypeError: thrown when a value is not of the expected type
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
class TypeError extends Error {
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
 * @param {string} field The name of the field that was invalid
 * 
 * @example
 * throw new NoIntegerError('id');
 * // NoIntegerError: Id must be an integer
 */
class NotIntegerError extends Error {
    constructor(field) {
        super(`${field.charAt(0).toUpperCase() + field.slice(1)} must be an integer`);
        this.name = 'NoIntegerError';
    }
};

/**
 * InvalidNumberStringError: thrown when a value is not a valid number string
 * 
 * @param {string} field The name of the field that was invalid
 * 
 * @example
 * throw new InvalidNumberStringError('id');
 * // InvalidNumberStringError: Id must be a valid number string
 */
class InvalidNumberStringError extends Error {
    constructor(field) {
        super(`Invalid number string for ${field}`);
        this.name = 'InvalidNumberStringError';
    }
};

/**
 * EmptyValueError: thrown when a required value is empty
 * Especially useful for fields with a minimum length of 1
 * 
 * @param {string} field The name of the field that was empty
 * 
 * @example
 * throw new EmptyValueError('title');
 * // EmptyValueError: Title must not be empty
 * 
 */
class EmptyValueError extends Error {
  constructor(field) {
    super(`${field.charAt(0).toUpperCase() + field.slice(1)} must not be empty`);
    this.name = 'EmptyValueError';
  }
};

/**
 * MaxValueError: thrown when a value is greater than a maximum value
 * 
 * @param {string} field The name of the field that was invalid
 * @param {number} maxValue The maximum value allowed for the field
 * 
 * @example
 * throw new MaxValueError('title', 100);
 * // MaxValueError: Title must not be greater than 100
 */
class MaxValueError extends Error {
  constructor(field, maxValue) {
    super(`${field.charAt(0).toUpperCase() + field.slice(1)} must not be greater than ${maxValue}`);
    this.name = 'ExceededValueError';
  }
};

/**
 * MinValueError: thrown when a value is less than a minimum value
 * 
 * @param {string} field The name of the field that was invalid
 * @param {number} minValue The minimum value allowed for the field
 * 
 * @example
 * throw new MinValueError('title', 100);
 * // MinValueError: Title must not be less than 100
 */
class MinValueError extends Error {
  constructor(field, minValue) {
    super(`${field.charAt(0).toUpperCase() + field.slice(1)} must not be less than ${minValue}`);
    this.name = 'MinValueError';
  }
} 

/**
 * NotFoundError: thrown when a database record is not found
 * 
 * @example
 * throw new NotFoundError();
 * // NotFoundError: record was not found
 */
class NotFoundError extends Error {
    constructor() {
        super(`record was not found`);
        this.name = 'NotFoundError';
    }
};

/** 
 * ServerError: thrown when there is a server error
 * 
 * @example
 * throw new ServerError();
 * // ServerError: Server error
 */
class ServerError extends Error {
    constructor() {
        super('Server error');
        this.name = 'ServerError';
    }
};

module.exports = {
    UndefinedError,
    TypeError,
    NotIntegerError,
    InvalidNumberStringError,
    EmptyValueError,
    MaxValueError,
    MinValueError,
    NotFoundError,
    ServerError,
};