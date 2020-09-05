import { createRenderer, screen } from '../../4-helpers/test-utils';
import TownScene from '.';

const defaultTownInfo = {
  inventory: {
    itemStacks: [],
    gold: 0,
  },
  name: 'Marketplace',
  townLocationId: 1,
};

describe('<TownScene />', () => {
  const renderTownScene = createRenderer(TownScene);
  it('renders all shops', () => {
    const initialReduxState = {
      townLocations: {
        byId: {
          2: { ...defaultTownInfo, townLocationId: 2 },
          3: { ...defaultTownInfo, townLocationId: 3 },
          4: { ...defaultTownInfo, townLocationId: 4 },
          5: { ...defaultTownInfo, townLocationId: 5 },
        },
      },
      townScene: { currentTownId: 1 },
      towns: {
        byId: {
          1: {
            locationIds: [2, 3, 4, 5],
            name: 'Oxford',
            townId: 1,
          },
        },
      },
    };
    renderTownScene({}, { preloadedState: initialReduxState });
    expect(screen.getAllByRole('button')).toHaveLength(4);
  });
});
