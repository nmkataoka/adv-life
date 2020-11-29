import { Controller, EventSys, RequestData, Router } from '0-engine';
import { CREATE_NOISED_WORLD_MAP } from '1-game-code/World/constants';
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
    return dispatch({ type: CREATE_NOISED_WORLD_MAP, payload });
  };
}
