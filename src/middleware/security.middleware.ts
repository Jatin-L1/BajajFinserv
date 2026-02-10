import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';
import { config } from '../config/config';
import { ErrorResponse } from '../types';

/**
 * Rate limiting middleware to prevent abuse
 */
export const rateLimiter = rateLimit({
    windowMs: config.rateLimitWindowMs,
    max: config.rateLimitMaxRequests,
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (_req: Request, res: Response) => {
        const errorResponse: ErrorResponse = {
            is_success: false,
            official_email: config.officialEmail,
            error: 'Too many requests from this IP, please try again later',
        };
        res.status(429).json(errorResponse);
    },
    // Skip rate limiting in test/development if needed
    skip: (_req: Request) => {
        // Could add IP whitelist here if needed
        return false;
    },
});

/**
 * Request sanitization middleware
 * Prevents common injection attacks
 */
export function sanitizeRequest(
    req: Request,
    _res: Response,
    next: Function
): void {
    // Remove any __proto__ or constructor properties to prevent prototype pollution
    if (req.body) {
        sanitizeObject(req.body);
    }

    if (req.query) {
        sanitizeObject(req.query);
    }

    if (req.params) {
        sanitizeObject(req.params);
    }

    next();
}

/**
 * Recursively sanitize an object
 */
function sanitizeObject(obj: any): void {
    if (obj && typeof obj === 'object') {
        delete obj.__proto__;
        delete obj.constructor;
        delete obj.prototype;

        Object.keys(obj).forEach((key) => {
            if (typeof obj[key] === 'object') {
                sanitizeObject(obj[key]);
            }
        });
    }
}
