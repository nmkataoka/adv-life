import { NComponent } from '../0-engine/ECS/NComponent';

// The basic stats that StatusEffects can effect
// StatusEffects are built by affecting one or more StatusAbilities
// in a particular manner
export enum StatusAbility {
  // Are effectively booleans, if any relevant StatusEffect is active, should be 1
  CanChooseMovementDestination = 0,
  CanChooseAttackTarget,
  CanDiscernFriendFromFoe,
  CanUseMagic,

  // The following StatusAbilities calculate the current severity
  // as the max severity of all relevant active status effects
  USE_MAX_TO_AGGREGATE,
  MovementSpeedSlow,
  ActionSpeedSlow,
  SightRadiusMultiplier,

  MAX
}

const {
  CanChooseMovementDestination = 0,
  CanChooseAttackTarget,
  CanDiscernFriendFromFoe,
  CanUseMagic,

  MovementSpeedSlow,
  ActionSpeedSlow,
  SightRadiusMultiplier,
} = StatusAbility;

// The actual status effects as players think about them.
// They affect one or more StatusAbilities in a particular manner.
// This constant acts as a StatusEffect enum as well as a StatusEffect -> StatusAbility map
export const StatusEffect = {
  ActionSpeedSlow: [ActionSpeedSlow],
  Blind: [SightRadiusMultiplier],
  Channel: [],
  Confuse: [CanDiscernFriendFromFoe],
  Disable: [ActionSpeedSlow, CanChooseAttackTarget],
  MovementSpeedSlow: [MovementSpeedSlow],
  Recover: [],
  Root: [CanChooseMovementDestination, MovementSpeedSlow],
  Silence: [CanUseMagic],
  Sleep: [CanChooseMovementDestination, CanChooseAttackTarget, MovementSpeedSlow, ActionSpeedSlow],
  Stun: [CanChooseMovementDestination, CanChooseAttackTarget, MovementSpeedSlow, ActionSpeedSlow],
};

// Reverse mapping of StatusEffect
const StatusAbilityToStatusEffects = Object.entries(StatusEffect).reduce(
  (map: {[key: number]: (keyof typeof StatusEffect)[]}, [statusEffect, statusAbilities]) => {
    statusAbilities.forEach((sa) => {
      if (map[sa] == null) {
        map[sa] = [];
      }
      map[sa].push(statusEffect as keyof typeof StatusEffect);
    });
    return map;
  }, {},
);

export class StatusEffectsCmpt implements NComponent {
  constructor() {
    this.activeStatusEffects = Object.keys(StatusEffect).reduce(
      (record: Partial<ActiveStatusEffectsRecord>, key) => {
        record[key as keyof typeof StatusEffect] = [];
        return record;
      }, {},
    ) as ActiveStatusEffectsRecord;

    this.statusAbilities = [];
    for (let i = 0; i < StatusAbility.MAX; ++i) {
      this.statusAbilities.push(0);
    }
  }

  public StartEffect(
    statusEffect: keyof typeof StatusEffect,
    data: {severity: number; duration: number},
  ) {
    const { severity, duration } = data;
    this.activeStatusEffects[statusEffect].push({
      severity,
      remainingDuration: duration,
      totalDuration: duration,
    });

    // Update status abiltiies
    StatusEffect[statusEffect].forEach((statusAbility) => {
      if (this.statusAbilities[statusAbility] < severity) {
        this.RecalculateStatusAbility(statusAbility);
      }
    });
  }

  public GetStatusAbilitySeverity(statusAbility: number): number {
    return this.statusAbilities[statusAbility];
  }

  public StatusEffectIsActive(statusEffect: keyof typeof StatusEffect): boolean {
    return this.activeStatusEffects[statusEffect].length > 0;
  }

  // Returns the status effect with max severity
  public GetStatusEffect(statusEffect: keyof typeof StatusEffect): ActiveStatusEffectData {
    return this.GetMaxStatusEffect(statusEffect);
  }

  public DecreaseRemainingTimeOfStatusEffects(dt: number): void {
    Object.entries(this.activeStatusEffects).forEach(([statusEffect, activeEffects]) => {
      for (let i = 0; i < activeEffects.length; ++i) {
        const { remainingDuration } = activeEffects[i];
        const newRemainingDuration = remainingDuration - dt;

        if (newRemainingDuration <= 0) {
          this.CancelStatusEffect(statusEffect as keyof typeof StatusEffect, i);
        } else {
          activeEffects[i] = { ...activeEffects[i], remainingDuration: newRemainingDuration };
        }
      }
    });
  }

  public CancelStatusEffect(statusEffect: keyof typeof StatusEffect, idx: number): void {
    const [{ severity }] = this.activeStatusEffects[statusEffect].splice(idx, 1);

    // Update all possibly affected StatusAbilities
    StatusEffect[statusEffect].forEach((statusAbility) => {
      // If statusAbility is a Min/Max aggregated field and this is NOT the extreme value,
      // we are certain that the extreme value still exists
      // eslint-disable-next-line max-len
      const statusAbilityIsUnaffected = statusAbility > StatusAbility.USE_MAX_TO_AGGREGATE && severity !== this.statusAbilities[statusAbility];
      if (!statusAbilityIsUnaffected) {
        this.RecalculateStatusAbility(statusAbility);
      }
    });
  }

  // Calculate the current status ability severity
  // by aggregating over associated StatusEffects
  private RecalculateStatusAbility(statusAbility: number): void {
    const isActive = this.GetTotalActiveStatusEffectsForStatusAbility(statusAbility) > 0;
    if (!isActive) {
      this.statusAbilities[statusAbility] = 0;
    } else if (statusAbility < StatusAbility.USE_MAX_TO_AGGREGATE) {
      // Uses bool
      this.statusAbilities[statusAbility] = 1;
    } else {
      // Uses max
      this.statusAbilities[statusAbility] = this.GetMaxSeverityForStatusAbility(statusAbility);
    }
  }

  private GetTotalActiveStatusEffectsForStatusAbility(statusAbility: number): number {
    const statusEffects = StatusAbilityToStatusEffects[statusAbility];
    let total = 0;
    statusEffects.forEach((statusEffect) => {
      total += this.activeStatusEffects[statusEffect].length;
    });
    return total;
  }

  private GetMaxSeverityForStatusAbility(statusAbility: number): number {
    let max = -1;
    const statusEffects = StatusAbilityToStatusEffects[statusAbility];
    statusEffects.forEach((statusEffect) => {
      this.activeStatusEffects[statusEffect].forEach(({ severity }) => {
        if (severity > max) {
          max = severity;
        }
      });
    });
    return max;
  }

  // Gets the duration of the MAX severity status effect
  private GetMaxStatusEffect(statusEffect: keyof typeof StatusEffect): ActiveStatusEffectData {
    const max = -1;
    let maxStatusEffect = { severity: -1, remainingDuration: 0, totalDuration: 0 };
    this.activeStatusEffects[statusEffect].forEach((activeStatusEffect) => {
      if (activeStatusEffect.severity > max) {
        maxStatusEffect = activeStatusEffect;
      }
    });
    return maxStatusEffect;
  }

  // public channelRemaining = 0;

  // public channelTotalDuration = 0;

  // public recoveryRemaining = 0;

  // public recoveryTotalDuration = 0;

  // public isChanneling() {
  //   return this.channelRemaining > 0;
  // }

  // public startChanneling(channelDuration: number) {
  //   this.channelRemaining = channelDuration;
  //   this.channelTotalDuration = channelDuration;
  // }

  // public cancelChannel() {
  //   this.channelRemaining = 0;
  // }

  // public isRecovering() {
  //   return this.recoveryRemaining > 0;
  // }

  // public startRecovering(recoveryDuration: number) {
  //   this.recoveryRemaining = recoveryDuration;
  //   this.recoveryTotalDuration = recoveryDuration;
  // }

  // Stores the current severity affecting the unit (usually the max of all penalties of this type)
  // Indexed by StatusAbility enum
  private statusAbilities: number[];

  private activeStatusEffects: ActiveStatusEffectsRecord;
}

type ActiveStatusEffectsRecord = Record<keyof typeof StatusEffect, ActiveStatusEffectData[]>;

export type ActiveStatusEffectData = {
  severity: number;
  remainingDuration: number;
  totalDuration: number;
}
