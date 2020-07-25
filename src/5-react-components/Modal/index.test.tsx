import React from 'react';
import * as sinon from 'sinon';
import {
  render, fireEvent, screen, waitFor,
} from '../../4-helpers/test-utils';

import Modal from '.';

describe('<Modal />', () => {
  it('when close button is clicked, closes and calls onClose', async () => {
    const handleClose = sinon.stub();
    render(<Modal isShowing onClose={handleClose}><div>Hello!</div></Modal>);

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => screen.getByText('Hello!'));
    expect(handleClose.calledOnce).toBe(true);
  });
});
