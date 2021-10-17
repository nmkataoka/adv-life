import { Overlay } from '6-ui-features/WorldMap/WorldMapContext';
import { ColumnContainer, LayerButton } from './LayerButtons';

const buttons = [{ text: 'Political', value: 'political' }] as const;

interface OverlayButtonsProps {
  overlayIsActive: { [key: string]: boolean };
  toggleOverlay: (key: Overlay) => void;
}

export function OverlayButtons({
  overlayIsActive,
  toggleOverlay,
}: OverlayButtonsProps): JSX.Element {
  return (
    <ColumnContainer>
      {buttons.map(({ text, value }) => (
        <LayerButton
          key={value}
          isselected={overlayIsActive[value]}
          onClick={() => toggleOverlay(value)}
        >
          {text}
        </LayerButton>
      ))}
    </ColumnContainer>
  );
}
