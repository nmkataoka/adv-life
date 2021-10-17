import { EventListener } from '0-engine/ECS/event-system/EventListener';
import AgentSys from './Agent/AgentSys';
import CharacterCreationSys from './CharacterCreation/CharacterCreationSys';
import AttackSys from './Combat/AttackSys';
import ManaRegenSys from './Combat/ManaRegenSys';
import MovementSys from './Combat/MovementSys';
import SetPlayerDestinationSys from './Combat/SetPlayerDestinationSys';
import StatusEffectsSys from './Combat/StatusEffectsSys';
import EquipmentSys from './Inventory/EquipmentSys';
import ItemClassDbSys from './Items/ItemClass/ItemClassDbSys';
import MaterialDbSys from './Items/Material/MaterialDbSys';
import MerchantSys from './Merchant/MerchantSys';
import TownSys from './Town/TownSys';
import TravelToLocationSys from './Unit/TravelToLocationSys';
import CivSys from './World/Civs/CivSys';
import CivTurnSys from './World/Civs/CivTurnSys';
import FoodSys from './World/Food/FoodSys';
import RainSys from './World/Hydrology/RainSys';
import TerrainGenSys from './World/TerrainGen/TerrainGenSys';

const eventListeners: EventListener<any, any>[] = [
  ...AgentSys,
  ...AttackSys,
  ...CharacterCreationSys,
  ...CivSys,
  ...CivTurnSys,
  ...EquipmentSys,
  ...FoodSys,
  ...ItemClassDbSys,
  ...ManaRegenSys,
  ...MaterialDbSys,
  ...MovementSys,
  ...RainSys,
  ...SetPlayerDestinationSys,
  ...StatusEffectsSys,
  ...TerrainGenSys,
  ...TownSys,
  ...TravelToLocationSys,
  ...MerchantSys,
];

export default eventListeners;
