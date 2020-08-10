import React from 'react';
import styled from '@emotion/styled';
import Window from '../../components/Window';
import Header from '../../components/Header';
import AttributeRow, { AttributeRowProps } from './AttributeRow';

type AttributeWindowProps = {
  attributes: AttributeRowProps[],
  header: string;
}

export default function AttributeWindow({ attributes, header }: AttributeWindowProps): JSX.Element {
  return (
    <Window showNavigation>
      <Header>{header}</Header>
      <AttributeContainer>
        {attributes.map(({
          info,
          label,
          min,
          max,
          value,
        }) => (
          <AttributeRow
            info={info}
            key={label}
            label={label}
            min={min}
            max={max}
            value={value}
          />
        ))}
      </AttributeContainer>
    </Window>
  );
}

const AttributeContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
