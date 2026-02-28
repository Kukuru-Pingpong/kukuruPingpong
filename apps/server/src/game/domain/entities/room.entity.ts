import { RoomCode } from '../value-objects/room-code.vo';
import { GameState } from '../value-objects/game-state.vo';
import { Hp } from '../value-objects/hp.vo';
import { Player } from './player.entity';

export class Room {
  public state: GameState = GameState.WAITING;
  public sentence: string | null = null;
  public round = 1;
  private players: Player[] = [];

  constructor(public readonly code: RoomCode) {}

  get playerCount(): number {
    return this.players.length;
  }

  getPlayer(playerNum: 1 | 2): Player | undefined {
    return this.players.find((p) => p.playerNum === playerNum);
  }

  getPlayerBySocketId(socketId: string): Player | undefined {
    return this.players.find((p) => p.socketId === socketId);
  }

  getAllPlayers(): Player[] {
    return [...this.players];
  }

  getPlayerSocketIds(): string[] {
    return this.players.map((p) => p.socketId);
  }

  addPlayer(socketId: string): Player {
    if (this.players.length >= 2) {
      throw new Error('방이 가득 찼습니다.');
    }
    const playerNum = (this.players.length + 1) as 1 | 2;
    const player = new Player(socketId, playerNum);
    this.players.push(player);

    if (this.players.length === 2) {
      this.state = GameState.CHARACTER_SELECT;
    }

    return player;
  }

  selectCharacter(playerNum: 1 | 2, characterId: number): boolean {
    const player = this.getPlayer(playerNum);
    if (!player) return false;

    player.selectCharacter(characterId);

    const p1 = this.getPlayer(1);
    const p2 = this.getPlayer(2);
    if (p1?.characterId && p2?.characterId) {
      this.state = GameState.WORD_SELECT;
      return true; // both selected
    }
    return false;
  }

  submitWord(playerNum: 1 | 2, word: string): boolean {
    const player = this.getPlayer(playerNum);
    if (!player) return false;

    player.submitWord(word);

    const p1 = this.getPlayer(1);
    const p2 = this.getPlayer(2);
    return !!(p1?.word && p2?.word); // both submitted
  }

  setSentence(sentence: string): void {
    this.sentence = sentence;
  }

  submitAudio(playerNum: 1 | 2, audioBase64: string): boolean {
    const player = this.getPlayer(playerNum);
    if (!player) return false;

    player.submitAudio(audioBase64);

    const p1 = this.getPlayer(1);
    const p2 = this.getPlayer(2);
    return !!(p1?.audioData && p2?.audioData); // both submitted
  }

  updateAfterRound(hp: Record<number, number>, nextRound: number): void {
    const p1 = this.getPlayer(1);
    const p2 = this.getPlayer(2);

    if (p1) {
      p1.hp = new Hp(hp[1]);
      p1.resetRound();
    }
    if (p2) {
      p2.hp = new Hp(hp[2]);
      p2.resetRound();
    }

    this.round = nextRound;
    this.sentence = null;
  }

  getHpMap(): Record<number, number> {
    const p1 = this.getPlayer(1);
    const p2 = this.getPlayer(2);
    return {
      1: p1?.hp.toNumber() ?? 100,
      2: p2?.hp.toNumber() ?? 100,
    };
  }

  getCharacterMap(): Record<number, number> {
    const result: Record<number, number> = {};
    const p1 = this.getPlayer(1);
    const p2 = this.getPlayer(2);
    if (p1?.characterId) result[1] = p1.characterId;
    if (p2?.characterId) result[2] = p2.characterId;
    return result;
  }

  getWordMap(): Record<number, string> {
    const result: Record<number, string> = {};
    const p1 = this.getPlayer(1);
    const p2 = this.getPlayer(2);
    if (p1?.word) result[1] = p1.word;
    if (p2?.word) result[2] = p2.word;
    return result;
  }

  getAudioMap(): Record<number, string> {
    const result: Record<number, string> = {};
    const p1 = this.getPlayer(1);
    const p2 = this.getPlayer(2);
    if (p1?.audioData) result[1] = p1.audioData;
    if (p2?.audioData) result[2] = p2.audioData;
    return result;
  }
}
