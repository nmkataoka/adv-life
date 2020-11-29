import { CharacterCreationController } from '2-backend-api/controllers/CharacterCreationController';
import { PlayerMovementController } from '2-backend-api/controllers/PlayerMovementController';
import { ShopController } from '2-backend-api/controllers/ShopController';
import { TerrainGenController } from '2-backend-api/controllers/TerrainGenController';
import { ControllerConstructor } from './API/Controller';

const controllers: ControllerConstructor<any>[] = [
  CharacterCreationController,
  PlayerMovementController,
  ShopController,
  TerrainGenController,
];

export default controllers;
