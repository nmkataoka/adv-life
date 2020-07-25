import React from 'react';
import {
  render, fireEvent, screen, waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import Modal from '.';

describe('<Modal />', () => {
  it('closes when close button is clicked', async () => {
    render(<Modal isShowing><div>Hello!</div></Modal>);

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => screen.getByText('Hello!'));
    expect(() => screen.getByTestId('Hello!')).toThrow();
  });
});
