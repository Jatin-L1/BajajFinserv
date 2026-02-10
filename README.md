# BFHL REST API

Production-grade REST API implementation for the BFHL assignment with Google Gemini AI integration.

## 🚀 Features

- ✅ **5 Operations**: Fibonacci, Prime, LCM, HCF, and AI-powered Q&A
- ✅ **Gemini AI Integration**: Intelligent single-word responses
- ✅ **Robust Validation**: Zod-based input validation with detailed error messages
- ✅ **Security**: Rate limiting, Helmet security headers, CORS, request sanitization
- ✅ **Error Handling**: Comprehensive error handling with proper HTTP status codes
- ✅ **TypeScript**: Type-safe implementation
- ✅ **Production Ready**: Optimized for Vercel deployment

## 📋 API Endpoints

### POST /bfhl

Main endpoint supporting 5 different operations. Each request must contain **exactly one** operation key.

**Operations:**
- `fibonacci` - Generate Fibonacci series
- `prime` - Filter prime numbers
- `lcm` - Calculate Least Common Multiple
- `hcf` - Calculate Highest Common Factor
- `AI` - AI-powered Q&A

### GET /health

Health check endpoint.

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **AI**: Google Gemini API
- **Validation**: Zod
- **Security**: Helmet, CORS, Express Rate Limit
- **Deployment**: Vercel (serverless)

## 📦 Installation

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Google Gemini API key ([Get it here](https://aistudio.google.com))
- Your Chitkara University email

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Bajaj
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy the example file
   cp .env.example .env
   ```
   
   Edit `.env` and add your credentials:
   ```env
   OFFICIAL_EMAIL=your.name@chitkara.edu.in
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Run locally**
   ```bash
   # Development mode with hot reload
   npm run dev
   
   # Production mode
   npm start
   ```

## 🧪 Testing

Test the API using curl or any API client:

```bash
# Test health endpoint
curl http://localhost:3000/health

# Test Fibonacci
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"fibonacci": 7}'

# Test Prime
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"prime": [2,4,7,9,11]}'

# Test LCM
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"lcm": [12,18,24]}'

# Test HCF
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"hcf": [24,36,60]}'

# Test AI
curl -X POST http://localhost:3000/bfhl \
  -H "Content-Type: application/json" \
  -d '{"AI": "What is the capital of France?"}'
```

## 🚢 Deployment to Vercel

### Step 1: Prepare GitHub Repository

1. Create a new GitHub repository
2. Initialize git and push code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: BFHL API implementation"
   git branch -M main
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. Go to [Vercel](https://vercel.com)
2. Sign in with GitHub
3. Click **"New Project"**
4. Import your repository
5. Configure environment variables:
   - `OFFICIAL_EMAIL` - Your Chitkara email
   - `GEMINI_API_KEY` - Your Gemini API key
6. Click **"Deploy"**

### Step 3: Test Deployed API

```bash
# Replace with your Vercel URL
curl https://your-app.vercel.app/health
```

## 📚 API Documentation

See [API.md](API.md) for detailed API documentation with all request/response examples.

## 🏗️ Project Structure

```
Bajaj/
├── src/
│   ├── config/
│   │   └── config.ts           # Configuration management
│   ├── controllers/
│   │   └── bfhl.controller.ts  # Request handlers
│   ├── middleware/
│   │   ├── error.middleware.ts    # Error handling
│   │   ├── security.middleware.ts # Security measures
│   │   └── validation.middleware.ts # Input validation
│   ├── routes/
│   │   └── bfhl.routes.ts      # Route definitions
│   ├── services/
│   │   ├── ai.service.ts       # Gemini AI integration
│   │   └── math.service.ts     # Math operations
│   ├── types/
│   │   └── index.ts            # TypeScript types
│   └── index.ts                # Application entry point
├── .env.example                # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json
├── vercel.json                 # Vercel configuration
└── README.md
```

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing configured
- **Request Sanitization**: Prevents injection attacks
- **Input Validation**: Comprehensive validation with Zod
- **Error Handling**: No sensitive data exposure

## ⚡ Performance Optimizations

- Efficient algorithms (Euclidean for GCD/HCF)
- Request size limits (10MB)
- Array size limits for operations
- AI retry logic with exponential backoff
- Optimized Fibonacci generation

## 🐛 Error Handling

The API returns consistent error responses:

```json
{
  "is_success": false,
  "official_email": "your.email@chitkara.edu.in",
  "error": "Error message here"
}
```

**HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

## 📝 License

ISC

## 👤 Author

Student at Chitkara University

---

**Note**: Remember to replace `your.name@chitkara.edu.in` with your actual Chitkara email and `your_gemini_api_key_here` with your Gemini API key in the `.env` file.
