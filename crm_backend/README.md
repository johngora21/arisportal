# CRM Backend - Complete Python Flask API

A comprehensive Customer Relationship Management (CRM) backend built with Python Flask, MySQL, and JWT authentication.

## 🏗️ **Database Architecture**

### **Well-Organized MySQL Schema:**

#### **Core Tables:**
- **`users`** - User authentication and management
- **`contacts`** - Customer/lead information
- **`deals`** - Sales opportunities and pipeline
- **`deal_items`** - Product/service line items
- **`communications`** - All customer interactions
- **`notes`** - General notes and comments
- **`activities`** - System activity logging
- **`tags`** - Flexible tagging system
- **`contact_tags`** - Contact-tag relationships
- **`deal_tags`** - Deal-tag relationships

#### **Analytics Views:**
- **`sales_pipeline`** - Pipeline analysis view
- **`contact_activity_summary`** - Contact activity metrics
- **`monthly_sales_performance`** - Monthly sales data

## 🚀 **Features**

### **Authentication & Authorization:**
- JWT-based authentication
- Role-based access control (admin, manager, sales_rep, viewer)
- Password hashing with bcrypt
- User profile management

### **Contact Management:**
- Complete contact profiles
- Lead scoring system
- Status tracking (lead, prospect, customer, etc.)
- Source tracking
- Tag system for organization
- Search and filtering

### **Deal Management:**
- Sales pipeline tracking
- Deal stages and probability
- Product/service line items
- Value calculations
- Close date tracking
- Deal closure (won/lost)

### **Communication Tracking:**
- Multiple communication types (email, phone, meeting, etc.)
- Scheduled communications
- Follow-up reminders
- Outcome tracking
- Activity logging

### **Analytics & Reporting:**
- Dashboard metrics
- Sales performance analysis
- Pipeline analysis
- Activity analytics
- Conversion rate tracking

## 📁 **Project Structure**

```
crm_backend/
├── app.py                 # Main Flask application
├── config.py              # Configuration management
├── init_crm_db.py         # Database initialization
├── requirements.txt       # Python dependencies
├── start_crm_backend.sh   # Startup script
├── models/                # Database models
│   ├── user.py
│   ├── contact.py
│   ├── deal.py
│   ├── communication.py
│   └── tag.py
└── routes/                # API routes
    ├── auth.py
    ├── contacts.py
    ├── deals.py
    ├── communications.py
    ├── analytics.py
    └── tags.py
```

## 🛠️ **Setup Instructions**

### **1. Prerequisites:**
- Python 3.8+
- MySQL 8.0+
- Git

### **2. Installation:**

```bash
# Clone the repository
cd /Users/escobar/arisportal/crm_backend

# Make startup script executable
chmod +x start_crm_backend.sh

# Run the startup script
./start_crm_backend.sh
```

### **3. Environment Configuration:**

Create a `.env` file with your database credentials:

```env
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/arisportal_crm
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=arisportal_crm
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret
CORS_ORIGINS=http://localhost:3002
```

## 📡 **API Endpoints**

### **Authentication:**
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user
- `PUT /api/v1/auth/profile` - Update profile
- `POST /api/v1/auth/change-password` - Change password

### **Contacts:**
- `GET /api/v1/contacts` - Get all contacts
- `POST /api/v1/contacts` - Create contact
- `GET /api/v1/contacts/{id}` - Get contact
- `PUT /api/v1/contacts/{id}` - Update contact
- `DELETE /api/v1/contacts/{id}` - Delete contact
- `POST /api/v1/contacts/{id}/tags` - Add tag
- `DELETE /api/v1/contacts/{id}/tags/{tag_id}` - Remove tag

### **Deals:**
- `GET /api/v1/deals` - Get all deals
- `POST /api/v1/deals` - Create deal
- `GET /api/v1/deals/{id}` - Get deal
- `PUT /api/v1/deals/{id}` - Update deal
- `DELETE /api/v1/deals/{id}` - Delete deal
- `POST /api/v1/deals/{id}/items` - Add deal item
- `PUT /api/v1/deals/{id}/items/{item_id}` - Update item
- `DELETE /api/v1/deals/{id}/items/{item_id}` - Delete item
- `POST /api/v1/deals/{id}/close` - Close deal

### **Communications:**
- `GET /api/v1/communications` - Get communications
- `POST /api/v1/communications` - Create communication
- `POST /api/v1/communications/notes` - Create note
- `GET /api/v1/communications/scheduled` - Get scheduled
- `GET /api/v1/communications/follow-ups` - Get follow-ups

### **Analytics:**
- `GET /api/v1/analytics/dashboard` - Dashboard metrics
- `GET /api/v1/analytics/sales-performance` - Sales performance
- `GET /api/v1/analytics/pipeline-analysis` - Pipeline analysis
- `GET /api/v1/analytics/activities` - Activity analytics

### **Tags:**
- `GET /api/v1/tags` - Get all tags
- `POST /api/v1/tags` - Create tag
- `PUT /api/v1/tags/{id}` - Update tag
- `DELETE /api/v1/tags/{id}` - Delete tag

## 🔒 **Security Features**

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt for password security
- **Role-Based Access** - Granular permissions
- **Input Validation** - Email format validation
- **SQL Injection Protection** - SQLAlchemy ORM
- **CORS Configuration** - Cross-origin security

## 📊 **Database Features**

- **Indexed Fields** - Optimized queries
- **Foreign Key Constraints** - Data integrity
- **Cascade Deletes** - Clean data removal
- **Generated Columns** - Automatic calculations
- **JSON Fields** - Flexible data storage
- **Analytics Views** - Pre-computed metrics

## 🚀 **Running the Backend**

```bash
# Start the backend
./start_crm_backend.sh

# Or manually:
source venv/bin/activate
python app.py
```

The API will be available at `http://localhost:5000`

## 🔧 **Development**

- **Hot Reload** - Automatic restart on changes
- **Debug Mode** - Detailed error messages
- **Database Migrations** - Schema versioning
- **Activity Logging** - Complete audit trail

This CRM backend provides a solid foundation for managing customer relationships with a well-organized database structure and comprehensive API endpoints.
