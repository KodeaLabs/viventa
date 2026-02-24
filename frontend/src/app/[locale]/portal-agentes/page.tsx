'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import {
  GlobeAltIcon,
  ShieldCheckIcon,
  BoltIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';
import { Spinner } from '@/components/atoms';

export default function PortalAgentesPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;
  const isSpanish = locale === 'es';
  const { user, isLoading } = useUser();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(`/${locale}/agent/properties`);
    }
  }, [user, isLoading, locale, router]);

  if (isLoading || user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="container-custom text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            {isSpanish ? 'Portal de Agentes' : 'Agent Portal'}
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            {isSpanish
              ? 'Únete a la plataforma líder de bienes raíces en Venezuela. Publica tus propiedades y conecta con compradores internacionales.'
              : 'Join the leading real estate platform in Venezuela. List your properties and connect with international buyers.'}
          </p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="max-w-lg mx-auto">
          {/* Sign In Card */}
          <div className="bg-white rounded-xl shadow-lg border border-secondary-200 p-8 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserCircleIcon className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="font-display text-2xl font-bold text-secondary-900 mb-3">
              {isSpanish
                ? 'Accede a tu cuenta de agente'
                : 'Access your agent account'}
            </h2>
            <p className="text-secondary-600 mb-8">
              {isSpanish
                ? 'Inicia sesión o regístrate para administrar tus propiedades, responder consultas y conectar con compradores.'
                : 'Sign in or register to manage your properties, respond to inquiries, and connect with buyers.'}
            </p>
            <a
              href="/api/auth/login"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors text-lg"
            >
              {isSpanish ? 'Iniciar Sesión / Registrarse' : 'Sign In / Register'}
            </a>
            <p className="mt-4 text-xs text-secondary-500">
              {isSpanish ? 'Al continuar, aceptas nuestros' : 'By continuing, you agree to our'}{' '}
              <Link href={`/${locale}/terms`} className="text-primary-600 hover:underline">
                {isSpanish ? 'Términos de Servicio' : 'Terms of Service'}
              </Link>{' '}
              {isSpanish ? 'y' : 'and'}{' '}
              <Link href={`/${locale}/privacy`} className="text-primary-600 hover:underline">
                {isSpanish ? 'Política de Privacidad' : 'Privacy Policy'}
              </Link>
            </p>
          </div>

          {/* Benefits Section */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200 text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GlobeAltIcon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-secondary-900 mb-2">
                {isSpanish ? 'Alcance Internacional' : 'International Reach'}
              </h3>
              <p className="text-sm text-secondary-600">
                {isSpanish
                  ? 'Conecta con compradores de todo el mundo'
                  : 'Connect with buyers from around the world'}
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200 text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-secondary-900 mb-2">
                {isSpanish ? 'Plataforma Segura' : 'Secure Platform'}
              </h3>
              <p className="text-sm text-secondary-600">
                {isSpanish
                  ? 'Tus datos y propiedades están protegidos'
                  : 'Your data and properties are protected'}
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200 text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BoltIcon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-secondary-900 mb-2">
                {isSpanish ? 'Fácil de Usar' : 'Easy to Use'}
              </h3>
              <p className="text-sm text-secondary-600">
                {isSpanish
                  ? 'Publica propiedades en minutos'
                  : 'List properties in minutes'}
              </p>
            </div>
          </div>

          {/* Contact Alternative */}
          <div className="mt-8 text-center">
            <p className="text-secondary-600 mb-3">
              {isSpanish
                ? '¿Prefieres contactarnos directamente?'
                : 'Prefer to contact us directly?'}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              <ChatBubbleLeftRightIcon className="w-5 h-5" />
              {isSpanish ? 'Contáctanos por WhatsApp' : 'Contact us via WhatsApp'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
