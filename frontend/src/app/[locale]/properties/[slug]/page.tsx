import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import {
  MapPinIcon,
  HomeIcon,
  ArrowsPointingOutIcon,
  CalendarIcon,
  CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import { Badge } from '@/components/atoms';
import { ImageGallery } from '@/components/molecules';
import { InquiryForm } from '@/components/organisms';
import { api, formatPrice, formatArea } from '../../../../lib/api';
import { propertyTypeLabels } from '../../../../lib/utils';

interface PropertyDetailPageProps {
  params: { locale: string; slug: string };
}

export default async function PropertyDetailPage({
  params: { locale, slug },
}: PropertyDetailPageProps) {
  const t = await getTranslations({ locale, namespace: 'property' });
  const inquiryT = await getTranslations({ locale, namespace: 'inquiry' });

  // Fetch property
  let property = null;
  try {
    const response = await api.getProperty(slug);
    property = response.data;
  } catch (error) {
    console.error('Failed to fetch property:', error);
    notFound();
  }

  if (!property) {
    notFound();
  }

  const description =
    locale === 'es' && property.description_es
      ? property.description_es
      : property.description;

  const propertyTypeLabel =
    propertyTypeLabels[property.property_type]?.[locale as 'en' | 'es'] ||
    property.property_type;

  const inquiryTranslations = {
    title: inquiryT('title'),
    subtitle: inquiryT('subtitle'),
    fullName: inquiryT('fullName'),
    email: inquiryT('email'),
    phone: inquiryT('phone'),
    country: inquiryT('country'),
    message: inquiryT('message'),
    contactMethod: inquiryT('contactMethod'),
    email_option: inquiryT('email_option'),
    phone_option: inquiryT('phone_option'),
    whatsapp: inquiryT('whatsapp'),
    submit: inquiryT('submit'),
    submitting: inquiryT('submitting'),
    success: inquiryT('success'),
    error: inquiryT('error'),
    required: inquiryT('required'),
    invalidEmail: inquiryT('invalidEmail'),
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Image Gallery with Fullscreen Lightbox */}
      <div className="bg-secondary-900">
        <div className="container-custom py-4">
          <ImageGallery
            images={property.images || []}
            title={property.title}
          />
        </div>
      </div>

      <div className="container-custom py-8 md:py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm text-secondary-500 mb-6">
          <Link href={`/${locale}/properties`} className="hover:text-primary-600 transition-colors">
            {locale === 'en' ? 'Properties' : 'Propiedades'}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-secondary-900 truncate max-w-xs">{property.title}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                {property.is_featured && <Badge variant="warning">{t('featured')}</Badge>}
                {property.is_beachfront && <Badge variant="success">{t('beachfront')}</Badge>}
                {property.price_negotiable && (
                  <Badge variant="secondary">{t('priceNegotiable')}</Badge>
                )}
              </div>

              <h1 className="font-display text-3xl md:text-4xl font-bold text-secondary-900 mb-2">
                {property.title}
              </h1>

              <div className="flex items-center text-secondary-600 mb-4">
                <MapPinIcon className="h-5 w-5 mr-2" />
                <span>{property.address}, {property.location_display}</span>
              </div>

              <p className="text-4xl font-bold text-primary-600">
                {formatPrice(property.price)}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 text-center">
                <HomeIcon className="h-6 w-6 mx-auto text-secondary-400 mb-2" />
                <p className="text-2xl font-bold text-secondary-900">{property.bedrooms}</p>
                <p className="text-sm text-secondary-500">{t('bedrooms')}</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <svg className="h-6 w-6 mx-auto text-secondary-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                </svg>
                <p className="text-2xl font-bold text-secondary-900">{Math.floor(property.bathrooms)}</p>
                <p className="text-sm text-secondary-500">{t('bathrooms')}</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <ArrowsPointingOutIcon className="h-6 w-6 mx-auto text-secondary-400 mb-2" />
                <p className="text-2xl font-bold text-secondary-900">
                  {property.area_sqm || '-'}
                </p>
                <p className="text-sm text-secondary-500">m²</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <CalendarIcon className="h-6 w-6 mx-auto text-secondary-400 mb-2" />
                <p className="text-2xl font-bold text-secondary-900">
                  {property.year_built || '-'}
                </p>
                <p className="text-sm text-secondary-500">{t('yearBuilt')}</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-xl p-6 shadow-card">
              <h2 className="font-display text-xl font-semibold text-secondary-900 mb-4">
                {t('description')}
              </h2>
              <p className="text-secondary-600 whitespace-pre-line">{description}</p>
            </div>

            {/* Details */}
            <div className="bg-white rounded-xl p-6 shadow-card">
              <h2 className="font-display text-xl font-semibold text-secondary-900 mb-4">
                {t('details')}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-secondary-500">{t('type')}</p>
                  <p className="font-medium text-secondary-900">{propertyTypeLabel}</p>
                </div>
                <div>
                  <p className="text-sm text-secondary-500">{t('area')}</p>
                  <p className="font-medium text-secondary-900">
                    {formatArea(property.area_sqm)}
                  </p>
                </div>
                {property.lot_size_sqm && (
                  <div>
                    <p className="text-sm text-secondary-500">{t('lotSize')}</p>
                    <p className="font-medium text-secondary-900">
                      {formatArea(property.lot_size_sqm)}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-secondary-500">{t('parking')}</p>
                  <p className="font-medium text-secondary-900">{property.parking_spaces}</p>
                </div>
              </div>
            </div>

            {/* Features */}
            {property.features && property.features.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-card">
                <h2 className="font-display text-xl font-semibold text-secondary-900 mb-4">
                  {t('features')}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckBadgeIcon className="h-5 w-5 text-accent-500 mr-2" />
                      <span className="text-secondary-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Agent Info */}
              <div className="bg-white rounded-xl p-6 shadow-card">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-secondary-200 rounded-full flex items-center justify-center mr-4 overflow-hidden">
                    {property.agent?.avatar || property.agent?.avatar_url ? (
                      <img
                        src={property.agent.avatar || property.agent.avatar_url || ''}
                        alt={property.agent.full_name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-bold text-secondary-600">
                        {property.agent?.full_name?.charAt(0) || 'A'}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-secondary-900">
                      {property.agent?.full_name}
                    </p>
                    {property.agent?.is_verified_agent && (
                      <div className="flex items-center text-accent-600 text-sm">
                        <CheckBadgeIcon className="h-4 w-4 mr-1" />
                        {locale === 'en' ? 'Verified Agent' : 'Agente Verificado'}
                      </div>
                    )}
                  </div>
                </div>
                {property.agent?.company_name && (
                  <p className="text-secondary-500 text-sm">{property.agent.company_name}</p>
                )}
              </div>

              {/* Inquiry Form */}
              <InquiryForm
                propertyId={property.id}
                locale={locale as 'en' | 'es'}
                translations={inquiryTranslations}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
