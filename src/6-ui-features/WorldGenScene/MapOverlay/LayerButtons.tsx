import { WorldMapLayer } from '1-game-code/World/DataLayer/WorldMapLayers';
import styled from '@emotion/styled';

const buttons: { text: string; value: WorldMapLayer }[] = [
  { text: 'Elevation', value: 'elevation' },
  { text: 'Rainfall', value: 'rain' },
];

type LayerButtonsProps = {
  currentLayer: WorldMapLayer;
  onLayerChange: (newLayer: WorldMapLayer) => void;
};

export function LayerButtons({ currentLayer, onLayerChange }: LayerButtonsProps): JSX.Element {
  return (
    <ColumnContainer>
      {buttons.map(({ text, value }) => (
        <LayerButton
          key={value}
          isselected={currentLayer === value}
          onClick={() => onLayerChange(value)}
        >
          {text}
        </LayerButton>
      ))}
    </ColumnContainer>
  );
}

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

type LayerButtonProps = {
  isselected?: boolean;
};

const LayerButton = styled.button<LayerButtonProps>`
  ${(props) => props.isselected && `background-color: lightgray;`}
  margin: 0.5em;
  margin-bottom: 0;
  padding: 0.5em 1em;
  width: 8em;
`;
