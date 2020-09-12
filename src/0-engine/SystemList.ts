import { ECSystemConstructor } from './ECS/types/ECSystemTypes';
import { AgentSys } from '../1-game-code/ecsystems/Agent/AgentSys';
import { AttackSys } from '../1-game-code/ecsystems/AttackSys';
import { ManaRegenSys } from '../1-game-code/ecsystems/ManaRegenSys';
import { StatusEffectsSys } from '../1-game-code/ecsystems/Agent/StatusEffectsSys';
import { EventSys } from './ECS/event-system/EventSys';
import { CombatLogSys } from '../1-game-code/ecsystems/Combat/CombatLogSys';
import { CharacterCreationController } from '../2-backend-api/controllers/character-creation.controller';

const SystemList: ECSystemConstructor<any>[] = [
  // Core systems
  EventSys,

  // Other systems
  AgentSys,
  AttackSys,
  CombatLogSys,
  ManaRegenSys,
  StatusEffectsSys,

  // API Controllers
  CharacterCreationController,
];

export default SystemList;
