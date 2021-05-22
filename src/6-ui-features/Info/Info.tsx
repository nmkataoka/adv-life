import { ReactNode } from 'react';
import ReactDOM from 'react-dom';

/** This is an HTML element id, unrelated to the `id` number used in the info context */
const infoRootId = 'infoRoot';

/** Each scene is responsible for rendering this component if they want to use the Info system. */
export function InfoRoot({ className }: { className?: string }): JSX.Element {
  return <div id={infoRootId} className={className} />;
}

/** Components can stick their info in here (should be conditional based on `useInfoBox`) */
export function Info({ children }: { children?: ReactNode }): JSX.Element {
  const root = document.getElementById(infoRootId);
  if (root == null) {
    throw new Error(
      'Could not find info root. Each scene is responsible for rendering an `InfoRoot` component somewhere.',
    );
  }
  return ReactDOM.createPortal(children, root);
}
