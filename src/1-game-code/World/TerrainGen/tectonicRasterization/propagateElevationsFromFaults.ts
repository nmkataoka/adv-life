import { DataLayer } from '1-game-code/World/DataLayer/DataLayer';
import { Vector2 } from '8-helpers/math';
import { multiply } from '8-helpers/math/Vector2';
import { WorldMap } from '1-game-code/World/WorldMap';
import { convergence, Fault, hasSamePlateTypes, MAX_CONVERGENCE } from '../Fault';
import { floodfillFromFault } from './floodfillFromFault';
import { defaultHilliness, mountainHilliness, hillHilliness } from './constants';

const RiftSettings = {
  divergent: {
    min: -500,
    range: -2000,
  },
  subduction: {
    min: -2000,
    range: -4000,
  },
} as const;

const RidgeSettings = {
  divergent: {
    min: 400,
    range: 2000,
  },
  subduction: {
    min: 500,
    range: 2000,
  },
  contConvergent: {
    // Since cont convergent mountains are the tallest points on the map,
    // min + range + highest base continent altitude + max of all elevation noise
    // equals the maximum possible elevation.
    min: 1500,
    range: 3500,
  },
} as const;

/** Real mountain ranges have an average width slope of about 0.005 (4mi tall, 50m wide).
 *
 * However, this is a very useful parameter to tune non-realistically for two purposes:
 * - If the fault lengths are very short, steep slopes are needed to pack large altitude
 *   differentials into a small space. This implies there are too many tecplates for the world size.
 * - If the features have small altitude differentials, shallow slopes can widen fault
 *   features for aethestic reasons in order to
 */
const ridgeSlope = 0.01;

const riftSlope = 0.01;

/** For each fault, a fault profile is built, which is basically
 * a cross-sectional slice perpendicular to the fault line. The fault profile
 * is then applied (with some noising) along the fault..
 */
export function propagateElevationsFromFaults(
  elevLayer: DataLayer,
  hillinessLayer: DataLayer,
  faults: Fault[],
): void {
  const { width, height, metersPerCoord } = elevLayer;
  const elevChanges = new DataLayer('elevChanges', width, height, metersPerCoord);
  elevChanges.setAll(0);
  faults.forEach((fault) => {
    const { vertices } = fault;
    if (vertices.length < 2) throw new Error('Fault has fewer than 2 vertices.');

    const faultFeatures = constructFaultProfile(fault, metersPerCoord);
    faultFeatures.forEach((feature) => {
      applyFaultFeature(elevChanges, hillinessLayer, fault, feature);
    });
  });

  // Apply elevChanges
  for (let yi = 0; yi < height; ++yi) {
    for (let xi = 0; xi < width; ++xi) {
      elevLayer.set(xi, yi, elevLayer.at(xi, yi) + elevChanges.at(xi, yi));
    }
  }
}

/** Because fault profiles can be complicated, e.g. ridge on one side of the fault and
 * a rift on the other, we break them up into one or more fault features.
 */
type FaultFeature = {
  /** One half of the cross-section elevation profile of the fault feature.
   * Each index corresponds to one world map tile. Applied symmetrically
   * on the fault, with 0-index at the center. */
  elevProfile: number[];
  hilliness: number;
  shift: Vector2;
};

function constructFaultProfile(fault: Fault, metersPerCoord: number): FaultFeature[] {
  const { tecPlateHigher } = fault;
  const samePlateType = hasSamePlateTypes(fault);
  const conv = convergence(fault);

  // AdjustedConv is like a height intensifier. Greater absval of convergence means
  // a deeper rift or higher mountains.
  const adjustedConv = Math.abs(conv / MAX_CONVERGENCE);

  const faultFeatures: FaultFeature[] = [];
  if (conv < 0) {
    if (samePlateType) {
      if (tecPlateHigher.isOceanic) {
        // Divergent oceanic ridge
        faultFeatures.push(
          createRidgeFeature(
            'divergent',
            adjustedConv,
            metersPerCoord,
            fault.length,
            hillHilliness,
          ),
        );
      } else {
        // Continental rift
        // In order to reduce the frequency of rifts, we are furthing gating by convergence
        // Threshold = 0.5 => 50% of rifts remain smooth plate transitions
        // eslint-disable-next-line no-lonely-if
        if (adjustedConv > 0.5) {
          faultFeatures.push(
            createRiftFeature(
              'divergent',
              adjustedConv,
              metersPerCoord,
              fault.length,
              defaultHilliness,
            ),
          );
        }
      }
    } else {
      // Divergent ocean-continent makes a smooth coast.
      // (not scientifically accurate but it workd here)
      // By default, smooth coasts are created by shapeCoasts.
    }
  } else if (samePlateType) {
    if (tecPlateHigher.isOceanic) {
      // Convergent oceanic forms a subduction
      const features = createSubductionFeatures(
        adjustedConv,
        metersPerCoord,
        fault.length,
        fault.normalDir,
      );
      faultFeatures.push(...features);
    } else {
      // Convergent continents -> huge mountains
      const feature = createRidgeFeature(
        'contConvergent',
        adjustedConv,
        metersPerCoord,
        fault.length,
        mountainHilliness,
      );
      faultFeatures.push(feature);
    }
  } else {
    // Convergence between ocean and continental is subduction
    const features = createSubductionFeatures(
      adjustedConv,
      metersPerCoord,
      fault.length,
      fault.normalDir,
    );
    faultFeatures.push(...features);
  }
  return faultFeatures;
}

function createRidgeFeature(
  ridgeType: keyof typeof RidgeSettings,
  adjustedConv: number,
  metersPerCoord: number,
  faultLength: number,
  hilliness: number,
  shift?: Vector2,
): FaultFeature {
  const { min, range } = RidgeSettings[ridgeType];
  // The ridge width must be less than 1/2 the fault length in order to minimize
  // issues around the fault intersections. Since we use a constant ridge slope,
  // we need to cap the ridge height to a function of the fault length.
  const maxRidgeWidth = Math.floor(Math.floor(faultLength - 1) / 2) * metersPerCoord;
  const ridgeHeight = Math.max(
    min,
    Math.min(min + range * adjustedConv, maxRidgeWidth * ridgeSlope),
  );
  const elevProfile: number[] = [];
  addElevProfileSection(elevProfile, ridgeHeight, 0, -metersPerCoord * ridgeSlope);
  return { hilliness, shift: shift ?? [0, 0], elevProfile };
}

function createRiftFeature(
  riftType: keyof typeof RiftSettings,
  adjustedConv: number,
  metersPerCoord: number,
  faultLength: number,
  hilliness: number,
  shift?: Vector2,
): FaultFeature {
  const { min, range } = RiftSettings[riftType];
  const maxRiftWidth = Math.floor(Math.floor(faultLength - 1) / 2) * metersPerCoord;
  const riftDepth = Math.min(min, Math.max(min + range * adjustedConv, -maxRiftWidth * riftSlope));
  const elevProfile: number[] = [];
  addElevProfileSection(elevProfile, riftDepth, 0, metersPerCoord * riftSlope);
  return { hilliness, shift: shift ?? [0, 0], elevProfile };
}

function createSubductionFeatures(
  adjustedConv: number,
  metersPerCoord: number,
  faultLength: number,
  normalDir: Vector2,
): FaultFeature[] {
  // Create oceanic ridge or coastal mountain range
  const ridgeFeature = createRidgeFeature(
    'subduction',
    adjustedConv,
    metersPerCoord,
    faultLength,
    mountainHilliness,
    multiply(normalDir, 130000 / metersPerCoord),
  );
  // Create oceanic trench
  const riftFeature = createRiftFeature(
    'subduction',
    adjustedConv,
    metersPerCoord,
    faultLength,
    hillHilliness,
    multiply(normalDir, -90000 / metersPerCoord),
  );
  return [ridgeFeature, riftFeature];
}

function addElevProfileSection(
  profile: number[],
  startElev: number,
  finalElev: number,
  slope: number,
): void {
  if (startElev < finalElev) {
    if (slope <= 0)
      throw new Error(
        'addElevProfileSection will never finish. Did you put the wrong sign on the slope?',
      );
    for (let elev = startElev; elev < finalElev; elev += slope) {
      profile.push(elev);
    }
  } else {
    if (slope >= 0)
      throw new Error(
        'addElevProfileSection will never finish. Did you put the wrong sign on the slope?',
      );
    for (let elev = startElev; elev > finalElev; elev += slope) {
      profile.push(elev);
    }
  }
}

/** Writes fault profile to an 'additive' elevation layer that will be merged with
 * the world map elevation layer at the end. Uses floodFillFromFault to apply fault profiles.
 */
function applyFaultFeature(
  elevChanges: DataLayer,
  hillinessLayer: DataLayer,
  fault: Fault,
  feature: FaultFeature,
) {
  if (feature.elevProfile.length < 2) {
    throw new Error('Fault feature elev profile is missing entries.');
  }
  if (hillinessLayer.name !== WorldMap.Layer.Hilliness) {
    throw new Error(`Wrong data layer ${hillinessLayer.name} passed instead of hilliness layer`);
  }

  const { shift, elevProfile, hilliness } = feature;

  /** Calculate skipSegments
   * This clips the ends of the fault for the floodfill algorithm in order
   * to prevent the floodfill from spilling too far past the fault ends.
   *
   * Basically subtracts the length of the fault profile, but caps it at
   * just under half the fault's length. If skipSegments is greater than half
   * the fault's length, then the entire fault feature would be skipped,
   * which is undesirable (although likely reflective of an upstream issue
   * with the feature profile being too long).
   */
  const skipSegments = Math.min(
    elevProfile.length - 1,
    Math.floor(Math.floor(fault.vertices.length - 1) / 2),
  );

  // This warning is useful for debugging, but during tests it's too noisy
  // const featureLength = feature.elevProfile.length;
  // if (featureLength > fault.length / 2) {
  //   // eslint-disable-next-line no-console
  //   console.warn(
  //     `Feature profile is longer than half the fault length. The entire fault feature is in danger of being skipped.` +
  //       `Fault length: ${fault.length.toFixed(2)}, feature length: ${featureLength.toFixed(2)}`,
  //   );
  // }

  floodfillFromFault(
    elevChanges,
    fault,
    shift,
    elevProfile.length - 1,
    skipSegments,
    (x: number, y: number, t: number) => {
      // Feature is applied in a max fashion.
      // E.g. for ridge areas, only the highest ridge is applied
      const elevChange = elevProfile[t];
      if (elevChange > 0) {
        if (elevChange > elevChanges.at(x, y)) {
          elevChanges.set(x, y, elevChange);
        }
      } else if (elevChange < elevChanges.at(x, y)) {
        elevChanges.set(x, y, elevChange);
      }

      if (hilliness > hillinessLayer.at(x, y)) {
        hillinessLayer.set(x, y, hilliness);
      }
    },
  );
}
