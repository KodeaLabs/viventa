'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import {
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface PropertyImage {
  id: string;
  image: string;
  thumbnail_url?: string;
  large_url?: string;
  order?: number;
}

interface ImageGalleryProps {
  images: PropertyImage[];
  title: string;
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  };

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;

      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, goToPrevious, goToNext]);

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
        <Image
          src="/images/placeholder-property.jpg"
          alt={title}
          fill
          className="object-cover"
          priority
        />
      </div>
    );
  }

  const getImageUrl = (image: PropertyImage, size: 'thumb' | 'large' = 'large') => {
    if (size === 'thumb') {
      return image.thumbnail_url || image.image;
    }
    return image.large_url || image.image;
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 aspect-[16/9] md:aspect-[21/9]">
        {/* Main Image */}
        <button
          onClick={() => openLightbox(0)}
          className="relative rounded-xl overflow-hidden cursor-pointer group"
        >
          <Image
            src={getImageUrl(images[0], 'large')}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          {images.length > 5 && (
            <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
              +{images.length - 5} more
            </div>
          )}
        </button>

        {/* Secondary Images */}
        <div className="hidden md:grid grid-cols-2 gap-4">
          {images.slice(1, 5).map((image, index) => (
            <button
              key={image.id}
              onClick={() => openLightbox(index + 1)}
              className="relative rounded-xl overflow-hidden cursor-pointer group"
            >
              <Image
                src={getImageUrl(image, 'thumb')}
                alt={`${title} - ${index + 2}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black">
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Close gallery"
          >
            <XMarkIcon className="h-6 w-6 text-white" />
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-4 z-50 px-4 py-2 bg-white/10 rounded-full text-white text-sm font-medium">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Main image container */}
          <div className="absolute inset-0 flex items-center justify-center p-4 md:p-16">
            <div className="relative w-full h-full">
              <Image
                src={getImageUrl(images[currentIndex], 'large')}
                alt={`${title} - ${currentIndex + 1}`}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeftIcon className="h-6 w-6 text-white" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Next image"
              >
                <ChevronRightIcon className="h-6 w-6 text-white" />
              </button>
            </>
          )}

          {/* Thumbnail strip */}
          <div className="absolute bottom-4 left-0 right-0 z-50">
            <div className="flex justify-center gap-2 overflow-x-auto px-4 py-2">
              {images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    'relative w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all',
                    currentIndex === index
                      ? 'ring-2 ring-white opacity-100'
                      : 'opacity-50 hover:opacity-75'
                  )}
                >
                  <Image
                    src={getImageUrl(image, 'thumb')}
                    alt={`Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
