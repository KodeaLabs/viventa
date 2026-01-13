'use client';

import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { PropertyForm } from '@/components/organisms';

interface NewPropertyPageProps {
  params: { locale: string };
}

export default function NewPropertyPage({ params: { locale } }: NewPropertyPageProps) {
  const isSpanish = locale === 'es';

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-custom py-8 md:py-12">
        {/* Header */}
        <div className="mb-8">
          <Link
            href={`/${locale}/agent/properties`}
            className="inline-flex items-center text-secondary-600 hover:text-secondary-900 mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            {isSpanish ? 'Volver a Mis Propiedades' : 'Back to My Properties'}
          </Link>
          <h1 className="font-display text-3xl font-bold text-secondary-900">
            {isSpanish ? 'Nueva Propiedad' : 'New Property'}
          </h1>
          <p className="text-secondary-600 mt-1">
            {isSpanish
              ? 'Completa el formulario para publicar una nueva propiedad'
              : 'Fill out the form to publish a new property'}
          </p>
        </div>

        {/* Form */}
        <PropertyForm locale={locale} mode="create" />
      </div>
    </div>
  );
}
