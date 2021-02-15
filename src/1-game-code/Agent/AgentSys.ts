import { createEventSlice, DefaultEvent } from '0-engine';
import { getSkillData } from '3-frontend-api/SkillData';
import { ComponentManager } from '0-engine/ECS/component-manager/ComponentManager';
import { DeepReadonly } from 'ts-essentials';
import { AgentCmpt } from '../ncomponents/AgentCmpt';
import { BoundActionStatus, BoundAction } from './BoundAction';
import { ExecutorStatus } from './ProcRule';
import { ProcRuleDbCmpt } from './ProcRuleDatabaseCmpt';
import { GoalQueueCmpt } from './GoalQueueCmpt';
import { FactionCmpt } from '../ncomponents/FactionCmpt';

const agentStartSlice = createEventSlice(DefaultEvent.Start, {
  writeCmpts: [ProcRuleDbCmpt],
})<undefined>(
  ({
    componentManagers: {
      writeCMgrs: [procRuleDbMgr],
    },
    eMgr,
  }) => {
    const e = eMgr.createEntity('procRuleDb');
    procRuleDbMgr.add(e, new ProcRuleDbCmpt());
  },
);

const agentUpdateSlice = createEventSlice(DefaultEvent.Update, {
  readCmpts: [FactionCmpt, ProcRuleDbCmpt],
  writeCmpts: [AgentCmpt, GoalQueueCmpt],
})<{ dt: number }>(
  async ({
    componentManagers: {
      readCMgrs: [factionMgr, procRuleDbMgr],
      writeCMgrs: [agentMgr, goalQueueMgr],
    },
    payload: { dt },
  }) => {
    const promises = agentMgr.entries().map(async ([e, agentCmpt]) => {
      const self = e;
      let { baction } = agentCmpt;

      // Get new action if necessary
      if (!baction || baction.status === BoundActionStatus.Finished) {
        baction = getNextAction(factionMgr, procRuleDbMgr, goalQueueMgr, self, baction);
      }

      // Start or continue action
      if (baction.status === BoundActionStatus.Prospective) {
        baction.status = BoundActionStatus.Active;
      }

      const runStatus = await baction.Continue(dt);
      if (runStatus !== ExecutorStatus.Running) {
        baction.status = BoundActionStatus.Finished;
      }

      agentCmpt.baction = baction;
    });
    await Promise.all(promises);
  },
);

function getNextAction(
  factionMgr: ComponentManager<FactionCmpt>,
  procRuleDbMgr: ComponentManager<ProcRuleDbCmpt>,
  goalQueueMgr: ComponentManager<GoalQueueCmpt>,
  self: number,
  baction?: BoundAction<any>,
): BoundAction<any> {
  const prdb = procRuleDbMgr.getAsArray()[0];

  // Recovery forces a delay after a successful action
  const recoveryDuration = baction?.recoveryDuration;

  if (typeof recoveryDuration === 'number' && recoveryDuration > 0) {
    const recoverPr = prdb.getProcRule('recover');
    return new BoundAction(recoverPr, [self], recoveryDuration, 0);
  }

  // Player-controlled agents use GoalQueueCmpt to receive commands from the player
  const goalQueueCmpt = goalQueueMgr.tryGetMut(self);
  if (goalQueueCmpt && goalQueueCmpt.nextAction) {
    const { nextAction } = goalQueueCmpt;
    goalQueueCmpt.nextAction = undefined;
    return nextAction;
  }

  // All units can use an AI to attack an enemy
  const nextAction = attackRandomEnemy(factionMgr, prdb, self);
  if (nextAction) return nextAction;

  // Default return
  return BoundAction.Idle(self);
}

function attackRandomEnemy(
  factionMgr: ComponentManager<FactionCmpt>,
  prdb: DeepReadonly<ProcRuleDbCmpt>,
  self: number,
): BoundAction | undefined {
  const factionCmpt = factionMgr.tryGet(self);
  if (!factionCmpt) return undefined;

  const enemies = getEnemies(factionMgr, factionCmpt.isEnemy);
  if (enemies.length === 0) return undefined;

  // Attack a random enemy
  const targetIdx = Math.floor(Math.random() * enemies.length);
  const enemyHandle = enemies[targetIdx];
  const attack = prdb.getProcRule('attack');
  const { data, recoveryDuration } = getSkillData(self, [enemyHandle], 'attack');
  const baction = new BoundAction(attack, [self, enemyHandle], data, recoveryDuration);
  return baction;
}

function getEnemies(factionMgr: ComponentManager<FactionCmpt>, isEnemy: boolean): number[] {
  const enemies = factionMgr.entries().filter(([, factionCmpt]) => factionCmpt.isEnemy !== isEnemy);

  return enemies.map(([e]) => e);
}

export default [agentStartSlice.eventListener, agentUpdateSlice.eventListener];
