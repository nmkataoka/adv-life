import React from 'react';
import { render, screen, waitFor, waitForElementToBeRemoved } from '8-helpers/test-utils';
import userEvent from '@testing-library/user-event';
import App from '../../App';

describe('buy items (integration)', () => {
  it('can create character and buy items', async () => {
    const { getByText, getByRole } = render(<App />);

    const closeModal = () => {
      const closeButton = getByRole('button', { name: 'X' });
      userEvent.click(closeButton);
    };

    const checkPlayerGold = async (gold: number) => {
      const playerInventory = await waitFor(() => getByText('Player Name'));
      userEvent.click(playerInventory);

      await waitFor(() => {
        expect(getByText(`Gold: ${gold}g`)).toBeInTheDocument();
      });

      closeModal();
    };

    userEvent.click(screen.getByText('New Game'));
    const doneBtn = await waitFor(() => getByText('Done'));

    userEvent.click(doneBtn);

    await checkPlayerGold(3000);

    const blacksmith = await waitFor(() => getByText("Blacksmith's"));
    userEvent.click(blacksmith);
    const boots = await waitFor(() => getByRole('button', { name: /boots/i }));

    userEvent.dblClick(boots);
    await waitForElementToBeRemoved(() => getByRole('button', { name: /boots/i }));

    // Boots should move to the inventory
    expect(getByText('boots')).toBeInTheDocument();
    closeModal();
    await checkPlayerGold(2250);
  });
});
