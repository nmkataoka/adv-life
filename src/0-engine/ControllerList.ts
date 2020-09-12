import { CharacterCreationController } from '../2-backend-api/controllers/character-creation.controller';
import { ShopController } from '../2-backend-api/controllers/shop-controller';
import { Controller, ControllerConstructor } from './API/Controller';

const controllers: ControllerConstructor<any>[] = [CharacterCreationController, ShopController];

export default controllers;
