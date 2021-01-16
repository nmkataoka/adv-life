export interface Random {
  /** Should return number between [0, 1) evenly distributed, like Math.random */
  random: () => number;
}
