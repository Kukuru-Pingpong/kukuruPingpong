import { Injectable } from '@nestjs/common';
import { IRoomRepository } from '../../domain/repositories/room.repository';
import { Room } from '../../domain/entities/room.entity';

@Injectable()
export class InMemoryRoomRepository implements IRoomRepository {
  private rooms = new Map<string, Room>();

  save(room: Room): void {
    this.rooms.set(room.code.toString(), room);
  }

  findByCode(code: string): Room | undefined {
    return this.rooms.get(code);
  }

  delete(code: string): void {
    this.rooms.delete(code);
  }

  exists(code: string): boolean {
    return this.rooms.has(code);
  }
}
