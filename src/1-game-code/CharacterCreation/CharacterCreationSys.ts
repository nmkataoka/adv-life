import { EventCallbackError, createEventSlice, Entity, NULL_ENTITY } from '0-engine';
import { MovementCmpt } from '1-game-code/Combat/MovementCmpt';
import { ComponentClasses } from '0-engine/ECS/component-dependencies/ComponentDependencies';
import { UnitLocationCmpt } from '1-game-code/Unit/UnitLocationCmpt';
import { BelongsToCivCmpt, CivCmpt } from '1-game-code/World/Civs/CivCmpt';
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

// This event handler should probably be split up
const characterCreationSlice = createEventSlice('createCharacter', {
  writeCmpts: [
    CivCmpt,

    BelongsToCivCmpt,
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
  civ: { id: Entity; admin?: boolean };
  className?: string;
  name: string;
  personality?: PersonalityArray;
  race?: string;
  stats?: Partial<CombatStatsCmpt>;
}>(
  ({
    eMgr,
    payload: { civ, className, name, personality, race, stats },
    componentManagers: {
      writeCMgrs: [civMgr],
    },
  }) => {
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

    const unitLocationCmpt = new UnitLocationCmpt();
    eMgr.addCmpt(player, unitLocationCmpt);

    // Characters should belong to a civilization
    const { id: civId, admin = false } = civ;
    if (civId !== NULL_ENTITY) {
      const belongsToCivCmpt = new BelongsToCivCmpt();
      belongsToCivCmpt.id = civId;
      eMgr.addCmpt(player, belongsToCivCmpt);

      // Characters can optionally be set as the rulers of a civ
      if (admin) {
        const civCmpt = civMgr.getMut(civId);
        civCmpt.admin = player;
      }
    }
  },
  'createCharacter',
);

export const { createCharacter } = characterCreationSlice;

export default [characterCreationSlice.eventListener];
