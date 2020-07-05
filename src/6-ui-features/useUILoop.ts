import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { AppThunk } from '../7-app/types';
import useTimeoutLoop from '../5-react-components/useTimeoutLoop';

export type ActionCreator = () => AppThunk;

const uiInterval = 200;

// Registers redux actions in the UI loop
// E.g. use this hook to update the UI from the engine state.
//
// reduxActions: this should be a memoized array of redux action creators
export default function useUILoop(reduxActions: ActionCreator[]): void {
  const dispatch = useDispatch();

  const callback = useCallback(() => {
    reduxActions.forEach((action) => dispatch(action()));
  }, [dispatch, reduxActions]);

  useTimeoutLoop(callback, uiInterval);
}
