import styled from '@emotion/styled';
// import { useSelector2 } from '4-react-ecsal';

const CombatLog = (): JSX.Element => {
  // const combatLogEntries = [];
  return (
    <ReverserWrapper>
      <InnerWrapper>
        {/* combatLogEntries.map((entry, idx) => (
          // the idx in the key should be removed once timestamps
          // are associated with the entries to make them unique
          // eslint-disable-next-line react/no-array-index-key
          <Entry key={`${entry}_${idx}`}>{entry}</Entry>
        )) */}
      </InnerWrapper>
    </ReverserWrapper>
  );
};

export default CombatLog;

const ReverserWrapper = styled.div`
  overflow: auto;
  display: flex;
  flex-direction: column-reverse;
  height: 15em;
  background-color: lightgray;
  padding: 1em;
  border: 1px solid gray;
`;

const InnerWrapper = styled.div``;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Entry = styled.div`
  padding: 0.1em 0;
`;
