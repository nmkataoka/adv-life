import { Controller, EventCallbackArgs, GetView } from '../../0-engine';
import {
  ClassCmpt,
  CombatStatsCmpt,
  NameCmpt,
  PersonalityArray,
  PersonalityCmpt,
  PlayerCmpt,
  RaceCmpt,
} from '../../1-game-code/ncomponents';
import { CREATE_CHARACTER } from './character-creation.constants';
import { GetEventSys } from '../../0-engine/ECS/globals/DispatchEvent';

export type Stats = {
  dexterity: number;
  intelligence: number;
  magicalAffinity: number;
  stamina: number;
  strength: number;
};

export class CharacterCreationController extends Controller {
  public Start(): void {
    const eventSys = GetEventSys();
    eventSys.RegisterListener(CREATE_CHARACTER, this.OnCreateCharacter);
  }

  public OnUpdate(): void {}

  private OnCreateCharacter = ({
    eMgr,
    payload: { className, name, personality, race, stats },
    ack,
  }: EventCallbackArgs<{
    className: string;
    name: string;
    personality: PersonalityArray;
    race: string;
    stats: Stats;
  }>): void => {
    const playerAlreadyExists = GetView(eMgr, 0, PlayerCmpt).Count > 0;
    if (playerAlreadyExists) {
      throw new Error('Tried to create player character, but player already exists.');
    }

    const player = eMgr.CreateEntity();

    const nameCmpt = new NameCmpt();
    if (name) {
      nameCmpt.name = name;
    }
    eMgr.AddComponent(player, nameCmpt);

    const personalityCmpt = new PersonalityCmpt();
    if (personality) {
      personalityCmpt.setTraits(personality);
    }
    eMgr.AddComponent(player, personalityCmpt);

    const playerCmpt = new PlayerCmpt();
    eMgr.AddComponent(player, playerCmpt);

    const combatStatsCmpt = new CombatStatsCmpt();
    if (stats) {
      Object.assign(combatStatsCmpt, stats);
    }
    eMgr.AddComponent(player, combatStatsCmpt);

    const raceCmpt = new RaceCmpt();
    if (race) {
      raceCmpt.race = race;
    }
    eMgr.AddComponent(player, raceCmpt);

    const classCmpt = new ClassCmpt();
    if (className) {
      classCmpt.class = className;
    }
    eMgr.AddComponent(player, classCmpt);

    if (ack) {
      ack(player.handle);
    }
  };
}
