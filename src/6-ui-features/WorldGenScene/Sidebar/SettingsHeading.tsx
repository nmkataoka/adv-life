import styled from '@emotion/styled';
import { getColor } from '6-ui-features/Theme';

type SettingsHeadingProps = {
  children: string;
};

export function SettingsHeading({ children }: SettingsHeadingProps): JSX.Element {
  return (
    <HeadingContainer>
      <h4>{children}</h4>
      <HeadingRight>
        <HeadingRightTop />
        <HeadingRightBottom />
      </HeadingRight>
    </HeadingContainer>
  );
}

const HeadingContainer = styled.div`
  margin-top: 0.5em;
  display: flex;
  align-items: stretch;
`;

const HeadingRight = styled.div`
  flex: 1 0 0;
  margin: 0 1em;

  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const HeadingRightTop = styled.div`
  flex: 0 0 55%;
  box-sizing: border-box;
  border-bottom: 1px solid ${getColor('white')};
`;

const HeadingRightBottom = styled.div`
  flex: 0 0 45%;
`;
