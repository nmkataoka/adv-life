import { PersonalityArray } from '../1-game-code/ncomponents';
import apiClient, { AckCallback } from './ApiClient';
import { CREATE_CHARACTER } from '../2-backend-api/controllers/character-creation.constants';

export type Stats = {
  dexterity: number;
  intelligence: number;
  magicalAffinity: number;
  stamina: number;
  strength: number;
};

export const createPlayerCharacter = (
  data: {
    className?: string;
    name?: string;
    personality?: PersonalityArray;
    race?: string;
    stats?: Stats;
  },
  ack: AckCallback
): void => {
  apiClient.emit(CREATE_CHARACTER, data, ack);
};
