import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from './7-app/store';
import App from './App';

test('renders learn react link', () => {
  const { getByText } = render(
    <Provider store={store}>
      <App isTest />
    </Provider>,
  );

  expect(getByText(/Adventurer's Life/i)).toBeInTheDocument();
});
