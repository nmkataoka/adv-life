import { ECSystemConstructor } from './ECS/types/ECSystemTypes';
import { AgentSys } from '../1-game-code/Agent/AgentSys';
import { AttackSys } from '../1-game-code/Combat/AttackSys';
import { ManaRegenSys } from '../1-game-code/Combat/ManaRegenSys';
import { StatusEffectsSys } from '../1-game-code/Combat/StatusEffectsSys';
import { EventSys } from './ECS/event-system/EventSys';
import { CombatLogSys } from '../1-game-code/Combat/CombatLogSys';
import { CharacterCreationSys } from '../1-game-code/CharacterCreation/CharacterCreationSys';
import { MerchantSys } from '../1-game-code/Merchant/MerchantSys';
import { ItemClassDbSys } from '../1-game-code/Items/ItemClassDbSys';

const SystemList: ECSystemConstructor<any>[] = [
  // Core systems
  EventSys,

  // Other systems
  AgentSys,
  AttackSys,
  CharacterCreationSys,
  CombatLogSys,
  ItemClassDbSys,
  ManaRegenSys,
  MerchantSys,
  StatusEffectsSys,
];

export default SystemList;
