'use client';

import { Input, Select, type SelectOption } from '@/components/atoms';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  type?: 'text' | 'email' | 'tel' | 'number' | 'textarea' | 'select';
  name: string;
  label: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  options?: SelectOption[];
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  className?: string;
  rows?: number;
}

export function FormField({
  type = 'text',
  name,
  label,
  placeholder,
  error,
  helperText,
  required,
  options = [],
  value,
  onChange,
  className,
  rows = 4,
}: FormFieldProps) {
  if (type === 'select') {
    return (
      <Select
        name={name}
        label={label}
        placeholder={placeholder}
        error={error}
        options={options}
        required={required}
        value={value as string}
        onChange={onChange as any}
        className={className}
      />
    );
  }

  if (type === 'textarea') {
    return (
      <div className={cn('w-full', className)}>
        <label htmlFor={name} className="label">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <textarea
          id={name}
          name={name}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          rows={rows}
          className={cn(
            'input resize-none',
            error && 'border-red-500 focus:ring-red-500'
          )}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        {helperText && !error && (
          <p className="mt-1 text-sm text-secondary-500">{helperText}</p>
        )}
      </div>
    );
  }

  return (
    <Input
      type={type}
      name={name}
      label={label}
      placeholder={placeholder}
      error={error}
      helperText={helperText}
      required={required}
      value={value}
      onChange={onChange}
      className={className}
    />
  );
}
