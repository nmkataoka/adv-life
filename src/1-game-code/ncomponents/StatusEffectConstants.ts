// The basic stats that StatusEffects can effect
// StatusEffects are built by affecting one or more StatusAbilities
// in a particular manner
export enum StatusAbility {
  // Are effectively booleans, if any relevant StatusEffect is active, should be 1
  CanChooseMovementDestination = 0,
  CanChooseAttackTarget,
  CanDiscernFriendFromFoe,
  CanUseMagic,
  IsTargetable,

  // The following StatusAbilities calculate the current severity
  // as the max severity of all relevant active status effects
  USE_MAX_TO_AGGREGATE,
  MovementSpeedSlow,
  ActionSpeedSlow,
  SightRadiusMultiplier,

  MAX
}

// Destructuring for convenience
const {
  CanChooseMovementDestination = 0,
  CanChooseAttackTarget,
  CanDiscernFriendFromFoe,
  CanUseMagic,
  IsTargetable,

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
  Stealth: [IsTargetable],
  Stun: [CanChooseMovementDestination, CanChooseAttackTarget, MovementSpeedSlow, ActionSpeedSlow],
};

// Reverse mapping of StatusEffect
export const StatusAbilityToStatusEffects = Object.entries(StatusEffect).reduce(
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
