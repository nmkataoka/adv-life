import { EventListener } from '0-engine/ECS/event-system';
import AgentSys from './Agent/AgentSys';
import CharacterCreationSys from './CharacterCreation/CharacterCreationSys';
import AttackSys from './Combat/AttackSys';
import CombatLogSys from './Combat/CombatLogSys';
import ManaRegenSys from './Combat/ManaRegenSys';
import MovementSys from './Combat/MovementSys';
import SetPlayerDestinationSys from './Combat/SetPlayerDestinationSys';
import StatusEffectsSys from './Combat/StatusEffectsSys';
import EquipmentSys from './Inventory/EquipmentSys';
import ItemClassDbSys from './Items/ItemClass/ItemClassDbSys';
import MaterialDbSys from './Items/Material/MaterialDbSys';
import MerchantSys from './Merchant/MerchantSys';
import TerrainGenSys from './World/TerrainGenSys';

const eventListeners: EventListener<any, any>[] = [
  ...AgentSys,
  ...AttackSys,
  ...CharacterCreationSys,
  ...CombatLogSys,
  ...EquipmentSys,
  ...ItemClassDbSys,
  ...ManaRegenSys,
  ...MaterialDbSys,
  ...MovementSys,
  ...SetPlayerDestinationSys,
  ...StatusEffectsSys,
  ...TerrainGenSys,
  ...MerchantSys,
];

export default eventListeners;
