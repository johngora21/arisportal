from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey, Enum, Date, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from database import Base

class EmploymentStatus(enum.Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    TERMINATED = "terminated"
    ON_LEAVE = "on_leave"

class EmploymentType(enum.Enum):
    FULL_TIME = "full_time"
    PART_TIME = "part_time"
    CONTRACT = "contract"
    INTERN = "intern"

class MaritalStatus(enum.Enum):
    SINGLE = "single"
    MARRIED = "married"
    DIVORCED = "divorced"
    WIDOWED = "widowed"

class Gender(enum.Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"

class Branch(Base):
    __tablename__ = "branches"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    address = Column(Text)
    city = Column(String(50))
    state = Column(String(50))
    country = Column(String(50))
    postal_code = Column(String(20))
    phone = Column(String(20))
    email = Column(String(100))
    manager = Column(String(100))  # Manager name
    manager_id = Column(Integer, ForeignKey("staff.id"))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    staff = relationship("Staff", back_populates="branch", foreign_keys="Staff.branch_id")
    departments = relationship("Department", back_populates="branch")

class Department(Base):
    __tablename__ = "departments"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    branch_id = Column(Integer, ForeignKey("branches.id"), nullable=False)
    manager = Column(String(100))  # Manager name
    manager_id = Column(Integer, ForeignKey("staff.id"))
    phone = Column(String(20))  # Department phone
    email = Column(String(100))  # Department email
    objectives = Column(Text)  # Department objectives (JSON string)
    budget = Column(Float, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    branch = relationship("Branch", back_populates="departments")
    staff = relationship("Staff", back_populates="department", foreign_keys="Staff.department_id")
    roles = relationship("Role", back_populates="department")

class Role(Base):
    __tablename__ = "roles"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    level = Column(String(50))  # Senior, Junior, Manager
    reports_to = Column(String(100))  # Reports To
    status = Column(String(20), default='active')  # Active/Inactive
    experience_required = Column(String(100))  # Experience Required
    education_required = Column(String(100))  # Education Required
    key_skills = Column(Text)  # Key Skills (JSON string)
    min_salary = Column(Float, default=0)
    max_salary = Column(Float, default=0)
    responsibilities = Column(Text)
    requirements = Column(Text)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    department = relationship("Department", back_populates="roles")
    staff = relationship("Staff", back_populates="role", foreign_keys="Staff.role_id")

class Staff(Base):
    __tablename__ = "staff"
    
    # Basic Information
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String(20), unique=True, nullable=True, index=True)
    employee_number = Column(String(20), unique=True, nullable=True)
    
    # Personal Information
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    middle_name = Column(String(50))
    date_of_birth = Column(Date)
    gender = Column(Enum(Gender))
    national_id = Column(String(50), unique=True)
    marital_status = Column(Enum(MaritalStatus))
    blood_group = Column(String(10))
    
    # Contact Information
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(String(20), nullable=False)
    alternative_phone = Column(String(20))
    
    # Address Information
    address_full = Column(Text)
    address_city = Column(String(50))
    address_state = Column(String(50))
    address_country = Column(String(50))
    address_postal_code = Column(String(20))
    
    # Emergency Contacts
    emergency_contact_name = Column(String(100))
    emergency_contact_relationship = Column(String(50))
    emergency_contact_phone = Column(String(20))
    emergency_contact2_name = Column(String(100))
    emergency_contact2_relationship = Column(String(50))
    emergency_contact2_phone = Column(String(20))
    
    # Social Media
    linkedin_url = Column(String(200))
    twitter_url = Column(String(200))
    instagram_url = Column(String(200))
    
    # Employment Information
    branch_id = Column(Integer, ForeignKey("branches.id"), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=False)
    role_id = Column(Integer, ForeignKey("roles.id"), nullable=False)
    employment_type = Column(Enum(EmploymentType), nullable=False)
    employment_status = Column(Enum(EmploymentStatus), default=EmploymentStatus.ACTIVE)
    hire_date = Column(Date, nullable=False)
    probation_end_date = Column(Date)
    contract_end_date = Column(Date)
    reporting_manager_id = Column(Integer, ForeignKey("staff.id"))
    work_location = Column(String(100))
    
    # Salary Information
    basic_salary = Column(Float, nullable=False)
    allowances = Column(Float, default=0)
    total_package = Column(Float, nullable=False)
    
    # Banking Information
    bank_name = Column(String(100))
    bank_account = Column(String(50))
    tax_id = Column(String(50))
    
    # Performance & Benefits
    last_review_date = Column(Date)
    next_review_date = Column(Date)
    benefits = Column(JSON)  # Array of benefits
    
    # Performance Information
    performance_rating = Column(String(20))
    technical_skills = Column(Text)
    languages = Column(Text)
    certifications = Column(JSON)  # Array of certification objects
    
    # Attendance Information
    work_schedule = Column(String(50))
    holiday_entitlement = Column(Integer, default=21)
    annual_leave_balance = Column(Integer, default=21)
    sick_leave_balance = Column(Integer, default=10)
    personal_leave_balance = Column(Integer, default=5)
    maternity_leave_balance = Column(Integer, default=0)
    
    # System Information
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    branch = relationship("Branch", back_populates="staff", foreign_keys=[branch_id])
    department = relationship("Department", back_populates="staff", foreign_keys=[department_id])
    role = relationship("Role", back_populates="staff", foreign_keys=[role_id])
    reporting_manager = relationship("Staff", remote_side=[id], foreign_keys=[reporting_manager_id])
    payroll_records = relationship("PayrollRecord", back_populates="staff")

class PayrollRecord(Base):
    __tablename__ = "payroll_records"
    
    id = Column(Integer, primary_key=True, index=True)
    staff_id = Column(Integer, ForeignKey("staff.id"), nullable=False)
    payroll_period = Column(String(20), nullable=False)  # Format: YYYY-MM
    pay_date = Column(Date, nullable=False)
    
    # Salary Components
    basic_salary = Column(Float, nullable=False)
    allowances = Column(Float, default=0)
    overtime_pay = Column(Float, default=0)
    bonus = Column(Float, default=0)
    gross_salary = Column(Float, nullable=False)
    
    # Deductions
    paye_tax = Column(Float, default=0)
    sdl_tax = Column(Float, default=0)
    nssf = Column(Float, default=0)
    nhif = Column(Float, default=0)
    pension_contribution = Column(Float, default=0)
    other_deductions = Column(Float, default=0)
    total_deductions = Column(Float, default=0)
    
    # Net Pay
    net_salary = Column(Float, nullable=False)
    
    # Additional Information
    hours_worked = Column(Float, default=0)
    days_worked = Column(Integer, default=0)
    notes = Column(Text)
    
    # Status
    status = Column(String(20), default="pending")  # pending, processed, paid
    processed_at = Column(DateTime)
    paid_at = Column(DateTime)
    
    # System Information
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    staff = relationship("Staff", back_populates="payroll_records")

class PayrollCalculation(Base):
    __tablename__ = "payroll_calculations"
    
    id = Column(Integer, primary_key=True, index=True)
    payroll_period = Column(String(20), nullable=False)
    branch_id = Column(Integer, ForeignKey("branches.id"))
    
    # Totals
    total_employees = Column(Integer, default=0)
    total_gross_salary = Column(Float, default=0)
    total_deductions = Column(Float, default=0)
    total_net_salary = Column(Float, default=0)
    
    # Tax Breakdown
    total_paye_tax = Column(Float, default=0)
    total_sdl_tax = Column(Float, default=0)
    total_nssf = Column(Float, default=0)
    total_nhif = Column(Float, default=0)
    
    # Status
    status = Column(String(20), default="draft")  # draft, calculated, approved, processed
    calculated_at = Column(DateTime)
    approved_at = Column(DateTime)
    processed_at = Column(DateTime)
    
    # System Information
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    branch = relationship("Branch")
