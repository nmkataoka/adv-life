import styled from '@emotion/styled';

const attributes = [
  { label: 'Race', value: 'Human' },
  { label: 'Class', value: 'Fighter' },
  { label: 'Strength', value: 1 },
];

const CharacterSummary = (): JSX.Element => (
  <Container>
    <h3>Joe Uristemiah</h3>
    {attributes.map(({ label, value }) => (
      <div key={label}>
        <b>{`${label}: `}</b>
        {value}
      </div>
    ))}
  </Container>
);

const Container = styled.div``;

export default CharacterSummary;
