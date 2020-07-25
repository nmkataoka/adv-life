import React from 'react';
import { render, screen } from '@testing-library/react';
import TownLocation from './TownLocation';

describe('<TownLocation />', () => {
  it('renders location name', () => {
    const name = 'Marketplace';
    render(<TownLocation name={name} />);

    expect(screen.getByRole('button')).toHaveTextContent(name);
  });
});
