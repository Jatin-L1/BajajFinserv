import { Request, Response, NextFunction } from 'express';
import { config } from '../config/config';
import {
    generateFibonacci,
    filterPrimes,
    calculateLCM,
    calculateHCF,
} from '../services/math.service';
import { aiService } from '../services/ai.service';
import { SuccessResponse, HealthResponse, AppError } from '../types';
import { asyncHandler } from '../middleware/error.middleware';

/**
 * Controller for BFHL operations
 */

/**
 * POST /bfhl - Main endpoint for all operations
 */
export const handleBFHL = asyncHandler(
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const body = req.body;
        const operation = (req as any).operation;

        let data: any;

        try {
            switch (operation) {
                case 'fibonacci': {
                    const n = body.fibonacci;
                    data = generateFibonacci(n);
                    break;
                }

                case 'prime': {
                    const numbers = body.prime;
                    data = filterPrimes(numbers);
                    break;
                }

                case 'lcm': {
                    const numbers = body.lcm;

                    // Additional validation for LCM
                    if (numbers.some((n: number) => n === 0)) {
                        throw new AppError(400, 'LCM cannot be calculated with zero values');
                    }

                    data = calculateLCM(numbers);
                    break;
                }

                case 'hcf': {
                    const numbers = body.hcf;

                    // Additional validation for HCF
                    if (numbers.some((n: number) => n === 0)) {
                        throw new AppError(400, 'HCF cannot be calculated with zero values');
                    }

                    data = calculateHCF(numbers);
                    break;
                }

                case 'AI': {
                    const question = body.AI;
                    data = await aiService.queryAI(question);
                    break;
                }

                default:
                    throw new AppError(400, `Unknown operation: ${operation}`);
            }

            // Build success response
            const response: SuccessResponse = {
                is_success: true,
                official_email: config.officialEmail,
                data,
            };

            res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }
);

/**
 * GET /health - Health check endpoint
 */
export const handleHealth = asyncHandler(
    async (_req: Request, res: Response): Promise<void> => {
        const response: HealthResponse = {
            is_success: true,
            official_email: config.officialEmail,
        };

        res.status(200).json(response);
    }
);
