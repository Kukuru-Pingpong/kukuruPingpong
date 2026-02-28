import type { Character } from '../model/types';
import { characters } from '../data/characters';

export function getCharacterById(id: number): Character | undefined {
  return characters.find((c) => c.id === id);
}
