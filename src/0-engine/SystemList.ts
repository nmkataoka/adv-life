import { ECSystemConstructor } from './ECS/types/ECSystemTypes';
import { AgentSys } from '../2-ecsystems/Agent/AgentSys';
import { AttackSys } from '../2-ecsystems/AttackSys';
import { ManaRegenSys } from '../2-ecsystems/ManaRegenSys';
import { StatusEffectsSys } from '../2-ecsystems/Agent/StatusEffectsSys';
import { EventSys } from './ECS/EventSys';

const SystemList: ECSystemConstructor<any>[] = [
  // Core systems
  EventSys,

  // Other systems
  AgentSys,
  AttackSys,
  ManaRegenSys,
  StatusEffectsSys,
];

export default SystemList;
