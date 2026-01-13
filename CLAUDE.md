# CLAUDE.md - Project Guidelines for Venezuelan Real Estate Platform

## Project Overview

A real estate platform MVP enabling foreigners to purchase properties in Venezuela, with Venezuelan agents managing listings and international buyers browsing and expressing interest.

## Tech Stack

### Backend
- **Framework:** Django 5.x with Django REST Framework
- **Database:** PostgreSQL 15+
- **Cache:** Redis (for session management, caching, rate limiting)
- **Authentication:** Auth0 (Universal Login with social providers)

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS with custom design system
- **UI Pattern:** Atomic Design (atoms, molecules, organisms, templates, pages)
- **i18n:** next-intl for English/Spanish localization

### Infrastructure
- **Containerization:** Docker & Docker Compose
- **Deployment:** Railway-ready configuration
- **CI/CD:** GitHub Actions (optional)

## Architecture Principles

### Backend (Django)

#### App Structure (Clean Architecture)
```
backend/
├── config/                 # Project settings, URLs, WSGI/ASGI
├── apps/
│   ├── accounts/          # User management, Auth0 integration
│   ├── properties/        # Property listings domain
│   ├── inquiries/         # Contact/interest requests
│   └── common/            # Shared utilities, base models
├── api/
│   └── v1/                # API versioning
└── tests/                 # Test suite
```

#### Domain Separation Rules
1. Each Django app should be self-contained with its own models, serializers, views, and tests
2. Cross-app dependencies should go through service layers, not direct model imports
3. Use signals sparingly; prefer explicit service calls
4. Keep views thin; business logic in services

#### Redis Usage
- Cache frequently accessed data (property listings, search results)
- Session storage for authenticated users
- Rate limiting for API endpoints
- Celery task queue backend (future)

```python
# Example Redis cache usage
from django.core.cache import cache

def get_featured_properties():
    cache_key = 'featured_properties'
    data = cache.get(cache_key)
    if data is None:
        data = Property.objects.filter(is_featured=True)[:10]
        cache.set(cache_key, data, timeout=300)  # 5 minutes
    return data
```

### Frontend (Next.js)

#### Atomic Design Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── atoms/         # Buttons, inputs, labels, icons
│   │   ├── molecules/     # Form fields, cards, search bars
│   │   ├── organisms/     # Headers, property grids, forms
│   │   └── templates/     # Page layouts
│   ├── app/               # Next.js App Router pages
│   ├── lib/               # Utilities, API clients, hooks
│   ├── locales/           # i18n translations
│   └── styles/            # Global styles, Tailwind config
```

#### Component Naming
- Use PascalCase for components: `PropertyCard.tsx`
- Use camelCase for utilities: `formatPrice.ts`
- Prefix hooks with 'use': `useProperties.ts`

## Coding Standards

### Python/Django
```python
# Use type hints
def get_property_by_id(property_id: int) -> Property | None:
    return Property.objects.filter(id=property_id).first()

# Use dataclasses or Pydantic for DTOs
@dataclass
class PropertyCreateDTO:
    title: str
    description: str
    price: Decimal

# Explicit service layer
class PropertyService:
    @staticmethod
    def create_property(dto: PropertyCreateDTO, agent: User) -> Property:
        # Business logic here
        pass
```

### TypeScript/React
```typescript
// Use interfaces for props
interface PropertyCardProps {
  property: Property;
  onSelect?: (id: string) => void;
}

// Use functional components with explicit types
export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onSelect }) => {
  // Component implementation
};

// Custom hooks for data fetching
export const useProperties = (filters?: PropertyFilters) => {
  // Hook implementation
};
```

## Testing Requirements

### Backend Tests
- Unit tests for services and utilities
- Integration tests for API endpoints
- Use pytest with pytest-django
- Minimum 80% coverage for business logic

```python
# Example test structure
class TestPropertyService:
    def test_create_property_success(self, db, agent_user):
        dto = PropertyCreateDTO(title="Beach House", ...)
        property = PropertyService.create_property(dto, agent_user)
        assert property.title == "Beach House"
```

### Frontend Tests
- Unit tests for utilities and hooks
- Component tests with React Testing Library
- E2E tests with Playwright (optional for MVP)

```typescript
// Example component test
describe('PropertyCard', () => {
  it('displays property title and price', () => {
    render(<PropertyCard property={mockProperty} />);
    expect(screen.getByText('Beach House')).toBeInTheDocument();
    expect(screen.getByText('$50,000')).toBeInTheDocument();
  });
});
```

## Admin Requirements

Every model must have a corresponding admin configuration with:
1. List display with relevant fields
2. Search fields
3. Filters
4. Ordering
5. Read-only fields where appropriate

```python
@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ['title', 'price', 'agent', 'status', 'created_at']
    list_filter = ['status', 'property_type', 'created_at']
    search_fields = ['title', 'description', 'agent__email']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']
```

## API Design

### Versioning
All API endpoints under `/api/v1/`

### Standard Response Format
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "total": 100
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid property data",
    "details": { ... }
  }
}
```

## Environment Variables

### Backend (.env)
```
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=postgresql://user:pass@localhost:5432/vzla_realestate
REDIS_URL=redis://localhost:6379/0
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_API_IDENTIFIER=https://api.vzla-realestate.com
AUTH0_CLIENT_ID=your-client-id
AUTH0_CLIENT_SECRET=your-client-secret
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_AUTH0_DOMAIN=your-domain.auth0.com
NEXT_PUBLIC_AUTH0_CLIENT_ID=your-client-id
NEXT_PUBLIC_AUTH0_AUDIENCE=https://api.vzla-realestate.com
```

## Git Workflow

### Commit Messages
Use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Adding tests
- `chore:` Maintenance

### Branch Naming
- `feature/property-listings`
- `fix/search-filters`
- `chore/update-dependencies`

## Commands Reference

### Backend
```bash
# Run development server
python manage.py runserver

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run tests
pytest

# Run tests with coverage
pytest --cov=apps --cov-report=html
```

### Frontend
```bash
# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Lint code
npm run lint
```

### Docker
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Run backend commands
docker-compose exec backend python manage.py migrate

# Stop all services
docker-compose down
```

## Deployment (Railway)

### Backend Service
- Build command: `pip install -r requirements.txt`
- Start command: `gunicorn config.wsgi:application`
- Health check: `/api/v1/health/`

### Frontend Service
- Build command: `npm run build`
- Start command: `npm start`

### Required Railway Services
1. PostgreSQL database
2. Redis instance
3. Backend web service
4. Frontend web service

## Performance Considerations

1. Use `select_related` and `prefetch_related` for related objects
2. Paginate all list endpoints (default: 20 items)
3. Cache property listings for 5 minutes
4. Use database indexes on frequently queried fields
5. Optimize images before storage

## Security Checklist

- [ ] CORS properly configured
- [ ] CSRF protection enabled
- [ ] SQL injection prevention (use ORM)
- [ ] XSS prevention (escape user input)
- [ ] Rate limiting on auth endpoints
- [ ] Secure headers configured
- [ ] Environment variables for secrets
- [ ] Auth0 tokens validated on backend
