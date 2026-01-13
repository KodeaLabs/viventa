'use client';

import { useState, useRef, useCallback } from 'react';
import {
  PhotoIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';

export interface UploadedImage {
  id?: string;
  file?: File;
  preview: string;
  isMain: boolean;
  isExisting?: boolean;
}

interface ImageUploadProps {
  images: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  maxImages?: number;
  disabled?: boolean;
  translations: {
    dropzone: string;
    dragDrop: string;
    or: string;
    browse: string;
    maxFiles: string;
    setMain: string;
    remove: string;
  };
}

export function ImageUpload({
  images,
  onChange,
  maxImages = 10,
  disabled = false,
  translations,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    );
    handleFiles(files);
  }, [disabled]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    handleFiles(files);
    // Reset input so same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const handleFiles = (files: File[]) => {
    const remainingSlots = maxImages - images.length;
    const filesToAdd = files.slice(0, remainingSlots);

    const newImages: UploadedImage[] = filesToAdd.map((file, index) => ({
      file,
      preview: URL.createObjectURL(file),
      isMain: images.length === 0 && index === 0, // First image is main if no images yet
    }));

    onChange([...images, ...newImages]);
  };

  const handleRemove = (index: number) => {
    const newImages = [...images];
    const removed = newImages.splice(index, 1)[0];

    // Revoke object URL if it's a new file
    if (removed.file) {
      URL.revokeObjectURL(removed.preview);
    }

    // If we removed the main image, make the first one main
    if (removed.isMain && newImages.length > 0) {
      newImages[0].isMain = true;
    }

    onChange(newImages);
  };

  const handleSetMain = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isMain: i === index,
    }));
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      {images.length < maxImages && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors',
            isDragging
              ? 'border-primary-500 bg-primary-50'
              : 'border-secondary-300 hover:border-primary-400 hover:bg-secondary-50',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled}
          />
          <ArrowUpTrayIcon className="h-10 w-10 mx-auto text-secondary-400 mb-3" />
          <p className="text-secondary-600 font-medium">{translations.dragDrop}</p>
          <p className="text-secondary-400 text-sm mt-1">
            {translations.or}{' '}
            <span className="text-primary-600 hover:text-primary-700">
              {translations.browse}
            </span>
          </p>
          <p className="text-secondary-400 text-xs mt-2">
            {translations.maxFiles.replace('{max}', String(maxImages))}
          </p>
        </div>
      )}

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id || index}
              className={cn(
                'relative aspect-[4/3] rounded-lg overflow-hidden group',
                image.isMain && 'ring-2 ring-primary-500 ring-offset-2'
              )}
            >
              <img
                src={image.preview}
                alt={`Property image ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {/* Set as Main Button */}
                <button
                  type="button"
                  onClick={() => handleSetMain(index)}
                  className={cn(
                    'p-2 rounded-full transition-colors',
                    image.isMain
                      ? 'bg-primary-500 text-white'
                      : 'bg-white/90 text-secondary-600 hover:bg-white'
                  )}
                  title={translations.setMain}
                >
                  {image.isMain ? (
                    <StarIconSolid className="h-5 w-5" />
                  ) : (
                    <StarIcon className="h-5 w-5" />
                  )}
                </button>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="p-2 rounded-full bg-white/90 text-red-600 hover:bg-white transition-colors"
                  title={translations.remove}
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Main Badge */}
              {image.isMain && (
                <div className="absolute top-2 left-2 bg-primary-500 text-white text-xs font-medium px-2 py-1 rounded">
                  Principal
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
