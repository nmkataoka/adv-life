import { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { useInfoOwnerId } from './InfoContext';

/** This is an HTML element id, unrelated to the `id` number used in the info context */
const infoRootId = 'infoRoot';

/** Each scene is responsible for rendering this component if they want to use the Info system. */
export function InfoRoot({
  children,
  className,
  defaultContent,
}: {
  children?: ReactNode;
  className?: string;
  defaultContent?: JSX.Element;
}): JSX.Element {
  const ownerId = useInfoOwnerId();
  return (
    <div id={infoRootId} className={className}>
      {children}
      {ownerId < 0 && defaultContent}
    </div>
  );
}

/** Components can stick their info in here (should be conditional based on `useInfoBox`) */
export function Info({
  children,
  show,
}: {
  children?: ReactNode;
  show?: boolean;
}): JSX.Element | null {
  if (!show) {
    return null;
  }
  const root = document.getElementById(infoRootId);
  if (root == null) {
    throw new Error(
      'Could not find info root. Each scene is responsible for rendering an `InfoRoot` component somewhere.',
    );
  }
  return ReactDOM.createPortal(children, root);
}
