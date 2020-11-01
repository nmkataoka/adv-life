import { ECSystem } from '0-engine/ECS/ECSystem';
import { EntityManager } from '0-engine';
import { GetPrdb } from '0-engine/ECS/globals/EntityManagerGlobals';
import { getSkillData } from '3-frontend-api/SkillData';
import { AgentCmpt } from '../ncomponents/AgentCmpt';
import { BoundActionStatus, BoundAction } from './BoundAction';
import { ExecutorStatus } from './ProcRule';
import { ProcRuleDbCmpt } from './ProcRuleDatabaseCmpt';
import { GoalQueueCmpt } from './GoalQueueCmpt';
import { FactionCmpt } from '../ncomponents/FactionCmpt';

export class AgentSys extends ECSystem {
  public Start(): void {
    // Create the proc rule database
    const prdbEntity = EntityManager.instance.createEntity();
    EntityManager.instance.addCmpt(prdbEntity, new ProcRuleDbCmpt());
  }

  public OnUpdate(dt: number): void {
    this.setCachedComponents();
    const agentMgr = this.GetComponentManager(AgentCmpt);

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
    if (!this.prdb) {
      this.prdb = Object.values(this.GetComponentManager(ProcRuleDbCmpt).components)[0];
    }
  }

  private GetNextAction(self: number, baction?: BoundAction<any>): BoundAction<any> {
    if (!this.prdb) throw new Error('prdb not set');

    // Recovery forces a delay after a successful action
    const recoveryDuration = baction?.recoveryDuration;

    if (typeof recoveryDuration === 'number' && recoveryDuration > 0) {
      const recoverPr = this.prdb.getProcRule('recover');
      return new BoundAction(recoverPr, [self], recoveryDuration, 0);
    }

    // Player-controlled agents use GoalQueueCmpt to receive commands from the player
    const goalQueueCmpt = this.GetComponentUncertain(GoalQueueCmpt, self);
    if (goalQueueCmpt && goalQueueCmpt.nextAction) {
      const { nextAction } = goalQueueCmpt;
      goalQueueCmpt.nextAction = undefined;
      return nextAction;
    }

    // All units can use an AI to attack an enemy
    const nextAction = this.AttackRandomEnemy(self);
    if (nextAction) return nextAction;

    // Default return
    return BoundAction.Idle(self);
  }

  private AttackRandomEnemy(self: number): BoundAction | undefined {
    const factionCmpt = this.GetComponent(FactionCmpt, self);
    if (!factionCmpt) return undefined;

    const enemies = this.GetEnemies(factionCmpt.isEnemy);
    if (enemies.length === 0) return undefined;

    // Attack a random enemy
    const targetIdx = Math.floor(Math.random() * enemies.length);
    const enemyHandle = enemies[targetIdx];
    const prdb = GetPrdb();
    const attack = prdb.getProcRule('attack');
    const { data, recoveryDuration } = getSkillData(self, [enemyHandle], 'attack');
    const baction = new BoundAction(attack, [self, enemyHandle], data, recoveryDuration);
    return baction;
  }

  private GetEnemies(isEnemy: boolean): number[] {
    const factionMgr = this.GetComponentManager(FactionCmpt);
    const enemies = Object.entries(factionMgr.components).filter(
      ([, factionCmpt]) => factionCmpt.isEnemy !== isEnemy,
    );

    return enemies.map(([entityStr]) => parseInt(entityStr, 10));
  }
}
