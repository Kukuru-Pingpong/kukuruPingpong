import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomService } from '../../application/services/room.service';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly roomService: RoomService) {}

  handleConnection(client: Socket) {
    console.log('접속:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('퇴장:', client.id);
    const roomCode = this.roomService.handleDisconnect(client.id);
    if (roomCode) {
      client.to(roomCode).emit('opponent-left');
    }
  }

  @SubscribeMessage('create-room')
  handleCreateRoom(@ConnectedSocket() client: Socket) {
    const result = this.roomService.createRoom(client.id);
    client.join(result.roomCode);
    return { roomCode: result.roomCode, playerNum: result.playerNum };
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomCode: string,
  ) {
    const result = this.roomService.joinRoom(client.id, roomCode);
    if ('error' in result) {
      return result;
    }

    client.join(result.roomCode);
    this.server.to(result.roomCode).emit('game-start');
    return { roomCode: result.roomCode, playerNum: result.playerNum };
  }

  @SubscribeMessage('select-character')
  handleSelectCharacter(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { characterId: number },
  ) {
    const result = this.roomService.selectCharacter(client.id, data.characterId);
    if (!result) return;

    if (result.bothSelected) {
      this.server.to(result.roomCode).emit('both-characters-selected', {
        char1: result.char1,
        char2: result.char2,
      });
    }
  }

  @SubscribeMessage('submit-word')
  handleSubmitWord(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { word: string },
  ) {
    const result = this.roomService.submitWord(client.id, data.word);
    if (!result) return;

    client.to(result.roomCode).emit('opponent-word-submitted');

    if (result.bothSubmitted) {
      this.server.to(result.roomCode).emit('words-ready', {
        word1: result.word1,
        word2: result.word2,
      });
    }
  }

  @SubscribeMessage('sentence-ready')
  handleSentenceReady(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { sentence: string },
  ) {
    const roomCode = this.roomService.setSentence(client.id, data.sentence);
    if (!roomCode) return;

    this.server.to(roomCode).emit('sentence-generated', { sentence: data.sentence });
  }

  @SubscribeMessage('recording-done')
  handleRecordingDone(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { audioBase64: string },
  ) {
    const result = this.roomService.submitAudio(client.id, data.audioBase64);
    if (!result) return;

    client.to(result.roomCode).emit('opponent-recording-done');

    if (result.bothDone) {
      this.server.to(result.roomCode).emit('both-recordings-done', {
        audio1: result.audio1,
        audio2: result.audio2,
      });
    }
  }

  @SubscribeMessage('judgment-ready')
  handleJudgmentReady(
    @ConnectedSocket() client: Socket,
    @MessageBody() judgment: any,
  ) {
    const roomCode = this.roomService.getRoomCodeBySocket(client.id);
    if (!roomCode) return;

    this.server.to(roomCode).emit('judgment-result', judgment);
  }

  @SubscribeMessage('round-complete')
  handleRoundComplete(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { hp: Record<number, number>; round: number; ko: boolean },
  ) {
    const roomCode = this.roomService.handleRoundComplete(client.id, data.hp, data.round);
    if (!roomCode) return;

    this.server.to(roomCode).emit('round-result', {
      hp: data.hp,
      round: data.round,
      ko: data.ko,
    });
  }
}
