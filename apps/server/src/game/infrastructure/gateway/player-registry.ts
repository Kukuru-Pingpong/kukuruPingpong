import { Injectable } from '@nestjs/common';

export interface PlayerInfo {
  roomCode: string;
  playerNum: 1 | 2;
}

@Injectable()
export class PlayerRegistry {
  private registry = new Map<string, PlayerInfo>();

  register(socketId: string, roomCode: string, playerNum: 1 | 2): void {
    this.registry.set(socketId, { roomCode, playerNum });
  }

  get(socketId: string): PlayerInfo | undefined {
    return this.registry.get(socketId);
  }

  remove(socketId: string): PlayerInfo | undefined {
    const info = this.registry.get(socketId);
    this.registry.delete(socketId);
    return info;
  }
}
