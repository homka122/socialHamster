import { WebSocket } from 'ws';

export type ExtSocket = WebSocket & { username: string | undefined };
