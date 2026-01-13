import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from '@/components/molecules/SearchBar';

const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock window.location for locale detection
const mockLocation = {
  pathname: '/en/properties',
};

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

const translations = {
  searchPlaceholder: 'Search properties...',
  allTypes: 'All Types',
  forSale: 'For Sale',
  forRent: 'For Rent',
  search: 'Search',
  location: 'Location',
};

describe('SearchBar', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  describe('Hero variant', () => {
    it('renders search form with all fields', () => {
      render(<SearchBar variant="hero" translations={translations} />);

      expect(screen.getByPlaceholderText('Search properties...')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Margarita, Caracas...')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    });

    it('submits search with parameters', () => {
      render(<SearchBar variant="hero" translations={translations} />);

      const searchInput = screen.getByPlaceholderText('Search properties...');
      const locationInput = screen.getByPlaceholderText('Margarita, Caracas...');
      const typeSelect = screen.getByRole('combobox');
      const submitButton = screen.getByRole('button', { name: /search/i });

      fireEvent.change(searchInput, { target: { value: 'beach house' } });
      fireEvent.change(locationInput, { target: { value: 'Porlamar' } });
      fireEvent.change(typeSelect, { target: { value: 'sale' } });
      fireEvent.click(submitButton);

      expect(mockPush).toHaveBeenCalledWith(
        '/en/properties?search=beach+house&listing_type=sale&city=Porlamar'
      );
    });

    it('submits search with partial parameters', () => {
      render(<SearchBar variant="hero" translations={translations} />);

      const searchInput = screen.getByPlaceholderText('Search properties...');
      const submitButton = screen.getByRole('button', { name: /search/i });

      fireEvent.change(searchInput, { target: { value: 'apartment' } });
      fireEvent.click(submitButton);

      expect(mockPush).toHaveBeenCalledWith('/en/properties?search=apartment');
    });
  });

  describe('Compact variant', () => {
    it('renders compact search form', () => {
      render(<SearchBar variant="compact" translations={translations} />);

      expect(screen.getByPlaceholderText('Search properties...')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
      // Location input should not be visible in compact mode
      expect(screen.queryByPlaceholderText('Margarita, Caracas...')).not.toBeInTheDocument();
    });

    it('submits search from compact form', () => {
      render(<SearchBar variant="compact" translations={translations} />);

      const searchInput = screen.getByPlaceholderText('Search properties...');
      const submitButton = screen.getByRole('button', { name: /search/i });

      fireEvent.change(searchInput, { target: { value: 'villa' } });
      fireEvent.click(submitButton);

      expect(mockPush).toHaveBeenCalledWith('/en/properties?search=villa');
    });
  });

  it('submits empty search', () => {
    render(<SearchBar variant="hero" translations={translations} />);

    const submitButton = screen.getByRole('button', { name: /search/i });
    fireEvent.click(submitButton);

    expect(mockPush).toHaveBeenCalledWith('/en/properties?');
  });
});
