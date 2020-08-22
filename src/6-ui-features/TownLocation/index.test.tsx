import React from 'react';
import { render, screen } from '../../4-helpers/test-utils';
import TownLocation from '.';

describe('<TownLocation />', () => {
  it('renders location name', () => {
    const name = 'Marketplace';
    render(<TownLocation name={name} />);

    expect(screen.getByRole('button')).toHaveTextContent(name);
  });
});
