import { ECSystem } from "../../0-engine/ECS/ECSystem";
import { AgentCmpt } from "../../1- ncomponents/AgentCmpt";
import { BoundActionStatus, BoundAction } from "./BoundAction";
import { ExecutorStatus } from "./ProcRule";
import { ProcRuleDbCmpt } from "./ProcRuleDatabaseCmpt";
import { GoalQueueCmpt } from "./GoalQueueCmpt";
import { GetComponentManager } from "../../0-engine/GlobalFunctions";

export class AgentSys extends ECSystem {
  public Start(): void {
    // Create the proc rule database
    const prdbEntity = this.eMgr.CreateEntity();
    const prdbCmpt = new ProcRuleDbCmpt();
    this.eMgr.AddComponent(prdbEntity, prdbCmpt);
  }

  public OnUpdate(dt: number): void {
    const { eMgr } = this;
    this.setCachedComponents();
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

  private prdb?: ProcRuleDbCmpt;

  private setCachedComponents(): void {
    if(!this.prdb) this.prdb = Object.values(GetComponentManager(ProcRuleDbCmpt).components)[0];
  }

  private GetNextAction(self: number, baction?: BoundAction): BoundAction {
    if(!this.prdb) throw new Error("prdb not set");

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
