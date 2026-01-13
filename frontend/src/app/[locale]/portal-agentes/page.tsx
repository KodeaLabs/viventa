'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/atoms';

type TabType = 'login' | 'register';

export default function PortalAgentesPage() {
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as string;

  // Redirect to Spanish version if accessed in English
  if (locale === 'en') {
    router.push('/es/portal-agentes');
    return null;
  }

  const [activeTab, setActiveTab] = useState<TabType>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agentType: 'individual',
    companyName: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // TODO: Implement actual login logic with Auth0 or backend
      console.log('Login attempt:', { email: loginEmail });
      // For now, show a message
      setError('El sistema de autenticación se configurará próximamente.');
    } catch {
      setError('Error al iniciar sesión. Por favor intente de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (registerData.password !== registerData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Implement actual registration logic
      console.log('Register attempt:', registerData);
      setError('El registro se habilitará próximamente. Por favor contáctenos directamente.');
    } catch {
      setError('Error al registrarse. Por favor intente de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="container-custom text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Portal de Agentes
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Únete a la plataforma líder de bienes raíces en Venezuela.
            Publica tus propiedades y conecta con compradores internacionales.
          </p>
        </div>
      </div>

      <div className="container-custom py-12">
        <div className="max-w-lg mx-auto">
          {/* Tab Buttons */}
          <div className="flex bg-white rounded-xl shadow-sm border border-secondary-200 p-1 mb-8">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'login'
                  ? 'bg-primary-600 text-white'
                  : 'text-secondary-600 hover:bg-secondary-50'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'register'
                  ? 'bg-primary-600 text-white'
                  : 'text-secondary-600 hover:bg-secondary-50'
              }`}
            >
              Registrarse
            </button>
          </div>

          {/* Forms */}
          <div className="bg-white rounded-xl shadow-lg border border-secondary-200 p-8">
            {error && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
                {error}
              </div>
            )}

            {activeTab === 'login' ? (
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-secondary-700 mb-2">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id="login-email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="tu@email.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium text-secondary-700 mb-2">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id="login-password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
                </Button>

                <p className="text-center text-sm text-secondary-500">
                  ¿Olvidaste tu contraseña?{' '}
                  <button type="button" className="text-primary-600 hover:text-primary-700 font-medium">
                    Recuperar
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-secondary-700 mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={registerData.firstName}
                      onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-secondary-700 mb-2">
                      Apellido
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={registerData.lastName}
                      onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="register-email" className="block text-sm font-medium text-secondary-700 mb-2">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    id="register-email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="tu@email.com"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-2">
                    Teléfono / WhatsApp
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={registerData.phone}
                    onChange={(e) => setRegisterData({ ...registerData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="+58 412 123 4567"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Tipo de Cuenta
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRegisterData({ ...registerData, agentType: 'individual', companyName: '' })}
                      className={`p-4 border rounded-lg text-left transition-all ${
                        registerData.agentType === 'individual'
                          ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500'
                          : 'border-secondary-300 hover:border-secondary-400'
                      }`}
                    >
                      <div className="font-medium text-secondary-900">Agente Individual</div>
                      <div className="text-sm text-secondary-500">Trabajo independiente</div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegisterData({ ...registerData, agentType: 'company' })}
                      className={`p-4 border rounded-lg text-left transition-all ${
                        registerData.agentType === 'company'
                          ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500'
                          : 'border-secondary-300 hover:border-secondary-400'
                      }`}
                    >
                      <div className="font-medium text-secondary-900">Inmobiliaria</div>
                      <div className="text-sm text-secondary-500">Empresa de bienes raíces</div>
                    </button>
                  </div>
                </div>

                {registerData.agentType === 'company' && (
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-secondary-700 mb-2">
                      Nombre de la Empresa
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      value={registerData.companyName}
                      onChange={(e) => setRegisterData({ ...registerData, companyName: e.target.value })}
                      className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="register-password" className="block text-sm font-medium text-secondary-700 mb-2">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id="register-password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Mínimo 8 caracteres"
                    minLength={8}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-700 mb-2">
                    Confirmar Contraseña
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="••••••••"
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Registrando...' : 'Crear Cuenta'}
                </Button>

                <p className="text-center text-xs text-secondary-500">
                  Al registrarte, aceptas nuestros{' '}
                  <Link href="/es/terms" className="text-primary-600 hover:underline">
                    Términos de Servicio
                  </Link>{' '}
                  y{' '}
                  <Link href="/es/privacy" className="text-primary-600 hover:underline">
                    Política de Privacidad
                  </Link>
                </p>
              </form>
            )}
          </div>

          {/* Benefits Section */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200 text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-secondary-900 mb-2">Alcance Internacional</h3>
              <p className="text-sm text-secondary-600">Conecta con compradores de todo el mundo</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200 text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-secondary-900 mb-2">Plataforma Segura</h3>
              <p className="text-sm text-secondary-600">Tus datos y propiedades están protegidos</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-secondary-200 text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-secondary-900 mb-2">Fácil de Usar</h3>
              <p className="text-sm text-secondary-600">Publica propiedades en minutos</p>
            </div>
          </div>

          {/* Contact Alternative */}
          <div className="mt-8 text-center">
            <p className="text-secondary-600 mb-3">
              ¿Prefieres contactarnos directamente?
            </p>
            <Link
              href="/es/contact"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Contáctanos por WhatsApp
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
