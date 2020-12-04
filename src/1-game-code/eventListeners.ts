import CharacterCreationSys from './CharacterCreation/CharacterCreationSys';
import AttackSys from './Combat/AttackSys';
import CombatLogSys from './Combat/CombatLogSys';
import ManaRegenSys from './Combat/ManaRegenSys';
import MovementSys from './Combat/MovementSys';
import SetPlayerDestinationSys from './Combat/SetPlayerDestinationSys';
import StatusEffectsSys from './Combat/StatusEffectsSys';
import EquipmentSys from './Inventory/EquipmentSys';
import MerchantSys from './Merchant/MerchantSys';
import TerrainGenSys from './World/TerrainGenSys';

const eventListeners = [
  ...AttackSys,
  ...CharacterCreationSys,
  ...CombatLogSys,
  ...EquipmentSys,
  ...ManaRegenSys,
  ...MovementSys,
  ...SetPlayerDestinationSys,
  ...StatusEffectsSys,
  ...TerrainGenSys,
  ...MerchantSys,
];

export default eventListeners;
