import { createEventSlice, DefaultEvent, EntityManager } from '0-engine';
import { ComponentManager } from '0-engine/ECS/component-manager/ComponentManager';
import { consoleError } from '8-helpers/console';
import { commit, createCacheState, Node, read } from '0-engine/ECS/query/node';
import { AgentCmpt } from '../ncomponents/AgentCmpt';
import { ExecutorStatus, ProcRule } from './ProcRule';
import { ProcRuleDbCmpt } from './ProcRuleDatabaseCmpt';
import { GoalQueueCmpt } from './GoalQueueCmpt';
import { Idle } from './ProcRules/idle';
import { Consideration } from './Consideration';
import { CreateTown } from './ProcRules/CreateTown';

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

const cache = createCacheState();

const agentUpdateSlice = createEventSlice(DefaultEvent.Update, {
  readCmpts: [ProcRuleDbCmpt],
  writeCmpts: [AgentCmpt, GoalQueueCmpt],
})<{ dt: number }>(
  async ({
    componentManagers: {
      readCMgrs: [procRuleDbMgr],
      writeCMgrs: [agentMgr, goalQueueMgr],
    },
    eMgr,
    payload: { dt },
  }) => {
    const { dispatch } = eMgr;
    const promises = agentMgr.entries().map(async ([e, agentCmpt]) => {
      const self = e;
      let { baction } = agentCmpt;

      // Get new action if necessary
      if (!baction) {
        baction = getNextAction(eMgr, agentMgr, procRuleDbMgr, goalQueueMgr, self);
        if (baction) {
          const { status } = await baction.init({
            eMgr,
            entityBinding: baction.entityBinding,
            dispatch,
            dt,
          });
          if (status !== ExecutorStatus.Success) {
            consoleError(`baction failed init: ${JSON.stringify(baction)}`);
            baction = undefined;
          }
        }
      }

      // Continue action
      if (baction) {
        const { entityBinding, state } = baction;
        const { status, state: newState } = await baction.tick(
          { eMgr, entityBinding, dispatch, dt },
          state,
        );
        baction.state = newState;

        // If baction is finished, clear it
        if (status !== ExecutorStatus.Running) {
          baction = undefined;
        }
      }

      agentCmpt.baction = baction;
    });
    await Promise.all(promises);

    commit(cache);
  },
);

function getNextAction(
  eMgr: EntityManager,
  agentMgr: ComponentManager<AgentCmpt>,
  procRuleDbMgr: ComponentManager<ProcRuleDbCmpt>,
  goalQueueMgr: ComponentManager<GoalQueueCmpt>,
  self: number,
): ProcRule {
  // Player-controlled agents use GoalQueueCmpt to receive commands from the player
  const goalQueueCmpt = goalQueueMgr.tryGetMut(self);
  if (goalQueueCmpt && goalQueueCmpt.nextAction) {
    const { nextAction } = goalQueueCmpt;
    goalQueueCmpt.nextAction = undefined;
    return nextAction;
  }

  // Find all possible actions
  const agentCmpt = agentMgr.get(self);
  const { actionContexts } = agentCmpt;
  const possibleActions: ProcRule[] = [];

  // TODO: finish setting up action contexts properly and stop cheating here
  // @ts-expect-error readonly
  actionContexts.civRuler = { name: 'civRuler', actions: [CreateTown.name] };
  const prdb = procRuleDbMgr.getAsArray()[0];

  Object.values(actionContexts).forEach((actionContext) => {
    const actionRules = actionContext.actions.map((actionName) => prdb.getAction(actionName));
    actionRules.forEach((A) => {
      const entityBindings = A.conditions.bindEntities(eMgr, self, false);
      possibleActions.push(...entityBindings.map((entityBinding) => new A(entityBinding)));
    });
  });

  const select = (node: Node<unknown>) => read(cache, eMgr, node);

  if (possibleActions.length > 0) {
    // For each action, evaluate expected utility
    const expectedUtilities = possibleActions.map((action) => {
      const considerations: Consideration[] = prdb.getConsiderations(action.constructor.name);
      // TODO: Evaluate considerations start from maximum possible impact
      // If the action clearly won't make it, stop considering it
      const numConsiderations = considerations.length;
      const utilities = considerations.map((c) => c.evaluate({ select }));
      const [totalUtility, totalRisk] = utilities.reduce(
        ([ut, rt], [utility, risk]) => [ut + utility, rt + risk],
        [0, 0],
      );
      const averageUtility = totalUtility / numConsiderations;
      const averageRisk = totalRisk / numConsiderations;
      return [averageUtility, averageRisk] as const;
    });

    /** Risk aversion factor. Should be personalized per agent. */
    const a = 0.2;

    const finalUtilities = expectedUtilities.map(([utility, risk]) => utility - 0.5 * a * risk);

    // Pick the action with the highest expected utility
    const indexOfMaxUtility = finalUtilities.reduce((maxIdx, utility, idx) => {
      if (utility > finalUtilities[maxIdx]) return idx;
      return maxIdx;
    }, 0);

    return possibleActions[indexOfMaxUtility];
  }

  // Default return
  return new Idle([self]);
}

export default [agentStartSlice.eventListener, agentUpdateSlice.eventListener];
