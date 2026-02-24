'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/react/24/outline';
import { Button, Badge, Spinner } from '@/components/atoms';
import { formatPrice } from '../../../../lib/api';
import { useAuthenticatedApi } from '@/hooks';

interface Property {
  id: string;
  title: string;
  slug: string;
  price: number;
  status: 'active' | 'draft' | 'pending' | 'sold';
  main_image: string | null;
  location_display: string;
  views_count: number;
  inquiries_count: number;
  created_at: string;
}

interface AgentPropertiesPageProps {
  params: { locale: string };
}

export default function AgentPropertiesPage({
  params: { locale },
}: AgentPropertiesPageProps) {
  const isSpanish = locale === 'es';
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { api, isAuthLoading, accessToken } = useAuthenticatedApi();

  useEffect(() => {
    if (isAuthLoading) return;

    if (!accessToken) {
      window.location.href = '/api/auth/login';
      return;
    }

    const fetchProperties = async () => {
      try {
        const data = await api.getAgentProperties();
        setProperties((data.data || []) as unknown as Property[]);
      } catch {
        setError(
          isSpanish
            ? 'Error al cargar propiedades'
            : 'Failed to load properties'
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
  }, [isSpanish, isAuthLoading, accessToken, api]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      isSpanish
        ? '¿Estás seguro de que deseas eliminar esta propiedad?'
        : 'Are you sure you want to delete this property?'
    );

    if (!confirmed) return;

    try {
      await api.deleteProperty(id);
      setProperties(properties.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Failed to delete property:', err);
    }
  };

  const statusColors = {
    active: 'success',
    draft: 'secondary',
    pending: 'warning',
    sold: 'primary',
  } as const;

  const statusLabels = {
    active: isSpanish ? 'Activo' : 'Active',
    draft: isSpanish ? 'Borrador' : 'Draft',
    pending: isSpanish ? 'Pendiente' : 'Pending',
    sold: isSpanish ? 'Vendido' : 'Sold',
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-custom py-8 md:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-secondary-900">
              {isSpanish ? 'Mis Propiedades' : 'My Properties'}
            </h1>
            <p className="text-secondary-600 mt-1">
              {isSpanish
                ? 'Administra tus listados de propiedades'
                : 'Manage your property listings'}
            </p>
          </div>
          <Link href={`/${locale}/agent/properties/new`} className="mt-4 sm:mt-0">
            <Button>
              <PlusIcon className="h-5 w-5 mr-2" />
              {isSpanish ? 'Nueva Propiedad' : 'New Property'}
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-card">
            <p className="text-sm text-secondary-500">
              {isSpanish ? 'Total' : 'Total'}
            </p>
            <p className="text-2xl font-bold text-secondary-900">
              {properties.length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-card">
            <p className="text-sm text-secondary-500">
              {isSpanish ? 'Activas' : 'Active'}
            </p>
            <p className="text-2xl font-bold text-green-600">
              {properties.filter((p) => p.status === 'active').length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-card">
            <p className="text-sm text-secondary-500">
              {isSpanish ? 'Borradores' : 'Drafts'}
            </p>
            <p className="text-2xl font-bold text-secondary-400">
              {properties.filter((p) => p.status === 'draft').length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-card">
            <p className="text-sm text-secondary-500">
              {isSpanish ? 'Consultas' : 'Inquiries'}
            </p>
            <p className="text-2xl font-bold text-primary-600">
              {properties.reduce((sum, p) => sum + (p.inquiries_count || 0), 0)}
            </p>
          </div>
        </div>

        {/* Properties List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{error}</div>
        ) : properties.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-card">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <PlusIcon className="h-8 w-8 text-secondary-400" />
            </div>
            <h3 className="font-display text-lg font-semibold text-secondary-900 mb-2">
              {isSpanish ? 'No tienes propiedades' : 'No properties yet'}
            </h3>
            <p className="text-secondary-600 mb-6">
              {isSpanish
                ? 'Crea tu primera propiedad para empezar a recibir consultas.'
                : 'Create your first property listing to start receiving inquiries.'}
            </p>
            <Link href={`/${locale}/agent/properties/new`}>
              <Button>
                <PlusIcon className="h-5 w-5 mr-2" />
                {isSpanish ? 'Crear Propiedad' : 'Create Property'}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-secondary-50 border-b border-secondary-100">
                    <th className="text-left px-6 py-4 text-sm font-semibold text-secondary-600">
                      {isSpanish ? 'Propiedad' : 'Property'}
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-secondary-600">
                      {isSpanish ? 'Precio' : 'Price'}
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-secondary-600">
                      {isSpanish ? 'Estado' : 'Status'}
                    </th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-secondary-600">
                      <EyeIcon className="h-5 w-5 inline" />
                    </th>
                    <th className="text-center px-6 py-4 text-sm font-semibold text-secondary-600">
                      <ChatBubbleLeftIcon className="h-5 w-5 inline" />
                    </th>
                    <th className="text-right px-6 py-4 text-sm font-semibold text-secondary-600">
                      {isSpanish ? 'Acciones' : 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((property) => (
                    <tr
                      key={property.id}
                      className="border-b border-secondary-100 last:border-0 hover:bg-secondary-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-16 h-12 bg-secondary-200 rounded-lg overflow-hidden flex-shrink-0">
                            {property.main_image ? (
                              <Image
                                src={property.main_image}
                                alt={property.title}
                                width={64}
                                height={48}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-secondary-400 text-xs">
                                {isSpanish ? 'Sin imagen' : 'No image'}
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <p className="font-medium text-secondary-900 line-clamp-1">
                              {property.title}
                            </p>
                            <p className="text-sm text-secondary-500">
                              {property.location_display}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-secondary-900">
                          {formatPrice(property.price)}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={statusColors[property.status]}>
                          {statusLabels[property.status]}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-center text-secondary-600">
                        {property.views_count || 0}
                      </td>
                      <td className="px-6 py-4 text-center text-secondary-600">
                        {property.inquiries_count || 0}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/${locale}/properties/${property.slug}`}
                            className="p-2 text-secondary-400 hover:text-secondary-600 hover:bg-secondary-100 rounded-lg"
                            title={isSpanish ? 'Ver' : 'View'}
                          >
                            <EyeIcon className="h-5 w-5" />
                          </Link>
                          <Link
                            href={`/${locale}/agent/properties/${property.id}/edit`}
                            className="p-2 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                            title={isSpanish ? 'Editar' : 'Edit'}
                          >
                            <PencilIcon className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(property.id)}
                            className="p-2 text-secondary-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                            title={isSpanish ? 'Eliminar' : 'Delete'}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
