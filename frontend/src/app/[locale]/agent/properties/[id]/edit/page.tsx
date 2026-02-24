'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { PropertyForm } from '@/components/organisms';
import { Spinner } from '@/components/atoms';
import { useAuthenticatedApi } from '@/hooks';
import type { Property } from '@/types';

interface EditPropertyPageProps {
  params: { locale: string; id: string };
}

export default function EditPropertyPage({ params: { locale, id } }: EditPropertyPageProps) {
  const router = useRouter();
  const isSpanish = locale === 'es';
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { api, isAuthLoading, accessToken } = useAuthenticatedApi();

  useEffect(() => {
    if (isAuthLoading) return;

    if (!accessToken) {
      window.location.href = '/api/auth/login';
      return;
    }

    const fetchProperty = async () => {
      try {
        const data = await api.getProperty(id);
        setProperty(data.data || data as unknown as Property);
      } catch (err: any) {
        if (err?.message?.includes('404')) {
          setError(isSpanish ? 'Propiedad no encontrada' : 'Property not found');
        } else {
          setError(
            isSpanish
              ? 'Error al cargar la propiedad'
              : 'Failed to load property'
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [id, isSpanish, isAuthLoading, accessToken, api]);

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-secondary-50">
        <div className="container-custom py-8 md:py-12">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Link
              href={`/${locale}/agent/properties`}
              className="text-primary-600 hover:text-primary-700"
            >
              {isSpanish ? 'Volver a Mis Propiedades' : 'Back to My Properties'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return null;
  }

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
            {isSpanish ? 'Editar Propiedad' : 'Edit Property'}
          </h1>
          <p className="text-secondary-600 mt-1">{property.title}</p>
        </div>

        {/* Form */}
        <PropertyForm property={property} locale={locale} mode="edit" />
      </div>
    </div>
  );
}
