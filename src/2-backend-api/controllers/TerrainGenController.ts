import { Controller, RequestData, Router } from '0-engine';
import { EventSys } from '0-engine/ECS/event-system';
import { createNoisedWorldMap } from '1-game-code/World/TerrainGenSys';
import { CREATE_NOISED_TERRAIN } from './TerrainGenConstants';

export class TerrainGenController extends Controller {
  public Start = (router: Router): void => {
    router.addRoute(CREATE_NOISED_TERRAIN, this.OnCreateNoisedTerrain);
  };

  public OnUpdate(): void {}

  private OnCreateNoisedTerrain = async (
    { payload }: RequestData<undefined>,
    dispatch: typeof EventSys.prototype.Dispatch,
  ): Promise<void> => {
    return dispatch(createNoisedWorldMap(payload));
  };
}
