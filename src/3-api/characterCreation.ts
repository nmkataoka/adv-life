import { EntityManager } from '../0-engine/ECS/EntityManager';
import { PlayerCmpt } from '../1- ncomponents/PlayerCmpt';
import { GetView } from '../0-engine/ECS/View';
import { Entity } from '../0-engine/ECS/Entity';
import { PersonalityArray, PersonalityCmpt } from '../1- ncomponents/PersonalityCmpt';
import { CombatStatsCmpt } from '../1- ncomponents/CombatStatsCmpt';
import { RaceCmpt } from '../1- ncomponents/Race';
import { ClassCmpt } from '../1- ncomponents/ClassCmpt';

export type Stats = {
  dexterity: number;
  intelligence: number;
  magicalAffinity: number;
  stamina: number;
  strength: number;
}

export const createPlayerCharacter = ({
  className,
  personality,
  race,
  stats,
}: {
  className?: string,
  personality?: PersonalityArray,
  race?: string,
  stats?: Stats,
}): Entity => {
  const playerAlreadyExists = GetView(0, PlayerCmpt).Count > 0;

  if (playerAlreadyExists) {
    throw new Error('Tried to create player character, but player already exists.');
  }

  const eMgr = EntityManager.instance;
  const player = eMgr.CreateEntity();

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

  return player;
};
