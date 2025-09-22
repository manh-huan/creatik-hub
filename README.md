# Text-to-Video App

AI-powered text-to-video generation platform built with Next.js, Node.js, and external AI APIs.

## 🚀 Quick Start

1. **Clone and setup:**
   ```bash
   git clone <your-repo>
   cd text-to-video-app
   ./scripts/setup.sh
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Start development servers:**
   ```bash
   npm run dev
   ```

4. **Or use Docker:**
   ```bash
   npm run docker:dev
   ```

## 📁 Project Structure

- `frontend/` - Next.js React application
- `backend/` - Node.js API server
- `shared/` - Shared types and utilities
- `infrastructure/` - Docker, Terraform, K8s configs
- `docs/` - Documentation

## 🔧 Tech Stack

- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, PostgreSQL, Redis
- **AI APIs:** RunwayML, Replicate, OpenAI, Stability AI
- **Storage:** CloudFlare R2, AWS S3
- **Infrastructure:** Docker, Vercel, Railway

## 📚 Documentation

See `docs/` folder for detailed documentation.
