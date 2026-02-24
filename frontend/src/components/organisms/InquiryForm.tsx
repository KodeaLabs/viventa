'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CheckIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/atoms';
import { FormField } from '@/components/molecules';
import { api } from '../../lib/api';
import { cn } from '../../lib/utils';
import type { InquiryFormData } from '@/types';

interface InquiryFormProps {
  propertyId: string;
  locale: 'en' | 'es';
  translations: {
    title: string;
    subtitle: string;
    fullName: string;
    email: string;
    phone: string;
    country: string;
    message: string;
    contactMethod: string;
    email_option: string;
    phone_option: string;
    whatsapp: string;
    submit: string;
    submitting: string;
    success: string;
    error: string;
    required: string;
    invalidEmail: string;
  };
  className?: string;
}

export function InquiryForm({
  propertyId,
  locale,
  translations,
  className,
}: InquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InquiryFormData>({
    defaultValues: {
      property: propertyId,
      preferred_contact_method: 'email',
      preferred_language: locale,
    },
  });

  const onSubmit = async (data: InquiryFormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      await api.createInquiry({
        ...data,
        property: propertyId,
        preferred_language: locale,
      });
      setSubmitStatus('success');
      reset();
    } catch (error: any) {
      setSubmitStatus('error');
      setErrorMessage(error.message || translations.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    const nextSteps = locale === 'es'
      ? [
          'El agente revisará tu consulta',
          'Recibirás una respuesta en 24-48 horas',
          'El agente te contactará por tu método preferido',
        ]
      : [
          'The agent will review your inquiry',
          'Expect a response within 24-48 hours',
          'The agent will contact you via your preferred method',
        ];

    return (
      <div className={cn('bg-green-50 rounded-xl p-6', className)}>
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckIcon className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            {translations.success}
          </h3>
        </div>

        {/* What happens next */}
        <div className="mt-6 pt-4 border-t border-green-200">
          <h4 className="text-sm font-semibold text-green-800 mb-3">
            {locale === 'es' ? '¿Qué sigue?' : "What's next?"}
          </h4>
          <ul className="space-y-2">
            {nextSteps.map((step, index) => (
              <li key={index} className="flex items-start text-sm text-green-700">
                <span className="flex-shrink-0 w-5 h-5 bg-green-200 rounded-full flex items-center justify-center mr-2 mt-0.5 text-xs font-bold text-green-800">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('bg-white rounded-xl shadow-elegant p-6', className)}>
      <h3 className="font-display text-xl font-semibold text-secondary-900 mb-1">
        {translations.title}
      </h3>
      <p className="text-secondary-500 text-sm mb-6">{translations.subtitle}</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="label">
            {translations.fullName} <span className="text-red-500">*</span>
          </label>
          <input
            {...register('full_name', { required: translations.required })}
            className={cn('input', errors.full_name && 'border-red-500')}
            placeholder={translations.fullName}
          />
          {errors.full_name && (
            <p className="mt-1 text-sm text-red-600">{errors.full_name.message}</p>
          )}
        </div>

        <div>
          <label className="label">
            {translations.email} <span className="text-red-500">*</span>
          </label>
          <input
            {...register('email', {
              required: translations.required,
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: translations.invalidEmail,
              },
            })}
            type="email"
            className={cn('input', errors.email && 'border-red-500')}
            placeholder={translations.email}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">{translations.phone}</label>
            <input
              {...register('phone')}
              type="tel"
              className="input"
              placeholder="+1 234 567 8900"
            />
          </div>
          <div>
            <label className="label">{translations.country}</label>
            <input
              {...register('country')}
              className="input"
              placeholder={translations.country}
            />
          </div>
        </div>

        <div>
          <label className="label">
            {translations.message} <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('message', { required: translations.required })}
            rows={4}
            className={cn('input resize-none', errors.message && 'border-red-500')}
            placeholder={translations.message}
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
          )}
        </div>

        <div>
          <label className="label">{translations.contactMethod}</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                {...register('preferred_contact_method')}
                type="radio"
                value="email"
                className="mr-2"
              />
              {translations.email_option}
            </label>
            <label className="flex items-center">
              <input
                {...register('preferred_contact_method')}
                type="radio"
                value="phone"
                className="mr-2"
              />
              {translations.phone_option}
            </label>
            <label className="flex items-center">
              <input
                {...register('preferred_contact_method')}
                type="radio"
                value="whatsapp"
                className="mr-2"
              />
              {translations.whatsapp}
            </label>
          </div>
        </div>

        {submitStatus === 'error' && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
            {errorMessage}
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
          size="lg"
          isLoading={isSubmitting}
        >
          {isSubmitting ? translations.submitting : translations.submit}
        </Button>
      </form>
    </div>
  );
}
