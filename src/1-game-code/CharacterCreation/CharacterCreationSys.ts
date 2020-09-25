import { Stats } from 'fs';
import { ECSystem, GetView } from '0-engine';
import { EventCallbackArgs, EventSys } from '0-engine/ECS/event-system';
import {
  ClassCmpt,
  CombatStatsCmpt,
  InventoryCmpt,
  PersonalityArray,
  PersonalityCmpt,
  PlayerCmpt,
  RaceCmpt,
} from '../ncomponents';

export const CREATE_CHARACTER = 'characterCreation/createCharacter';

const createCharacter = ({
  eMgr,
  payload: { className, name, personality, race, stats },
  ack,
}: EventCallbackArgs<{
  className: string;
  name: string;
  personality: PersonalityArray;
  race: string;
  stats: Stats;
}>) => {
  const playerAlreadyExists = GetView(eMgr, 0, PlayerCmpt).Count > 0;
  if (playerAlreadyExists) {
    ack({ error: 'Tried to create player character, but player already exists.' });
  }

  const player = eMgr.createEntity(name || '');

  const personalityCmpt = eMgr.addCmpt(player, PersonalityCmpt);
  if (personality) {
    personalityCmpt.setTraits(personality);
  }

  eMgr.addCmpt(player, PlayerCmpt);

  const inventoryCmpt = eMgr.addCmpt(player, InventoryCmpt, 20, true);
  inventoryCmpt.gold = 3000;

  const combatStatsCmpt = eMgr.addCmpt(player, CombatStatsCmpt);
  if (stats) {
    Object.assign(combatStatsCmpt, stats);
  }

  const raceCmpt = eMgr.addCmpt(player, RaceCmpt);
  if (race) {
    raceCmpt.race = race;
  }

  const classCmpt = eMgr.addCmpt(player, ClassCmpt);
  if (className) {
    classCmpt.class = className;
  }

  if (ack) {
    ack({ data: player });
  }
};

export class CharacterCreationSys extends ECSystem {
  public Start(): void {
    this.eMgr.getSys(EventSys).RegisterListener(CREATE_CHARACTER, createCharacter);
  }

  public OnUpdate(): void {}
}
