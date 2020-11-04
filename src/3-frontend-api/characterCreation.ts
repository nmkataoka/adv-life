import { PersonalityArray } from '1-game-code/ncomponents';
import { CREATE_CHARACTER } from '2-backend-api/controllers/CharacterCreationConstants';
import apiClient, { AckCallback } from '3-frontend-api/ApiClient';

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
  ack: AckCallback,
): void => {
  apiClient.emit(CREATE_CHARACTER, data, ack);
};
