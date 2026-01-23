'use client';

import { useState } from 'react';
import { ShareIcon, CheckIcon, LinkIcon } from '@heroicons/react/24/outline';
import { cn } from '../../lib/utils';

interface ShareButtonProps {
  url?: string;
  title: string;
  className?: string;
  locale: 'en' | 'es';
}

export function ShareButton({ url, title, className, locale }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = locale === 'es'
    ? `Mira esta propiedad: ${title}`
    : `Check out this property: ${title}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error
        if ((err as Error).name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    } else {
      setShowOptions(!showOptions);
    }
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      href: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`,
      color: 'bg-green-500',
    },
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'bg-blue-600',
    },
    {
      name: 'Twitter',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'bg-sky-500',
    },
    {
      name: 'Email',
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`,
      color: 'bg-secondary-600',
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={handleNativeShare}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg border border-secondary-200 text-secondary-600 hover:bg-secondary-100 transition-colors',
          className
        )}
      >
        <ShareIcon className="h-5 w-5" />
        <span className="font-medium">
          {locale === 'es' ? 'Compartir' : 'Share'}
        </span>
      </button>

      {showOptions && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowOptions(false)}
          />

          {/* Options */}
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-elegant py-2 z-50">
            {shareOptions.map((option) => (
              <a
                key={option.name}
                href={option.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2 hover:bg-secondary-50 transition-colors"
                onClick={() => setShowOptions(false)}
              >
                <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold', option.color)}>
                  {option.name.charAt(0)}
                </div>
                <span className="text-secondary-700">{option.name}</span>
              </a>
            ))}

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="w-full flex items-center gap-3 px-4 py-2 hover:bg-secondary-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-secondary-200 flex items-center justify-center">
                {copied ? (
                  <CheckIcon className="h-4 w-4 text-green-600" />
                ) : (
                  <LinkIcon className="h-4 w-4 text-secondary-600" />
                )}
              </div>
              <span className="text-secondary-700">
                {copied
                  ? locale === 'es'
                    ? 'Copiado'
                    : 'Copied!'
                  : locale === 'es'
                  ? 'Copiar enlace'
                  : 'Copy link'}
              </span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
