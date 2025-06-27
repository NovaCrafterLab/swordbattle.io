import * as Protocol from './Protocol';
import logger from '@/utils/logger';

const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
window.socket = null;

class Socket {
  private socket: null | WebSocket;
  private queue: any[];

  constructor() {
    this.socket = null;
    this.queue = [];
  }

  connect(address: string, onOpen: any, onMessage: any, onClose: any) {
    const endpoint = `${protocol}${address}`;

    if (window.socket !== null) {
      window.socket.close();
    }

    this.socket = new WebSocket(endpoint);
    this.socket.binaryType = 'arraybuffer';
    window.socket = this.socket;

    this.socket.addEventListener('open', () => {
      logger.info('WebSocket open:', endpoint);
      this.onOpen();
      onOpen();
    });
    this.socket.addEventListener('close', (event: CloseEvent) => {
      logger.warn('WebSocket closed:', event.code, event.reason, endpoint);
      onClose(event, endpoint);
      this.close();
    });
    this.socket.addEventListener('message', (message: any) => {
      if (typeof message.data === 'string') return;

      try {
        const payload = Protocol.decodeServerMessage(
          new Uint8Array(message.data),
        );
        onMessage(payload);
      } catch (err) {
        logger.error('Decoding message error:', err);
      }
    });

    return this.socket;
  }

  onOpen() {
    for (const msg of this.queue) {
      this.emit(msg);
    }
  }

  emit(data: any) {
    if (this.socket?.readyState !== 1) {
      logger.debug('WebSocket not ready, queueing message:', data);
      return this.queue.push(data);
    }

    const payload = Protocol.encodeClientMessage(data);
    logger.debug('WebSocket send:', data);
    this.socket?.send(payload);
  }

  close() {
    if (this.socket) {
      logger.info('WebSocket closing');
      this.socket.close(1000);
      this.socket = null;
      window.socket = null;
    }
  }
}

const socketInstance = new Socket();
export default socketInstance;
