'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckIcon,
  BuildingOffice2Icon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { Button, Spinner } from '@/components/atoms';
import { api } from '../../../lib/api';

interface Referrer {
  id: number;
  name: string;
  email: string;
}

interface BecomeAgentPageProps {
  params: { locale: string };
}

export default function BecomeAgentPage({
  params: { locale },
}: BecomeAgentPageProps) {
  const router = useRouter();
  const isSpanish = locale === 'es';

  const [agentType, setAgentType] = useState<string>('individual');
  const [referrerId, setReferrerId] = useState<number | undefined>();
  const [referrers, setReferrers] = useState<Referrer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingReferrers, setIsLoadingReferrers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchReferrers = async () => {
      try {
        const response = await api.getReferrers();
        setReferrers(response.data || []);
      } catch (err) {
        console.error('Failed to fetch referrers:', err);
      } finally {
        setIsLoadingReferrers(false);
      }
    };

    fetchReferrers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await api.becomeAgent({
        agent_type: agentType,
        referred_by: referrerId,
      });

      setSuccess(true);

      // Redirect to agent dashboard after 2 seconds
      setTimeout(() => {
        router.push(`/${locale}/agent/properties`);
      }, 2000);
    } catch (err: any) {
      setError(
        err.message ||
          (isSpanish
            ? 'Error al registrar como agente'
            : 'Failed to register as agent')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const agentTypes = [
    {
      value: 'individual',
      label: isSpanish ? 'Agente Individual' : 'Individual Agent',
      description: isSpanish
        ? 'Soy un agente inmobiliario independiente'
        : "I'm an independent real estate agent",
    },
    {
      value: 'company',
      label: isSpanish ? 'Empresa Inmobiliaria' : 'Real Estate Company',
      description: isSpanish
        ? 'Represento una empresa de bienes raíces'
        : 'I represent a real estate company',
    },
  ];

  if (success) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckIcon className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="font-display text-2xl font-bold text-secondary-900 mb-2">
            {isSpanish ? '¡Registro Exitoso!' : 'Registration Successful!'}
          </h2>
          <p className="text-secondary-600 mb-4">
            {isSpanish
              ? 'Ahora eres un agente registrado. Redirigiendo al panel de control...'
              : 'You are now a registered agent. Redirecting to dashboard...'}
          </p>
          <Spinner size="md" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-custom py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              {isSpanish ? 'Conviértete en Agente' : 'Become an Agent'}
            </h1>
            <p className="text-secondary-600 text-lg">
              {isSpanish
                ? 'Únete a nuestra red de profesionales inmobiliarios y comienza a publicar tus propiedades'
                : 'Join our network of real estate professionals and start listing your properties'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            {/* Agent Type Selection */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-secondary-900 mb-4">
                {isSpanish ? 'Tipo de Agente' : 'Agent Type'}
              </label>
              <div className="space-y-3">
                {agentTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      agentType === type.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-secondary-200 hover:border-secondary-300'
                    }`}
                  >
                    <div className="flex items-start">
                      <input
                        type="radio"
                        name="agent_type"
                        value={type.value}
                        checked={agentType === type.value}
                        onChange={(e) => setAgentType(e.target.value)}
                        className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500"
                      />
                      <div className="ml-3">
                        <span className="font-medium text-secondary-900">
                          {type.label}
                        </span>
                        <p className="text-sm text-secondary-500 mt-0.5">
                          {type.description}
                        </p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Referrer Selection */}
            <div className="mb-8">
              <label
                htmlFor="referrer"
                className="block text-sm font-semibold text-secondary-900 mb-2"
              >
                {isSpanish ? '¿Quién te refirió?' : 'Who referred you?'}
                <span className="font-normal text-secondary-500 ml-1">
                  ({isSpanish ? 'opcional' : 'optional'})
                </span>
              </label>
              <p className="text-sm text-secondary-500 mb-3">
                {isSpanish
                  ? 'Si alguien te invitó a unirte a la plataforma, selecciónalo aquí'
                  : 'If someone invited you to join the platform, select them here'}
              </p>
              {isLoadingReferrers ? (
                <div className="flex items-center justify-center py-4">
                  <Spinner size="sm" />
                </div>
              ) : (
                <select
                  id="referrer"
                  value={referrerId || ''}
                  onChange={(e) =>
                    setReferrerId(e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-secondary-900"
                >
                  <option value="">
                    {isSpanish
                      ? '-- Nadie me refirió --'
                      : '-- No one referred me --'}
                  </option>
                  {referrers.map((referrer) => (
                    <option key={referrer.id} value={referrer.id}>
                      {referrer.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Terms */}
            <div className="mb-8 p-4 bg-secondary-50 rounded-lg">
              <p className="text-sm text-secondary-600">
                {isSpanish
                  ? 'Al registrarte como agente, aceptas nuestros términos de servicio y te comprometes a cumplir con las regulaciones inmobiliarias de Venezuela.'
                  : 'By registering as an agent, you agree to our terms of service and commit to complying with Venezuelan real estate regulations.'}
              </p>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  {isSpanish ? 'Registrando...' : 'Registering...'}
                </>
              ) : isSpanish ? (
                'Registrarme como Agente'
              ) : (
                'Register as Agent'
              )}
            </Button>
          </form>

          {/* Benefits */}
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BuildingOffice2Icon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-secondary-900 mb-1">
                {isSpanish ? 'Publica Propiedades' : 'List Properties'}
              </h3>
              <p className="text-sm text-secondary-500">
                {isSpanish
                  ? 'Sube y administra tus propiedades'
                  : 'Upload and manage your properties'}
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <UserGroupIcon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-secondary-900 mb-1">
                {isSpanish ? 'Tu Página' : 'Your Page'}
              </h3>
              <p className="text-sm text-secondary-500">
                {isSpanish
                  ? 'Perfil público para compartir'
                  : 'Public profile to share'}
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ChatBubbleLeftRightIcon className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-secondary-900 mb-1">
                {isSpanish ? 'Recibe Consultas' : 'Get Inquiries'}
              </h3>
              <p className="text-sm text-secondary-500">
                {isSpanish
                  ? 'Conecta con compradores interesados'
                  : 'Connect with interested buyers'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
