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

  joinEmit(code: string) {
    this.socket.emit('joinRoom', { code });
  }

  leaveEmit(code: string) {
    this.socket.emit('leaveRoom', { code });
  }

  joinRoom(cb: (data: any) => void) {
    this.socket.once('userJoined', (data) => {
      console.log('User joined:', data);
      cb(data);
    });
  }

  leaveRoom(cb: (data: any) => void) {
    this.socket.once('userLeft', (data) => {
      console.log('User left:', data);
      cb(data);
    });
  }

  hostJoinRoom(code: string, cb: (data: any) => void) {
    this.socket.emit('joinRoom', { code });

    this.socket.once('hostJoined', (data) => {
      console.log('Host joined:', data);
      cb(data);
    });
  }

  hostLeaveRoom(code: string, cb: (data: any) => void) {
    this.socket.emit('leaveRoom', { code });

    this.socket.once('hostLeft', (data) => {
      console.log('Host left:', data);
      cb(data);
    });
  }

  cleanUp() {
    console.log('Cleaning up socket listeners');
    this.socket.off();
  }
}
