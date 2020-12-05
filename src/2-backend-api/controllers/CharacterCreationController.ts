import { Controller, RequestData, Router } from '0-engine';
import { EventSys } from '0-engine/ECS/event-system';
import { createCharacter } from '1-game-code/CharacterCreation/CharacterCreationSys';
import { PersonalityArray } from '1-game-code/ncomponents';
import { CREATE_CHARACTER } from './CharacterCreationConstants';

export type Stats = {
  dexterity: number;
  intelligence: number;
  magicalAffinity: number;
  stamina: number;
  strength: number;
};

export class CharacterCreationController extends Controller {
  public Start = (router: Router): void => {
    router.addRoute(CREATE_CHARACTER, this.OnCreateCharacter);
  };

  public OnUpdate(): void {}

  private OnCreateCharacter = async (
    {
      payload,
    }: RequestData<{
      className: string;
      name: string;
      personality: PersonalityArray;
      race: string;
      stats: Stats;
    }>,
    dispatch: typeof EventSys.prototype.Dispatch,
  ): Promise<void> => {
    return dispatch(createCharacter(payload));
  };
}
