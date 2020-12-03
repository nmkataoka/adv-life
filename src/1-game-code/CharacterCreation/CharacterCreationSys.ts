import { Stats } from 'fs';
import { ECSystem, EventCallbackError, createEventListener } from '0-engine';
import { EventSys } from '0-engine/ECS/event-system';
import { MovementCmpt } from '1-game-code/Combat/MovementCmpt';
import { ComponentClasses } from '0-engine/ECS/ComponentDependencies';
import {
  ClassCmpt,
  CombatPositionCmpt,
  CombatStatsCmpt,
  InventoryCmpt,
  PersonalityArray,
  PersonalityCmpt,
  PlayerCmpt,
  RaceCmpt,
} from '../ncomponents';

export const CREATE_CHARACTER = 'characterCreation/createCharacter';

// This event handler should probably be split up

const slice = createEventListener({
  writeCmpts: [
    ClassCmpt,
    CombatPositionCmpt,
    CombatStatsCmpt,
    InventoryCmpt,
    MovementCmpt,
    PersonalityCmpt,
    PlayerCmpt,
    RaceCmpt,
  ],
})<{
  className?: string;
  name: string;
  personality?: PersonalityArray;
  race?: string;
  stats?: Stats;
}>(function createCharacter({ eMgr, payload: { className, name, personality, race, stats } }) {
  const playerAlreadyExists =
    eMgr.getView(new ComponentClasses({ readCmpts: [PlayerCmpt] })).count > 0;
  if (playerAlreadyExists) {
    throw new EventCallbackError('Tried to create player character, but player already exists.');
  }

  const player = eMgr.createEntity(name || '');

  const personalityCmpt = new PersonalityCmpt();
  if (personality) {
    personalityCmpt.setTraits(personality);
  }
  eMgr.addCmpt(player, personalityCmpt);

  eMgr.addCmpt(player, new PlayerCmpt());

  const inventoryCmpt = new InventoryCmpt(20, true);
  inventoryCmpt.gold = 3000;
  eMgr.addCmpt(player, inventoryCmpt);

  const combatStatsCmpt = new CombatStatsCmpt();
  if (stats) {
    Object.assign(combatStatsCmpt, stats);
  }
  eMgr.addCmpt(player, combatStatsCmpt);

  const raceCmpt = new RaceCmpt();
  if (race) {
    raceCmpt.race = race;
  }
  eMgr.addCmpt(player, raceCmpt);

  const classCmpt = new ClassCmpt();
  if (className) {
    classCmpt.class = className;
  }
  eMgr.addCmpt(player, classCmpt);

  const movementCmpt = new MovementCmpt();
  eMgr.addCmpt(player, movementCmpt);
  const combatPosCmpt = new CombatPositionCmpt();
  eMgr.addCmpt(player, combatPosCmpt);
}, 'createCharacter');

export class CharacterCreationSys extends ECSystem {
  public Start(): void {
    this.eMgr.getSys(EventSys).RegisterListener(CREATE_CHARACTER, slice.eventListener);
  }

  public OnUpdate(): void {}
}
