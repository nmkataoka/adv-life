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

/** Components can stick their info in here (should be conditional based on `useInfoBox`)
 *
 * Usage:
 *
 * In the scene:
 * - an InfoProvider must be placed somewhere in the scene. This is not rendered by the app by default!
 * - an InfoRoot to provide the info container
 *
 * In each component that can have info:
 * - `useInfo` call to register an id and receive a function to request ownership of the info root
 * - an Info component that acts like a modal component
 *
 * Example:
 *
 * In CharacterCreationScene:
 * ```tsx
 * function CharacterCreationScene(): JSX.Element {
 *  return (
 *     <SceneContainer>
 *       <InfoProvider>
 *         <Map />
 *         <InfoRoot />
 *       </InfoProvider>
 *     </SceneContainer>
 *   );
 * }
 * ```
 *
 * On each input in CharacterCreationScene that can display info when clicked on:
 *
 * ```tsx
 * function ClassInput(): JSX.Element {
 *   const { isInfoOwner, requestInfoOwnership } = useInfo();
 *   return (
 *     <InputContainer onClick={requestInfoOwnership}>
 *       Rest of the input component...
 *       <Info show={isInfoOwner}>
 *         <h1>CharacterClass</h1>
 *         The character's class is an important choice to make...
 *       </Info>
 *     </InputContainer>
 *   );
 * }
 * ```
 *
 * When the input is clicked on, it will display its `Info` component inside the `InfoRoot`.
 *
 * To clear the info context, use the function returned from the `useClearInfo` hook.
 */
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
