import styled from '@emotion/styled';
import { Info, useInfo } from '6-ui-features/Info';
import { useReduxDispatch } from '11-redux-wrapper';
import Window from '../../components/Window';
import { selectedOption } from '../../characterCreationSlice';

export interface OptionRowProps {
  label: string;
  info: string;
  value: string;
}

interface OptionProps extends OptionRowProps {
  isSelected: boolean;
}

function Option({ label, info, isSelected }: OptionProps): JSX.Element {
  const { isInfoMine, requestInfoOwnership } = useInfo();
  const dispatch = useReduxDispatch();

  const handleClick = () => {
    requestInfoOwnership();
    dispatch(selectedOption({ label }));
  };

  return (
    <OptionDiv onClick={handleClick} selected={isSelected}>
      {label}
      <Info show={isInfoMine}>
        <Window header={label}>{info}</Window>
      </Info>
    </OptionDiv>
  );
}

interface SelectionWindowProps {
  header: string;
  options: OptionRowProps[];
  selectedIdx: number;
}

export default function SelectionWindow({
  header,
  options,
  selectedIdx,
}: SelectionWindowProps): JSX.Element {
  return (
    <Window header={header} randomize showNavigation>
      <OptionsContainer>
        {options.map((o, idx) => (
          <Option
            key={o.value}
            isSelected={selectedIdx === idx}
            label={o.label}
            info={o.info}
            value={o.value}
          />
        ))}
      </OptionsContainer>
    </Window>
  );
}

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

type OptionDivProps = {
  selected: boolean;
};

const OptionDiv = styled.button`
  ${(props: OptionDivProps) => props.selected && 'background-color: lightblue;'}
  border: 1px solid #c0c0c0;
  padding: 1em;
  margin: 0.5em 0;
`;
