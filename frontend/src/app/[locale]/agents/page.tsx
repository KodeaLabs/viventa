import { api } from '../../../lib/api';
import Link from 'next/link';
import {
  MapPinIcon,
  BuildingOffice2Icon,
  CheckBadgeIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import type { AgentListItem, AgentType } from '@/types';

interface AgentsPageProps {
  params: { locale: string };
  searchParams: {
    agent_type?: AgentType;
    city?: string;
    search?: string;
  };
}

function AgentCard({ agent, locale }: { agent: AgentListItem; locale: string }) {
  const getAgentTypeLabel = (type: AgentType) => {
    const labels: Record<string, string> = {
      individual: locale === 'en' ? 'Realtor' : 'Agente',
      company: locale === 'en' ? 'Company' : 'Empresa',
    };
    return labels[type] || type;
  };

  return (
    <Link
      href={agent.slug ? `/${locale}/agents/${agent.slug}` : '#'}
      className="block bg-white rounded-xl shadow-sm border border-secondary-100 hover:shadow-md transition-all duration-200 overflow-hidden group"
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          {/* Avatar/Logo */}
          <div className="flex-shrink-0">
            {agent.logo ? (
              <img
                src={agent.logo}
                alt={agent.display_name}
                className="w-16 h-16 rounded-lg object-cover"
              />
            ) : agent.avatar || agent.avatar_url ? (
              <img
                src={agent.avatar || agent.avatar_url || ''}
                alt={agent.display_name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-600">
                  {agent.display_name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg text-secondary-900 truncate group-hover:text-primary-600 transition-colors">
                {agent.display_name}
              </h3>
              {agent.is_verified_agent && (
                <CheckBadgeIcon className="w-5 h-5 text-primary-500 flex-shrink-0" />
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-secondary-500 mb-2">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                agent.agent_type === 'company'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-secondary-100 text-secondary-700'
              }`}>
                {getAgentTypeLabel(agent.agent_type)}
              </span>
              <span className="flex items-center gap-1">
                <MapPinIcon className="w-4 h-4" />
                {agent.location_display}
              </span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <BuildingOffice2Icon className="w-4 h-4 text-secondary-400" />
                <span className="text-secondary-600">
                  {agent.active_listings_count || agent.total_listings}{' '}
                  {locale === 'en' ? 'listings' : 'propiedades'}
                </span>
              </div>
              {agent.total_sales > 0 && (
                <div className="flex items-center gap-1">
                  <CheckCircleIcon className="w-4 h-4 text-emerald-500" />
                  <span className="text-secondary-600">
                    {agent.total_sales}{' '}
                    {locale === 'en' ? 'sales' : 'ventas'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default async function AgentsPage({
  params: { locale },
  searchParams,
}: AgentsPageProps) {
  // Fetch agents
  let agents: AgentListItem[] = [];
  let meta = null;

  try {
    const response = await api.getAgents({
      agent_type: searchParams.agent_type,
      city: searchParams.city,
      search: searchParams.search,
    });
    agents = response.data || [];
    meta = (response as any).meta;
  } catch (error) {
    console.error('Failed to fetch agents:', error);
  }

  const title = locale === 'en' ? 'Real Estate Agents & Companies' : 'Agentes y Empresas Inmobiliarias';
  const subtitle = locale === 'en'
    ? 'Find trusted real estate professionals across Venezuela'
    : 'Encuentra profesionales inmobiliarios de confianza en toda Venezuela';

  return (
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container-custom py-12">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
            {title}
          </h1>
          <p className="text-primary-100 text-lg">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-secondary-100">
        <div className="container-custom py-4">
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/${locale}/agents`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !searchParams.agent_type
                  ? 'bg-primary-600 text-white'
                  : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
              }`}
            >
              {locale === 'en' ? 'All' : 'Todos'}
            </Link>
            <Link
              href={`/${locale}/agents?agent_type=individual`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                searchParams.agent_type === 'individual'
                  ? 'bg-primary-600 text-white'
                  : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
              }`}
            >
              {locale === 'en' ? 'Individual Agents' : 'Agentes Individuales'}
            </Link>
            <Link
              href={`/${locale}/agents?agent_type=company`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                searchParams.agent_type === 'company'
                  ? 'bg-primary-600 text-white'
                  : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
              }`}
            >
              {locale === 'en' ? 'Companies' : 'Empresas'}
            </Link>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container-custom py-8 md:py-12">
        {meta && (
          <p className="text-secondary-600 mb-6">
            {locale === 'en'
              ? `Showing ${agents.length} professionals`
              : `Mostrando ${agents.length} profesionales`}
          </p>
        )}

        {agents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              {locale === 'en' ? 'No agents found' : 'No se encontraron agentes'}
            </h3>
            <p className="text-secondary-600">
              {locale === 'en'
                ? 'Try adjusting your filters'
                : 'Intenta ajustar tus filtros'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
