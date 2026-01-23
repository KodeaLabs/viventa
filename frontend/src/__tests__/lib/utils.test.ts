import {
  cn,
  formatDate,
  formatRelativeTime,
  truncate,
  getInitials,
  debounce,
  propertyTypeLabels,
  listingTypeLabels,
  venezuelanStates,
} from '@/lib/utils';

describe('cn (class name merger)', () => {
  it('merges class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('handles conditional classes', () => {
    expect(cn('foo', false && 'bar', 'baz')).toBe('foo baz');
  });

  it('merges Tailwind classes with proper precedence', () => {
    expect(cn('px-4', 'px-6')).toBe('px-6');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });

  it('handles arrays of classes', () => {
    expect(cn(['foo', 'bar'])).toBe('foo bar');
  });

  it('handles undefined and null values', () => {
    expect(cn('foo', undefined, null, 'bar')).toBe('foo bar');
  });
});

describe('formatDate', () => {
  // Use ISO date with explicit time to avoid timezone issues
  const testDate = '2024-01-15T12:00:00';

  it('formats date in English', () => {
    const result = formatDate(testDate, 'en');
    expect(result).toMatch(/January 15, 2024/);
  });

  it('formats date in Spanish', () => {
    const result = formatDate(testDate, 'es');
    expect(result).toMatch(/15 de enero de 2024/);
  });

  it('uses English as default locale', () => {
    const result = formatDate(testDate);
    expect(result).toMatch(/January 15, 2024/);
  });
});

describe('formatRelativeTime', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-15T12:00:00'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('formats seconds ago', () => {
    const result = formatRelativeTime('2024-01-15T11:59:30', 'en');
    expect(result).toMatch(/30 seconds ago/);
  });

  it('formats minutes ago', () => {
    const result = formatRelativeTime('2024-01-15T11:30:00', 'en');
    expect(result).toMatch(/30 minutes ago/);
  });

  it('formats hours ago', () => {
    const result = formatRelativeTime('2024-01-15T06:00:00', 'en');
    expect(result).toMatch(/6 hours ago/);
  });

  it('formats days ago', () => {
    const result = formatRelativeTime('2024-01-10T12:00:00', 'en');
    expect(result).toMatch(/5 days ago/);
  });

  it('formats months ago', () => {
    const result = formatRelativeTime('2023-11-15T12:00:00', 'en');
    expect(result).toMatch(/2 months ago/);
  });

  it('formats years ago', () => {
    const result = formatRelativeTime('2022-01-15T12:00:00', 'en');
    expect(result).toMatch(/2 years ago/);
  });
});

describe('truncate', () => {
  it('does not truncate short text', () => {
    expect(truncate('Hello', 10)).toBe('Hello');
  });

  it('truncates long text with ellipsis', () => {
    expect(truncate('Hello, World!', 10)).toBe('Hello, ...');
  });

  it('handles text exactly at max length', () => {
    expect(truncate('Hello', 5)).toBe('Hello');
  });

  it('handles empty string', () => {
    expect(truncate('', 10)).toBe('');
  });
});

describe('getInitials', () => {
  it('returns initials from full name', () => {
    expect(getInitials('John Doe')).toBe('JD');
  });

  it('returns single initial for single name', () => {
    expect(getInitials('John')).toBe('J');
  });

  it('limits to two initials', () => {
    expect(getInitials('John Michael Doe')).toBe('JM');
  });

  it('handles lowercase names', () => {
    expect(getInitials('john doe')).toBe('JD');
  });
});

describe('debounce', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('debounces function calls', () => {
    const fn = jest.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('passes arguments to debounced function', () => {
    const fn = jest.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn('arg1', 'arg2');

    jest.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('uses last arguments when called multiple times', () => {
    const fn = jest.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn('first');
    debouncedFn('second');
    debouncedFn('third');

    jest.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledWith('third');
  });
});

describe('propertyTypeLabels', () => {
  it('has English and Spanish labels for all property types', () => {
    const types = ['house', 'apartment', 'condo', 'villa', 'penthouse', 'townhouse', 'land', 'commercial'];

    types.forEach((type) => {
      expect(propertyTypeLabels[type]).toBeDefined();
      expect(propertyTypeLabels[type].en).toBeDefined();
      expect(propertyTypeLabels[type].es).toBeDefined();
    });
  });
});

describe('listingTypeLabels', () => {
  it('has English and Spanish labels for sale and rent', () => {
    expect(listingTypeLabels.sale).toEqual({ en: 'For Sale', es: 'En Venta' });
    expect(listingTypeLabels.rent).toEqual({ en: 'For Rent', es: 'En Alquiler' });
  });
});

describe('venezuelanStates', () => {
  it('contains all Venezuelan states', () => {
    expect(venezuelanStates).toHaveLength(24);
    expect(venezuelanStates).toContain('Nueva Esparta');
    expect(venezuelanStates).toContain('Distrito Capital');
    expect(venezuelanStates).toContain('Zulia');
  });
});
