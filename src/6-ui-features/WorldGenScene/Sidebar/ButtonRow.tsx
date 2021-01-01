import React from 'react';
import styled from '@emotion/styled';
import { PrimaryButton } from '6-ui-features/DesignSystem/buttons/PrimaryButton';

export function ButtonRow(): JSX.Element {
  return (
    <LastRow>
      <PrimaryButton>Go!</PrimaryButton>
    </LastRow>
  );
}

const LastRow = styled.div`
  display: flex;
  margin: 0.5em;
  justify-content: flex-end;
`;
