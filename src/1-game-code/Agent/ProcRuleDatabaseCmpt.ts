import { NComponent } from '0-engine';
import { ProcRule } from './ProcRule';
import { ProcRuleData } from './ProcRuleData';

export class ProcRuleDbCmpt extends NComponent {
  public procRules: ProcRule<any>[];

  public procRuleMap: { [key: string]: number };

  constructor() {
    super();
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
