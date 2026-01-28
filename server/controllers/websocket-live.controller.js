import GeminiLiveService from '../services/gemini-live.service.js';
import { buildSystemInstruction, getGreeting } from '../config/prompts.js';

class WebSocketLiveController {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.activeSessions = new Map();
  }

  handleConnection(ws, req) {
    const sessionId = this.generateSessionId();
    
    console.log(`🔌 WebSocket connected: ${sessionId}`);
    
    const session = {
      sessionId,
      ws,
      liveService: null,
      startTime: Date.now(),
      lastActivity: Date.now(),
      isConnected: false,
      isStreaming: false,
      hasStarted: false,
      greetingMessage: null,
      level: 1,
      topicId: null,
      stats: {
        audioChunksSent: 0,
        audioChunksReceived: 0,
        messagesSent: 0,
        messagesReceived: 0
      }
    };
    
    this.activeSessions.set(sessionId, session);
    
    ws.send(JSON.stringify({
      type: 'session_info',
      sessionId,
      timestamp: Date.now()
    }));

    ws.on('message', async (message) => {
      try {
        const session = this.activeSessions.get(sessionId);
        if (!session) {
          ws.send(JSON.stringify({ type: 'error', message: 'Session not found' }));
          return;
        }
        
        session.lastActivity = Date.now();
        session.stats.messagesReceived++;
        
        const data = JSON.parse(message);

        switch (data.type) {
          case 'init':
            await this.handleInit(session, data);
            break;
          case 'start_stream':
            await this.handleStartStream(session, data);
            break;
          case 'audio_chunk':
            session.stats.audioChunksReceived++;
            if (session.stats.audioChunksReceived % 10 === 0) {
              console.log(`📥 Received audio chunk #${session.stats.audioChunksReceived} from client`);
            }
            await this.handleAudioChunk(session, data);
            break;
          case 'end_stream':
            await this.handleEndStream(session, data);
            break;
          case 'text':
            await this.handleText(session, data);
            break;
          case 'stop':
            await this.handleStop(session);
            break;
          default:
            console.warn(`⚠️ Unknown message type: ${data.type}`);
        }
        
        session.stats.messagesSent++;
        
      } catch (error) {
        console.error(`❌ Error handling message:`, error);
        ws.send(JSON.stringify({
          type: 'error',
          message: error.message,
          sessionId
        }));
      }
    });

    ws.on('close', () => {
      this.handleDisconnect(sessionId);
    });

    ws.on('error', (error) => {
      console.error(`❌ WebSocket error for ${sessionId}:`, error);
      this.handleDisconnect(sessionId);
    });
  }

  async handleInit(session, data) {
    const { ws } = session;
    
    try {
      console.log(`🎬 Initializing session ${session.sessionId}`);
      
      const level = data.level || 1;
      const topicId = data.topicId || 'daily-life';
      const voiceName = data.voiceName || 'Kore';
      
      session.level = level;
      session.topicId = topicId;

      const systemInstruction = buildSystemInstruction(level, topicId);
      const greeting = getGreeting(level, topicId);

      session.liveService = new GeminiLiveService(this.apiKey);
      
      await session.liveService.connect({
        onopen: () => {
          ws.send(JSON.stringify({
            type: 'ready',
            message: 'Gemini Live API ready',
            sessionId: session.sessionId,
            level,
            topicId,
            voiceName
          }));
          console.log(`✅ Session ${session.sessionId} ready`);
        },
        onmessage: (message) => {
          if (message.serverContent) {
            const parts = message.serverContent.modelTurn?.parts || [];
            
            // User transcription
            if (message.serverContent.inputTranscription?.text) {
              ws.send(JSON.stringify({
                type: 'user_transcript',
                text: message.serverContent.inputTranscription.text,
                sessionId: session.sessionId
              }));
            }

            // AI text response - ONLY send outputTranscription (what AI actually says)
            // Do NOT send part.text (thinking process/instructions)
            if (message.serverContent.outputTranscription?.text) {
              console.log(`🤖 AI transcript: ${message.serverContent.outputTranscription.text}`);
              ws.send(JSON.stringify({
                type: 'text_response',
                text: message.serverContent.outputTranscription.text,
                sessionId: session.sessionId
              }));
            }
            
            parts.forEach(part => {
              // Skip text parts - they contain thinking process
              // Only send audio
              if (part.text) {
                // Do NOT send - this is thinking/instructions
                console.log('🤔 Skipping thinking text:', part.text.substring(0, 50) + '...');
              }
              
              // AI audio response
              if (part.inlineData && part.inlineData.mimeType.startsWith('audio/')) {
                session.stats.audioChunksSent++;
                
                if (session.stats.audioChunksSent % 5 === 0) {
                  console.log(`🔊 Sending AI audio chunk #${session.stats.audioChunksSent} to client`);
                }
                
                ws.send(JSON.stringify({
                  type: 'audio_response',
                  audio: part.inlineData.data,
                  mimeType: part.inlineData.mimeType,
                  sessionId: session.sessionId
                }));
              }
            });

            if (message.serverContent.turnComplete) {
              ws.send(JSON.stringify({
                type: 'turn_complete',
                sessionId: session.sessionId
              }));
            }

            if (message.serverContent.interrupted) {
              ws.send(JSON.stringify({
                type: 'interrupted',
                message: 'Model was interrupted',
                sessionId: session.sessionId
              }));
            }
          }
        },
        onerror: (error) => {
          ws.send(JSON.stringify({
            type: 'error',
            message: error.message,
            sessionId: session.sessionId
          }));
        },
        onclose: (event) => {
          ws.send(JSON.stringify({
            type: 'session_closed',
            reason: event.reason,
            sessionId: session.sessionId
          }));
        }
      }, {
        voiceName,
        systemInstruction,
        level
      });
      
      session.greetingMessage = greeting;
      session.isConnected = true;
      
    } catch (error) {
      console.error(`❌ Failed to initialize session:`, error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Failed to connect: ' + error.message,
        sessionId: session.sessionId
      }));
    }
  }

  async handleStartStream(session, data) {
    const { ws, liveService } = session;
    
    if (!session.isConnected) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Live API not connected',
        sessionId: session.sessionId
      }));
      return;
    }
    
    session.isStreaming = true;
    ws.send(JSON.stringify({
      type: 'streaming_started',
      message: 'Real-time audio streaming active',
      sessionId: session.sessionId
    }));
    
    console.log(`🎙️ Streaming started - Session: ${session.sessionId}`);
    
    // Send greeting on first start
    if (!session.hasStarted && session.greetingMessage) {
      session.hasStarted = true;
      setTimeout(() => {
        liveService.sendText(session.greetingMessage);
        console.log(`👋 Greeting sent - Session: ${session.sessionId}`);
      }, 500);
    }
  }

  async handleAudioChunk(session, data) {
    const { ws, liveService } = session;
    
    if (!session.isStreaming) {
      console.warn(`⚠️ Audio chunk received but not streaming - Session: ${session.sessionId}`);
      return;
    }
    
    try {
      if (!data.audio) {
        console.warn(`⚠️ Audio chunk has no data - Session: ${session.sessionId}`);
        return;
      }
      
      await liveService.sendRealtimeInput(data.audio);
    } catch (error) {
      console.error(`❌ Error sending audio to Gemini - Session: ${session.sessionId}:`, error.message);
    }
  }

  async handleEndStream(session, data) {
    const { ws, liveService } = session;
    
    console.log(`🎙️ Ending stream - Session: ${session.sessionId}`);
    console.log(`📊 Stats - Chunks received: ${session.stats.audioChunksReceived}, Chunks sent: ${session.stats.audioChunksSent}`);
    session.isStreaming = false;
    
    try {
      console.log(`📤 Sending end_stream to Gemini Live API...`);
      await liveService.endAudioStream();
      console.log(`✅ Audio stream ended, waiting for AI response...`);
      
      ws.send(JSON.stringify({
        type: 'stream_ended',
        sessionId: session.sessionId,
        stats: data.stats || null
      }));
    } catch (error) {
      console.error(`❌ Error ending stream:`, error);
    }
  }

  async handleText(session, data) {
    const { ws, liveService } = session;
    
    if (!session.isConnected) {
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Live API not connected',
        sessionId: session.sessionId
      }));
      return;
    }
    
    try {
      console.log(`💬 Text message:`, data.text);
      await liveService.sendText(data.text);
    } catch (error) {
      console.error(`❌ Error sending text:`, error);
      ws.send(JSON.stringify({
        type: 'error',
        message: error.message,
        sessionId: session.sessionId
      }));
    }
  }

  async handleStop(session) {
    const { ws, liveService } = session;
    
    console.log(`🛑 Stopping session ${session.sessionId}`);
    
    if (liveService) {
      liveService.close();
    }
    
    ws.send(JSON.stringify({
      type: 'stopped',
      message: 'Session stopped',
      sessionId: session.sessionId,
      stats: session.stats
    }));
  }

  handleDisconnect(sessionId) {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;
    
    const duration = ((Date.now() - session.startTime) / 1000).toFixed(2);
    
    console.log(`🔌 Disconnected - Session: ${sessionId}, Duration: ${duration}s`);
    
    if (session.liveService) {
      session.liveService.close();
    }
    
    this.activeSessions.delete(sessionId);
    console.log(`📊 Active sessions: ${this.activeSessions.size}`);
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getActiveSessions() {
    const sessions = [];
    this.activeSessions.forEach((session, sessionId) => {
      sessions.push({
        sessionId,
        level: session.level,
        topicId: session.topicId,
        startTime: session.startTime,
        duration: ((Date.now() - session.startTime) / 1000).toFixed(2) + 's',
        isConnected: session.isConnected,
        isStreaming: session.isStreaming,
        stats: session.stats
      });
    });
    return sessions;
  }
}

export default WebSocketLiveController;
