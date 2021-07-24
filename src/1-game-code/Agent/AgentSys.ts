import { createEventSlice, DefaultEvent } from '0-engine';
import { ComponentManager } from '0-engine/ECS/component-manager/ComponentManager';
import { consoleError } from '8-helpers/console';
import { AgentCmpt } from '../ncomponents/AgentCmpt';
import { ExecutorStatus, ProcRule } from './ProcRule';
import { ProcRuleDbCmpt } from './ProcRuleDatabaseCmpt';
import { GoalQueueCmpt } from './GoalQueueCmpt';
import { Idle } from './ProcRules/idle';

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
  readCmpts: [ProcRuleDbCmpt],
  writeCmpts: [AgentCmpt, GoalQueueCmpt],
})<{ dt: number }>(
  async ({
    componentManagers: {
      readCMgrs: [procRuleDbMgr],
      writeCMgrs: [agentMgr, goalQueueMgr],
    },
    payload: { dt },
  }) => {
    const promises = agentMgr.entries().map(async ([e, agentCmpt]) => {
      const self = e;
      let { baction } = agentCmpt;

      // Get new action if necessary
      if (!baction) {
        baction = getNextAction(procRuleDbMgr, goalQueueMgr, self, baction);
        if (baction) {
          const { status } = await baction.init({ entityBinding: baction.entityBinding, dt });
          if (status !== ExecutorStatus.Success) {
            consoleError(`baction failed init: ${JSON.stringify(baction)}`);
            baction = undefined;
          }
        }
      }

      // Continue action
      if (baction) {
        const { entityBinding, state } = baction;
        const { status, state: newState } = await baction.tick({ entityBinding, dt }, state);
        baction.state = newState;

        // If baction is finished, clear it
        if (status !== ExecutorStatus.Running) {
          baction = undefined;
        }
      }

      agentCmpt.baction = baction;
    });
    await Promise.all(promises);
  },
);

function getNextAction(
  procRuleDbMgr: ComponentManager<ProcRuleDbCmpt>,
  goalQueueMgr: ComponentManager<GoalQueueCmpt>,
  self: number,
  baction?: ProcRule,
): ProcRule {
  // Find all possible actions

  // For each action, evaluate expected utility

  // Pick the action with the highest expected utility

  const prdb = procRuleDbMgr.getAsArray()[0];

  // Player-controlled agents use GoalQueueCmpt to receive commands from the player
  const goalQueueCmpt = goalQueueMgr.tryGetMut(self);
  if (goalQueueCmpt && goalQueueCmpt.nextAction) {
    const { nextAction } = goalQueueCmpt;
    goalQueueCmpt.nextAction = undefined;
    return nextAction;
  }

  // Default return
  return new Idle([self]);
}

export default [agentStartSlice.eventListener, agentUpdateSlice.eventListener];
