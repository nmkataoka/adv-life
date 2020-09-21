import { CharacterCreationController } from '2-backend-api/controllers/CharacterCreationController';
import { ShopController } from '2-backend-api/controllers/ShopController';
import { ControllerConstructor } from './API/Controller';

const controllers: ControllerConstructor<any>[] = [CharacterCreationController, ShopController];

export default controllers;
