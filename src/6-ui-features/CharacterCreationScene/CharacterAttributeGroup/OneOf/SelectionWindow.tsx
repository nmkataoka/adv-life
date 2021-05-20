import styled from '@emotion/styled';
import { useDispatch } from 'react-redux';
import Window from '../../components/Window';
import { updateInfoWindow, selectedOption } from '../../characterCreationSlice';

export type OptionRowProps = {
  label: string;
  info: string;
  value: string;
};

type SelectionWindowProps = {
  header: string;
  options: OptionRowProps[];
  selectedIdx: number;
};

export default function SelectionWindow({
  header,
  options,
  selectedIdx,
}: SelectionWindowProps): JSX.Element {
  const dispatch = useDispatch();

  const handleClick = ({ label, info }: OptionRowProps) => () => {
    dispatch(updateInfoWindow({ infoWindowTitle: label, infoWindowText: info }));
    dispatch(selectedOption({ label }));
  };

  return (
    <Window header={header} randomize showNavigation>
      <OptionsContainer>
        {options.map((o, idx) => (
          <Option key={o.value} onClick={handleClick(o)} selected={selectedIdx === idx}>
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

type OptionProps = {
  selected: boolean;
};

const Option = styled.button`
  ${(props: OptionProps) => props.selected && 'background-color: lightblue;'}
  border: 1px solid #c0c0c0;
  padding: 1em;
  margin: 0.5em 0;
`;
