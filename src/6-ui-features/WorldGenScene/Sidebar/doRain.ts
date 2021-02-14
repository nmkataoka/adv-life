import { Thunk } from '0-engine/ECS/Thunk';
import { rain, WaterParams } from '1-game-code/World/Hydrology/RainSys';
import { WorldGenModules } from '../constants';
import { rainControls } from '../constants/rainControls';
import { parseContentSectionIntoDict } from './createWorld';

function parseWaterParams(content: typeof rainControls): WaterParams {
  const { dt, numDrops, ...dropParams } = parseContentSectionIntoDict(content, 'Rain Settings');
  return { dropParams, dt, numDrops } as WaterParams;
}

export const doRain = (settings: typeof WorldGenModules): Thunk => async (dispatch) => {
  const rainSettings = settings[2];
  const { content: rainContent } = rainSettings;
  const waterParams = parseWaterParams(rainContent);
  await dispatch(rain(waterParams));
};
