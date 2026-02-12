import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Counter } from '../example/commponents/Counter';

describe('Counter', () => {
  test('should render and increment/decrement counter', async () => {
    render(<Counter />);

    const count = screen.getByTestId('countText');
    const incrementButton = screen.getByTestId('incrementButton');
    const decrementButton = screen.getByTestId('decrementButton');

    fireEvent.click(incrementButton);
    await waitFor(() => expect(count.textContent).toBe('2'));

    fireEvent.click(decrementButton);
    await waitFor(() => expect(count.textContent).toBe('1'));

    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    await waitFor(() => expect(count.textContent).toBe('3'));
  });
});
