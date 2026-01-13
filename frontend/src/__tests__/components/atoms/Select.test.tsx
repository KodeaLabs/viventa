import { render, screen, fireEvent } from '@testing-library/react';
import { Select } from '@/components/atoms/Select';

const options = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

describe('Select', () => {
  it('renders with default props', () => {
    render(<Select options={options} />);

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('renders with label', () => {
    render(<Select options={options} label="Choose option" id="select" />);

    expect(screen.getByLabelText('Choose option')).toBeInTheDocument();
  });

  it('renders with placeholder as disabled option', () => {
    render(<Select options={options} placeholder="Select an option" />);

    const placeholderOption = screen.getByRole('option', { name: 'Select an option' });
    expect(placeholderOption).toBeInTheDocument();
    expect(placeholderOption).toBeDisabled();
    expect(screen.getAllByRole('option')).toHaveLength(4); // placeholder + 3 options
  });

  it('renders with error state', () => {
    render(<Select options={options} error="Please select an option" />);

    expect(screen.getByText('Please select an option')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveClass('border-red-500');
  });

  it('handles value changes', () => {
    const handleChange = jest.fn();
    render(<Select options={options} onChange={handleChange} />);

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'option2' } });

    expect(handleChange).toHaveBeenCalled();
  });

  it('disables select when disabled prop is true', () => {
    render(<Select options={options} disabled />);

    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('applies custom className', () => {
    render(<Select options={options} className="custom-class" />);

    expect(screen.getByRole('combobox')).toHaveClass('custom-class');
  });

  it('renders with selected value', () => {
    render(<Select options={options} value="option2" onChange={() => {}} />);

    expect(screen.getByRole('combobox')).toHaveValue('option2');
  });

  it('uses name as id fallback', () => {
    render(<Select options={options} name="category" label="Category" />);

    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('id', 'category');
    expect(screen.getByLabelText('Category')).toBe(select);
  });

  it('forwards ref correctly', () => {
    const ref = { current: null };
    render(<Select options={options} ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });
});
