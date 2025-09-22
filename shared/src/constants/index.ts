// API Status Codes
export const API_STATUS = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500
} as const

// Video Generation Status
export const VIDEO_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
} as const

// AI Provider Types
export const AI_PROVIDERS = {
  RUNWAY: 'runway',
  REPLICATE: 'replicate',
  STABILITY: 'stability',
  OPENAI: 'openai'
} as const

// File Size Limits
export const FILE_LIMITS = {
  MAX_VIDEO_SIZE: 100 * 1024 * 1024, // 100MB
  MAX_PROMPT_LENGTH: 1000,
  MAX_VIDEO_DURATION: 30 // seconds
} as const

// Default Values
export const DEFAULTS = {
  VIDEO_DURATION: 5,
  VIDEO_FPS: 24,
  VIDEO_RATIO: '16:9'
} as const
