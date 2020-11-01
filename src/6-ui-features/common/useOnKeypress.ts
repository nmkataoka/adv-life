import { useEffect, useState } from 'react';

// Generate a unique token for each callback
// so they can be deregistered when the component unmounts
let cbId = 0;
const getId = (): number => {
  const myId = cbId;
  cbId += 1;
  return myId;
};

export type onKeyPressCallback = (keyCode: number) => void;
export const keypressCallbacks: { [key: number]: onKeyPressCallback } = {};

export default function useOnKeypress(cb: onKeyPressCallback): void {
  const [myId] = useState(getId);

  useEffect(() => {
    keypressCallbacks[myId] = cb;
    return () => {
      delete keypressCallbacks[myId];
    };
  }, [myId, cb]);
}
