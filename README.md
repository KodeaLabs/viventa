# Venezuela Estates - Real Estate Platform

A modern real estate platform for Venezuelan properties, enabling international buyers to discover and inquire about properties while Venezuelan agents manage their listings.

## Features

- **Property Listings**: Browse properties with advanced filtering and search
- **Multi-language Support**: Full English and Spanish localization
- **Agent Dashboard**: Agents can create, edit, and manage their property listings
- **Inquiry System**: Potential buyers can submit inquiries directly from property pages
- **Authentication**: Auth0-based authentication with social login support
- **Responsive Design**: Mobile-first, elegant UI built with Tailwind CSS

## Tech Stack

### Backend
- Django 5.x with Django REST Framework
- PostgreSQL database
- Redis for caching and sessions
- Auth0 JWT authentication

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Atomic Design component system
- next-intl for i18n

### Infrastructure
- Docker & Docker Compose
- Railway-ready configuration

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 20+ (for local frontend development)
- Python 3.12+ (for local backend development)

### Using Docker Compose (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/yourusername/venezuelan-real-state.git
cd venezuelan-real-state
```

2. Create environment files:
```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env.local
```

3. Configure Auth0 (optional for basic functionality):
   - Create an Auth0 application at https://auth0.com
   - Update the `.env` files with your Auth0 credentials

4. Start the services:
```bash
docker-compose up -d
```

5. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000/api/v1/
   - API Documentation: http://localhost:8000/api/docs/
   - Admin: http://localhost:8000/admin/

### Local Development

#### Backend
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

#### Frontend
```bash
cd frontend

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local

# Run development server
npm run dev
```

## Project Structure

```
venezuelan-real-state/
├── backend/
│   ├── config/           # Django project settings
│   ├── apps/
│   │   ├── accounts/     # User authentication
│   │   ├── properties/   # Property listings
│   │   ├── inquiries/    # Contact requests
│   │   └── common/       # Shared utilities
│   ├── api/v1/           # API endpoints
│   └── tests/            # Test suite
├── frontend/
│   ├── src/
│   │   ├── app/          # Next.js pages
│   │   ├── components/
│   │   │   ├── atoms/    # Basic UI elements
│   │   │   ├── molecules/# Composed components
│   │   │   ├── organisms/# Complex components
│   │   │   └── templates/# Page layouts
│   │   ├── lib/          # Utilities and API client
│   │   ├── locales/      # i18n translations
│   │   └── types/        # TypeScript types
│   └── public/           # Static assets
├── docker-compose.yml
└── README.md
```

## API Endpoints

### Public
- `GET /api/v1/properties/` - List all active properties
- `GET /api/v1/properties/{slug}/` - Get property details
- `GET /api/v1/properties/featured/` - Get featured properties
- `POST /api/v1/inquiries/` - Submit an inquiry

### Authenticated (Agent)
- `GET /api/v1/agent/properties/` - List agent's properties
- `POST /api/v1/agent/properties/` - Create a property
- `PATCH /api/v1/agent/properties/{id}/` - Update a property
- `DELETE /api/v1/agent/properties/{id}/` - Delete a property
- `GET /api/v1/agent/inquiries/` - List inquiries for agent's properties

### User
- `GET /api/v1/auth/me/` - Get current user
- `PATCH /api/v1/auth/me/` - Update profile
- `POST /api/v1/auth/become-agent/` - Register as agent

## Testing

### Backend
```bash
cd backend
pytest
pytest --cov=apps --cov-report=html
```

### Frontend
```bash
cd frontend
npm test
```

## Deployment (Railway)

1. Create a new Railway project
2. Add services:
   - PostgreSQL
   - Redis
3. Deploy backend:
   - Set build command: `pip install -r requirements.txt`
   - Set start command: `gunicorn config.wsgi:application`
   - Add environment variables from `.env.example`
4. Deploy frontend:
   - Set build command: `npm run build`
   - Set start command: `npm start`
   - Add environment variables from `.env.example`

## Environment Variables

### Backend
| Variable | Description | Default |
|----------|-------------|---------|
| `DEBUG` | Debug mode | `True` |
| `SECRET_KEY` | Django secret key | - |
| `DATABASE_URL` | PostgreSQL connection URL | - |
| `REDIS_URL` | Redis connection URL | - |
| `AUTH0_DOMAIN` | Auth0 domain | - |
| `AUTH0_API_IDENTIFIER` | Auth0 API identifier | - |

### Frontend
| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000/api/v1` |
| `AUTH0_SECRET` | Auth0 session secret | - |
| `AUTH0_BASE_URL` | Application base URL | - |
| `AUTH0_ISSUER_BASE_URL` | Auth0 domain URL | - |
| `AUTH0_CLIENT_ID` | Auth0 client ID | - |
| `AUTH0_CLIENT_SECRET` | Auth0 client secret | - |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
