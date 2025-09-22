import app from './app'
import { createServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'

const PORT = process.env.PORT || 3001

const server = createServer(app)
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)
  
  socket.on('join-room', (room) => {
    socket.join(room)
  })
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id)
  })
})

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
