import { useEffect } from "react";
import { ImportantKeycodes } from "./constants";
import { useDispatch } from "react-redux";
import { keyPressed } from "./actions";

export default function useDetectKeypress() {
  const dispatch = useDispatch();

  const onKeypress = (e: { keyCode: number }) => {
    if (ImportantKeycodes.includes(e.keyCode)) {
      dispatch(keyPressed(e.keyCode));
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", onKeypress, false);
    return () => {
      document.removeEventListener("keydown", onKeypress, false);
    };
  });
}
