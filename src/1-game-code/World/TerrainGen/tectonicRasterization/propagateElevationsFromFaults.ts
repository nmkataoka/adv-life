import { DataLayer } from '1-game-code/World/DataLayer';
import { Vector2 } from '8-helpers/math';
import { multiply } from '8-helpers/math/Vector2';
import { convergence, Fault, hasSamePlateTypes, MAX_CONVERGENCE } from '../Fault';
import { floodfillFromFault } from './floodfillFromFault';

const RiftSettings = {
  divergent: {
    min: -500,
    range: -2000,
    // widthMin: 200000,
    // riftWidthRange: 800000,
  },
  subduction: {
    min: -2000,
    range: -4000,
    // const sRiftWidthMin = 100000;
    // const sRiftWidthRng = 1000000;
  },
} as const;

const RidgeSettings = {
  divergent: {
    min: 1400,
    range: 1000,
    widthMin: 100000,
    widthRange: 4000000,
  },
  subduction: {
    min: 1500,
    range: 400,
    widthMin: 200000,
    widthRange: 2000000,
  },
  contConvergent: {
    // Since cont convergent mountains are the tallest points on the map,
    // min + range + highest base continent altitude + max of all elevation noise
    // equals the maximum possible elevation.
    min: 2000,
    range: 500,
    widthMin: 200000,
    widthRange: 2000000,
  },
} as const;

// Elevation Noise
const defaultHilliness = 1; // WARNING: This needs to match "default hilliness" in Elevation.cpp
const mountainHilliness = 5000;
const hillHilliness = 2000;

/** For each fault, a fault profile is built, which is basically
 * a cross-sectional slice perpendicular to the fault line. The fault profile
 * is then applied (with some noising) along the fault..
 */
export function propagateElevationsFromFaults(elevLayer: DataLayer, faults: Fault[]): void {
  const { width, height, metersPerCoord } = elevLayer;
  const elevChanges = new DataLayer(width, height, metersPerCoord);
  elevChanges.setAll(0);
  faults.forEach((fault) => {
    const { vertices } = fault;
    if (vertices.length < 2) throw new Error('Fault has fewer than 2 vertices.');

    const faultFeatures = constructFaultProfile(fault, metersPerCoord);
    faultFeatures.forEach((feature) => {
      applyFaultFeature(elevChanges, fault, feature);
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
          createRidgeFeature('divergent', adjustedConv, metersPerCoord, hillHilliness),
        );
      } else {
        // Continental rift
        // In order to reduce the frequency of rifts, we are furthing gating by convergence
        // Threshold = 0.5 => 50% of rifts remain smooth plate transitions
        // eslint-disable-next-line no-lonely-if
        if (adjustedConv > 0.5) {
          faultFeatures.push(
            createRiftFeature('divergent', adjustedConv, metersPerCoord, defaultHilliness),
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
      faultFeatures.push(
        ...createSubductionFeatures(adjustedConv, metersPerCoord, fault.normalDir),
      );
    } else {
      // Convergent continents -> huge mountains
      faultFeatures.push(
        createRidgeFeature('contConvergent', adjustedConv, metersPerCoord, mountainHilliness),
      );
    }
  } else {
    // Convergence between ocean and continental is subduction
    faultFeatures.push(...createSubductionFeatures(adjustedConv, metersPerCoord, fault.normalDir));
  }
  return faultFeatures;
}

function createRidgeFeature(
  ridgeType: keyof typeof RidgeSettings,
  adjustedConv: number,
  metersPerCoord: number,
  hilliness: number,
  shift?: Vector2,
): FaultFeature {
  const { min, range, widthMin, widthRange } = RidgeSettings[ridgeType];
  const ridgeHeight = min + range * adjustedConv;
  const ridgeHalfWidth = (widthMin + widthRange * adjustedConv) / 2;
  const elevProfile: number[] = [];
  addConstantElevProfileSection(elevProfile, ridgeHeight, ridgeHalfWidth / metersPerCoord);
  addElevProfileSection(elevProfile, ridgeHeight, 0, -metersPerCoord * 0.002);
  return { hilliness, shift: shift ?? [0, 0], elevProfile };
}

function createRiftFeature(
  riftType: keyof typeof RiftSettings,
  adjustedConv: number,
  metersPerCoord: number,
  hilliness: number,
  shift?: Vector2,
): FaultFeature {
  const { min, range } = RiftSettings[riftType];
  const riftDepth = min + range * adjustedConv;
  const elevProfile: number[] = [];
  addElevProfileSection(elevProfile, riftDepth, 0, metersPerCoord * 0.002);
  return { hilliness, shift: shift ?? [0, 0], elevProfile };
}

function createSubductionFeatures(
  adjustedConv: number,
  metersPerCoord: number,
  normalDir: Vector2,
): FaultFeature[] {
  // Create oceanic ridge or coastal mountain range
  const ridgeFeature = createRidgeFeature(
    'subduction',
    adjustedConv,
    metersPerCoord,
    mountainHilliness,
    multiply(normalDir, 800000 / metersPerCoord),
  );
  // Create oceanic trench
  const riftFeature = createRiftFeature(
    'subduction',
    adjustedConv,
    metersPerCoord,
    hillHilliness,
    multiply(normalDir, -500000 / metersPerCoord),
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

function addConstantElevProfileSection(profile: number[], elev: number, indices: number): void {
  for (let i = 0; i < indices; ++i) {
    profile.push(elev);
  }
}

/** Writes fault profile to an 'additive' elevation layer that will be merged with
 * the world map elevation layer at the end. Uses floodFillFromFault to apply fault profiles.
 */
function applyFaultFeature(elevChanges: DataLayer, fault: Fault, feature: FaultFeature) {
  if (feature.elevProfile.length < 2) {
    throw new Error('Fault feature elev profile is missing entries.');
  }
  const { shift, elevProfile } = feature;

  /** Calculate skipSegments
   * This clips the ends of the fault for the floodfill algorithm in order
   * to prevent the floodfill from spilling too far past the fault ends.
   *
   * Basically subtracts the length of the fault profile.
   */
  floodfillFromFault(
    elevChanges,
    fault,
    shift,
    elevProfile.length - 1,
    elevProfile.length - 1, // Skip segments
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
      // TODO: if(hilliness > /* TODO */) {}
    },
  );
}
