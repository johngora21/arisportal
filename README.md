# ArisPortal - Complete Business Management System

A comprehensive business management platform with FastAPI backend and Next.js frontend.

## 🏗️ Project Structure

```
arisportal-1/
├── backend/                   # 🚀 FastAPI Backend
│   ├── main.py               # FastAPI application entry point
│   ├── database.py           # Database configuration
│   ├── models/               # SQLAlchemy database models
│   │   ├── payroll.py        # Payroll models (Staff, Branch, etc.)
│   │   ├── crm.py            # CRM models (Contact, Deal, etc.)
│   │   ├── property.py       # Property models
│   │   └── ...               # Other models
│   ├── routers/              # FastAPI route handlers
│   │   ├── payroll.py        # Payroll API endpoints
│   │   ├── crm.py            # CRM API endpoints
│   │   ├── finance.py        # Finance API endpoints
│   │   └── ...               # Other routes
│   ├── requirements_fastapi.txt
│   └── arisportal.db         # SQLite database
├── frontend/                 # 🎨 Next.js Frontend
│   ├── src/
│   │   ├── app/              # Next.js app directory
│   │   │   ├── dashboard/    # Dashboard pages
│   │   │   ├── finance/      # Finance modules
│   │   │   │   └── payroll/  # Payroll system
│   │   │   ├── crm/          # CRM pages
│   │   │   └── ...           # Other modules
│   │   ├── components/       # Shared React components
│   │   ├── config/           # Configuration files
│   │   └── styles/           # CSS styles
│   ├── package.json
│   └── next.config.js
├── start_backend.sh          # Backend startup script
├── start_frontend.sh         # Frontend startup script
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup
```bash
# Make script executable and run
chmod +x start_backend.sh
./start_backend.sh
```
Backend will run on: http://localhost:4001

### Frontend Setup
```bash
# Make script executable and run
chmod +x start_frontend.sh
./start_frontend.sh
```
Frontend will run on: http://localhost:4000

## 📋 Features

### ✅ Payroll System (100% Complete)
- Complete staff management
- Branch and department organization
- Automated payroll processing
- Tax calculation engine (PAYE, SDL, NSSF, NHIF)
- Payroll history and records

### 🔧 CRM System
- Contact management
- Deal tracking
- Communication history

### 💰 Finance Management
- Transaction tracking
- Invoice generation
- Loan management
- Escrow services

### 🏢 Property Management
- Property listings
- Tenant management
- Lease tracking

### 📊 Investment Platform
- Agriculture investments
- Energy projects
- Infrastructure investments

## 🛠️ Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **SQLite** - Database (easily switchable to PostgreSQL/MySQL)
- **Pydantic** - Data validation

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

## 🔗 API Endpoints

### Payroll API
- `GET /api/v1/payroll/branches` - Get all branches
- `GET /api/v1/payroll/departments` - Get all departments
- `GET /api/v1/payroll/roles` - Get all roles
- `GET /api/v1/payroll/staff` - Get all staff
- `POST /api/v1/payroll/process` - Process payroll

### CRM API
- `GET /api/v1/contacts` - Get all contacts
- `GET /api/v1/deals` - Get all deals

## 📝 Development

### Backend Development
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements_fastapi.txt
uvicorn main:app --reload
```

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

## 🎯 Next Steps
- Add authentication system
- Implement real-time notifications
- Add comprehensive testing
- Deploy to production

## 📞 Support
For questions or issues, please contact the development team.
