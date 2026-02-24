export default function PrivacyPage({
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
            {isSpanish ? 'Pol\u00edtica de Privacidad' : 'Privacy Policy'}
          </h1>
          <p className="text-secondary-300">
            {isSpanish ? '\u00daltima actualizaci\u00f3n: Febrero 2026' : 'Last updated: February 2026'}
          </p>
        </div>
      </div>

      <div className="container-custom py-12 md:py-16">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-card p-8 md:p-12 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="font-display text-2xl font-bold text-secondary-900 mb-4">
              {isSpanish ? 'Introducci\u00f3n' : 'Introduction'}
            </h2>
            <p className="text-secondary-600 leading-relaxed">
              {isSpanish
                ? 'En Viventi ("nosotros", "nuestro"), respetamos su privacidad y nos comprometemos a proteger sus datos personales. Esta pol\u00edtica de privacidad describe c\u00f3mo recopilamos, usamos, almacenamos y protegemos su informaci\u00f3n cuando utiliza nuestra plataforma de bienes ra\u00edces.'
                : 'At Viventi ("we", "our", "us"), we respect your privacy and are committed to protecting your personal data. This privacy policy describes how we collect, use, store, and protect your information when you use our real estate platform.'}
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="font-display text-2xl font-bold text-secondary-900 mb-4">
              {isSpanish ? 'Informaci\u00f3n que Recopilamos' : 'Information We Collect'}
            </h2>
            <div className="space-y-4 text-secondary-600 leading-relaxed">
              <div>
                <h3 className="font-semibold text-secondary-900 mb-2">
                  {isSpanish ? 'Informaci\u00f3n proporcionada por usted' : 'Information you provide'}
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    {isSpanish
                      ? 'Datos de registro: nombre, correo electr\u00f3nico, tel\u00e9fono, pa\u00eds'
                      : 'Registration data: name, email, phone, country'}
                  </li>
                  <li>
                    {isSpanish
                      ? 'Consultas de propiedades: mensajes, m\u00e9todo de contacto preferido'
                      : 'Property inquiries: messages, preferred contact method'}
                  </li>
                  <li>
                    {isSpanish
                      ? 'Informaci\u00f3n de agentes: perfil profesional, licencias, empresa'
                      : 'Agent information: professional profile, licenses, company'}
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900 mb-2">
                  {isSpanish ? 'Informaci\u00f3n recopilada autom\u00e1ticamente' : 'Automatically collected information'}
                </h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    {isSpanish
                      ? 'Datos de uso: p\u00e1ginas visitadas, tiempo en el sitio, b\u00fasquedas realizadas'
                      : 'Usage data: pages visited, time on site, searches performed'}
                  </li>
                  <li>
                    {isSpanish
                      ? 'Informaci\u00f3n t\u00e9cnica: direcci\u00f3n IP, tipo de navegador, dispositivo'
                      : 'Technical information: IP address, browser type, device'}
                  </li>
                  <li>
                    {isSpanish
                      ? 'Cookies y tecnolog\u00edas similares para mejorar la experiencia'
                      : 'Cookies and similar technologies to improve experience'}
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section>
            <h2 className="font-display text-2xl font-bold text-secondary-900 mb-4">
              {isSpanish ? 'C\u00f3mo Usamos su Informaci\u00f3n' : 'How We Use Your Information'}
            </h2>
            <ul className="list-disc list-inside space-y-2 text-secondary-600 leading-relaxed">
              <li>
                {isSpanish
                  ? 'Facilitar la conexi\u00f3n entre compradores y agentes inmobiliarios'
                  : 'Facilitate the connection between buyers and real estate agents'}
              </li>
              <li>
                {isSpanish
                  ? 'Procesar y responder a consultas sobre propiedades'
                  : 'Process and respond to property inquiries'}
              </li>
              <li>
                {isSpanish
                  ? 'Mejorar nuestros servicios y la experiencia del usuario'
                  : 'Improve our services and user experience'}
              </li>
              <li>
                {isSpanish
                  ? 'Enviar comunicaciones relevantes sobre propiedades y servicios'
                  : 'Send relevant communications about properties and services'}
              </li>
              <li>
                {isSpanish
                  ? 'Cumplir con obligaciones legales y regulatorias'
                  : 'Comply with legal and regulatory obligations'}
              </li>
            </ul>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="font-display text-2xl font-bold text-secondary-900 mb-4">
              {isSpanish ? 'Compartici\u00f3n de Datos' : 'Data Sharing'}
            </h2>
            <p className="text-secondary-600 leading-relaxed mb-4">
              {isSpanish
                ? 'No vendemos sus datos personales. Podemos compartir su informaci\u00f3n en los siguientes casos:'
                : 'We do not sell your personal data. We may share your information in the following cases:'}
            </p>
            <ul className="list-disc list-inside space-y-2 text-secondary-600 leading-relaxed">
              <li>
                {isSpanish
                  ? 'Con agentes inmobiliarios cuando usted env\u00eda una consulta sobre una propiedad'
                  : 'With real estate agents when you submit a property inquiry'}
              </li>
              <li>
                {isSpanish
                  ? 'Con proveedores de servicios que nos ayudan a operar la plataforma (alojamiento, autenticaci\u00f3n)'
                  : 'With service providers that help us operate the platform (hosting, authentication)'}
              </li>
              <li>
                {isSpanish
                  ? 'Cuando sea requerido por ley o autoridades competentes'
                  : 'When required by law or competent authorities'}
              </li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="font-display text-2xl font-bold text-secondary-900 mb-4">
              {isSpanish ? 'Seguridad de los Datos' : 'Data Security'}
            </h2>
            <p className="text-secondary-600 leading-relaxed">
              {isSpanish
                ? 'Implementamos medidas t\u00e9cnicas y organizativas para proteger sus datos personales contra acceso no autorizado, p\u00e9rdida o alteraci\u00f3n. Esto incluye cifrado de datos en tr\u00e1nsito, control de acceso y monitoreo regular de seguridad.'
                : 'We implement technical and organizational measures to protect your personal data against unauthorized access, loss, or alteration. This includes data encryption in transit, access control, and regular security monitoring.'}
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="font-display text-2xl font-bold text-secondary-900 mb-4">
              {isSpanish ? 'Sus Derechos' : 'Your Rights'}
            </h2>
            <p className="text-secondary-600 leading-relaxed mb-4">
              {isSpanish
                ? 'Usted tiene derecho a:'
                : 'You have the right to:'}
            </p>
            <ul className="list-disc list-inside space-y-2 text-secondary-600 leading-relaxed">
              <li>{isSpanish ? 'Acceder a sus datos personales' : 'Access your personal data'}</li>
              <li>{isSpanish ? 'Rectificar datos inexactos' : 'Rectify inaccurate data'}</li>
              <li>{isSpanish ? 'Solicitar la eliminaci\u00f3n de sus datos' : 'Request deletion of your data'}</li>
              <li>{isSpanish ? 'Oponerse al procesamiento de sus datos' : 'Object to processing of your data'}</li>
              <li>{isSpanish ? 'Solicitar la portabilidad de sus datos' : 'Request data portability'}</li>
            </ul>
          </section>

          {/* Contact */}
          <section>
            <h2 className="font-display text-2xl font-bold text-secondary-900 mb-4">
              {isSpanish ? 'Contacto' : 'Contact'}
            </h2>
            <p className="text-secondary-600 leading-relaxed">
              {isSpanish
                ? 'Si tiene preguntas sobre esta pol\u00edtica de privacidad o desea ejercer sus derechos, cont\u00e1ctenos en:'
                : 'If you have questions about this privacy policy or wish to exercise your rights, contact us at:'}
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
