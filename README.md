# 🛠️ CutOptiX: Intelligent Fabrication & Material Optimization

**CutOptiX** is a comprehensive full-stack platform designed for the window and door fabrication industry. It helps manufacturers optimize material usage, reduce waste, and manage project workflows from design to delivery.

---

## 🚀 Features

### 📐 Project & Design Management
- **Smart Workflows**: Guided flow from Project Creation → Design Specification → Optimization.
- **Detailed Specifications**: Input width, height, typology, glass type, and finish for every unit.
- **INR Support**: Full regional support for Indian Rupee (₹) and metric measurements (mm).

### ⚡ Optimization Engine
- **1D Cutting Stock Optimization**: Intelligent algorithm to map cuts onto standard 6000mm bars.
- **Waste Reduction**: Targeted waste minimization (aiming for <10% waste).
- **Visual Cutting Charts**: Clear visualization of how each bar should be cut.

### 📊 Analytics & Reporting
- **Performance KPIs**: Track total revenue, average project cost, and material efficiency.
- **Professional PDF Export**: Generate comprehensive, print-ready reports with one click.
- **Project Tracking**: Real-time status updates (Pending, In-Progress, Completed).

---

## 🏗️ Technology Stack

### Backend
- **Django 4.2 / DRF**: Robust API and business logic.
- **PostgreSQL**: Reliable relational data storage.
- **Redis & Celery**: Background task processing for heavy optimization logic.

### Frontend
- **React 18 / Vite**: Fast, modern user interface.
- **Tailwind CSS**: Sleek, responsive design.
- **Recharts**: Professional data visualization.
- **Lucide-React**: Beautiful iconography.

---

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/RihanC/CutOptix_v2.git
cd CutOptix_v2
```

### 2. Backend Setup
```bash
cd cutoptix-backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run migrations
python manage.py migrate --settings=config.settings.development

# Create a superuser
python manage.py createsuperuser --settings=config.settings.development

# Start the server
python manage.py runserver --settings=config.settings.development
```

### 3. Frontend Setup
```bash
cd ../CutOptiX
npm install
npm run dev
```

---

## 📸 Screenshots
<<<<<<< HEAD
<img width="1600" height="1036" alt="WhatsApp Image 2026-04-29 at 03 32 14" src="https://github.com/user-attachments/assets/fa4e8d58-58ae-4bdc-bcaf-d9be2050616e" />

=======
*(Add your screenshots here to make it look even better!)*
>>>>>>> a0df8c82a (made changes in login page and added toggle button for dark mode)

---

## 👨‍💻 Author
**Rihan Chougule**
- GitHub: [@RihanC](https://github.com/RihanC)

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.
