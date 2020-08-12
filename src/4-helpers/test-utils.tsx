import React from 'react';
import { render as rtlRender, RenderResult } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../7-app/rootReducer';

type WrapperProps = {
  children?: React.ReactNode;
}

function render(
  component: JSX.Element,
  {
    store = configureStore({ reducer: rootReducer }),
    ...renderOptions
  } = {},
): RenderResult {
  function Wrapper({ children }: WrapperProps) {
    return <Provider store={store}>{children}</Provider>;
  }
  return rtlRender(component, { wrapper: Wrapper, ...renderOptions });
}

// re-export everything
export * from '@testing-library/react';

// override render method
export { render };
