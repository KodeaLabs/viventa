'use client';

import Link from 'next/link';

interface FooterProps {
  locale: string;
  translations: {
    tagline: string;
    properties: string;
    forSale: string;
    forRent: string;
    featured: string;
    company: string;
    about: string;
    contact: string;
    privacy: string;
    terms: string;
    locations: string;
    margarita: string;
    caracas: string;
    valencia: string;
    copyright: string;
  };
}

export function Footer({ locale, translations }: FooterProps) {
  return (
    <footer className="bg-secondary-900 text-secondary-300">
      <div className="container-custom py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href={`/${locale}`} className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-display font-bold text-xl">V</span>
              </div>
              <span className="font-display font-semibold text-xl text-white">
                Viventa
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed">
              {translations.tagline}
            </p>
          </div>

          {/* Properties */}
          <div>
            <h3 className="text-white font-semibold mb-4">{translations.properties}</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href={`/${locale}/properties?listing_type=sale`}
                  className="text-sm hover:text-white transition-colors"
                >
                  {translations.forSale}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/properties?listing_type=rent`}
                  className="text-sm hover:text-white transition-colors"
                >
                  {translations.forRent}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/properties?is_featured=true`}
                  className="text-sm hover:text-white transition-colors"
                >
                  {translations.featured}
                </Link>
              </li>
            </ul>
          </div>

          {/* Locations */}
          <div>
            <h3 className="text-white font-semibold mb-4">{translations.locations}</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href={`/${locale}/properties?city=Porlamar`}
                  className="text-sm hover:text-white transition-colors"
                >
                  {translations.margarita}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/properties?city=Caracas`}
                  className="text-sm hover:text-white transition-colors"
                >
                  {translations.caracas}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/properties?city=Valencia`}
                  className="text-sm hover:text-white transition-colors"
                >
                  {translations.valencia}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">{translations.company}</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="text-sm hover:text-white transition-colors"
                >
                  {translations.about}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/contact`}
                  className="text-sm hover:text-white transition-colors"
                >
                  {translations.contact}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/privacy`}
                  className="text-sm hover:text-white transition-colors"
                >
                  {translations.privacy}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/terms`}
                  className="text-sm hover:text-white transition-colors"
                >
                  {translations.terms}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Agent CTA */}
        <div className="mt-12 pt-8 border-t border-secondary-800">
          <div className="bg-gradient-to-r from-primary-600/20 to-primary-700/20 rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h3 className="text-white font-display text-lg md:text-xl font-semibold mb-1">
                ¿Eres agente inmobiliario?
              </h3>
              <p className="text-secondary-400 text-sm">
                Publica tus propiedades y conecta con compradores internacionales
              </p>
            </div>
            <Link
              href="/es/portal-agentes"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Publicar Propiedad
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-secondary-800">
          <p className="text-sm text-center">
            {translations.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
