import React from 'react';
import styled from '@emotion/styled';
import { useDispatch } from 'react-redux';
import Window from '../../components/Window';
import { updateInfoWindow } from '../../characterCreationSlice';
import Header from '../../components/Header';

export type OptionRowProps = {
  label: string,
  info: string,
}

type SelectionWindowProps = {
  header: string;
  options: OptionRowProps[];
}

export default function SelectionWindow({ header, options }: SelectionWindowProps): JSX.Element {
  const dispatch = useDispatch();

  const handleClick = ({ label, info }: OptionRowProps) => () => {
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
