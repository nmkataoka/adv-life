import { ProcRule } from './ProcRule';
import { ProcRuleData } from './ProcRuleData';
import { NComponent } from '../../0-engine/ECS/NComponent';

export class ProcRuleDbCmpt implements NComponent {
  public procRules: ProcRule<any>[];

  public procRuleMap: { [key: string]: number };

  constructor() {
    this.procRules = [];
    this.procRuleMap = {};
    this.loadProcRules();
  }

  public getProcRule(name: string): ProcRule<any> {
    return this.procRules[this.procRuleMap[name]];
  }

  private loadProcRules() {
    Object.values(ProcRuleData).forEach((pr) => {
      this.procRuleMap[pr.name] = this.procRules.length;
      this.procRules.push(pr);
    });
  }
}
