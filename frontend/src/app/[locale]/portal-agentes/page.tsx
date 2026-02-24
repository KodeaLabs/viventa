'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  GlobeAltIcon,
  ShieldCheckIcon,
  BoltIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline';
import { Button } from '@/components/atoms';

type TabType = 'login' | 'register';

export default function PortalAgentesPage() {
  const params = useParams();
  const locale = params.locale as string;
  const isSpanish = locale === 'es';

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
      setError(
        isSpanish
          ? 'El sistema de autenticación se configurará próximamente.'
          : 'The authentication system will be configured soon.'
      );
    } catch {
      setError(
        isSpanish
          ? 'Error al iniciar sesión. Por favor intente de nuevo.'
          : 'Login error. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (registerData.password !== registerData.confirmPassword) {
      setError(
        isSpanish
          ? 'Las contraseñas no coinciden'
          : 'Passwords do not match'
      );
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Implement actual registration logic
      console.log('Register attempt:', registerData);
      setError(
        isSpanish
          ? 'El registro se habilitará próximamente. Por favor contáctenos directamente.'
          : 'Registration will be available soon. Please contact us directly.'
      );
    } catch {
      setError(
        isSpanish
          ? 'Error al registrarse. Por favor intente de nuevo.'
          : 'Registration error. Please try again.'
      );
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
              {isSpanish ? 'Iniciar Sesión' : 'Sign In'}
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === 'register'
                  ? 'bg-primary-600 text-white'
                  : 'text-secondary-600 hover:bg-secondary-50'
              }`}
            >
              {isSpanish ? 'Registrarse' : 'Register'}
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
                    {isSpanish ? 'Correo Electrónico' : 'Email'}
                  </label>
                  <input
                    type="email"
                    id="login-email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder={isSpanish ? 'tu@email.com' : 'you@email.com'}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium text-secondary-700 mb-2">
                    {isSpanish ? 'Contraseña' : 'Password'}
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
                  {isLoading
                    ? (isSpanish ? 'Iniciando...' : 'Signing in...')
                    : (isSpanish ? 'Iniciar Sesión' : 'Sign In')}
                </Button>

                <p className="text-center text-sm text-secondary-500">
                  {isSpanish ? '¿Olvidaste tu contraseña?' : 'Forgot your password?'}{' '}
                  <button type="button" className="text-primary-600 hover:text-primary-700 font-medium">
                    {isSpanish ? 'Recuperar' : 'Recover'}
                  </button>
                </p>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-secondary-700 mb-2">
                      {isSpanish ? 'Nombre' : 'First Name'}
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
                      {isSpanish ? 'Apellido' : 'Last Name'}
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
                    {isSpanish ? 'Correo Electrónico' : 'Email'}
                  </label>
                  <input
                    type="email"
                    id="register-email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder={isSpanish ? 'tu@email.com' : 'you@email.com'}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-2">
                    {isSpanish ? 'Teléfono / WhatsApp' : 'Phone / WhatsApp'}
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
                    {isSpanish ? 'Tipo de Cuenta' : 'Account Type'}
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
                      <div className="font-medium text-secondary-900">
                        {isSpanish ? 'Agente Individual' : 'Individual Agent'}
                      </div>
                      <div className="text-sm text-secondary-500">
                        {isSpanish ? 'Trabajo independiente' : 'Independent work'}
                      </div>
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
                      <div className="font-medium text-secondary-900">
                        {isSpanish ? 'Inmobiliaria' : 'Real Estate Company'}
                      </div>
                      <div className="text-sm text-secondary-500">
                        {isSpanish ? 'Empresa de bienes raíces' : 'Real estate business'}
                      </div>
                    </button>
                  </div>
                </div>

                {registerData.agentType === 'company' && (
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-secondary-700 mb-2">
                      {isSpanish ? 'Nombre de la Empresa' : 'Company Name'}
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
                    {isSpanish ? 'Contraseña' : 'Password'}
                  </label>
                  <input
                    type="password"
                    id="register-password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder={isSpanish ? 'Mínimo 8 caracteres' : 'Minimum 8 characters'}
                    minLength={8}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-700 mb-2">
                    {isSpanish ? 'Confirmar Contraseña' : 'Confirm Password'}
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
                  {isLoading
                    ? (isSpanish ? 'Registrando...' : 'Registering...')
                    : (isSpanish ? 'Crear Cuenta' : 'Create Account')}
                </Button>

                <p className="text-center text-xs text-secondary-500">
                  {isSpanish ? 'Al registrarte, aceptas nuestros' : 'By registering, you agree to our'}{' '}
                  <Link href={`/${locale}/terms`} className="text-primary-600 hover:underline">
                    {isSpanish ? 'Términos de Servicio' : 'Terms of Service'}
                  </Link>{' '}
                  {isSpanish ? 'y' : 'and'}{' '}
                  <Link href={`/${locale}/privacy`} className="text-primary-600 hover:underline">
                    {isSpanish ? 'Política de Privacidad' : 'Privacy Policy'}
                  </Link>
                </p>
              </form>
            )}
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
