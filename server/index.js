import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import WebSocketLiveController from './controllers/websocket-live.controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from parent directory (hsk-ai root)
dotenv.config({ path: join(__dirname, '..', '.env') });

const app = express();
const server = createServer(app);

const PORT = process.env.WS_PORT || 3002;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY is required');
  process.exit(1);
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// WebSocket server
const wss = new WebSocketServer({ server, path: '/ws' });
const wsController = new WebSocketLiveController(GEMINI_API_KEY);

wss.on('connection', (ws, req) => {
  wsController.handleConnection(ws, req);
});

server.listen(PORT, () => {
  console.log(`🚀 WebSocket server running on port ${PORT}`);
  console.log(`📡 WebSocket endpoint: ws://localhost:${PORT}/ws`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Shutting down...');
  wss.clients.forEach(client => client.close());
  server.close(() => process.exit(0));
});
