import { GameManager } from '../0-engine/GameManager';
import { CombatStatsCmpt } from '../1- ncomponents/CombatStatsCmpt';
import { HealthCmpt } from '../1- ncomponents/HealthCmpt';
import { FactionCmpt } from '../1- ncomponents/FactionCmpt';
import { CombatPositionCmpt } from '../1- ncomponents/CombatPositionCmpt';
import { StatusEffectsCmpt } from '../1- ncomponents/StatusEffectsCmpt';
import { GetView } from '../0-engine/ECS/View';
import { AgentCmpt } from '../1- ncomponents/AgentCmpt';

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

export type UnitsDict = {
  [key: string]: UnitInfo;
};

const getHealth = (entityHandle: number) => {
  const { eMgr } = GameManager.instance;
  const healthMgr = eMgr.GetComponentManager(HealthCmpt);
  const healthCmpt = healthMgr.GetByNumber(entityHandle);

  const { health, maxHealth } = healthCmpt;
  return { health, maxHealth };
};

const getCombatStats = (entityHandle: number) => {
  const { eMgr } = GameManager.instance;
  const combatStatsMgr = eMgr.GetComponentManager(CombatStatsCmpt);
  const combatStatsCmpt = combatStatsMgr.GetByNumber(entityHandle);

  const { mana, maxMana } = combatStatsCmpt;
  return { mana, maxMana };
};

const getFaction = (entityHandle: number) => {
  const { eMgr } = GameManager.instance;
  const factionCmpt = eMgr.GetComponent(FactionCmpt, entityHandle);
  const { isEnemy } = factionCmpt;
  return { isEnemy };
};

const getStatusEffects = (entityHandle: number) => {
  const { eMgr } = GameManager.instance;
  const statusEffectsCmpt = eMgr.GetComponent(StatusEffectsCmpt, entityHandle);
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
  const combatPosCmpt = eMgr.GetComponent(CombatPositionCmpt, entityHandle);
  const { position } = combatPosCmpt;
  return { position };
};

const getBactionInfo = (entityHandle: number) => {
  const { eMgr } = GameManager.instance;
  const agentCmpt = eMgr.GetComponentUncertain(AgentCmpt, entityHandle);

  let targetEntity = -1;
  if (agentCmpt && agentCmpt.baction) {
    const { baction: { entityBinding } } = agentCmpt;
    if (entityBinding.length > 1) {
      targetEntity = entityBinding[1];
    }
  }
  return { targetEntity };
};

export const getUnitInfos = (): UnitsDict => {
  const units: UnitsDict = {};
  const unitView = GetView(0, HealthCmpt);
  for (let i = 0; i < unitView.Count; ++i) {
    const e = unitView.At(i);
    const entityHandle = parseInt(e, 10);

    const healthInfo = getHealth(entityHandle);
    const combatStatsInfo = getCombatStats(entityHandle);
    const factionInfo = getFaction(entityHandle);
    const statusEffectsInfo = getStatusEffects(entityHandle);
    const combatPosInfo = getCombatPosition(entityHandle);
    const bactionInfo = getBactionInfo(entityHandle);

    units[entityHandle] = {
      entityHandle,
      ...bactionInfo,
      ...combatPosInfo,
      ...combatStatsInfo,
      ...factionInfo,
      ...healthInfo,
      ...statusEffectsInfo,
    };
  }

  return units;
};
