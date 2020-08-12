import React from 'react';
import styled from '@emotion/styled';
import { useDispatch } from 'react-redux';
import Window from '../../components/Window';
import { changedFreeformInputValue } from '../../characterCreationSlice';

export type FreeformRowProps = {
  label: string;
  type: string;
  value: string;
}

type FreeformInputWindowProps = {
  header: string;
  options: FreeformRowProps[];
}

const FreeformInputWindow = ({ header, options }: FreeformInputWindowProps): JSX.Element => {
  const dispatch = useDispatch();

  const handleChange = (label: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(changedFreeformInputValue({ label, value: e.target.value }));
  };

  return (
    <Window header={header} showNavigation>
      <OptionsContainer>
        {options.map(({ label, type, value }) => (
          <label key={label} htmlFor={`freeform-input-${label}`}>
            {label}
            <Input id={`freeform-input-${label}`} onChange={handleChange(label)} type={type} value={value} />
          </label>
        ))}
      </OptionsContainer>
    </Window>
  );
};

export default FreeformInputWindow;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  margin-bottom: 1em;
  margin-top: 0.25em;  
  display: block;
`;
