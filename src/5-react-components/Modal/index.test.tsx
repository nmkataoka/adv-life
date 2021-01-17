import { stub } from 'sinon';
import { render, fireEvent, screen, waitFor } from '8-helpers/test-utils';

import Modal from '.';

describe('<Modal />', () => {
  it('when close button is clicked, closes and calls onClose', async () => {
    const handleClose = stub();
    render(
      <Modal isShowing onClose={handleClose}>
        <div>Hello!</div>
      </Modal>,
    );

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => screen.getByText('Hello!'));
    expect(handleClose.calledOnce).toBe(true);
  });
});
