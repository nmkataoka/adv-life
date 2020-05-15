import { useEffect, useCallback } from "react";
import { ImportantKeycodes } from "./constants";
import { useDispatch } from "react-redux";
import { keyPressed } from "./actions";
import { keypressCallbacks } from "./useOnKeypress";

export default function useDetectKeypress() {
  const dispatch = useDispatch();

  const onKeypress = useCallback(
    (e: { keyCode: number }) => {
      if (ImportantKeycodes.includes(e.keyCode)) {
        // Trigger all registered callbacks for keypresses
        Object.values(keypressCallbacks).forEach((cb) => cb(e.keyCode));

        // Dispatch the generic redux keypress action
        dispatch(keyPressed(e.keyCode));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    document.addEventListener("keydown", onKeypress, false);
    return () => {
      document.removeEventListener("keydown", onKeypress, false);
    };
  }, [onKeypress]);
}
