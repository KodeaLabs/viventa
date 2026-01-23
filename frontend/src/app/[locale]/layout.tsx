import { Inter, Playfair_Display } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { Header, Footer } from '@/components/organisms';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'meta' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: 'nav' });
  const footerT = await getTranslations({ locale, namespace: 'footer' });

  const headerTranslations = {
    home: t('home'),
    properties: t('properties'),
    projects: t('projects'),
    agents: t('agents'),
    about: t('about'),
    contact: t('contact'),
  };

  const currentYear = new Date().getFullYear();
  const footerTranslations = {
    tagline: footerT('tagline'),
    properties: footerT('properties'),
    featured: footerT('featured'),
    company: footerT('company'),
    about: footerT('about'),
    contact: footerT('contact'),
    privacy: footerT('privacy'),
    terms: footerT('terms'),
    locations: footerT('locations'),
    margarita: footerT('margarita'),
    caracas: footerT('caracas'),
    valencia: footerT('valencia'),
    copyright: footerT('copyright', { year: currentYear }),
  };

  return (
    <html lang={locale} className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <Header locale={locale} translations={headerTranslations} />
          <main className="flex-1">{children}</main>
          <Footer locale={locale} translations={footerTranslations} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
