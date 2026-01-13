import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/atoms';
import { SearchBar } from '@/components/molecules';
import { PropertyGrid } from '@/components/organisms';
import { api } from '@/lib/api';
import {
  BuildingOffice2Icon,
  UserGroupIcon,
  GlobeAmericasIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'home' });
  const heroT = await getTranslations({ locale, namespace: 'hero' });
  const searchT = await getTranslations({ locale, namespace: 'search' });
  const propertyT = await getTranslations({ locale, namespace: 'property' });

  // Fetch featured properties
  let featuredProperties = [];
  try {
    const response = await api.getFeaturedProperties();
    featuredProperties = response.data || [];
  } catch (error) {
    console.error('Failed to fetch featured properties:', error);
  }

  const searchTranslations = {
    searchPlaceholder: searchT('placeholder'),
    allTypes: searchT('allTypes'),
    forSale: searchT('forSale'),
    forRent: searchT('forRent'),
    search: searchT('search'),
    location: searchT('location'),
  };

  const propertyTranslations = {
    bedrooms: propertyT('bedrooms'),
    bathrooms: propertyT('bathrooms'),
    forSale: propertyT('forSale'),
    forRent: propertyT('forRent'),
    beachfront: propertyT('beachfront'),
    featured: propertyT('featured'),
    investment: propertyT('investment'),
    noProperties: propertyT('noProperties'),
  };

  const stats = [
    { value: '500+', label: locale === 'es' ? 'Propiedades' : 'Properties' },
    { value: '150+', label: locale === 'es' ? 'Agentes Verificados' : 'Verified Agents' },
    { value: '24', label: locale === 'es' ? 'Estados' : 'States' },
    { value: '98%', label: locale === 'es' ? 'Satisfacción' : 'Satisfaction' },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-secondary-900 min-h-[600px] lg:min-h-[700px]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop"
            alt="Luxury beachfront property"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary-900/95 via-secondary-900/80 to-secondary-900/60" />
        </div>

        <div className="container-custom relative z-10 py-20 lg:py-28">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 bg-primary-600/20 text-primary-300 text-sm font-medium rounded-full mb-6 border border-primary-500/30">
              {locale === 'es' ? 'Plataforma Inmobiliaria #1 de Venezuela' : "Venezuela's #1 Real Estate Platform"}
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6 leading-tight">
              {heroT('title')}
            </h1>

            <p className="text-lg md:text-xl text-secondary-300 mb-8 leading-relaxed">
              {heroT('subtitle')}
            </p>

            {/* Search Bar */}
            <div className="mb-10">
              <SearchBar translations={searchTranslations} />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-white/10">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-secondary-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <span className="text-primary-600 font-medium text-sm uppercase tracking-wider mb-2 block">
                {locale === 'es' ? 'Destacados' : 'Featured'}
              </span>
              <h2 className="text-3xl md:text-4xl font-semibold text-secondary-900">
                {t('featuredTitle')}
              </h2>
              <p className="text-secondary-600 mt-3 max-w-xl">
                {t('featuredSubtitle')}
              </p>
            </div>
            <Link href={`/${locale}/properties`} className="mt-6 md:mt-0">
              <Button variant="outline" className="group">
                {t('viewAll')}
                <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <PropertyGrid
            properties={featuredProperties}
            locale={locale}
            translations={propertyTranslations}
          />
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-secondary-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-primary-600 font-medium text-sm uppercase tracking-wider mb-2 block">
              {locale === 'es' ? 'Por qué elegirnos' : 'Why Choose Us'}
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold text-secondary-900 mb-4">
              {t('whyTitle')}
            </h2>
            <p className="text-secondary-600 text-lg max-w-2xl mx-auto">
              {t('whySubtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-lg p-6 border border-secondary-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mb-5">
                <BuildingOffice2Icon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                {t('why1Title')}
              </h3>
              <p className="text-secondary-600 text-sm leading-relaxed">{t('why1Desc')}</p>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-lg p-6 border border-secondary-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-accent-50 rounded-lg flex items-center justify-center mb-5">
                <UserGroupIcon className="w-6 h-6 text-accent-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                {t('why2Title')}
              </h3>
              <p className="text-secondary-600 text-sm leading-relaxed">{t('why2Desc')}</p>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-lg p-6 border border-secondary-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-5">
                <GlobeAmericasIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                {locale === 'es' ? 'Alcance Internacional' : 'International Reach'}
              </h3>
              <p className="text-secondary-600 text-sm leading-relaxed">
                {locale === 'es'
                  ? 'Conectamos compradores internacionales con las mejores propiedades de Venezuela.'
                  : 'We connect international buyers with the best properties in Venezuela.'}
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-lg p-6 border border-secondary-100 hover:border-primary-200 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center mb-5">
                <ShieldCheckIcon className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                {t('why3Title')}
              </h3>
              <p className="text-secondary-600 text-sm leading-relaxed">{t('why3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-primary-600">
        <div className="container-custom text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
            {locale === 'es'
              ? '¿Eres agente inmobiliario?'
              : 'Are you a real estate agent?'}
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            {locale === 'es'
              ? 'Únete a nuestra plataforma y conecta con compradores de todo el mundo interesados en propiedades venezolanas.'
              : 'Join our platform and connect with buyers worldwide interested in Venezuelan properties.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={`/${locale}/agent/properties`}>
              <Button size="lg" variant="secondary" className="bg-white text-primary-600 hover:bg-secondary-50">
                {locale === 'es' ? 'Registrar Propiedad' : 'List Property'}
              </Button>
            </Link>
            <Link href={`/${locale}/about`}>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                {locale === 'es' ? 'Más Información' : 'Learn More'}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
