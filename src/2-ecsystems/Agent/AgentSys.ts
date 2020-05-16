import { ECSystem } from "../../0-engine/ECS/ECSystem";
import { AgentCmpt } from "../../1- ncomponents/AgentCmpt";
import { BoundActionStatus, BoundAction } from "./BoundAction";
import { ExecutorStatus } from "./ProcRule";
import { ProcRuleDatabase } from "./ProcRuleDatabase";
import { GoalQueueCmpt } from "./GoalQueueCmpt";

export class AgentSys extends ECSystem {
  public readonly prdb = new ProcRuleDatabase();

  public Start(): void {}

  public OnUpdate(dt: number): void {
    const { eMgr } = this;
    const agentMgr = eMgr.GetComponentManager(AgentCmpt);

    Object.entries(agentMgr.components).forEach(([entityString, agentCmpt]) => {
      const self = parseInt(entityString, 10);
      let { baction } = agentCmpt;

      // Get new action if necessary
      if (!baction || baction.status === BoundActionStatus.Finished) {
        baction = this.GetNextAction(self, baction);
      }

      // Start or continue action
      if (baction.status === BoundActionStatus.Prospective) {
        baction.status = BoundActionStatus.Active;
      }

      const runStatus = baction.Continue(dt);
      if (runStatus !== ExecutorStatus.Running) {
        baction.status = BoundActionStatus.Finished;
      }

      agentCmpt.baction = baction;
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private GetNextAction(self: number, baction?: BoundAction<any>): BoundAction<any> {
    // Recovery forces a delay after a successful action
    if(baction && baction.recoveryDuration > 0) {
      const recoverPr = this.prdb.getProcRule('recover');
      return new BoundAction(recoverPr, [self], baction.recoveryDuration, 0);
    }

    // Player-controlled agents use GoalQueueCmpt to receive commands from the player
    const goalQueueCmpt = this.eMgr.GetComponent(GoalQueueCmpt, self);
    if(goalQueueCmpt && goalQueueCmpt.nextAction) {
      const { nextAction } = goalQueueCmpt;
      goalQueueCmpt.nextAction = undefined;
      return nextAction;
    }

    return BoundAction.Idle(self);
  }
}
