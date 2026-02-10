import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../types';


const fibonacciSchema = z.object({
    fibonacci: z
        .number({
            required_error: 'fibonacci must be a number',
            invalid_type_error: 'fibonacci must be a number',
        })
        .int('fibonacci must be an integer')
        .nonnegative('fibonacci must be non-negative')
        .max(1000, 'fibonacci must not exceed 1000 for performance reasons'),
});

// Schema for Prime operation
const primeSchema = z.object({
    prime: z
        .array(
            z
                .number({
                    required_error: 'prime array must contain numbers',
                    invalid_type_error: 'prime array must contain numbers',
                })
                .int('All elements in prime array must be integers'),
            {
                required_error: 'prime must be an array',
                invalid_type_error: 'prime must be an array',
            }
        )
        .min(1, 'prime array must not be empty')
        .max(1000, 'prime array must not exceed 1000 elements'),
});

// Schema for LCM operation
const lcmSchema = z.object({
    lcm: z
        .array(
            z
                .number({
                    required_error: 'lcm array must contain numbers',
                    invalid_type_error: 'lcm array must contain numbers',
                })
                .int('All elements in lcm array must be integers')
                .positive('All elements in lcm array must be positive'),
            {
                required_error: 'lcm must be an array',
                invalid_type_error: 'lcm must be an array',
            }
        )
        .min(1, 'lcm array must not be empty')
        .max(100, 'lcm array must not exceed 100 elements'),
});

// Schema for HCF operation
const hcfSchema = z.object({
    hcf: z
        .array(
            z
                .number({
                    required_error: 'hcf array must contain numbers',
                    invalid_type_error: 'hcf array must contain numbers',
                })
                .int('All elements in hcf array must be integers')
                .positive('All elements in hcf array must be positive'),
            {
                required_error: 'hcf must be an array',
                invalid_type_error: 'hcf must be an array',
            }
        )
        .min(1, 'hcf array must not be empty')
        .max(100, 'hcf array must not exceed 100 elements'),
});

// Schema for AI operation
const aiSchema = z.object({
    AI: z
        .string({
            required_error: 'AI must be a string',
            invalid_type_error: 'AI must be a string',
        })
        .min(1, 'AI question cannot be empty')
        .max(500, 'AI question must not exceed 500 characters'),
});

/**
 * Validates that request contains exactly one operation key
 */
export function validateBFHLRequest(
    req: Request,
    _res: Response,
    next: NextFunction
): void {
    try {
        const body = req.body;

        // Check if body exists
        if (!body || typeof body !== 'object') {
            throw new ValidationError('Request body must be a valid JSON object');
        }

        // Get all possible operation keys
        const operationKeys = ['fibonacci', 'prime', 'lcm', 'hcf', 'AI'];
        const presentKeys = operationKeys.filter((key) => key in body);

        // Validate exactly one operation key is present
        if (presentKeys.length === 0) {
            throw new ValidationError(
                `Request must contain exactly one of: ${operationKeys.join(', ')}`
            );
        }

        if (presentKeys.length > 1) {
            throw new ValidationError(
                `Request must contain exactly one operation key. Found: ${presentKeys.join(', ')}`
            );
        }

        const operationKey = presentKeys[0];

        // Validate the specific operation
        try {
            switch (operationKey) {
                case 'fibonacci':
                    fibonacciSchema.parse(body);
                    break;
                case 'prime':
                    primeSchema.parse(body);
                    break;
                case 'lcm':
                    lcmSchema.parse(body);
                    break;
                case 'hcf':
                    hcfSchema.parse(body);
                    break;
                case 'AI':
                    aiSchema.parse(body);
                    break;
                default:
                    throw new ValidationError(`Unknown operation: ${operationKey}`);
            }
        } catch (error: unknown) {
            if (error instanceof z.ZodError) {
                // Extract the first error message for clarity
                const firstError = error.errors[0];
                throw new ValidationError(firstError.message);
            }
            throw error;
        }

        // Attach validated operation to request for use in controller
        (req as any).operation = operationKey;
        next();
    } catch (error) {
        next(error);
    }
}
