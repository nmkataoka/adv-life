import { Entity, NameCmpt } from '0-engine';
import { ComponentNode, componentNode } from '4-react-ecsal';

export const getName = (e: Entity): ComponentNode<NameCmpt> => componentNode(NameCmpt, e);
