export interface Video {
  id: string
  userId: string
  title: string
  description?: string
  url: string
  thumbnailUrl?: string
  duration?: number
  status: VideoStatus
  createdAt: Date
  updatedAt: Date
}

export enum VideoStatus {
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}
