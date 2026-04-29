"""
CutOptiX Django Backend
A complete REST API for window and door fabrication optimization

Project Structure:
- config/             Django configuration and routing
- apps/               Business logic modules
  - accounts/         User authentication and profiles
  - projects/         Project management
  - designs/          Design specifications
  - optimization/     Cutting optimization algorithm
  - reports/          Report generation
  - analytics/        Metrics and analytics
- manage.py           Django CLI
- requirements.txt    Python dependencies
- docker-compose.yml  Docker stack setup
- Dockerfile          Container image
- setup.sh            Setup automation
- README.md           Complete documentation
- QUICKSTART.md       Quick start guide

Key Features:
✓ JWT Authentication with Role-Based Access Control
✓ RESTful API with 40+ endpoints
✓ Database models for all entities
✓ First-Fit Decreasing optimization algorithm
✓ Async task processing with Celery
✓ Report generation framework
✓ Analytics and metrics computation
✓ Docker support
✓ Comprehensive documentation
✓ Production-ready configuration

Getting Started:
1. Run setup.sh for local development
2. Or use docker-compose for containerized setup
3. Access API at http://localhost:8000/api/v1/
4. Admin panel at http://localhost:8000/admin/

For detailed information, see README.md or QUICKSTART.md
"""
