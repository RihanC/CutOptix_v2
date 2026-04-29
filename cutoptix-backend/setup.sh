#!/bin/bash

# Setup script for CutOptiX Django Backend

set -e

echo "========================================="
echo "CutOptiX Django Backend Setup Script"
echo "========================================="

# Check Python version
echo "Checking Python version..."
python_version=$(python3 --version 2>&1 | awk '{print $2}')
echo "Python version: $python_version"

# Create virtual environment
echo ""
echo "Creating virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip

# Install dependencies
echo ""
echo "Installing dependencies..."
pip install -r requirements.txt

# Create .env file if it doesn't exist
echo ""
echo "Setting up environment variables..."
if [ ! -f .env ]; then
    cp .env.development .env
    echo "✓ Created .env file (please update with your settings)"
else
    echo "✓ .env file already exists"
fi

# Check PostgreSQL
echo ""
echo "Checking PostgreSQL..."
if ! command -v psql &> /dev/null; then
    echo "⚠ PostgreSQL not found. Please install PostgreSQL 12+"
    exit 1
fi
echo "✓ PostgreSQL found"

# Check Redis
echo ""
echo "Checking Redis..."
if ! command -v redis-cli &> /dev/null; then
    echo "⚠ Redis not found. Please install Redis 6+"
    exit 1
fi
echo "✓ Redis found"

# Create database
echo ""
echo "Creating database and user..."
createdb cutoptix 2>/dev/null || echo "✓ Database already exists"
psql -U postgres -tc "CREATE USER cutoptix_user WITH PASSWORD 'password'" 2>/dev/null || echo "✓ User already exists"
psql -U postgres -tc "ALTER USER cutoptix_user CREATEDB" 2>/dev/null || true
psql -U postgres -d cutoptix -c "GRANT ALL PRIVILEGES ON DATABASE cutoptix TO cutoptix_user" 2>/dev/null || true

# Run migrations
echo ""
echo "Running migrations..."
python manage.py migrate --settings=config.settings.development

# Create superuser
echo ""
echo "Create superuser..."
python manage.py createsuperuser --settings=config.settings.development

# Collect static files
echo ""
echo "Collecting static files..."
python manage.py collectstatic --noinput --settings=config.settings.development || true

echo ""
echo "========================================="
echo "✓ Setup completed successfully!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Activate virtual environment: source venv/bin/activate"
echo "2. Start development server: python manage.py runserver --settings=config.settings.development"
echo "3. Access API: http://localhost:8000/api/v1/"
echo "4. Access admin: http://localhost:8000/admin/"
echo ""
echo "For more information, see README.md or QUICKSTART.md"
