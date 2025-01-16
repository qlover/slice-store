import { render, screen, fireEvent } from '@testing-library/react';
import Counter from '../src/commponents/Counter';

describe('Counter', () => {
  test('should render and increment/decrement counter', () => {
    render(<Counter />);

    const count = screen.getByTestId('countText');
    const incrementButton = screen.getByTestId('incrementButton');
    const decrementButton = screen.getByTestId('decrementButton');

    fireEvent.click(incrementButton);
    expect(count.innerHTML).toBe('2');

    fireEvent.click(decrementButton);
    expect(count.innerHTML).toBe('1');

    fireEvent.click(incrementButton);
    fireEvent.click(incrementButton);
    expect(count.innerHTML).toBe('3');
  });
});
