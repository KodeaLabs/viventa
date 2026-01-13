import { getTranslations } from 'next-intl/server';
import {
  ShieldCheckIcon,
  UserGroupIcon,
  GlobeAltIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

export default async function AboutPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const isSpanish = locale === 'es';

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 py-20">
        <div className="container-custom text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
            {isSpanish ? 'Sobre Nosotros' : 'About Us'}
          </h1>
          <p className="text-xl text-secondary-300 max-w-2xl mx-auto">
            {isSpanish
              ? 'Conectamos compradores internacionales con las mejores oportunidades inmobiliarias en Venezuela.'
              : 'Connecting international buyers with premium real estate opportunities in Venezuela.'}
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="container-custom py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-display text-3xl font-bold text-secondary-900 mb-6">
            {isSpanish ? 'Nuestra Misión' : 'Our Mission'}
          </h2>
          <p className="text-lg text-secondary-600 leading-relaxed">
            {isSpanish
              ? 'Venezuela Estates nació de la visión de hacer accesible el mercado inmobiliario venezolano a compradores de todo el mundo. Con precios históricamente bajos y un potencial de apreciación excepcional, Venezuela ofrece una oportunidad única de inversión que queremos compartir contigo.'
              : "Venezuela Estates was born from the vision of making Venezuela's real estate market accessible to buyers worldwide. With historically low prices and exceptional appreciation potential, Venezuela offers a unique investment opportunity we want to share with you."}
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white rounded-xl p-8 shadow-card text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheckIcon className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="font-display text-xl font-semibold text-secondary-900 mb-3">
              {isSpanish ? 'Transparencia' : 'Transparency'}
            </h3>
            <p className="text-secondary-600">
              {isSpanish
                ? 'Precios claros, procesos documentados y comunicación abierta en cada paso.'
                : 'Clear pricing, documented processes, and open communication at every step.'}
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-card text-center">
            <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserGroupIcon className="w-8 h-8 text-accent-600" />
            </div>
            <h3 className="font-display text-xl font-semibold text-secondary-900 mb-3">
              {isSpanish ? 'Agentes Verificados' : 'Verified Agents'}
            </h3>
            <p className="text-secondary-600">
              {isSpanish
                ? 'Trabajamos solo con agentes locales de confianza, verificados y con experiencia comprobada.'
                : 'We work only with trusted, verified local agents with proven experience.'}
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-card text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <GlobeAltIcon className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-display text-xl font-semibold text-secondary-900 mb-3">
              {isSpanish ? 'Alcance Global' : 'Global Reach'}
            </h3>
            <p className="text-secondary-600">
              {isSpanish
                ? 'Plataforma bilingüe diseñada para compradores internacionales, con soporte en inglés y español.'
                : 'Bilingual platform designed for international buyers, with support in English and Spanish.'}
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-card text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <SparklesIcon className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="font-display text-xl font-semibold text-secondary-900 mb-3">
              {isSpanish ? 'Calidad Premium' : 'Premium Quality'}
            </h3>
            <p className="text-secondary-600">
              {isSpanish
                ? 'Propiedades cuidadosamente seleccionadas que cumplen con nuestros estándares de calidad.'
                : 'Carefully selected properties that meet our quality standards.'}
            </p>
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="bg-white py-16 md:py-24">
        <div className="container-custom">
          <h2 className="font-display text-3xl font-bold text-secondary-900 mb-12 text-center">
            {isSpanish ? 'Cómo Funciona' : 'How It Works'}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
                1
              </div>
              <h3 className="font-display text-xl font-semibold text-secondary-900 mb-3">
                {isSpanish ? 'Explora' : 'Explore'}
              </h3>
              <p className="text-secondary-600">
                {isSpanish
                  ? 'Navega nuestro catálogo de propiedades verificadas con fotos, descripciones y precios en USD.'
                  : 'Browse our catalog of verified properties with photos, descriptions, and USD prices.'}
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
                2
              </div>
              <h3 className="font-display text-xl font-semibold text-secondary-900 mb-3">
                {isSpanish ? 'Contacta' : 'Contact'}
              </h3>
              <p className="text-secondary-600">
                {isSpanish
                  ? 'Envía una consulta directamente al agente verificado a través de nuestra plataforma segura.'
                  : 'Send an inquiry directly to the verified agent through our secure platform.'}
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white font-bold text-xl">
                3
              </div>
              <h3 className="font-display text-xl font-semibold text-secondary-900 mb-3">
                {isSpanish ? 'Invierte' : 'Invest'}
              </h3>
              <p className="text-secondary-600">
                {isSpanish
                  ? 'Nuestro equipo te guía en todo el proceso legal y de pago para una transacción segura.'
                  : 'Our team guides you through the entire legal and payment process for a secure transaction.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600 py-16">
        <div className="container-custom text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            {isSpanish ? '¿Listo para Explorar?' : 'Ready to Explore?'}
          </h2>
          <p className="text-primary-100 text-lg mb-8">
            {isSpanish
              ? 'Descubre las mejores oportunidades inmobiliarias en Venezuela.'
              : 'Discover the best real estate opportunities in Venezuela.'}
          </p>
          <a
            href={`/${locale}/properties`}
            className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
          >
            {isSpanish ? 'Ver Propiedades' : 'View Properties'}
          </a>
        </div>
      </div>
    </div>
  );
}
