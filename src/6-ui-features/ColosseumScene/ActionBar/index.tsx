import styled from '@emotion/styled';
import ActionButton from './ActionButton';

const actions = [
  { name: 'attack', displayText: 'Attack' },
  { name: 'defend', displayText: 'Defend' },
  { name: 'fireball', displayText: 'Fireball', aoeRadius: 1 },
  { name: 'stealth', displayText: 'Stealth' },
  { name: 'heal', displayText: 'Heal' },
  { name: 'flee', displayText: 'Flee' },
];

export default function ActionBar(): JSX.Element {
  return (
    <Container>
      {actions.map(({ name, displayText }) => (
        <ActionButton key={name} displayText={displayText} />
      ))}
    </Container>
  );
}

const Container = styled.div`
  background-color: #060708;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 0.5em 0.25em;
  position: absolute;
  bottom: 0;
`;
