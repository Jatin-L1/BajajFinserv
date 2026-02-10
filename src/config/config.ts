import dotenv from 'dotenv';
import { AppError } from '../types';

dotenv.config();

class Config {
    public readonly port: number;
    public readonly nodeEnv: string;
    public readonly officialEmail: string;
    public readonly geminiApiKey: string;
    public readonly huggingFaceApiKey: string;
    public readonly rateLimitWindowMs: number;
    public readonly rateLimitMaxRequests: number;

    constructor() {

        this.officialEmail = this.getEnvVar('OFFICIAL_EMAIL', 'student@chitkara.edu.in');
        this.geminiApiKey = this.getEnvVar('GEMINI_API_KEY');
        this.huggingFaceApiKey = this.getEnvVar('HUGGINGFACE_API_KEY');


        this.port = parseInt(this.getEnvVar('PORT', '3000'), 10);
        this.nodeEnv = this.getEnvVar('NODE_ENV', 'development');
        this.rateLimitWindowMs = parseInt(
            this.getEnvVar('RATE_LIMIT_WINDOW_MS', '900000'),
            10
        );
        this.rateLimitMaxRequests = parseInt(
            this.getEnvVar('RATE_LIMIT_MAX_REQUESTS', '100'),
            10
        );

        this.validateConfig();
    }


    private getEnvVar(key: string, defaultValue?: string): string {
        const value = process.env[key];

        if (!value && !defaultValue) {
            throw new AppError(
                500,
                `Missing required environment variable: ${key}`
            );
        }

        return value || defaultValue!;
    }


    private validateConfig(): void {
        if (this.port < 1 || this.port > 65535) {
            throw new AppError(500, 'PORT must be between 1 and 65535');
        }


        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(this.officialEmail)) {
            console.warn(
                `Warning: OFFICIAL_EMAIL (${this.officialEmail}) doesn't appear to be a valid email format`
            );
        }
    }


    public isProduction(): boolean {
        return this.nodeEnv === 'production';
    }


    public isDevelopment(): boolean {
        return this.nodeEnv === 'development';
    }
}

export const config = new Config();
