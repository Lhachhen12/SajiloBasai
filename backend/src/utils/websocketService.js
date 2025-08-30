// backend/lib/utils/websocketService.js
import { WebSocketServer } from 'ws';

class WebSocketService {
  constructor(server) {
    this.wss = new WebSocketServer({ server });
    this.clients = new Map(); // Store client connections by userId
    this.rooms = new Map(); // Store room connections
    
    this.wss.on('connection', (ws, req) => {
      this.handleConnection(ws, req);
    });
    
    console.log('WebSocket service initialized');
  }

  handleConnection(ws, req) {
    try {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const roomId = url.searchParams.get('roomId');
      const userId = url.searchParams.get('userId');
      
      if (!roomId || !userId) {
        ws.close(1008, 'Missing roomId or userId');
        return;
      }

      // Store client connection
      const clientKey = `${userId}-${roomId}`;
      this.clients.set(clientKey, ws);
      
      // Add to room
      if (!this.rooms.has(roomId)) {
        this.rooms.set(roomId, new Set());
      }
      this.rooms.get(roomId).add(clientKey);

      console.log(`User ${userId} connected to room ${roomId}`);

      ws.on('message', (data) => {
        this.handleMessage(ws, data, userId, roomId);
      });

      ws.on('close', () => {
        this.handleDisconnection(userId, roomId);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
      });

    } catch (error) {
      console.error('Error handling WebSocket connection:', error);
      ws.close(1011, 'Server error');
    }
  }

  handleMessage(ws, data, userId, roomId) {
    try {
      const message = JSON.parse(data);
      
      switch (message.type) {
        case 'typing':
          this.broadcastToRoom(roomId, {
            type: 'user_typing',
            userId: userId,
            roomId: roomId
          }, userId);
          break;
          
        default:
          console.log('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
    }
  }

  handleDisconnection(userId, roomId) {
    const clientKey = `${userId}-${roomId}`;
    this.clients.delete(clientKey);
    
    if (this.rooms.has(roomId)) {
      this.rooms.get(roomId).delete(clientKey);
      if (this.rooms.get(roomId).size === 0) {
        this.rooms.delete(roomId);
      }
    }
    
    console.log(`User ${userId} disconnected from room ${roomId}`);
  }

  // Broadcast message to all clients in a room except sender
  broadcastToRoom(roomId, message, excludeUserId = null) {
    if (!this.rooms.has(roomId)) return;
    
    const roomClients = this.rooms.get(roomId);
    roomClients.forEach(clientKey => {
      const [userId] = clientKey.split('-');
      if (excludeUserId && userId === excludeUserId) return;
      
      const ws = this.clients.get(clientKey);
      if (ws && ws.readyState === 1) { // WebSocket.OPEN = 1
        try {
          ws.send(JSON.stringify(message));
        } catch (error) {
          console.error('Error sending message to client:', error);
        }
      }
    });
  }

  // Send new message to all room participants
  notifyNewMessage(roomId, message) {
    this.broadcastToRoom(roomId, {
      type: 'new_message',
      message: message,
      roomId: roomId
    });
  }

  // Get connected clients count for a room
  getRoomClientCount(roomId) {
    return this.rooms.has(roomId) ? this.rooms.get(roomId).size : 0;
  }

  // Check if user is online in a specific room
  isUserOnlineInRoom(userId, roomId) {
    const clientKey = `${userId}-${roomId}`;
    return this.clients.has(clientKey);
  }
}

export default WebSocketService;