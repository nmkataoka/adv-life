import React from 'react';
import styled from '@emotion/styled';
import { useDispatch } from 'react-redux';
import Window from './Window';
import { updateInfoWindow } from '../characterCreationSlice';
import Header from './Header';

type OptionType = {
  label: string,
  info: string,
}

type SelectionWindowProps = {
  header: string;
  options: OptionType[];
}

export default function SelectionWindow({ header, options }: SelectionWindowProps): JSX.Element {
  const dispatch = useDispatch();

  const handleClick = ({ label, info }: OptionType) => () => {
    dispatch(updateInfoWindow({ infoWindowTitle: label, infoWindowText: info }));
  };

  return (
    <Window showNavigation>
      <Header>{header}</Header>
      <OptionsContainer>
        {options.map((o) => (
          <Option
            key={o.label}
            onClick={handleClick(o)}
          >
            {o.label}
          </Option>
        ))}
      </OptionsContainer>
    </Window>
  );
}

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Option = styled.button`
  border: 1px solid #c0c0c0;
  padding: 1em;
  margin: 0.5em 0;
`;
