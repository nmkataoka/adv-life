import { ECSystemConstructor } from './ECS/types/ECSystemTypes';
import { AgentSys } from '../2-ecsystems/Agent/AgentSys';
import { AttackSys } from '../2-ecsystems/AttackSys';
import { ManaRegenSys } from '../2-ecsystems/ManaRegenSys';
import { StatusEffectsSys } from '../2-ecsystems/Agent/StatusEffectsSys';

const SystemList: ECSystemConstructor<any>[] = [
  AgentSys,
  AttackSys,
  ManaRegenSys,
  StatusEffectsSys,
];

export default SystemList;
