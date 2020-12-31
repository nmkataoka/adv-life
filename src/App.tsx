import React, { useEffect } from 'react';
import { GameManager } from '0-engine/GameManager';
import { Provider as EcsalProvider } from '4-react-ecsal';
import { TestProvider } from '6-ui-features/TestContext';
import { defaultTheme } from '6-ui-features/Theme';
import { ThemeProvider } from '@emotion/react';
import { SceneRouter } from '7-app/SceneRouter';

type AppProps = {
  isTest?: boolean;
};

function App({ isTest = false }: AppProps): JSX.Element {
  useEffect(() => {
    void GameManager.instance.Start();

    // Only start once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <TestProvider value={isTest}>
      <ThemeProvider theme={defaultTheme}>
        <EcsalProvider store={GameManager.instance.eMgr}>
          <SceneRouter />
        </EcsalProvider>
      </ThemeProvider>
    </TestProvider>
  );
}

export default App;
