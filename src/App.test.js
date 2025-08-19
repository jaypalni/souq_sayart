/*
 * Copyright (c) 2025 Palni.
 * All rights reserved.
 *
 * This file is part of the ss-frontend project.
 */

import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
