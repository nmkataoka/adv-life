import { ProcRule } from '../ProcRule';
import { attack } from './attack';
import { fireball } from './fireball';
import { heal } from './heal';
import { recover } from './recover';
import { stealth } from './stealth';

const ProcRuleDataArr: ProcRule<any>[] = [attack, fireball, heal, recover, stealth];

export const ProcRuleData = ProcRuleDataArr.reduce((dict, pr) => {
  dict[pr.name] = pr;
  return dict;
}, {} as { [key: string]: ProcRule<any> });
