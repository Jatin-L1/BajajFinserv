import { config } from '../config/config';
import { AppError } from '../types';

interface HuggingFaceResponse {
    generated_text?: string;
}

class AIService {
    private apiUrl: string;
    private apiKey: string;

    constructor() {
        this.apiUrl = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';
        this.apiKey = config.huggingFaceApiKey;
    }

    async queryAI(question: string): Promise<string> {
        try {
            if (!question || typeof question !== 'string') {
                throw new AppError(400, 'Question must be a non-empty string');
            }

            if (question.trim().length === 0) {
                throw new AppError(400, 'Question cannot be empty');
            }

            const prompt = `Answer this question with only one word or a short phrase (maximum 3 words). Do not explain or elaborate.\n\nQuestion: ${question.trim()}\nAnswer:`;

            const result = await this.callWithRetry(prompt);

            let answer = result.trim();
            answer = answer.replace(/[.,!?;:]/g, '').trim();

            const words = answer.split(/\s+/);

            if (words.length === 1) {
                return words[0];
            } else if (words.length <= 3) {
                return words.slice(0, 3).join(' ');
            } else {
                return words[0];
            }

        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            if (error instanceof Error) {
                console.error('Hugging Face API Error:', error.message);

                if (error.message.includes('401') || error.message.includes('403')) {
                    throw new AppError(500, 'Invalid Hugging Face API key');
                }

                if (error.message.includes('503')) {
                    throw new AppError(503, 'AI model is loading, please try again in a few seconds');
                }

                throw new AppError(500, 'AI service temporarily unavailable');
            }

            throw new AppError(500, 'Failed to process AI request');
        }
    }

    private async callWithRetry(
        prompt: string,
        maxRetries: number = 3
    ): Promise<string> {
        let lastError: Error | null = null;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const response = await fetch(this.apiUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        inputs: prompt,
                        parameters: {
                            max_new_tokens: 10,
                            temperature: 0.1,
                            return_full_text: false,
                        },
                    }),
                });

                if (!response.ok) {
                    throw new Error(`API returned ${response.status}`);
                }

                const data: unknown = await response.json();

                // Handle array response
                if (Array.isArray(data) && data.length > 0) {
                    const firstItem = data[0] as HuggingFaceResponse;
                    if (firstItem.generated_text) {
                        return firstItem.generated_text;
                    }
                }

                // Handle object response
                if (typeof data === 'object' && data !== null) {
                    const objData = data as HuggingFaceResponse;
                    if (objData.generated_text) {
                        return objData.generated_text;
                    }
                }

                // Handle string response
                if (typeof data === 'string') {
                    return data;
                }

                throw new Error('Unexpected API response format');

            } catch (error) {
                lastError = error as Error;

                if (error instanceof Error && (error.message.includes('401') || error.message.includes('403'))) {
                    throw error;
                }

                if (attempt < maxRetries) {
                    const delay = error instanceof Error && error.message.includes('503')
                        ? 10000
                        : Math.min(1000 * Math.pow(2, attempt - 1), 5000);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }

        throw lastError || new Error('Failed to call AI service');
    }

    async healthCheck(): Promise<boolean> {
        try {
            const result = await this.callWithRetry('Say OK');
            return !!result;
        } catch {
            return false;
        }
    }
}

export const aiService = new AIService();
