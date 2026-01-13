import Link from 'next/link';
import { HomeIcon } from '@heroicons/react/24/outline';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        {/* 404 Illustration */}
        <div className="relative mx-auto mb-8 w-48 h-48">
          {/* House silhouette */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              viewBox="0 0 200 200"
              className="w-full h-full text-secondary-200"
              fill="currentColor"
            >
              <path d="M100 20L20 80v100h160V80L100 20zm0 20l60 45v75H40v-75l60-45z" />
            </svg>
          </div>

          {/* 404 text overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-display font-bold text-primary-600">
              404
            </span>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-4 right-4 w-6 h-6 bg-accent-300 rounded-full opacity-60" />
          <div className="absolute bottom-8 left-0 w-8 h-8 bg-primary-200 rounded-full opacity-40" />
        </div>

        {/* Text content */}
        <h1 className="font-display text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
          Property Not Found
        </h1>
        <p className="text-secondary-600 text-lg mb-8 max-w-md mx-auto">
          The property you are looking for might have been sold, removed, or
          doesn't exist. Let's find you something perfect.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/en/properties"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
          >
            Browse Properties
          </Link>
          <Link
            href="/en"
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-secondary-300 text-secondary-700 font-semibold rounded-lg hover:bg-secondary-100 transition-colors"
          >
            <HomeIcon className="w-5 h-5 mr-2" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
