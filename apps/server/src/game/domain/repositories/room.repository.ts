import { Room } from '../entities/room.entity';

export const ROOM_REPOSITORY = Symbol('ROOM_REPOSITORY');

export interface IRoomRepository {
  save(room: Room): void;
  findByCode(code: string): Room | undefined;
  delete(code: string): void;
  exists(code: string): boolean;
}
