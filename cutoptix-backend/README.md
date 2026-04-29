# CutOptiX Backend

## Overview

CutOptiX is a window and door fabrication optimization platform backend built with Django and Django REST Framework. It provides a comprehensive API for managing cutting optimization, project planning, cost analysis, and waste minimization for aluminum/material fabrication businesses.

## Features

- **Project Management**: Create and manage fabrication projects
- **Design Specifications**: Define window/door designs with detailed specifications
- **Cutting Optimization**: Intelligent cutting stock problem solver using First-Fit Decreasing algorithm
- **Material Tracking**: Track material bars, cutting plans, and waste
- **Report Generation**: Generate BOQ, cutting charts, and quotations
- **Analytics**: Comprehensive dashboard with cost and material efficiency analytics
- **Role-Based Access Control**: Admin, Manager, Estimator, Fabricator, and Viewer roles
- **JWT Authentication**: Secure token-based authentication

## Tech Stack

- **Framework**: Django 4.2
- **API**: Django REST Framework
- **Database**: PostgreSQL
- **Cache/Queue**: Redis
- **Async Tasks**: Celery
- **Authentication**: JWT (Simple JWT)
- **Documentation**: Swagger/OpenAPI

## Project Structure

```
cutoptix-backend/
├── config/              # Django configuration
│   ├── settings/       # Environment-based settings
│   ├── urls.py
│   └── wsgi.py
├── apps/
│   ├── accounts/       # User authentication and profiles
│   ├── projects/       # Project management
│   ├── designs/        # Design specifications
│   ├── optimization/   # Cutting optimization algorithm
│   ├── reports/        # Report generation
│   └── analytics/      # Analytics and metrics
├── requirements.txt    # Python dependencies
├── manage.py
└── docker-compose.yml  # Docker configuration
```

## Installation

### Prerequisites

- Python 3.11+
- PostgreSQL 12+
- Redis 6+
- Git

### Local Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cutoptix-backend
   ```

2. **Create virtual environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create .env file**
   ```bash
   cp .env.example .env
   ```

5. **Update .env with your configuration**
   ```
   DEBUG=True
   SECRET_KEY=your-secret-key-here
   DATABASE_URL=postgresql://cutoptix_user:password@localhost:5432/cutoptix
   REDIS_URL=redis://localhost:6379/0
   ```

6. **Create database**
   ```bash
   createdb cutoptix
   createuser cutoptix_user
   ```

7. **Run migrations**
   ```bash
   python manage.py migrate --settings=config.settings.development
   ```

8. **Create superuser**
   ```bash
   python manage.py createsuperuser --settings=config.settings.development
   ```

9. **Run development server**
   ```bash
   python manage.py runserver --settings=config.settings.development
   ```

### Docker Setup

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Run migrations**
   ```bash
   docker-compose exec web python manage.py migrate
   ```

3. **Create superuser**
   ```bash
   docker-compose exec web python manage.py createsuperuser
   ```

4. **Access the application**
   - API: http://localhost:8000/api/v1/
   - Admin: http://localhost:8000/admin/

## API Documentation

### Base URL
```
http://localhost:8000/api/v1/
```

### Authentication

**Login endpoint**: `POST /auth/login/`
```json
{
  "username": "your-username",
  "password": "your-password"
}
```

Response includes `access` and `refresh` tokens. Use the `access` token in the Authorization header:
```
Authorization: Bearer <access-token>
```

### Key Endpoints

#### Projects
- `GET /projects/` - List projects
- `POST /projects/` - Create project
- `GET /projects/{id}/` - Get project details
- `PUT /projects/{id}/` - Update project
- `DELETE /projects/{id}/` - Delete project
- `GET /projects/{id}/stats/` - Get project statistics
- `POST /projects/{id}/notes/` - Add project note

#### Designs
- `GET /projects/{project_id}/designs/` - List designs
- `POST /projects/{project_id}/designs/` - Create design
- `POST /projects/{project_id}/designs/bulk-create/` - Bulk create designs

#### Optimization
- `POST /projects/{project_id}/optimize/` - Run optimization
- `GET /projects/{project_id}/optimization-result/` - Get optimization results
- `GET /projects/{project_id}/cutting-plans/` - List cutting plans
- `POST /projects/{project_id}/material-bars/` - Create material bar

#### Reports
- `GET /projects/{project_id}/reports/` - List reports
- `POST /projects/{project_id}/reports/` - Generate report
- `GET /projects/{project_id}/reports/{id}/download/` - Download report

#### Analytics
- `GET /analytics/dashboard/` - Dashboard analytics
- `GET /analytics/projects/summary/` - Project summary
- `GET /analytics/cost-trend/` - Cost trends
- `GET /analytics/material-efficiency/` - Material efficiency
- `GET /analytics/waste-analysis/` - Waste analysis

## Development

### Running Tests
```bash
pytest
```

### Code Quality
```bash
# Format code
black .

# Lint code
flake8 .

# Type checking
mypy .
```

### Database Migrations
```bash
# Create migrations
python manage.py makemigrations --settings=config.settings.development

# Apply migrations
python manage.py migrate --settings=config.settings.development

# Show migration status
python manage.py showmigrations --settings=config.settings.development
```

## Deployment

### Production Checklist

- [ ] Set `DEBUG=False`
- [ ] Generate secure `SECRET_KEY`
- [ ] Configure `ALLOWED_HOSTS`
- [ ] Set up SSL/HTTPS
- [ ] Configure PostgreSQL with backups
- [ ] Set up Redis for caching
- [ ] Configure email backend (SendGrid, AWS SES, etc.)
- [ ] Set up Celery with supervisor or systemd
- [ ] Configure logging
- [ ] Set up monitoring (Sentry, New Relic, etc.)
- [ ] Configure CDN for static files
- [ ] Set up automated backups

### Environment Variables

See `.env.example` for all required environment variables.

Key production variables:
- `DEBUG` - Set to `False`
- `SECRET_KEY` - Generate a secure key
- `ALLOWED_HOSTS` - List of allowed domains
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `CORS_ALLOWED_ORIGINS` - Frontend URL
- `EMAIL_BACKEND` - Email service provider
- `AWS_*` - AWS credentials for S3 file storage

## Contributing

1. Create a feature branch
2. Make your changes
3. Write tests
4. Submit a pull request

## Support

For issues, questions, or suggestions, please create an issue in the repository.

## License

This project is proprietary and confidential.
