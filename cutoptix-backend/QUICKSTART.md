# Quick Start Guide for CutOptiX Backend

## Setup Instructions

### 1. Prerequisites
- Python 3.11 or higher
- PostgreSQL 12 or higher  
- Redis 6 or higher
- Git

### 2. Installation Steps

#### Option A: Local Development

```bash
# 1. Clone the repository
git clone <repository-url>
cd cutoptix-backend

# 2. Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Copy environment file
cp .env.development .env

# 5. Start PostgreSQL and Redis
# For macOS with Homebrew:
brew services start postgresql
brew services start redis

# 6. Create database
createdb cutoptix
createuser -P cutoptix_user  # Enter password: password

# 7. Apply migrations
python manage.py migrate --settings=config.settings.development

# 8. Create superuser
python manage.py createsuperuser --settings=config.settings.development

# 9. Run development server
python manage.py runserver --settings=config.settings.development
```

Access at: `http://localhost:8000`

#### Option B: Docker

```bash
# 1. Clone the repository
git clone <repository-url>
cd cutoptix-backend

# 2. Build and start containers
docker-compose up -d

# 3. Apply migrations
docker-compose exec web python manage.py migrate

# 4. Create superuser
docker-compose exec web python manage.py createsuperuser

# 5. Access the application
# API: http://localhost:8000/api/v1/
# Admin: http://localhost:8000/admin/
```

### 3. Testing

```bash
# Run all tests
pytest

# Run specific app tests
pytest apps/projects/tests.py

# Run with coverage
pytest --cov=apps --cov-report=html
```

### 4. Initial Data Setup

```bash
# Load sample data
python manage.py loaddata sample_data --settings=config.settings.development

# Or create data via API:
# POST /api/v1/accounts/register/
# POST /api/v1/projects/
# POST /api/v1/projects/{id}/designs/
```

### 5. API Usage Examples

#### Authentication
```bash
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "your-password"}'
```

#### Create Project
```bash
curl -X POST http://localhost:8000/api/v1/projects/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "PRJ-001",
    "name": "Sample Project",
    "client_name": "ABC Corp",
    "budget": 50000.00
  }'
```

#### Add Designs
```bash
curl -X POST http://localhost:8000/api/v1/projects/PRJ-001/designs/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "W-001",
    "width": 1000,
    "height": 1500,
    "typology": "sliding",
    "glass_type": "clear",
    "finish": "anodized",
    "quantity": 2,
    "unit_cost": 100.00
  }'
```

#### Run Optimization
```bash
curl -X POST http://localhost:8000/api/v1/projects/PRJ-001/optimize/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 6. Useful Commands

```bash
# Create migrations
python manage.py makemigrations --settings=config.settings.development

# Apply migrations
python manage.py migrate --settings=config.settings.development

# Collect static files
python manage.py collectstatic --settings=config.settings.development

# Shell
python manage.py shell --settings=config.settings.development

# Start Celery worker
celery -A config worker -l info

# Start Celery beat
celery -A config beat -l info
```

### 7. Troubleshooting

**Port already in use**
```bash
lsof -i :8000  # Find process
kill -9 <PID>  # Kill process
```

**Database connection error**
```bash
# Check PostgreSQL is running
psql -U cutoptix_user -d cutoptix

# Reset migrations
python manage.py migrate --settings=config.settings.development zero apps.projects
```

**Redis connection error**
```bash
# Check Redis is running
redis-cli ping  # Should return PONG

# Reset Redis
redis-cli FLUSHALL
```

### 8. Configuration

Key settings files:
- `config/settings/base.py` - Common settings
- `config/settings/development.py` - Development settings
- `config/settings/production.py` - Production settings
- `.env` - Environment variables

### 9. Documentation

- API Documentation: `http://localhost:8000/api/docs/`
- Admin: `http://localhost:8000/admin/`
- Models: Check individual `models.py` files in each app
- Serializers: Check `serializers.py` in each app

### 10. Next Steps

1. Review the [README.md](README.md) for detailed documentation
2. Check the Django Migration Guide in the frontend repo
3. Set up the frontend (React/Vite) to connect to this backend
4. Configure CORS properly for production
5. Set up email notifications
6. Configure S3 for file storage
7. Set up monitoring and logging

## Support

For issues or questions, refer to the main README.md or check the /docs folder.
