import styled from '@emotion/styled';
import { PrimaryButton } from '6-ui-features/DesignSystem/buttons/PrimaryButton';

type ButtonRowProps = {
  onGo: () => void;
};

export function ButtonRow({ onGo }: ButtonRowProps): JSX.Element {
  return (
    <LastRow>
      <PrimaryButton onClick={onGo}>Go!</PrimaryButton>
    </LastRow>
  );
}

const LastRow = styled.div`
  display: flex;
  margin: 0.5em;
  justify-content: flex-end;
`;
