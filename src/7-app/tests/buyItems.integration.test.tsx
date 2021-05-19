import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '8-helpers/test-utils';
import userEvent from '@testing-library/user-event';
import App from '../../App';

describe('buy items (integration)', () => {
  it('can create character and buy items', async () => {
    const { getByText, getByTestId, getByRole } = render(<App isTest />);

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

    // Set up world
    userEvent.click(screen.getByText('Create World'));

    // Reduce map size for tests
    fireEvent.change(getByTestId('width-slider'), { target: { value: 200 } });
    fireEvent.change(getByTestId('height-slider'), { target: { value: 100 } });
    fireEvent.change(getByTestId('numPlates-slider'), { target: { value: 5 } });

    const goBtn = await waitFor(() => getByText('Go!'));

    userEvent.click(goBtn);
    const finishTab = await waitFor(() => getByText('Finish'));
    userEvent.click(finishTab);
    const lastGoBtn = await waitFor(() => getByText('Go!'));

    userEvent.click(lastGoBtn);

    // Go through character creation
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
