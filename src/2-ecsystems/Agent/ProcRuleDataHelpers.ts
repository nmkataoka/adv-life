export const createChannelTime = (duration: number) => {
  let timePassed = 0;

  // Returns true if the channel is finished
  return (dt: number) => {
    if(timePassed > duration) return true;
    timePassed += dt;
    return false;
  }
}