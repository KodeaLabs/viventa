import { render, screen } from '@testing-library/react';
import { Spinner } from '@/components/atoms/Spinner';

describe('Spinner', () => {
  it('renders with default props', () => {
    const { container } = render(<Spinner />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('h-8', 'w-8');
  });

  it('renders with different sizes', () => {
    const { container, rerender } = render(<Spinner size="sm" />);
    expect(container.querySelector('svg')).toHaveClass('h-4', 'w-4');

    rerender(<Spinner size="md" />);
    expect(container.querySelector('svg')).toHaveClass('h-8', 'w-8');

    rerender(<Spinner size="lg" />);
    expect(container.querySelector('svg')).toHaveClass('h-12', 'w-12');
  });

  it('has animate-spin class', () => {
    const { container } = render(<Spinner />);

    expect(container.querySelector('svg')).toHaveClass('animate-spin');
  });

  it('applies custom className', () => {
    const { container } = render(<Spinner className="custom-class" />);

    expect(container.querySelector('svg')).toHaveClass('custom-class');
  });

  it('has proper svg structure', () => {
    const { container } = render(<Spinner />);

    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    expect(svg?.querySelector('circle')).toBeInTheDocument();
    expect(svg?.querySelector('path')).toBeInTheDocument();
  });

  it('has default primary-600 color', () => {
    const { container } = render(<Spinner />);

    expect(container.querySelector('svg')).toHaveClass('text-primary-600');
  });
});
