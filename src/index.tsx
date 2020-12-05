import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from 'react-redux';
import { store } from './7-app/store';
import { unregister } from './serviceWorker';

const render = async () => {
  const App = (await import('./App')).default;

  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>,
    document.getElementById('root'),
  );
};

// eslint-disable-next-line no-void
void (async () => {
  await render();
})();

if (process.env.NODE_ENV === 'development' && module.hot) {
  // eslint-disable-next-line
  module.hot.accept('./App', render);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
unregister();
