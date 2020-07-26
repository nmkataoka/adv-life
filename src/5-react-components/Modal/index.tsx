import React, {
  useState, useMemo, useCallback, useEffect,
} from 'react';
import styled from '@emotion/styled';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../7-app/types';
import { usedModalZIndex } from './modalMetaSlice';

type ModalProps = {
  children?: React.ReactNode,
  isShowing?: boolean,
  onClose?: () => void,
}

export default function Modal({ children, isShowing, onClose }: ModalProps): JSX.Element | null {
  const dispatch = useDispatch();
  const nextZIndex = useSelector((state: RootState) => state.modalMeta.nextZIndex);
  const [zIndex, setZIndex] = useState(-1);
  const [offset] = useState({ x: 5 * (Math.random() + 1), y: 5 * (Math.random() + 1) });

  const handleFocus = useCallback(() => {
    // When the container is clicked on, raise it in front of other open modals
    if (nextZIndex - 1 > zIndex) {
      setZIndex(nextZIndex);
      dispatch(usedModalZIndex(nextZIndex));
    }
  }, [dispatch, nextZIndex, zIndex]);

  const handleClose = useCallback(() => {
    setZIndex(-1);
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (zIndex === -1 && isShowing) {
      handleFocus();
    }
  }, [zIndex, isShowing, handleFocus]);

  // We don't want to rerender the content just because nextZIndex changes
  const content = useMemo(() => (
    <RelativeDiv>
      <CloseButton onClick={handleClose}>X</CloseButton>
      {children}
    </RelativeDiv>
  ), [children, handleClose]);

  if (!isShowing) return null;

  return (
    <Container style={{ zIndex }} offset={offset} onClick={handleFocus}>
      {content}
    </Container>
  );
}

type ContainerProps = {
  offset: {
    x: number;
    y: number;
  }
}
const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  ${({ offset }: ContainerProps) =>
    `transform: translate(calc(-50% + ${offset.x}em), calc(-50% + ${offset.y}em));`}
`;

const RelativeDiv = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const CloseButton = styled.button`
  font-size: 1.4em;
  padding: 0.5em 0.75em;
  position: absolute;
  top: 0.5em;
  right: 0.5em;
`;
