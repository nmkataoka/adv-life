import { ComponentClasses } from '0-engine/ECS/component-dependencies/ComponentDependencies';
import { CivCmpt } from '1-game-code/World/Civs/CivCmpt';
import { viewNode } from '4-react-ecsal';

export const civView = viewNode(new ComponentClasses({ readCmpts: [CivCmpt] }));
