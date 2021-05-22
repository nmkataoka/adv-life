import { createContext, ReactNode, useCallback, useContext, useState } from 'react';

let nextId = 0;

interface InfoContextValue {
  ownerId: number;
}

interface InfoActionsContextValue {
  setOwnerId: (id: number) => void;
}

const infoContext = createContext<InfoContextValue | undefined>(undefined);
const infoActionsContext = createContext<InfoActionsContextValue | undefined>(undefined);

export function InfoContextProvider({ children }: { children?: ReactNode }): JSX.Element {
  const [ownerId, setOwnerId] = useState(-1);

  return (
    <infoActionsContext.Provider value={{ setOwnerId }}>
      <infoContext.Provider value={{ ownerId }}>{children}</infoContext.Provider>
    </infoActionsContext.Provider>
  );
}

function useInfoContext(): InfoContextValue {
  const infoContextValue = useContext(infoContext);
  if (!infoContextValue) {
    throw new Error('useInfoContext must be inside an InfoContextProvider');
  }
  return infoContextValue;
}

function useInfoActions(): InfoActionsContextValue {
  const infoContextValue = useContext(infoActionsContext);
  if (!infoContextValue) {
    throw new Error('useInfoActionsContext must be inside an InfoContextProvider');
  }
  return infoContextValue;
}

/** @returns A function that clears the info box */
export function useClearInfo(): () => void {
  const { setOwnerId } = useInfoActions();
  return useCallback(() => setOwnerId(-1), [setOwnerId]);
}

/** This is intended for internal use only */
export function useInfoOwnerId(): number {
  const { ownerId } = useInfoContext();
  return ownerId;
}

/**
 * Single hook interface most components can use for displaying info.
 *
 * @returns A boolean that is True if you can display your info and a function to take control of the info box
 */
export function useInfo(): { isInfoMine: boolean; requestInfoOwnership: () => void } {
  const [myId] = useState(() => nextId++);
  // console.log('my id', myId);
  const ownerId = useInfoOwnerId();
  const { setOwnerId } = useInfoActions();
  const isInfoMine = ownerId === myId;
  const requestInfoOwnership = useCallback(() => setOwnerId(myId), [myId, setOwnerId]);
  return { isInfoMine, requestInfoOwnership };
}
