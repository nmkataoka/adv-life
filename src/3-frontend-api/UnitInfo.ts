import { GameManager } from '0-engine/GameManager';
import { CombatStatsCmpt } from '1-game-code/Combat/CombatStatsCmpt';
import { HealthCmpt } from '1-game-code/ncomponents/HealthCmpt';
import { FactionCmpt } from '1-game-code/ncomponents/FactionCmpt';
import { CombatPositionCmpt } from '1-game-code/Combat/CombatPositionCmpt';
import { StatusEffectsCmpt } from '1-game-code/Combat/StatusEffectsCmpt';
import { GoalQueueCmpt } from '1-game-code/Agent/GoalQueueCmpt';
import { DictOf } from '8-helpers/DictOf';

export type UnitInfo = {
  entityHandle: number;

  health: number;
  maxHealth: number;

  mana: number;
  maxMana: number;

  isChanneling: boolean;
  channelRemaining: number;
  channelTotalDuration: number;

  isRecovering: boolean;
  recoveryRemaining: number;
  recoveryTotalDuration: number;

  isStealthed: boolean;

  targetEntity: string | number;

  isEnemy?: boolean;
  position: number;
};

const getHealth = (entityHandle: number) => {
  const { eMgr } = GameManager.instance;
  const healthMgr = eMgr.tryGetMgrMut(HealthCmpt);
  const healthCmpt = healthMgr.getMut(entityHandle);

  const { health, maxHealth } = healthCmpt;
  return { health, maxHealth };
};

const getCombatStats = (entityHandle: number) => {
  const { eMgr } = GameManager.instance;
  const combatStatsMgr = eMgr.tryGetMgrMut(CombatStatsCmpt);
  const combatStatsCmpt = combatStatsMgr.getMut(entityHandle);

  const { mana, maxMana } = combatStatsCmpt;
  return { mana, maxMana };
};

const getFaction = (entityHandle: number) => {
  const { eMgr } = GameManager.instance;
  const factionCmpt = eMgr.getCmptMut(FactionCmpt, entityHandle);
  const { isEnemy } = factionCmpt;
  return { isEnemy };
};

const getStatusEffects = (entityHandle: number) => {
  const { eMgr } = GameManager.instance;
  const statusEffectsCmpt = eMgr.getCmptMut(StatusEffectsCmpt, entityHandle);
  const channel = statusEffectsCmpt.GetStatusEffect('Channel');
  const recovering = statusEffectsCmpt.GetStatusEffect('Recover');

  return {
    isChanneling: channel.severity > 0,
    channelRemaining: channel.remainingDuration,
    channelTotalDuration: channel.totalDuration,

    isRecovering: recovering.severity > 0,
    recoveryRemaining: recovering.remainingDuration,
    recoveryTotalDuration: recovering.totalDuration,
    isStealthed: statusEffectsCmpt.IsStatusEffectActive('Stealth'),
  };
};

const getCombatPosition = (entityHandle: number) => {
  const { eMgr } = GameManager.instance;
  const combatPosCmpt = eMgr.getCmptMut(CombatPositionCmpt, entityHandle);
  const { position } = combatPosCmpt;
  return { position };
};

const getNextBactionInfo = (entityHandle: number) => {
  const { eMgr } = GameManager.instance;
  const goalQueueCmpt = eMgr.tryGetCmptMut(GoalQueueCmpt, entityHandle);

  let targetEntity = -1;
  if (goalQueueCmpt && goalQueueCmpt.nextAction) {
    const {
      nextAction: { entityBinding },
    } = goalQueueCmpt;
    if (entityBinding.length > 1) {
      targetEntity = entityBinding[1];
    }
  }
  return { targetEntity };
};

export const getUnitInfos = (): DictOf<UnitInfo> => {
  const { eMgr } = GameManager.instance;
  const units: DictOf<UnitInfo> = {};
  const unitView = eMgr.getView([HealthCmpt], [], []);
  for (let i = 0; i < unitView.count; ++i) {
    const e = unitView.at(i);

    const healthInfo = getHealth(e);
    const combatStatsInfo = getCombatStats(e);
    const factionInfo = getFaction(e);
    const statusEffectsInfo = getStatusEffects(e);
    const combatPosInfo = getCombatPosition(e);
    const nextBactionInfo = getNextBactionInfo(e);

    units[e] = {
      entityHandle: e,
      ...combatPosInfo,
      ...combatStatsInfo,
      ...factionInfo,
      ...healthInfo,
      ...nextBactionInfo,
      ...statusEffectsInfo,
    };
  }

  return units;
};
