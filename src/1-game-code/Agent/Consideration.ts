import { Node } from '0-engine/ECS/query/node';

type Select<Data> = (node: Node<Data>) => Data;

/**
 * Considerations can use the following as inputs:
 * 1. world state
 * 2. other considerations
 */
export interface Consideration {
  /**
   * @returns [utility, risk] where utility in [-1, 1] and risk in [0, Infinity]
   * - `utility` should be calculated across all possible outcomes, including failure outcomes, taking into account probability of each outcome occurring
   * - `risk` should be calculated as the variance of the expected utility distribution
   */
  evaluate: (args: { select: Select<unknown> }) => [number, number];

  name: string;

  description?: string;

  /** The minimum risk that `evaluate` could return. Used to order considerations by significance. */
  minRisk: number;

  /** The maximum utility that `evaluate` could return. Used to order considerations by significance. */
  maxUtility: number;
}
