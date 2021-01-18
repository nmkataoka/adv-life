import { Thunk } from '0-engine/ECS/Thunk';
import { NoiseParams } from '1-game-code/Noise';
import { createWorldMap, TerrainGenParams } from '1-game-code/World/TerrainGen/TerrainGenSys';
import { WorldGenModules } from '../constants';
import { terrainGenControls } from '../constants/terrainGenControls';
import { TabContentProps } from './TabContent';

/** Single function to create a new world. Covers entirety of world gen. */
export const createWorld = (seed: string, settings: typeof WorldGenModules): Thunk => async (
  dispatch,
) => {
  const [terrainSettings] = settings;
  const { content } = terrainSettings;
  const terrainGenParams = parseTerrainGenParams(seed, content);
  return dispatch(createWorldMap(terrainGenParams));
};

/** Parses the UI settings data format into the payload expected by the backend */
function parseTerrainGenParams(seed: string, content: typeof terrainGenControls): TerrainGenParams {
  const generalOptions = parseContentSectionIntoDict(content, 'General');
  const { width, height, numPlates, oceanFrac: oceanPercent } = generalOptions;
  const oceanFrac = oceanPercent / 100;
  if (!width || !height || !numPlates || !oceanFrac)
    throw new Error('Something went wrong gathering the world gen settings.');

  const faultFeatureOptions = parseContentSectionIntoDict(content, 'Fault Features');
  const { coastSlope, ridgeSlope, riftSlope } = faultFeatureOptions;
  if (!coastSlope || !ridgeSlope || !riftSlope)
    throw new Error('Something went wrong gathering world gen settings.');

  const faultPerturbationNoise = parseNoiseSection(content, 'Fault Shape');
  const lowFreqNoise = parseNoiseSection(content, 'Low Frequency Noise');
  const ridgeNoise = parseNoiseSection(content, 'Ridge Noise');

  const terrainGenParams: TerrainGenParams = {
    seed,
    width,
    height,
    numPlates,
    oceanFrac,
    coastSlope,
    ridgeSlope,
    riftSlope,
    faultPerturbationNoise,
    lowFreqNoise,
    ridgeNoise,
  };
  return terrainGenParams;
}

function parseContentSectionIntoDict(
  content: TabContentProps['content'],
  heading: string,
): { [key: string]: any } {
  const dictionary = content
    .find(({ heading: h }) => heading === h)
    ?.options.reduce((dict, option) => {
      dict[option.key] = option.value;
      return dict;
    }, {} as { [key: string]: any });
  if (!dictionary) throw new Error('Something went wrong parsing the world gen settings.');
  return dictionary;
}

function parseNoiseSection(content: TabContentProps['content'], heading: string): NoiseParams {
  const dict = parseContentSectionIntoDict(content, heading);
  const scaleKeyName = Object.keys(dict).find((key) => key.slice(-5) === 'Scale');
  if (!scaleKeyName)
    throw new Error('Noise param section was missing `scale` key. Was the wrong section passed?');
  const prefix = scaleKeyName.slice(0, -5);
  const freqKeyName = `${prefix}Frequency`;
  const octavesKeyName = `${prefix}Octaves`;
  const lacunarityKeyName = `${prefix}Lacunarity`;
  const gainKeyName = `${prefix}Gain`;
  const {
    [scaleKeyName]: scale,
    [freqKeyName]: frequency,
    [octavesKeyName]: octaves,
    [lacunarityKeyName]: lacunarity,
    [gainKeyName]: gain,
  } = dict;
  return { scale, frequency, octaves, lacunarity, gain };
}
