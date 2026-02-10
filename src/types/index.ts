/**
 * Type definitions for the BFHL API
 */

export type OperationType = 'fibonacci' | 'prime' | 'lcm' | 'hcf' | 'AI';

/**
 * Base request interface - must contain exactly one operation key
 */
export interface BFHLRequest {
    fibonacci?: number;
    prime?: number[];
    lcm?: number[];
    hcf?: number[];
    AI?: string;
}

/**
 * Standard success response structure
 */
export interface SuccessResponse<T = unknown> {
    is_success: true;
    official_email: string;
    data: T;
}

/**
 * Standard error response structure
 */
export interface ErrorResponse {
    is_success: false;
    official_email: string;
    error: string;
    message?: string;
}

/**
 * Health check response
 */
export interface HealthResponse {
    is_success: true;
    official_email: string;
}

/**
 * Custom error class for application errors
 */
export class AppError extends Error {
    constructor(
        public statusCode: number,
        public message: string,
        public isOperational = true
    ) {
        super(message);
        Object.setPrototypeOf(this, AppError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Validation error class
 */
export class ValidationError extends AppError {
    constructor(message: string) {
        super(400, message);
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}
