import { Module } from '@nestjs/common';
import { GameGateway } from './infrastructure/gateway/game.gateway';
import { RoomService } from './application/services/room.service';
import { InMemoryRoomRepository } from './infrastructure/repositories/in-memory-room.repository';
import { PlayerRegistry } from './infrastructure/gateway/player-registry';
import { ROOM_REPOSITORY } from './domain/repositories/room.repository';

@Module({
  providers: [
    GameGateway,
    RoomService,
    PlayerRegistry,
    { provide: ROOM_REPOSITORY, useClass: InMemoryRoomRepository },
  ],
})
export class GameModule {}
