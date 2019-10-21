
export default class CustomError extends Error {
    constructor({type, exception}) {
        super(exception.message || JSON.stringify(exception));

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, CustomError);
        }

        this.name = type || 'CustomError';
        this.occurredAt = new Date();
    }
};
