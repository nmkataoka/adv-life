import { useContext, createContext } from 'react';

const TestContext = createContext(false);

export const TestProvider = TestContext.Provider;

export function useIsTest(): boolean {
  const isTest = useContext(TestContext);
  return isTest;
}
