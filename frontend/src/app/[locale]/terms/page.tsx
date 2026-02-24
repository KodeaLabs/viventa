export default function TermsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const isSpanish = locale === 'es';

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 py-16">
        <div className="container-custom text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            {isSpanish ? 'T\u00e9rminos de Servicio' : 'Terms of Service'}
          </h1>
          <p className="text-secondary-300">
            {isSpanish ? '\u00daltima actualizaci\u00f3n: Febrero 2026' : 'Last updated: February 2026'}
          </p>
        </div>
      </div>

      <div className="container-custom py-12 md:py-16">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-card p-8 md:p-12 space-y-8">
          {/* Acceptance */}
          <section>
            <h2 className="font-display text-2xl font-bold text-secondary-900 mb-4">
              {isSpanish ? '1. Aceptaci\u00f3n de los T\u00e9rminos' : '1. Acceptance of Terms'}
            </h2>
            <p className="text-secondary-600 leading-relaxed">
              {isSpanish
                ? 'Al acceder y utilizar la plataforma Viventi, usted acepta estar sujeto a estos t\u00e9rminos de servicio. Si no est\u00e1 de acuerdo con alguna parte de estos t\u00e9rminos, no debe utilizar nuestros servicios.'
                : 'By accessing and using the Viventi platform, you agree to be bound by these terms of service. If you do not agree with any part of these terms, you should not use our services.'}
            </p>
          </section>

          {/* Description */}
          <section>
            <h2 className="font-display text-2xl font-bold text-secondary-900 mb-4">
              {isSpanish ? '2. Descripci\u00f3n del Servicio' : '2. Service Description'}
            </h2>
            <p className="text-secondary-600 leading-relaxed">
              {isSpanish
                ? 'Viventi es una plataforma digital que conecta compradores internacionales con agentes inmobiliarios verificados en Venezuela. Facilitamos la b\u00fasqueda, visualizaci\u00f3n y consulta de propiedades, pero no somos parte directa de ninguna transacci\u00f3n inmobiliaria.'
                : 'Viventi is a digital platform that connects international buyers with verified real estate agents in Venezuela. We facilitate property search, viewing, and inquiry, but we are not a direct party to any real estate transaction.'}
            </p>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="font-display text-2xl font-bold text-secondary-900 mb-4">
              {isSpanish ? '3. Cuentas de Usuario' : '3. User Accounts'}
            </h2>
            <ul className="list-disc list-inside space-y-2 text-secondary-600 leading-relaxed">
              <li>
                {isSpanish
                  ? 'Usted es responsable de mantener la confidencialidad de su cuenta y contrase\u00f1a'
                  : 'You are responsible for maintaining the confidentiality of your account and password'}
              </li>
              <li>
                {isSpanish
                  ? 'Debe proporcionar informaci\u00f3n veraz y actualizada al registrarse'
                  : 'You must provide truthful and up-to-date information when registering'}
              </li>
              <li>
                {isSpanish
                  ? 'Nos reservamos el derecho de suspender o cancelar cuentas que violen estos t\u00e9rminos'
                  : 'We reserve the right to suspend or cancel accounts that violate these terms'}
              </li>
              <li>
                {isSpanish
                  ? 'Una persona no puede mantener m\u00e1s de una cuenta activa'
                  : 'A person may not maintain more than one active account'}
              </li>
            </ul>
          </section>

          {/* Agent Terms */}
          <section>
            <h2 className="font-display text-2xl font-bold text-secondary-900 mb-4">
              {isSpanish ? '4. T\u00e9rminos para Agentes' : '4. Agent Terms'}
            </h2>
            <p className="text-secondary-600 leading-relaxed mb-4">
              {isSpanish
                ? 'Los agentes inmobiliarios que publican propiedades en nuestra plataforma se comprometen a:'
                : 'Real estate agents listing properties on our platform agree to:'}
            </p>
            <ul className="list-disc list-inside space-y-2 text-secondary-600 leading-relaxed">
              <li>
                {isSpanish
                  ? 'Publicar informaci\u00f3n precisa y veraz sobre las propiedades'
                  : 'Publish accurate and truthful property information'}
              </li>
              <li>
                {isSpanish
                  ? 'Mantener las im\u00e1genes y precios actualizados'
                  : 'Keep images and prices up to date'}
              </li>
              <li>
                {isSpanish
                  ? 'Responder a las consultas de compradores en un tiempo razonable (24-48 horas)'
                  : 'Respond to buyer inquiries within a reasonable time (24-48 hours)'}
              </li>
              <li>
                {isSpanish
                  ? 'Cumplir con las leyes y regulaciones inmobiliarias de Venezuela'
                  : 'Comply with Venezuelan real estate laws and regulations'}
              </li>
              <li>
                {isSpanish
                  ? 'No publicar contenido fraudulento, enga\u00f1oso o il\u00edcito'
                  : 'Not publish fraudulent, misleading, or illicit content'}
              </li>
            </ul>
          </section>

          {/* Buyer Terms */}
          <section>
            <h2 className="font-display text-2xl font-bold text-secondary-900 mb-4">
              {isSpanish ? '5. T\u00e9rminos para Compradores' : '5. Buyer Terms'}
            </h2>
            <ul className="list-disc list-inside space-y-2 text-secondary-600 leading-relaxed">
              <li>
                {isSpanish
                  ? 'Las consultas enviadas a trav\u00e9s de la plataforma se comparten con el agente correspondiente'
                  : 'Inquiries submitted through the platform are shared with the corresponding agent'}
              </li>
              <li>
                {isSpanish
                  ? 'Los precios mostrados son indicativos y pueden estar sujetos a cambios'
                  : 'Displayed prices are indicative and may be subject to change'}
              </li>
              <li>
                {isSpanish
                  ? 'Viventi no garantiza la exactitud de la informaci\u00f3n proporcionada por los agentes'
                  : 'Viventi does not guarantee the accuracy of information provided by agents'}
              </li>
              <li>
                {isSpanish
                  ? 'Se recomienda verificar independientemente toda informaci\u00f3n antes de realizar una transacci\u00f3n'
                  : 'We recommend independently verifying all information before making a transaction'}
              </li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="font-display text-2xl font-bold text-secondary-900 mb-4">
              {isSpanish ? '6. Propiedad Intelectual' : '6. Intellectual Property'}
            </h2>
            <p className="text-secondary-600 leading-relaxed">
              {isSpanish
                ? 'Todo el contenido de la plataforma, incluyendo dise\u00f1o, logos, textos y c\u00f3digo, est\u00e1 protegido por derechos de propiedad intelectual. Las im\u00e1genes de propiedades son responsabilidad de los agentes que las publican.'
                : 'All platform content, including design, logos, text, and code, is protected by intellectual property rights. Property images are the responsibility of the agents who publish them.'}
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="font-display text-2xl font-bold text-secondary-900 mb-4">
              {isSpanish ? '7. Limitaci\u00f3n de Responsabilidad' : '7. Limitation of Liability'}
            </h2>
            <p className="text-secondary-600 leading-relaxed">
              {isSpanish
                ? 'Viventi act\u00faa como intermediario tecnol\u00f3gico y no asume responsabilidad por transacciones realizadas entre compradores y agentes. No garantizamos la disponibilidad continua del servicio ni la exactitud de los listados de propiedades.'
                : 'Viventi acts as a technology intermediary and assumes no liability for transactions between buyers and agents. We do not guarantee continuous service availability or the accuracy of property listings.'}
            </p>
          </section>

          {/* Modifications */}
          <section>
            <h2 className="font-display text-2xl font-bold text-secondary-900 mb-4">
              {isSpanish ? '8. Modificaciones' : '8. Modifications'}
            </h2>
            <p className="text-secondary-600 leading-relaxed">
              {isSpanish
                ? 'Nos reservamos el derecho de modificar estos t\u00e9rminos en cualquier momento. Los cambios ser\u00e1n efectivos al publicarse en esta p\u00e1gina. El uso continuado de la plataforma constituye la aceptaci\u00f3n de los t\u00e9rminos modificados.'
                : 'We reserve the right to modify these terms at any time. Changes will be effective upon posting on this page. Continued use of the platform constitutes acceptance of the modified terms.'}
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="font-display text-2xl font-bold text-secondary-900 mb-4">
              {isSpanish ? '9. Ley Aplicable' : '9. Governing Law'}
            </h2>
            <p className="text-secondary-600 leading-relaxed">
              {isSpanish
                ? 'Estos t\u00e9rminos se rigen por las leyes de la Rep\u00fablica Bolivariana de Venezuela. Cualquier disputa ser\u00e1 sometida a los tribunales competentes de Venezuela.'
                : 'These terms are governed by the laws of the Bolivarian Republic of Venezuela. Any dispute shall be submitted to the competent courts of Venezuela.'}
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="font-display text-2xl font-bold text-secondary-900 mb-4">
              {isSpanish ? '10. Contacto' : '10. Contact'}
            </h2>
            <p className="text-secondary-600 leading-relaxed">
              {isSpanish
                ? 'Para consultas sobre estos t\u00e9rminos, cont\u00e1ctenos en:'
                : 'For inquiries about these terms, contact us at:'}
            </p>
            <p className="mt-2">
              <a href="mailto:info@venezuelaestates.com" className="text-primary-600 hover:underline">
                info@venezuelaestates.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
