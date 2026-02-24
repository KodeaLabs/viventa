'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import {
  Bars3Icon,
  XMarkIcon,
  GlobeAltIcon,
  UserCircleIcon,
  ArrowRightStartOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { cn } from '../../lib/utils';

interface HeaderProps {
  locale: string;
  translations: {
    home: string;
    properties: string;
    projects: string;
    agents: string;
    about: string;
    contact: string;
    signIn: string;
    signOut: string;
    dashboard: string;
    myListings: string;
    myContracts: string;
  };
}

export function Header({ locale, translations }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, isLoading } = useUser();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const navigation = [
    { name: translations.home, href: `/${locale}` },
    { name: translations.properties, href: `/${locale}/properties` },
    { name: translations.projects, href: `/${locale}/projects` },
    { name: translations.agents, href: `/${locale}/agents` },
    { name: translations.about, href: `/${locale}/about` },
    { name: translations.contact, href: `/${locale}/contact` },
  ];

  const isActive = (href: string) => pathname === href;

  const otherLocale = locale === 'en' ? 'es' : 'en';
  const localePath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
              Viventi
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

            {/* Auth */}
            {!isLoading && (
              <>
                {user ? (
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center space-x-2 text-secondary-600 hover:text-secondary-900 transition-colors"
                    >
                      {user.picture ? (
                        <img
                          src={user.picture}
                          alt={user.name || ''}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <UserCircleIcon className="h-8 w-8" />
                      )}
                      <span className="text-sm font-medium max-w-[120px] truncate">
                        {user.name || user.email}
                      </span>
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-200 py-1 z-50">
                        <Link
                          href={`/${locale}/agent/properties`}
                          className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          {translations.myListings}
                        </Link>
                        <Link
                          href={`/${locale}/my/contracts`}
                          className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          {translations.myContracts}
                        </Link>
                        <hr className="my-1 border-secondary-100" />
                        <a
                          href="/api/auth/logout"
                          className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <ArrowRightStartOnRectangleIcon className="h-4 w-4 mr-2" />
                          {translations.signOut}
                        </a>
                      </div>
                    )}
                  </div>
                ) : (
                  <a
                    href="/api/auth/login"
                    className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    {translations.signIn}
                  </a>
                )}
              </>
            )}
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
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-300 ease-in-out',
            mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="py-4 border-t border-secondary-100">
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

              {/* Mobile Auth */}
              {!isLoading && (
                <>
                  <hr className="border-secondary-100" />
                  {user ? (
                    <>
                      <div className="flex items-center space-x-2 text-secondary-700">
                        {user.picture ? (
                          <img
                            src={user.picture}
                            alt={user.name || ''}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <UserCircleIcon className="h-8 w-8" />
                        )}
                        <span className="text-sm font-medium">{user.name || user.email}</span>
                      </div>
                      <Link
                        href={`/${locale}/agent/properties`}
                        className="text-secondary-600 text-base font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {translations.myListings}
                      </Link>
                      <Link
                        href={`/${locale}/my/contracts`}
                        className="text-secondary-600 text-base font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {translations.myContracts}
                      </Link>
                      <a
                        href="/api/auth/logout"
                        className="text-red-600 text-base font-medium"
                      >
                        {translations.signOut}
                      </a>
                    </>
                  ) : (
                    <a
                      href="/api/auth/login"
                      className="inline-flex items-center justify-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      {translations.signIn}
                    </a>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
