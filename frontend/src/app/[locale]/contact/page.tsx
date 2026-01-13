'use client';

import { useState } from 'react';
import {
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { Button, Input } from '@/components/atoms';

interface ContactPageProps {
  params: { locale: string };
}

export default function ContactPage({ params: { locale } }: ContactPageProps) {
  const isSpanish = locale === 'es';
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSubmitted(true);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 py-20">
        <div className="container-custom text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
            {isSpanish ? 'Contáctanos' : 'Contact Us'}
          </h1>
          <p className="text-xl text-secondary-300 max-w-2xl mx-auto">
            {isSpanish
              ? '¿Tienes preguntas? Estamos aquí para ayudarte.'
              : 'Have questions? We are here to help.'}
          </p>
        </div>
      </div>

      <div className="container-custom py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="font-display text-2xl font-bold text-secondary-900 mb-8">
              {isSpanish ? 'Información de Contacto' : 'Contact Information'}
            </h2>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPinIcon className="w-6 h-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-secondary-900">
                    {isSpanish ? 'Ubicación' : 'Location'}
                  </h3>
                  <p className="text-secondary-600">
                    Isla de Margarita, Nueva Esparta, Venezuela
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <EnvelopeIcon className="w-6 h-6 text-accent-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-secondary-900">Email</h3>
                  <a
                    href="mailto:info@venezuelaestates.com"
                    className="text-primary-600 hover:underline"
                  >
                    info@venezuelaestates.com
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ChatBubbleLeftRightIcon className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-secondary-900">WhatsApp</h3>
                  <a
                    href="https://wa.me/584121234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline"
                  >
                    +58 412 123 4567
                  </a>
                </div>
              </div>
            </div>

            {/* FAQ Teaser */}
            <div className="mt-12 p-6 bg-white rounded-xl shadow-card">
              <h3 className="font-display text-lg font-semibold text-secondary-900 mb-4">
                {isSpanish ? 'Preguntas Frecuentes' : 'Frequently Asked Questions'}
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium text-secondary-900">
                    {isSpanish
                      ? '¿Pueden los extranjeros comprar propiedades en Venezuela?'
                      : 'Can foreigners buy property in Venezuela?'}
                  </p>
                  <p className="text-sm text-secondary-600 mt-1">
                    {isSpanish
                      ? 'Sí, los extranjeros pueden comprar propiedades en Venezuela. Te guiamos en todo el proceso legal.'
                      : 'Yes, foreigners can purchase property in Venezuela. We guide you through the entire legal process.'}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-secondary-900">
                    {isSpanish
                      ? '¿Los precios están en dólares?'
                      : 'Are prices in USD?'}
                  </p>
                  <p className="text-sm text-secondary-600 mt-1">
                    {isSpanish
                      ? 'Sí, todos los precios en nuestra plataforma están en dólares americanos (USD).'
                      : 'Yes, all prices on our platform are in US Dollars (USD).'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl p-8 shadow-card">
            <h2 className="font-display text-2xl font-bold text-secondary-900 mb-6">
              {isSpanish ? 'Envíanos un Mensaje' : 'Send us a Message'}
            </h2>

            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="font-display text-xl font-semibold text-secondary-900 mb-2">
                  {isSpanish ? '¡Mensaje Enviado!' : 'Message Sent!'}
                </h3>
                <p className="text-secondary-600">
                  {isSpanish
                    ? 'Gracias por contactarnos. Te responderemos pronto.'
                    : 'Thank you for contacting us. We will get back to you soon.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label={isSpanish ? 'Nombre' : 'Name'}
                  name="name"
                  value={formState.name}
                  onChange={(e) =>
                    setFormState({ ...formState, name: e.target.value })
                  }
                  required
                />

                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={(e) =>
                    setFormState({ ...formState, email: e.target.value })
                  }
                  required
                />

                <Input
                  label={isSpanish ? 'Asunto' : 'Subject'}
                  name="subject"
                  value={formState.subject}
                  onChange={(e) =>
                    setFormState({ ...formState, subject: e.target.value })
                  }
                  required
                />

                <div>
                  <label className="label">
                    {isSpanish ? 'Mensaje' : 'Message'}
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    className="input"
                    value={formState.message}
                    onChange={(e) =>
                      setFormState({ ...formState, message: e.target.value })
                    }
                    required
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  isLoading={isSubmitting}
                >
                  {isSpanish ? 'Enviar Mensaje' : 'Send Message'}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
