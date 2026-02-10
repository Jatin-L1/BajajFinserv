import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config/config';
import bfhlRoutes from './routes/bfhl.routes';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { rateLimiter, sanitizeRequest } from './middleware/security.middleware';

/**
 * Initialize Express application
 */
const app: Application = express();

/**
 * Security Middleware
 */
// Helmet - sets various HTTP headers for security
app.use(helmet());

// CORS - enable cross-origin requests
app.use(
    cors({
        origin: '*', // Allow all origins for public API
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: false,
    })
);

// Rate limiting
app.use(rateLimiter);

/**
 * Body Parsing Middleware
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * Request Sanitization
 */
app.use(sanitizeRequest);

/**
 * Request Logging (Development)
 */
if (config.isDevelopment()) {
    app.use((req, _res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
}

/**
 * API Routes
 */
app.use('/', bfhlRoutes);

/**
 * Root endpoint
 */
app.get('/', (_req, res) => {
    res.json({
        message: 'BFHL API is running',
        endpoints: {
            health: 'GET /health',
            bfhl: 'POST /bfhl',
        },
        version: '1.0.0',
    });
});

/**
 * 404 Handler - must be after all routes
 */
app.use(notFoundHandler);

/**
 * Global Error Handler - must be last
 */
app.use(errorHandler);

/**
 * Start Server
 */
const PORT = config.port;

// Only start server if not in serverless environment
if (process.env.VERCEL !== '1') {
    app.listen(PORT, () => {
        console.log(`
╔════════════════════════════════════════╗
║   BFHL API Server                      ║
╟────────────────────────────────────────╢
║   Port:        ${PORT.toString().padEnd(24)}║
║   Environment: ${config.nodeEnv.padEnd(24)}║
║   Email:       ${config.officialEmail.padEnd(24)}║
╚════════════════════════════════════════╝

Server is running at http://localhost:${PORT}
    `);
    });
}

/**
 * Export app for Vercel serverless deployment
 */
export default app;
