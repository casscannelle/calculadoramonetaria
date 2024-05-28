import { render, screen } from '@testing-library/react';
import Page from './components/Page/Page';

test('renders titulo', () => {
  render(<Page />);
  const textElement = screen.getByText(/learn/i);
  expect(textElement).toBeInTheDocument();
});
