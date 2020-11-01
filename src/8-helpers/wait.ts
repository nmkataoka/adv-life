const wait = (duration = 0): Promise<NodeJS.Timeout> =>
  new Promise((resolve) => setTimeout(resolve, duration));
export default wait;
