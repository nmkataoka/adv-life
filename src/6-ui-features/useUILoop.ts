import { useEffect, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppThunk } from '../7-app/types';

export type ActionCreator = () => AppThunk;

const uiInterval = 200;

// Registers redux actions in the UI loop
// E.g. use this hook to update the UI from the engine state.
//
// reduxActions: this should be a memoized array of redux action creators
export default function useUILoop(reduxActions: ActionCreator[]): void {
  const dispatch = useDispatch();
  const [uiLoopHandle, setUiLoopHandle] = useState(null as NodeJS.Timeout | null);

  const startUILoop = useCallback(() => {
    const handle = setTimeout(() => {
      reduxActions.forEach((action) => dispatch(action()));
      startUILoop();
    }, uiInterval);
    setUiLoopHandle(handle);
  }, [dispatch, reduxActions]);

  useEffect(() => {
    startUILoop();
  }, [startUILoop]);

  // If the uiLoopHandle changes, clear the old timeout
  useEffect(() => () => {
    if (uiLoopHandle) clearTimeout(uiLoopHandle);
  }, [uiLoopHandle]);
}
