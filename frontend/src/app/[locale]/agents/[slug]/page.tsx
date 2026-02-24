import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  MapPinIcon,
  HomeIcon,
  ArrowsPointingOutIcon,
  CheckBadgeIcon,
  BuildingOffice2Icon,
} from '@heroicons/react/24/outline';
import { CheckBadgeIcon as CheckBadgeIconSolid } from '@heroicons/react/24/solid';
import { api, formatPrice } from '../../../../lib/api';
import type { AgentProfile, AgentListItem, Property, AgentType } from '@/types';

interface AgentProfilePageProps {
  params: { locale: string; slug: string };
}

function PropertyCard({ property, locale }: { property: Property; locale: string }) {
  return (
    <Link
      href={`/${locale}/properties/${property.slug}`}
      className="block bg-white rounded-xl shadow-sm border border-secondary-100 hover:shadow-md transition-all duration-200 overflow-hidden group"
    >
      <div className="aspect-[4/3] relative overflow-hidden">
        <img
          src={property.main_image || '/placeholder-property.jpg'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {property.is_featured && (
          <span className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-medium px-2 py-1 rounded">
            {locale === 'en' ? 'Featured' : 'Destacado'}
          </span>
        )}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-secondary-900 text-sm font-semibold px-3 py-1 rounded-lg">
          {formatPrice(property.price)}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-secondary-900 mb-1 truncate group-hover:text-primary-600 transition-colors">
          {property.title}
        </h3>
        <p className="text-sm text-secondary-500 mb-2 flex items-center gap-1">
          <MapPinIcon className="w-4 h-4" />
          {property.location_display}
        </p>
        <div className="flex items-center gap-4 text-sm text-secondary-600">
          <span className="flex items-center gap-1">
            <HomeIcon className="w-4 h-4" />
            {property.bedrooms} {locale === 'en' ? 'bd' : 'hab'}
          </span>
          <span className="flex items-center gap-1">
            <HomeIcon className="w-4 h-4" />
            {Math.floor(property.bathrooms)} {locale === 'en' ? 'ba' : 'ba'}
          </span>
          {property.area_sqm && (
            <span className="flex items-center gap-1">
              <ArrowsPointingOutIcon className="w-4 h-4" />
              {property.area_sqm} m²
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function TeamMemberCard({ member, locale }: { member: AgentListItem; locale: string }) {
  return (
    <Link
      href={member.slug ? `/${locale}/agents/${member.slug}` : '#'}
      className="flex items-center gap-4 p-4 bg-secondary-50 rounded-xl hover:bg-secondary-100 transition-colors"
    >
      {member.avatar || member.avatar_url ? (
        <img
          src={member.avatar || member.avatar_url || ''}
          alt={member.display_name}
          className="w-12 h-12 rounded-full object-cover"
        />
      ) : (
        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
          <span className="text-lg font-bold text-primary-600">
            {member.display_name.charAt(0)}
          </span>
        </div>
      )}
      <div>
        <h4 className="font-medium text-secondary-900">{member.display_name}</h4>
        <p className="text-sm text-secondary-500">
          {member.active_listings_count || member.total_listings}{' '}
          {locale === 'en' ? 'listings' : 'propiedades'}
        </p>
      </div>
    </Link>
  );
}

function SocialLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-secondary-600 hover:text-primary-600 transition-colors"
    >
      {icon}
      <span className="text-sm">{label}</span>
    </a>
  );
}

export default async function AgentProfilePage({
  params: { locale, slug },
}: AgentProfilePageProps) {
  let agent: AgentProfile | null = null;

  try {
    const response = await api.getAgentProfile(slug);
    agent = response.data;
  } catch (error) {
    console.error('Failed to fetch agent:', error);
    notFound();
  }

  if (!agent) {
    notFound();
  }

  const getAgentTypeLabel = (type: AgentType) => {
    const labels: Record<string, string> = {
      individual: locale === 'en' ? 'Independent Realtor' : 'Agente Independiente',
      company: locale === 'en' ? 'Real Estate Company' : 'Empresa Inmobiliaria',
    };
    return labels[type] || type;
  };

  const bio = locale === 'es' && agent.bio_es ? agent.bio_es : agent.bio;

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="container-custom py-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar/Logo */}
            <div className="flex-shrink-0">
              {agent.logo ? (
                <img
                  src={agent.logo}
                  alt={agent.display_name}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover bg-white shadow-lg"
                />
              ) : agent.avatar || agent.avatar_url ? (
                <img
                  src={agent.avatar || agent.avatar_url || ''}
                  alt={agent.display_name}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white flex items-center justify-center shadow-lg">
                  <span className="text-4xl font-bold text-primary-600">
                    {agent.display_name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-white">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-display text-3xl md:text-4xl font-bold">
                  {agent.display_name}
                </h1>
                {agent.is_verified_agent && (
                  <div className="bg-white/20 backdrop-blur-sm p-1 rounded-full">
                    <CheckBadgeIconSolid className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-primary-100">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-white">
                  {getAgentTypeLabel(agent.agent_type)}
                </span>
                <span className="flex items-center gap-1">
                  <MapPinIcon className="w-4 h-4" />
                  {agent.location_display}
                </span>
                {agent.founded_year && (
                  <span>
                    {locale === 'en' ? `Since ${agent.founded_year}` : `Desde ${agent.founded_year}`}
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mt-4">
                <div>
                  <div className="text-2xl font-bold">{agent.active_listings_count || agent.total_listings}</div>
                  <div className="text-sm text-primary-200">
                    {locale === 'en' ? 'Active Listings' : 'Propiedades Activas'}
                  </div>
                </div>
                {agent.total_sales > 0 && (
                  <div>
                    <div className="text-2xl font-bold">{agent.total_sales}</div>
                    <div className="text-sm text-primary-200">
                      {locale === 'en' ? 'Properties Sold' : 'Propiedades Vendidas'}
                    </div>
                  </div>
                )}
                {agent.agent_type !== 'individual' && agent.team_size > 1 && (
                  <div>
                    <div className="text-2xl font-bold">{agent.team_size}</div>
                    <div className="text-sm text-primary-200">
                      {locale === 'en' ? 'Team Members' : 'Miembros del Equipo'}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8 md:py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm text-secondary-500 mb-6">
          <Link href={`/${locale}/agents`} className="hover:text-primary-600 transition-colors">
            {locale === 'en' ? 'Agents' : 'Agentes'}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-secondary-900 truncate max-w-xs">{agent.display_name}</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            {bio && (
              <section className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
                <h2 className="font-display text-xl font-bold text-secondary-900 mb-4">
                  {locale === 'en' ? 'About' : 'Acerca de'}
                </h2>
                <p className="text-secondary-600 whitespace-pre-line">{bio}</p>
              </section>
            )}

            {/* Properties */}
            <section>
              <h2 className="font-display text-xl font-bold text-secondary-900 mb-6">
                {locale === 'en' ? 'Properties' : 'Propiedades'}
              </h2>
              {agent.properties && agent.properties.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-6">
                  {agent.properties.map((property) => (
                    <PropertyCard key={property.id} property={property} locale={locale} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-secondary-100">
                  <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BuildingOffice2Icon className="w-8 h-8 text-secondary-400" />
                  </div>
                  <p className="text-secondary-600">
                    {locale === 'en' ? 'No properties listed yet' : 'Aún no hay propiedades listadas'}
                  </p>
                </div>
              )}
            </section>

            {/* Team Members (for companies) */}
            {agent.agent_type !== 'individual' && agent.team_members && agent.team_members.length > 0 && (
              <section className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
                <h2 className="font-display text-xl font-bold text-secondary-900 mb-4">
                  {locale === 'en' ? 'Our Team' : 'Nuestro Equipo'}
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {agent.team_members.map((member) => (
                    <TeamMemberCard key={member.id} member={member} locale={locale} />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
              <h3 className="font-semibold text-lg text-secondary-900 mb-4">
                {locale === 'en' ? 'Contact' : 'Contacto'}
              </h3>

              <div className="space-y-4">
                {agent.phone && (
                  <a
                    href={`tel:${agent.phone}`}
                    className="flex items-center gap-3 text-secondary-600 hover:text-primary-600 transition-colors"
                  >
                    <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <span>{agent.phone}</span>
                  </a>
                )}

                {agent.whatsapp && (
                  <a
                    href={`https://wa.me/${agent.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-secondary-600 hover:text-emerald-600 transition-colors"
                  >
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </div>
                    <span>WhatsApp</span>
                  </a>
                )}

                {agent.website && (
                  <a
                    href={agent.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-secondary-600 hover:text-primary-600 transition-colors"
                  >
                    <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                    <span>{locale === 'en' ? 'Website' : 'Sitio Web'}</span>
                  </a>
                )}
              </div>

              {/* Social Links */}
              {(agent.instagram || agent.facebook || agent.linkedin) && (
                <div className="mt-6 pt-6 border-t border-secondary-100">
                  <h4 className="text-sm font-medium text-secondary-500 mb-3">
                    {locale === 'en' ? 'Social Media' : 'Redes Sociales'}
                  </h4>
                  <div className="flex gap-3">
                    {agent.instagram && (
                      <a
                        href={`https://instagram.com/${agent.instagram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </a>
                    )}
                    {agent.facebook && (
                      <a
                        href={agent.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                        </svg>
                      </a>
                    )}
                    {agent.linkedin && (
                      <a
                        href={agent.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Parent Company Info */}
            {agent.parent_company_info && (
              <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
                <h3 className="text-sm font-medium text-secondary-500 mb-3">
                  {locale === 'en' ? 'Works with' : 'Trabaja con'}
                </h3>
                <Link
                  href={`/${locale}/agents/${agent.parent_company_info.slug}`}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  {agent.parent_company_info.logo ? (
                    <img
                      src={agent.parent_company_info.logo}
                      alt={agent.parent_company_info.display_name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary-600">
                        {agent.parent_company_info.display_name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-secondary-900 flex items-center gap-1">
                      {agent.parent_company_info.display_name}
                      {agent.parent_company_info.is_verified && (
                        <CheckBadgeIconSolid className="w-4 h-4 text-primary-500" />
                      )}
                    </div>
                    <p className="text-sm text-secondary-500">
                      {locale === 'en' ? 'View company profile' : 'Ver perfil de la empresa'}
                    </p>
                  </div>
                </Link>
              </div>
            )}

            {/* License Info */}
            {agent.license_number && (
              <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-6">
                <h3 className="text-sm font-medium text-secondary-500 mb-2">
                  {locale === 'en' ? 'License Number' : 'Número de Licencia'}
                </h3>
                <p className="font-mono text-secondary-900">{agent.license_number}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
