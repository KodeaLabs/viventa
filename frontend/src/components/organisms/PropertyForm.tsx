'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { Button, Input, Textarea, Select, Spinner } from '@/components/atoms';
import { ImageUpload, UploadedImage } from '@/components/molecules/ImageUpload';
import type { Property, PropertyFormData, PropertyType, ListingType } from '@/types';

interface PropertyFormProps {
  property?: Property;
  locale: string;
  mode: 'create' | 'edit';
}

const propertyTypeOptions = (isSpanish: boolean) => [
  { value: 'beach_apartment', label: isSpanish ? 'Apartamento de Playa' : 'Beach Apartment' },
  { value: 'apartment', label: isSpanish ? 'Apartamento' : 'Apartment' },
  { value: 'house', label: isSpanish ? 'Casa' : 'House' },
  { value: 'villa', label: 'Villa' },
  { value: 'penthouse', label: 'Penthouse' },
  { value: 'finca', label: isSpanish ? 'Finca / Hacienda' : 'Finca / Country Estate' },
  { value: 'townhouse', label: isSpanish ? 'Casa Adosada' : 'Townhouse' },
  { value: 'beach_house', label: isSpanish ? 'Casa de Playa' : 'Beach House' },
  { value: 'land', label: isSpanish ? 'Terreno' : 'Land' },
  { value: 'commercial', label: isSpanish ? 'Comercial' : 'Commercial' },
];

const listingTypeOptions = (isSpanish: boolean) => [
  { value: 'sale', label: isSpanish ? 'Venta' : 'For Sale' },
  { value: 'rent', label: isSpanish ? 'Alquiler' : 'For Rent' },
];

const venezuelanStates = [
  { value: 'Amazonas', label: 'Amazonas' },
  { value: 'Anzoátegui', label: 'Anzoátegui' },
  { value: 'Apure', label: 'Apure' },
  { value: 'Aragua', label: 'Aragua' },
  { value: 'Barinas', label: 'Barinas' },
  { value: 'Bolívar', label: 'Bolívar' },
  { value: 'Carabobo', label: 'Carabobo' },
  { value: 'Cojedes', label: 'Cojedes' },
  { value: 'Delta Amacuro', label: 'Delta Amacuro' },
  { value: 'Distrito Capital', label: 'Distrito Capital' },
  { value: 'Falcón', label: 'Falcón' },
  { value: 'Guárico', label: 'Guárico' },
  { value: 'Lara', label: 'Lara' },
  { value: 'Mérida', label: 'Mérida' },
  { value: 'Miranda', label: 'Miranda' },
  { value: 'Monagas', label: 'Monagas' },
  { value: 'Nueva Esparta', label: 'Nueva Esparta' },
  { value: 'Portuguesa', label: 'Portuguesa' },
  { value: 'Sucre', label: 'Sucre' },
  { value: 'Táchira', label: 'Táchira' },
  { value: 'Trujillo', label: 'Trujillo' },
  { value: 'Vargas', label: 'Vargas' },
  { value: 'Yaracuy', label: 'Yaracuy' },
  { value: 'Zulia', label: 'Zulia' },
];

export function PropertyForm({ property, locale, mode }: PropertyFormProps) {
  const router = useRouter();
  const isSpanish = locale === 'es';
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [featuresInput, setFeaturesInput] = useState('');

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PropertyFormData>({
    defaultValues: property
      ? {
          title: property.title,
          description: property.description,
          description_es: property.description_es || '',
          price: property.price,
          price_negotiable: property.price_negotiable,
          property_type: property.property_type,
          listing_type: property.listing_type,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          area_sqm: property.area_sqm || undefined,
          lot_size_sqm: property.lot_size_sqm || undefined,
          year_built: property.year_built || undefined,
          parking_spaces: property.parking_spaces,
          address: property.address,
          city: property.city,
          state: property.state,
          zip_code: property.zip_code || '',
          latitude: property.latitude || undefined,
          longitude: property.longitude || undefined,
          features: property.features || [],
          is_new_construction: property.is_new_construction,
          is_beachfront: property.is_beachfront,
          is_investment_opportunity: property.is_investment_opportunity,
        }
      : {
          property_type: 'house' as PropertyType,
          listing_type: 'sale' as ListingType,
          bedrooms: 0,
          bathrooms: 0,
          parking_spaces: 0,
          price_negotiable: false,
          is_new_construction: false,
          is_beachfront: false,
          is_investment_opportunity: false,
        },
  });

  // Initialize images from property if editing
  useEffect(() => {
    if (property?.images) {
      const existingImages: UploadedImage[] = property.images.map((img) => ({
        id: img.id,
        preview: img.thumbnail_url || img.image || img.large_url || '',
        isMain: img.is_main,
        isExisting: true,
      }));
      setImages(existingImages);
    }
    if (property?.features) {
      setFeaturesInput(property.features.join(', '));
    }
  }, [property]);

  const onSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Parse features from comma-separated string
      const features = featuresInput
        .split(',')
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      const formData = new FormData();

      // Add all form fields
      formData.append('title', data.title);
      formData.append('description', data.description);
      if (data.description_es) formData.append('description_es', data.description_es);
      formData.append('price', String(data.price));
      formData.append('price_negotiable', String(data.price_negotiable || false));
      formData.append('property_type', data.property_type);
      formData.append('listing_type', data.listing_type);
      formData.append('bedrooms', String(data.bedrooms));
      formData.append('bathrooms', String(data.bathrooms));
      if (data.area_sqm) formData.append('area_sqm', String(data.area_sqm));
      if (data.lot_size_sqm) formData.append('lot_size_sqm', String(data.lot_size_sqm));
      if (data.year_built) formData.append('year_built', String(data.year_built));
      formData.append('parking_spaces', String(data.parking_spaces || 0));
      formData.append('address', data.address);
      formData.append('city', data.city);
      formData.append('state', data.state);
      if (data.zip_code) formData.append('zip_code', data.zip_code);
      if (data.latitude) formData.append('latitude', String(data.latitude));
      if (data.longitude) formData.append('longitude', String(data.longitude));
      formData.append('features', JSON.stringify(features));
      formData.append('is_new_construction', String(data.is_new_construction || false));
      formData.append('is_beachfront', String(data.is_beachfront || false));
      formData.append('is_investment_opportunity', String(data.is_investment_opportunity || false));

      const endpoint = mode === 'create'
        ? '/api/v1/agent/properties/'
        : `/api/v1/agent/properties/${property?.id}/`;

      const response = await fetch(endpoint, {
        method: mode === 'create' ? 'POST' : 'PATCH',
        credentials: 'include',
        body: formData,
      });

      if (response.status === 401) {
        window.location.href = '/api/auth/login';
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to save property');
      }

      const result = await response.json();
      const propertyId = result.data?.id || property?.id;

      // Upload new images
      const newImages = images.filter((img) => img.file);
      for (const image of newImages) {
        const imageFormData = new FormData();
        imageFormData.append('image', image.file!);
        imageFormData.append('is_main', String(image.isMain));

        await fetch(`/api/v1/agent/properties/${propertyId}/upload_image/`, {
          method: 'POST',
          credentials: 'include',
          body: imageFormData,
        });
      }

      // Redirect to properties list
      router.push(`/${locale}/agent/properties`);
      router.refresh();
    } catch (err) {
      console.error('Failed to save property:', err);
      setError(
        err instanceof Error
          ? err.message
          : isSpanish
          ? 'Error al guardar la propiedad'
          : 'Failed to save property'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const t = {
    title: isSpanish ? 'Título' : 'Title',
    titlePlaceholder: isSpanish ? 'Ej: Hermosa villa frente al mar' : 'E.g., Beautiful beachfront villa',
    description: isSpanish ? 'Descripción (Inglés)' : 'Description (English)',
    descriptionEs: isSpanish ? 'Descripción (Español)' : 'Description (Spanish)',
    price: isSpanish ? 'Precio (USD)' : 'Price (USD)',
    priceNegotiable: isSpanish ? 'Precio negociable' : 'Price negotiable',
    propertyType: isSpanish ? 'Tipo de Propiedad' : 'Property Type',
    listingType: isSpanish ? 'Tipo de Listado' : 'Listing Type',
    bedrooms: isSpanish ? 'Habitaciones' : 'Bedrooms',
    bathrooms: isSpanish ? 'Baños' : 'Bathrooms',
    areaSqm: isSpanish ? 'Área (m²)' : 'Area (sqm)',
    lotSizeSqm: isSpanish ? 'Tamaño del Terreno (m²)' : 'Lot Size (sqm)',
    yearBuilt: isSpanish ? 'Año de Construcción' : 'Year Built',
    parkingSpaces: isSpanish ? 'Estacionamientos' : 'Parking Spaces',
    address: isSpanish ? 'Dirección' : 'Address',
    city: isSpanish ? 'Ciudad' : 'City',
    state: isSpanish ? 'Estado' : 'State',
    zipCode: isSpanish ? 'Código Postal' : 'Zip Code',
    features: isSpanish ? 'Características' : 'Features',
    featuresPlaceholder: isSpanish
      ? 'Piscina, Jardín, Vista al mar, Aire acondicionado...'
      : 'Pool, Garden, Ocean View, Air Conditioning...',
    featuresHelp: isSpanish ? 'Separar con comas' : 'Separate with commas',
    flags: isSpanish ? 'Etiquetas Especiales' : 'Special Tags',
    isNewConstruction: isSpanish ? 'Nueva Construcción' : 'New Construction',
    isBeachfront: isSpanish ? 'Frente al Mar' : 'Beachfront',
    isInvestmentOpportunity: isSpanish ? 'Oportunidad de Inversión' : 'Investment Opportunity',
    images: isSpanish ? 'Imágenes' : 'Images',
    basicInfo: isSpanish ? 'Información Básica' : 'Basic Information',
    propertyDetails: isSpanish ? 'Detalles de la Propiedad' : 'Property Details',
    location: isSpanish ? 'Ubicación' : 'Location',
    save: isSpanish ? 'Guardar Propiedad' : 'Save Property',
    saving: isSpanish ? 'Guardando...' : 'Saving...',
    cancel: isSpanish ? 'Cancelar' : 'Cancel',
    required: isSpanish ? 'Campo requerido' : 'This field is required',
    imageTranslations: {
      dropzone: isSpanish ? 'Zona de carga' : 'Drop zone',
      dragDrop: isSpanish ? 'Arrastra y suelta las imágenes aquí' : 'Drag and drop images here',
      or: isSpanish ? 'o' : 'or',
      browse: isSpanish ? 'selecciona archivos' : 'browse files',
      maxFiles: isSpanish ? 'Máximo {max} imágenes' : 'Maximum {max} images',
      setMain: isSpanish ? 'Establecer como principal' : 'Set as main',
      remove: isSpanish ? 'Eliminar' : 'Remove',
    },
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <h2 className="font-display text-xl font-semibold text-secondary-900 mb-6">
          {t.basicInfo}
        </h2>
        <div className="grid gap-6">
          <Input
            label={t.title}
            placeholder={t.titlePlaceholder}
            error={errors.title?.message}
            {...register('title', { required: t.required })}
          />

          <Textarea
            label={t.description}
            rows={4}
            error={errors.description?.message}
            {...register('description', { required: t.required })}
          />

          <Textarea
            label={t.descriptionEs}
            rows={4}
            {...register('description_es')}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label={t.price}
              type="number"
              min="0"
              step="0.01"
              error={errors.price?.message}
              {...register('price', { required: t.required, valueAsNumber: true })}
            />

            <Controller
              name="property_type"
              control={control}
              rules={{ required: t.required }}
              render={({ field }) => (
                <Select
                  label={t.propertyType}
                  options={propertyTypeOptions(isSpanish)}
                  error={errors.property_type?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="listing_type"
              control={control}
              rules={{ required: t.required }}
              render={({ field }) => (
                <Select
                  label={t.listingType}
                  options={listingTypeOptions(isSpanish)}
                  error={errors.listing_type?.message}
                  {...field}
                />
              )}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="price_negotiable"
              className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
              {...register('price_negotiable')}
            />
            <label htmlFor="price_negotiable" className="text-sm text-secondary-700">
              {t.priceNegotiable}
            </label>
          </div>
        </div>
      </div>

      {/* Property Details */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <h2 className="font-display text-xl font-semibold text-secondary-900 mb-6">
          {t.propertyDetails}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Input
            label={t.bedrooms}
            type="number"
            min="0"
            {...register('bedrooms', { valueAsNumber: true })}
          />
          <Input
            label={t.bathrooms}
            type="number"
            min="0"
            step="0.5"
            {...register('bathrooms', { valueAsNumber: true })}
          />
          <Input
            label={t.areaSqm}
            type="number"
            min="0"
            {...register('area_sqm', { valueAsNumber: true })}
          />
          <Input
            label={t.lotSizeSqm}
            type="number"
            min="0"
            {...register('lot_size_sqm', { valueAsNumber: true })}
          />
          <Input
            label={t.yearBuilt}
            type="number"
            min="1800"
            max={new Date().getFullYear()}
            {...register('year_built', { valueAsNumber: true })}
          />
          <Input
            label={t.parkingSpaces}
            type="number"
            min="0"
            {...register('parking_spaces', { valueAsNumber: true })}
          />
        </div>

        <div className="mt-6">
          <label className="label">{t.features}</label>
          <input
            type="text"
            value={featuresInput}
            onChange={(e) => setFeaturesInput(e.target.value)}
            placeholder={t.featuresPlaceholder}
            className="input"
          />
          <p className="mt-1 text-sm text-secondary-500">{t.featuresHelp}</p>
        </div>

        <div className="mt-6">
          <label className="label">{t.flags}</label>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_new_construction"
                className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                {...register('is_new_construction')}
              />
              <label htmlFor="is_new_construction" className="text-sm text-secondary-700">
                {t.isNewConstruction}
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_beachfront"
                className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                {...register('is_beachfront')}
              />
              <label htmlFor="is_beachfront" className="text-sm text-secondary-700">
                {t.isBeachfront}
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_investment_opportunity"
                className="h-4 w-4 rounded border-secondary-300 text-primary-600 focus:ring-primary-500"
                {...register('is_investment_opportunity')}
              />
              <label htmlFor="is_investment_opportunity" className="text-sm text-secondary-700">
                {t.isInvestmentOpportunity}
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <h2 className="font-display text-xl font-semibold text-secondary-900 mb-6">
          {t.location}
        </h2>
        <div className="grid gap-6">
          <Input
            label={t.address}
            error={errors.address?.message}
            {...register('address', { required: t.required })}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label={t.city}
              error={errors.city?.message}
              {...register('city', { required: t.required })}
            />

            <Controller
              name="state"
              control={control}
              rules={{ required: t.required }}
              render={({ field }) => (
                <Select
                  label={t.state}
                  options={venezuelanStates}
                  placeholder={isSpanish ? 'Seleccionar estado' : 'Select state'}
                  error={errors.state?.message}
                  {...field}
                />
              )}
            />

            <Input
              label={t.zipCode}
              {...register('zip_code')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={isSpanish ? 'Latitud' : 'Latitude'}
              type="number"
              step="any"
              {...register('latitude', { valueAsNumber: true })}
            />
            <Input
              label={isSpanish ? 'Longitud' : 'Longitude'}
              type="number"
              step="any"
              {...register('longitude', { valueAsNumber: true })}
            />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <h2 className="font-display text-xl font-semibold text-secondary-900 mb-6">
          {t.images}
        </h2>
        <ImageUpload
          images={images}
          onChange={setImages}
          maxImages={10}
          translations={t.imageTranslations}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/${locale}/agent/properties`)}
          disabled={isSubmitting}
        >
          {t.cancel}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner size="sm" className="mr-2" />
              {t.saving}
            </>
          ) : (
            t.save
          )}
        </Button>
      </div>
    </form>
  );
}
