import React, { useRef } from 'react';
import { fireEvent, render } from '@testing-library/react';
import useZoomOnScroll from './useZoomOnScroll';

function TestCanvas({ max, min }: { max?: number; min?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scale = useZoomOnScroll(canvasRef, min, max);
  return (
    <canvas data-testid="canvas" ref={canvasRef}>
      {scale.toFixed(1)}
    </canvas>
  );
}

describe('useZoomOnScroll', () => {
  beforeEach(() => {});

  it('starts at scale=1 and zooms in when scrolling down', () => {
    const { container, getByTestId } = render(<TestCanvas />);
    expect(container).toHaveTextContent('1.0');

    fireEvent.wheel(getByTestId('canvas'), { deltaY: 10000 });
    expect(container).toHaveTextContent('2.0');
  });

  it('does not zoom past default min and max', () => {
    const { container, getByTestId } = render(<TestCanvas />);
    fireEvent.wheel(getByTestId('canvas'), { deltaY: 100000 });
    expect(container).toHaveTextContent('2.0');

    fireEvent.wheel(getByTestId('canvas'), { deltaY: -100000 });
    expect(container).toHaveTextContent('1.0');
  });
});
