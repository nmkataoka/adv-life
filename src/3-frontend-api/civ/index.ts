import { Entity, NameCmpt } from '0-engine';
import { ComponentClasses } from '0-engine/ECS/component-dependencies/ComponentDependencies';
import { CivCmpt } from '1-game-code/World/Civs/CivCmpt';
import { selectorNode, viewNode } from '4-react-ecsal';

export const civView = viewNode(new ComponentClasses({ readCmpts: [CivCmpt, NameCmpt] }));

export interface CivInfo {
  id: Entity;
  admin: CivCmpt['admin'];
  name: string;
}

export const getCivs = selectorNode({
  get: ({ get }) => {
    const [view] = get(civView);
    if (!view) throw new Error('Tried to get civs but no civ view was returned.');
    const civs: CivInfo[] = [];
    view.forEach((civ, { readCmpts: [civCmpt, nameCmpt] }) => {
      civs.push({
        id: civ,
        ...civCmpt,
        name: nameCmpt.name,
      });
    });
    return civs;
  },
});
