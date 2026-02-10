import { Request, Response, NextFunction } from 'express';
import { AppError, ErrorResponse } from '../types';
import { config } from '../config/config';
import { z } from 'zod';

/**
 * Global error handling middleware
 * Catches all errors and formats them consistently
 */
export function errorHandler(
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    // Log error in development
    if (config.isDevelopment()) {
        console.error('Error:', err);
    }

    // Default error response
    let statusCode = 500;
    let message = 'Internal server error';
    let isOperational = false;

    // Handle known error types
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
        isOperational = err.isOperational;
    } else if (err instanceof z.ZodError) {
        // Zod validation errors
        statusCode = 400;
        message = err.errors[0]?.message || 'Validation error';
        isOperational = true;
    } else if (err instanceof SyntaxError && 'body' in err) {
        // JSON parsing errors
        statusCode = 400;
        message = 'Invalid JSON in request body';
        isOperational = true;
    } else if (err.message) {
        // Generic errors with messages
        message = err.message;
    }

    // Build error response
    const errorResponse: ErrorResponse = {
        is_success: false,
        official_email: config.officialEmail,
        error: message,
    };

    // Add stack trace in development for debugging
    if (config.isDevelopment() && !isOperational) {
        errorResponse.message = err.stack;
    }

    // Send error response
    res.status(statusCode).json(errorResponse);

    // Log critical errors
    if (!isOperational) {
        console.error('CRITICAL ERROR:', {
            message: err.message,
            stack: err.stack,
            statusCode,
        });
    }
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(
    req: Request,
    _res: Response,
    next: NextFunction
): void {
    const error = new AppError(
        404,
        `Route not found: ${req.method} ${req.path}`
    );
    next(error);
}

/**
 * Async error wrapper to catch errors in async route handlers
 */
export function asyncHandler(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
    return (req: Request, _res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, _res, next)).catch(next);
    };
}
