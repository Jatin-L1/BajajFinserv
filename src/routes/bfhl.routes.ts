import { Router } from 'express';
import { handleBFHL, handleHealth } from '../controllers/bfhl.controller';
import { validateBFHLRequest } from '../middleware/validation.middleware';

const router = Router();

/**
 * POST /bfhl
 * Main endpoint for fibonacci, prime, lcm, hcf, and AI operations
 */
router.post('/bfhl', validateBFHLRequest, handleBFHL);

/**
 * GET /health
 * Health check endpoint
 */
router.get('/health', handleHealth);

export default router;
