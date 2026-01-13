import { render, screen, fireEvent } from '@testing-library/react';
import { Input } from '@/components/atoms/Input';

describe('Input', () => {
  it('renders with default props', () => {
    render(<Input placeholder="Enter text" />);

    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders with label', () => {
    render(<Input label="Email" id="email" />);

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('renders with error state', () => {
    render(<Input error="This field is required" />);

    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveClass('border-red-500');
  });

  it('renders with helper text', () => {
    render(<Input helperText="Enter a valid email" />);

    expect(screen.getByText('Enter a valid email')).toBeInTheDocument();
  });

  it('does not show helper text when error is present', () => {
    render(<Input error="Error message" helperText="Helper text" />);

    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
  });

  it('handles input changes', () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });

    expect(handleChange).toHaveBeenCalled();
  });

  it('disables input when disabled prop is true', () => {
    render(<Input disabled />);

    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<Input className="custom-class" />);

    expect(screen.getByRole('textbox')).toHaveClass('custom-class');
  });

  it('uses name as id fallback', () => {
    render(<Input name="email" label="Email" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'email');
    expect(screen.getByLabelText('Email')).toBe(input);
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<Input ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
