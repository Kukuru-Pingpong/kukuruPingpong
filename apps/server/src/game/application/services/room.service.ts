import { Injectable, Inject } from '@nestjs/common';
import { ROOM_REPOSITORY, IRoomRepository } from '../../domain/repositories/room.repository';
import { Room } from '../../domain/entities/room.entity';
import { RoomCode } from '../../domain/value-objects/room-code.vo';
import { PlayerRegistry } from '../../infrastructure/gateway/player-registry';

@Injectable()
export class RoomService {
  constructor(
    @Inject(ROOM_REPOSITORY)
    private readonly roomRepo: IRoomRepository,
    private readonly playerRegistry: PlayerRegistry,
  ) {}

  createRoom(socketId: string): { roomCode: string; playerNum: 1 | 2 } {
    const code = RoomCode.generate();
    const room = new Room(code);
    const player = room.addPlayer(socketId);
    this.roomRepo.save(room);
    this.playerRegistry.register(socketId, code.toString(), player.playerNum);
    return { roomCode: code.toString(), playerNum: player.playerNum };
  }

  joinRoom(socketId: string, roomCode: string): { roomCode: string; playerNum: 1 | 2 } | { error: string } {
    const room = this.roomRepo.findByCode(roomCode);
    if (!room) {
      return { error: '존재하지 않는 방입니다.' };
    }
    if (room.playerCount >= 2) {
      return { error: '방이 가득 찼습니다.' };
    }

    const player = room.addPlayer(socketId);
    this.playerRegistry.register(socketId, roomCode, player.playerNum);
    return { roomCode, playerNum: player.playerNum };
  }

  selectCharacter(socketId: string, characterId: number): { roomCode: string; bothSelected: boolean; char1?: number; char2?: number } | null {
    const info = this.playerRegistry.get(socketId);
    if (!info) return null;

    const room = this.roomRepo.findByCode(info.roomCode);
    if (!room) return null;

    const bothSelected = room.selectCharacter(info.playerNum, characterId);
    const chars = room.getCharacterMap();

    return {
      roomCode: info.roomCode,
      bothSelected,
      char1: chars[1],
      char2: chars[2],
    };
  }

  submitWord(socketId: string, word: string): { roomCode: string; bothSubmitted: boolean; word1?: string; word2?: string } | null {
    const info = this.playerRegistry.get(socketId);
    if (!info) return null;

    const room = this.roomRepo.findByCode(info.roomCode);
    if (!room) return null;

    const bothSubmitted = room.submitWord(info.playerNum, word);
    const words = room.getWordMap();

    return {
      roomCode: info.roomCode,
      bothSubmitted,
      word1: words[1],
      word2: words[2],
    };
  }

  setSentence(socketId: string, sentence: string): string | null {
    const info = this.playerRegistry.get(socketId);
    if (!info) return null;

    const room = this.roomRepo.findByCode(info.roomCode);
    if (!room) return null;

    room.setSentence(sentence);
    return info.roomCode;
  }

  submitAudio(socketId: string, audioBase64: string): { roomCode: string; bothDone: boolean; audio1?: string; audio2?: string } | null {
    const info = this.playerRegistry.get(socketId);
    if (!info) return null;

    const room = this.roomRepo.findByCode(info.roomCode);
    if (!room) return null;

    const bothDone = room.submitAudio(info.playerNum, audioBase64);
    const audioMap = room.getAudioMap();

    return {
      roomCode: info.roomCode,
      bothDone,
      audio1: audioMap[1],
      audio2: audioMap[2],
    };
  }

  getRoomCodeBySocket(socketId: string): string | null {
    const info = this.playerRegistry.get(socketId);
    return info?.roomCode ?? null;
  }

  handleRoundComplete(socketId: string, hp: Record<number, number>, round: number): string | null {
    const info = this.playerRegistry.get(socketId);
    if (!info) return null;

    const room = this.roomRepo.findByCode(info.roomCode);
    if (!room) return null;

    room.updateAfterRound(hp, round);
    return info.roomCode;
  }

  handleDisconnect(socketId: string): string | null {
    const info = this.playerRegistry.remove(socketId);
    if (!info) return null;

    this.roomRepo.delete(info.roomCode);
    return info.roomCode;
  }
}
