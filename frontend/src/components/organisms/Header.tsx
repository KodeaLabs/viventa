'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bars3Icon,
  XMarkIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface HeaderProps {
  locale: string;
  translations: {
    home: string;
    properties: string;
    agents: string;
    about: string;
    contact: string;
  };
}

export function Header({ locale, translations }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navigation = [
    { name: translations.home, href: `/${locale}` },
    { name: translations.properties, href: `/${locale}/properties` },
    { name: translations.agents, href: `/${locale}/agents` },
    { name: translations.about, href: `/${locale}/about` },
    { name: translations.contact, href: `/${locale}/contact` },
  ];

  const isActive = (href: string) => pathname === href;

  const otherLocale = locale === 'en' ? 'es' : 'en';
  const localePath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  return (
    <header className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-secondary-100">
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-display font-bold text-xl">V</span>
            </div>
            <span className="font-display font-semibold text-xl text-secondary-900 hidden sm:block">
              Viventa
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  isActive(item.href)
                    ? 'text-primary-600'
                    : 'text-secondary-600 hover:text-secondary-900'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Switcher */}
            <Link
              href={localePath}
              className="flex items-center space-x-1 text-secondary-600 hover:text-secondary-900 transition-colors"
            >
              <GlobeAltIcon className="h-5 w-5" />
              <span className="text-sm font-medium uppercase">{otherLocale}</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-secondary-600 hover:bg-secondary-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-secondary-100">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-base font-medium',
                    isActive(item.href)
                      ? 'text-primary-600'
                      : 'text-secondary-600'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <hr className="border-secondary-100" />
              <Link
                href={localePath}
                className="flex items-center space-x-2 text-secondary-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                <GlobeAltIcon className="h-5 w-5" />
                <span>{otherLocale === 'en' ? 'English' : 'Español'}</span>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
