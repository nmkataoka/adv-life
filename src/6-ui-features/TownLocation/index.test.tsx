import { createRenderer, screen } from '../../4-helpers/test-utils';
import TownLocation from '.';

describe('<TownLocation />', () => {
  const renderScreen = createRenderer(TownLocation);

  it('renders location name', () => {
    const name = 'Marketplace';
    const townLocationInfo = {
      inventory: {
        inventorySlots: [],
        gold: 0,
      },
      name: 'Marketplace',
      townLocationId: 1,
    };
    renderScreen({ townLocationId: 1 }, { preloadedState: { townLocations: { byId: { 1: townLocationInfo } } } });

    expect(screen.getByRole('button')).toHaveTextContent(name);
  });
});
