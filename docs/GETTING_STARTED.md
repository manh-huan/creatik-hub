# Getting Started

## Prerequisites

- Node.js 18+ 
- npm 8+
- Docker (optional)

## Quick Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd text-to-video-app
   ```

2. **Run setup script:**
   ```bash
   ./scripts/setup.sh
   ```

3. **Configure environment:**
   ```bash
   # Edit .env file with your API keys
   vim .env
   ```

4. **Start development:**
   ```bash
   npm run dev
   # OR with Docker
   npm run docker:dev
   ```

## API Keys Required

- RunwayML API Key
- Replicate API Token  
- OpenAI API Key
- AWS S3 credentials
- Stripe keys (for payments)

## Development Workflow

1. Frontend: http://localhost:3000
2. Backend API: http://localhost:3001  
3. Database: PostgreSQL on :5432
4. Redis: Redis on :6379

## Testing

```bash
npm run test          # All tests
npm run test:frontend # Frontend only
npm run test:backend  # Backend only
```

## Deployment

```bash
npm run deploy:staging     # Deploy to staging
npm run deploy:production  # Deploy to production
```
