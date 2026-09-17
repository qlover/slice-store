import { render, screen, fireEvent, act } from '@testing-library/react';
import Counter from './fixtures/Counter';

describe('Counter', () => {
  test('should render and increment/decrement counter', async () => {
    render(<Counter />);

    const count = screen.getByTestId('countText');
    const incrementButton = screen.getByTestId('incrementButton');
    const decrementButton = screen.getByTestId('decrementButton');

    await act(async () => {
      fireEvent.click(incrementButton);
      await Promise.resolve();
    });
    expect(count.innerHTML).toBe('2');

    await act(async () => {
      fireEvent.click(decrementButton);
      await Promise.resolve();
    });
    expect(count.innerHTML).toBe('1');

    await act(async () => {
      fireEvent.click(incrementButton);
      fireEvent.click(incrementButton);
      await Promise.resolve();
    });
    expect(count.innerHTML).toBe('3');
  });
});
