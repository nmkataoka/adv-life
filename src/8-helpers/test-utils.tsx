import React from 'react';
import { render as rtlRender, RenderResult } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore, ConfigureStoreOptions } from '@reduxjs/toolkit';
import rootReducer from '7-app/rootReducer';

type WrapperProps = {
  children?: React.ReactNode;
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

function createRenderer<ComponentProps>(Component: React.FunctionComponent<ComponentProps>) {
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
