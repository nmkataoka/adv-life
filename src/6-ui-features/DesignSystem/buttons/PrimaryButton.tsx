import styled from '@emotion/styled';
import { getColor } from '6-ui-features/Theme';
import { ButtonProps } from './ButtonProps';

type PrimaryButtonProps = ButtonProps;

export function PrimaryButton({ children, className, onClick }: PrimaryButtonProps): JSX.Element {
  return (
    <PrimaryButtonStyled className={className} onClick={onClick} role="button">
      {children}
    </PrimaryButtonStyled>
  );
}

const PrimaryButtonStyled = styled.button`
  background-color: ${getColor('blue')};
  border-radius: 4px;
  color: ${getColor('white')};
  font-size: 1.4em;
  padding: 0.25em 0.75em;
  box-shadow: var(--shadow-12);

  &:hover {
    background-color: ${getColor('blueLighter')};
  }
`;
