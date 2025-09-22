# Architecture Overview

## System Components

### Frontend (Next.js)
- React 18 with TypeScript
- Tailwind CSS for styling  
- Socket.IO for real-time updates
- Zustand for state management

### Backend (Node.js)
- Express.js API server
- PostgreSQL database
- Redis for caching and queues
- Bull for job processing

### AI Integration
- RunwayML API for text-to-video
- Replicate for multiple models
- OpenAI for prompt enhancement

### Storage
- CloudFlare R2 for video delivery
- AWS S3 for processing storage

## Data Flow

1. User submits text prompt
2. API server validates and queues job
3. Job processor calls AI API
4. Video is downloaded and stored
5. User is notified via WebSocket

## Security

- JWT authentication
- API rate limiting
- Input validation with Zod
- CORS configuration
- Helmet security headers
