import { GameManager } from '../0-engine/GameManager';
import { CombatStatsCmpt } from '../1- ncomponents/CombatStatsCmpt';
import { HealthCmpt } from '../1- ncomponents/HealthCmpt';
import { FactionCmpt } from '../1- ncomponents/FactionCmpt';
import { CombatPositionCmpt } from '../1- ncomponents/CombatPositionCmpt';
import { StatusEffectsCmpt } from '../1- ncomponents/StatusEffectsCmpt';
import { GetView } from '../0-engine/ECS/View';

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

  isEnemy?: boolean;
  position: number;
};

export type UnitsDict = {
  [key: string]: UnitInfo;
};

export const getUnitInfos = (): UnitsDict => {
  const { eMgr } = GameManager.instance;
  const combatStatsMgr = eMgr.GetComponentManager(CombatStatsCmpt);
  const healthMgr = eMgr.GetComponentManager(HealthCmpt);
  const factionMgr = eMgr.GetComponentManager(FactionCmpt);
  const positionMgr = eMgr.GetComponentManager(CombatPositionCmpt);
  const statusEffectsMgr = eMgr.GetComponentManager(StatusEffectsCmpt);

  const units: UnitsDict = {};
  const unitView = GetView(0, HealthCmpt);
  for (let i = 0; i < unitView.Count; ++i) {
    const e = unitView.At(i);
    const entityHandle = parseInt(e, 10);
    const healthCmpt = healthMgr.GetByNumber(entityHandle);
    const combatStatsCmpt = combatStatsMgr.GetByNumber(entityHandle);
    const factionCmpt = factionMgr.GetByNumber(entityHandle);
    const statusEffectsCmpt = statusEffectsMgr.GetByNumber(entityHandle);
    if (!statusEffectsCmpt || !healthCmpt) throw new Error('unit is missing StatusEffectsCmpt');
    const channel = statusEffectsCmpt.GetStatusEffect('Channel');
    const recovering = statusEffectsCmpt.GetStatusEffect('Recover');

    const combatPos = positionMgr.GetByNumber(entityHandle);
    if (!combatPos) throw new Error('unit is missing CombatPositionCmpt');

    const { health, maxHealth } = healthCmpt;

    units[entityHandle] = {
      entityHandle,
      health,
      maxHealth,

      mana: combatStatsCmpt?.mana ?? 100,
      maxMana: combatStatsCmpt?.maxMana ?? 100,

      isChanneling: channel.severity > 0,
      channelRemaining: channel.remainingDuration,
      channelTotalDuration: channel.totalDuration,

      isRecovering: recovering.severity > 0,
      recoveryRemaining: recovering.remainingDuration,
      recoveryTotalDuration: recovering.totalDuration,

      isStealthed: statusEffectsCmpt.IsStatusEffectActive('Stealth'),

      isEnemy: factionCmpt?.isEnemy,
      position: combatPos.position,

    };
  }

  return units;
};
