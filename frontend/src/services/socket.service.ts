import { io, Socket } from 'socket.io-client';

export class SocketService {
  private static instance: SocketService;
  private socket: Socket;

  private constructor() {
    this.socket = io('http://localhost:8000');
  }

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  // Emit methods
  joinEmit(code: string) {
    this.socket.emit('joinRoom', { code });
  }

  leaveEmit(code: string) {
    this.socket.emit('leaveRoom', { code });
  }

  updateScoreEmit(code: string) {
    this.socket.emit('updateScore', { code });
  }

  // Event listeners
  onUserJoined(cb: (data: any) => void) {
    this.socket.on('userJoined', cb);
  }

  onUserLeft(cb: (data: any) => void) {
    this.socket.on('userLeft', cb);
  }

  onScoreUpdated(cb: (data: any) => void) {
    this.socket.on('scoreUpdated', cb);
  }

  // Remove specific listeners
  off(eventName: string, cb?: (...args: any[]) => void) {
    this.socket.off(eventName, cb);
  }

  // Check if socket is connected
  isConnected(): boolean {
    return this.socket.connected;
  }

  // Global cleanup (optional, but avoid overuse)
  cleanUp() {
    console.log('Cleaning up all socket listeners');
    this.socket.off();
  }
}
