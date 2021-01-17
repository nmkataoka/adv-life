import styled from '@emotion/styled';
import { getColor } from '6-ui-features/Theme';
import { WorldGenTabs } from './constants';

type TabsProps = {
  selected: string;
  onChange: (next: typeof WorldGenTabs[number]['key']) => void;
};

export function Tabs({ selected, onChange }: TabsProps): JSX.Element {
  return (
    <Container>
      {WorldGenTabs.map(({ text, key }) => (
        <Tab key={key} isSelected={selected === key} onClick={() => onChange(key)}>
          {text}
        </Tab>
      ))}
      <FillTab />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-wrap: no-wrap;
`;

type TabProps = {
  isSelected: boolean;
};

const Tab = styled.button<TabProps>`
  flex: none;
  padding: 1em;
  border: 1px solid ${getColor('white')};
  border-radius: 4px 4px 0 0;
  background-color: inherit;
  color: inherit;

  ${(props) =>
    props.isSelected &&
    `
    border-bottom: 0;
  `}
`;

/** Adds border if the content container below extends past the tabs */
const FillTab = styled.div`
  flex: 1 1 auto;
  border-bottom: 1px solid ${getColor('white')};
`;
