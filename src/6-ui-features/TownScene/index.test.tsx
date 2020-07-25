import React from 'react';
import { render, screen } from '@testing-library/react';
import TownScene from '.';

describe('<TownScene />', () => {
  it('renders all shops', () => {
    render(<TownScene />);
    expect(screen.getAllByRole('button')).toHaveLength(4);
  });
});
