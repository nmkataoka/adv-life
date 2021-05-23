import { FunctionComponent, ReactNode } from 'react';
// This is a test file so it can use dev dependencies
/* eslint-disable import/no-extraneous-dependencies */
import { render as rtlRender, RenderResult } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, ConfigureStoreOptions } from '@reduxjs/toolkit';
import rootReducer from '7-app/rootReducer';

type WrapperProps = {
  children?: ReactNode;
};

function render(
  component: JSX.Element,
  { store = configureStore({ reducer: rootReducer }), ...renderOptions } = {},
): RenderResult {
  function Wrapper({ children }: WrapperProps) {
    return <Provider store={store}>{children}</Provider>;
  }
  return rtlRender(component, { wrapper: Wrapper, ...renderOptions });
}

function createRenderer<ComponentProps>(Component: FunctionComponent<ComponentProps>) {
  return (
    props: ComponentProps,
    { reducer = rootReducer, ...configureStoreOptions }: Partial<ConfigureStoreOptions> = {},
    { ...renderOptions } = {},
  ): RenderResult =>
    render(
      // eslint-disable-next-line react/jsx-props-no-spreading
      <Component {...props} />,
      {
        store: configureStore({ reducer, ...configureStoreOptions }),
        ...renderOptions,
      },
    );
}

// re-export everything
export * from '@testing-library/react';

// override render method
export { render, createRenderer };

const originalImageData = global.ImageData;
class ImageData {
  constructor(sw: number, sh: number);

  constructor(dataIn: Uint8ClampedArray, sw: number, sh?: number);

  constructor(arg1: number | Uint8ClampedArray, arg2: number, arg3?: number) {
    if (typeof arg1 === 'number') {
      this.data = new Uint8ClampedArray(arg1 * arg2);
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.height = arg3!;
      this.width = arg2;
    } else {
      this.data = arg1;
      this.height = arg3 ?? Math.floor(this.data.length / arg2);
      this.width = arg2;
    }
  }

  data: Uint8ClampedArray;

  height: number;

  width: number;
}

class ResizeObserver {
  observe() {}

  unobserve() {}

  disconnect() {}
}

export function setGlobals(): void {
  global.ImageData = ImageData;
  global.ResizeObserver = ResizeObserver;
}

export function resetGlobals(): void {
  global.ImageData = originalImageData;
}
/* eslint-enable import/no-extraneous-dependencies */
