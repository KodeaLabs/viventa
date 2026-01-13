import { render, screen, fireEvent } from '@testing-library/react';
import { PropertyCard } from '@/components/molecules/PropertyCard';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: any) => <a href={href}>{children}</a>,
}));

// Mock formatPrice
jest.mock('@/lib/api', () => ({
  formatPrice: (price: number) => `$${price.toLocaleString()}`,
}));

const mockProperty = {
  id: '1',
  title: 'Beautiful Beach House',
  slug: 'beautiful-beach-house',
  description: 'A stunning beachfront property',
  price: 150000,
  property_type: 'house',
  listing_type: 'sale' as const,
  status: 'active' as const,
  bedrooms: 4,
  bathrooms: 3,
  area_sqm: 250,
  address: '123 Beach Road',
  city: 'Porlamar',
  state: 'Nueva Esparta',
  country: 'Venezuela',
  location_display: 'Porlamar, Nueva Esparta',
  main_image: '/images/property-1.jpg',
  is_featured: true,
  is_beachfront: true,
  is_investment_opportunity: false,
  created_at: '2024-01-01',
  updated_at: '2024-01-01',
};

const translations = {
  bedrooms: 'bd',
  bathrooms: 'ba',
  forSale: 'For Sale',
  forRent: 'For Rent',
  beachfront: 'Beachfront',
  featured: 'Featured',
  investment: 'Investment',
};

describe('PropertyCard', () => {
  it('renders property information correctly', () => {
    render(
      <PropertyCard
        property={mockProperty}
        locale="en"
        translations={translations}
      />
    );

    expect(screen.getByText('Beautiful Beach House')).toBeInTheDocument();
    expect(screen.getByText('$150,000')).toBeInTheDocument();
    expect(screen.getByText('Porlamar, Nueva Esparta')).toBeInTheDocument();
    expect(screen.getByText('4 bd')).toBeInTheDocument();
    expect(screen.getByText('3 ba')).toBeInTheDocument();
    expect(screen.getByText('250 m²')).toBeInTheDocument();
  });

  it('renders badges for property features', () => {
    render(
      <PropertyCard
        property={mockProperty}
        locale="en"
        translations={translations}
      />
    );

    expect(screen.getByText('For Sale')).toBeInTheDocument();
    expect(screen.getByText('Featured')).toBeInTheDocument();
    expect(screen.getByText('Beachfront')).toBeInTheDocument();
  });

  it('renders For Rent badge for rental properties', () => {
    const rentalProperty = { ...mockProperty, listing_type: 'rent' as const };
    render(
      <PropertyCard
        property={rentalProperty}
        locale="en"
        translations={translations}
      />
    );

    expect(screen.getByText('For Rent')).toBeInTheDocument();
  });

  it('renders investment badge when applicable', () => {
    const investmentProperty = { ...mockProperty, is_investment_opportunity: true };
    render(
      <PropertyCard
        property={investmentProperty}
        locale="en"
        translations={translations}
      />
    );

    expect(screen.getByText('Investment')).toBeInTheDocument();
  });

  it('calls onSave when save button is clicked', () => {
    const handleSave = jest.fn();
    render(
      <PropertyCard
        property={mockProperty}
        locale="en"
        translations={translations}
        onSave={handleSave}
      />
    );

    const saveButton = screen.getByRole('button', { name: /save property/i });
    fireEvent.click(saveButton);

    expect(handleSave).toHaveBeenCalledWith('1');
  });

  it('shows filled heart when property is saved', () => {
    render(
      <PropertyCard
        property={mockProperty}
        locale="en"
        translations={translations}
        onSave={() => {}}
        isSaved={true}
      />
    );

    expect(screen.getByRole('button', { name: /remove from saved/i })).toBeInTheDocument();
  });

  it('links to the correct property detail page', () => {
    render(
      <PropertyCard
        property={mockProperty}
        locale="en"
        translations={translations}
      />
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/en/properties/beautiful-beach-house');
  });

  it('uses placeholder image when main_image is null', () => {
    const propertyWithoutImage = { ...mockProperty, main_image: null };
    render(
      <PropertyCard
        property={propertyWithoutImage}
        locale="en"
        translations={translations}
      />
    );

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', '/images/placeholder-property.jpg');
  });
});
