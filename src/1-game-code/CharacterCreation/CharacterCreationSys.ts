import { Stats } from 'fs';
import { ECSystem, GetView } from '0-engine';
import { EventCallbackArgs, EventSys } from '0-engine/ECS/event-system';
import {
  ClassCmpt,
  CombatStatsCmpt,
  InventoryCmpt,
  NameCmpt,
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

  const inventoryCmpt = new InventoryCmpt(20, true);
  inventoryCmpt.gold = 3000;
  eMgr.AddComponent(player, inventoryCmpt);

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
    ack({ data: player });
  }
};

export class CharacterCreationSys extends ECSystem {
  public Start(): void {
    this.eMgr.GetSystem(EventSys).RegisterListener(CREATE_CHARACTER, createCharacter);
  }

  public OnUpdate(): void {}
}
