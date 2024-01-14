// Description: Defines custom query errors

/**
 * Base class for query errors
 *
 * @extends Error
 * 
 * @example
 * throw new QueryError('Invalid query');
 * // QueryError: Invalid query
 * 
 */
class QueryError extends Error {
    constructor(message) {
        super(message);
        this.name = 'QueryError';
    }
};

/**
 * NotFoundError: thrown when a database record is not found
 * 
 * @extends QueryError
 * 
 * @example
 * throw new NotFoundError();
 * // NotFoundError: record was not found
 */
class NotFoundError extends QueryError {
    constructor() {
        super(`record was not found`);
        this.name = 'NotFoundError';
    }
};

/**
 * DuplicateEntryError: thrown when a database record is not found
 * 
 * @extends QueryError
 * 
 * @example
 * throw new DuplicateEntryError();
 * // DuplicateEntryError: duplicate entry
 */
class DuplicateEntryError extends QueryError {
    constructor() {
        super(`duplicate entry`);
        this.name = 'DuplicateEntryError';
    }
}

module.exports = {
    QueryError,
    NotFoundError,
    DuplicateEntryError,
}