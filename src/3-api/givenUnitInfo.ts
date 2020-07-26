import { UnitInfo } from './UnitInfo';

export const givenUnitInfo = (data: Partial<UnitInfo>): UnitInfo => ({
  entityHandle: 0,

  health: 100,
  maxHealth: 100,

  mana: 100,
  maxMana: 100,

  isChanneling: false,
  channelRemaining: 0,
  channelTotalDuration: 0,

  isRecovering: false,
  recoveryRemaining: 0,
  recoveryTotalDuration: 0,

  isStealthed: false,

  targetEntity: -1,

  isEnemy: false,
  position: 0,
  ...data,
});
