from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from database import get_db
from models.payroll import Staff, Branch, Department, Role, PayrollRecord, PayrollCalculation, EmploymentStatus, EmploymentType, MaritalStatus, Gender
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

# Pydantic models for request/response
class BranchCreate(BaseModel):
    name: str
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None

class BranchResponse(BaseModel):
    id: int
    name: str
    address: Optional[str]
    city: Optional[str]
    state: Optional[str]
    country: Optional[str]
    postal_code: Optional[str]
    phone: Optional[str]
    email: Optional[str]
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class DepartmentCreate(BaseModel):
    name: str
    description: Optional[str] = None
    branch_id: int
    budget: Optional[float] = 0

class DepartmentResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    branch_id: int
    budget: float
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class RoleCreate(BaseModel):
    name: str
    description: Optional[str] = None
    department_id: int
    min_salary: Optional[float] = 0
    max_salary: Optional[float] = 0
    responsibilities: Optional[str] = None
    requirements: Optional[str] = None

class RoleResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    department_id: int
    min_salary: float
    max_salary: float
    responsibilities: Optional[str]
    requirements: Optional[str]
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class StaffCreate(BaseModel):
    employee_id: str
    employee_number: str
    first_name: str
    last_name: str
    middle_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[Gender] = None
    national_id: Optional[str] = None
    marital_status: Optional[MaritalStatus] = None
    blood_group: Optional[str] = None
    email: str
    phone: str
    alternative_phone: Optional[str] = None
    address_full: Optional[str] = None
    address_city: Optional[str] = None
    address_state: Optional[str] = None
    address_country: Optional[str] = None
    address_postal_code: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_relationship: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    emergency_contact2_name: Optional[str] = None
    emergency_contact2_relationship: Optional[str] = None
    emergency_contact2_phone: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    instagram_url: Optional[str] = None
    branch_id: int
    department_id: int
    role_id: int
    employment_type: EmploymentType
    employment_status: Optional[EmploymentStatus] = EmploymentStatus.ACTIVE
    hire_date: date
    probation_end_date: Optional[date] = None
    contract_end_date: Optional[date] = None
    reporting_manager_id: Optional[int] = None
    work_location: Optional[str] = None
    basic_salary: float
    allowances: Optional[float] = 0
    total_package: float
    bank_name: Optional[str] = None
    bank_account: Optional[str] = None
    tax_id: Optional[str] = None
    last_review_date: Optional[date] = None
    next_review_date: Optional[date] = None
    benefits: Optional[dict] = None
    performance_rating: Optional[str] = None
    technical_skills: Optional[str] = None
    languages: Optional[str] = None
    certifications: Optional[dict] = None
    work_schedule: Optional[str] = None
    holiday_entitlement: Optional[int] = 21
    annual_leave_balance: Optional[int] = 21
    sick_leave_balance: Optional[int] = 10
    personal_leave_balance: Optional[int] = 5
    maternity_leave_balance: Optional[int] = 0

class StaffResponse(BaseModel):
    id: int
    employee_id: str
    employee_number: str
    first_name: str
    last_name: str
    middle_name: Optional[str]
    date_of_birth: Optional[date]
    gender: Optional[Gender]
    national_id: Optional[str]
    marital_status: Optional[MaritalStatus]
    blood_group: Optional[str]
    email: str
    phone: str
    alternative_phone: Optional[str]
    address_full: Optional[str]
    address_city: Optional[str]
    address_state: Optional[str]
    address_country: Optional[str]
    address_postal_code: Optional[str]
    emergency_contact_name: Optional[str]
    emergency_contact_relationship: Optional[str]
    emergency_contact_phone: Optional[str]
    emergency_contact2_name: Optional[str]
    emergency_contact2_relationship: Optional[str]
    emergency_contact2_phone: Optional[str]
    linkedin_url: Optional[str]
    twitter_url: Optional[str]
    instagram_url: Optional[str]
    branch_id: int
    department_id: int
    role_id: int
    employment_type: EmploymentType
    employment_status: EmploymentStatus
    hire_date: date
    probation_end_date: Optional[date]
    contract_end_date: Optional[date]
    reporting_manager_id: Optional[int]
    work_location: Optional[str]
    basic_salary: float
    allowances: float
    total_package: float
    bank_name: Optional[str]
    bank_account: Optional[str]
    tax_id: Optional[str]
    last_review_date: Optional[date]
    next_review_date: Optional[date]
    benefits: Optional[dict]
    performance_rating: Optional[str]
    technical_skills: Optional[str]
    languages: Optional[str]
    certifications: Optional[dict]
    work_schedule: Optional[str]
    holiday_entitlement: int
    annual_leave_balance: int
    sick_leave_balance: int
    personal_leave_balance: int
    maternity_leave_balance: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class PayrollProcessRequest(BaseModel):
    payroll_period: str  # Format: YYYY-MM
    branch_id: Optional[int] = None

class PayrollRecordResponse(BaseModel):
    id: int
    staff_id: int
    payroll_period: str
    pay_date: date
    basic_salary: float
    allowances: float
    overtime_pay: float
    bonus: float
    gross_salary: float
    paye_tax: float
    sdl_tax: float
    nssf: float
    nhif: float
    pension_contribution: float
    other_deductions: float
    total_deductions: float
    net_salary: float
    hours_worked: float
    days_worked: int
    notes: Optional[str]
    status: str
    processed_at: Optional[datetime]
    paid_at: Optional[datetime]
    created_at: datetime
    
    class Config:
        from_attributes = True

# Branch endpoints
@router.get("/branches", response_model=List[BranchResponse])
async def get_branches(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all branches with optional search"""
    query = db.query(Branch).filter(Branch.is_active == True)
    
    if search:
        query = query.filter(
            or_(
                Branch.name.ilike(f"%{search}%"),
                Branch.city.ilike(f"%{search}%"),
                Branch.state.ilike(f"%{search}%")
            )
        )
    
    branches = query.offset(skip).limit(limit).all()
    return branches

@router.post("/branches", response_model=BranchResponse)
async def create_branch(branch: BranchCreate, db: Session = Depends(get_db)):
    """Create a new branch"""
    db_branch = Branch(**branch.dict())
    db.add(db_branch)
    db.commit()
    db.refresh(db_branch)
    return db_branch

@router.get("/branches/{branch_id}", response_model=BranchResponse)
async def get_branch(branch_id: int, db: Session = Depends(get_db)):
    """Get a specific branch"""
    branch = db.query(Branch).filter(Branch.id == branch_id).first()
    if not branch:
        raise HTTPException(status_code=404, detail="Branch not found")
    return branch

# Department endpoints
@router.get("/departments", response_model=List[DepartmentResponse])
async def get_departments(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    branch_id: Optional[int] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all departments with optional filtering"""
    query = db.query(Department).filter(Department.is_active == True)
    
    if branch_id:
        query = query.filter(Department.branch_id == branch_id)
    
    if search:
        query = query.filter(Department.name.ilike(f"%{search}%"))
    
    departments = query.offset(skip).limit(limit).all()
    return departments

@router.post("/departments", response_model=DepartmentResponse)
async def create_department(department: DepartmentCreate, db: Session = Depends(get_db)):
    """Create a new department"""
    db_department = Department(**department.dict())
    db.add(db_department)
    db.commit()
    db.refresh(db_department)
    return db_department

# Role endpoints
@router.get("/roles", response_model=List[RoleResponse])
async def get_roles(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    department_id: Optional[int] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all roles with optional filtering"""
    query = db.query(Role).filter(Role.is_active == True)
    
    if department_id:
        query = query.filter(Role.department_id == department_id)
    
    if search:
        query = query.filter(Role.name.ilike(f"%{search}%"))
    
    roles = query.offset(skip).limit(limit).all()
    return roles

@router.post("/roles", response_model=RoleResponse)
async def create_role(role: RoleCreate, db: Session = Depends(get_db)):
    """Create a new role"""
    db_role = Role(**role.dict())
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role

# Staff endpoints
@router.get("/staff", response_model=List[StaffResponse])
async def get_staff(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    branch_id: Optional[int] = None,
    department_id: Optional[int] = None,
    employment_status: Optional[EmploymentStatus] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all staff with optional filtering"""
    query = db.query(Staff).filter(Staff.is_active == True)
    
    if branch_id:
        query = query.filter(Staff.branch_id == branch_id)
    
    if department_id:
        query = query.filter(Staff.department_id == department_id)
    
    if employment_status:
        query = query.filter(Staff.employment_status == employment_status)
    
    if search:
        query = query.filter(
            or_(
                Staff.first_name.ilike(f"%{search}%"),
                Staff.last_name.ilike(f"%{search}%"),
                Staff.email.ilike(f"%{search}%"),
                Staff.employee_id.ilike(f"%{search}%")
            )
        )
    
    staff = query.offset(skip).limit(limit).all()
    return staff

@router.post("/staff", response_model=StaffResponse)
async def create_staff(staff: StaffCreate, db: Session = Depends(get_db)):
    """Create a new staff member"""
    db_staff = Staff(**staff.dict())
    db.add(db_staff)
    db.commit()
    db.refresh(db_staff)
    return db_staff

@router.get("/staff/{staff_id}", response_model=StaffResponse)
async def get_staff_member(staff_id: int, db: Session = Depends(get_db)):
    """Get a specific staff member"""
    staff = db.query(Staff).filter(Staff.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff member not found")
    return staff

# Payroll calculation function
def calculate_payroll(basic_salary: float, allowances: float = 0, overtime_pay: float = 0, bonus: float = 0):
    """Calculate payroll deductions and net salary"""
    gross_salary = basic_salary + allowances + overtime_pay + bonus
    
    # Tax calculations (Kenya rates as example)
    paye_tax = 0
    if gross_salary > 288000:  # Annual threshold
        annual_gross = gross_salary * 12
        if annual_gross <= 288000:
            paye_tax = 0
        elif annual_gross <= 388000:
            paye_tax = (annual_gross - 288000) * 0.1 / 12
        elif annual_gross <= 688000:
            paye_tax = (100000 * 0.1 + (annual_gross - 388000) * 0.25) / 12
        else:
            paye_tax = (100000 * 0.1 + 300000 * 0.25 + (annual_gross - 688000) * 0.3) / 12
    
    # SDL Tax (1.5% of gross salary)
    sdl_tax = gross_salary * 0.015
    
    # NSSF (6% of basic salary, max 2160)
    nssf = min(basic_salary * 0.06, 2160)
    
    # NHIF (based on gross salary brackets)
    nhif = 0
    if gross_salary <= 5999:
        nhif = 150
    elif gross_salary <= 7999:
        nhif = 300
    elif gross_salary <= 11999:
        nhif = 400
    elif gross_salary <= 14999:
        nhif = 500
    elif gross_salary <= 19999:
        nhif = 600
    elif gross_salary <= 24999:
        nhif = 750
    elif gross_salary <= 29999:
        nhif = 850
    elif gross_salary <= 34999:
        nhif = 900
    elif gross_salary <= 39999:
        nhif = 950
    elif gross_salary <= 44999:
        nhif = 1000
    elif gross_salary <= 49999:
        nhif = 1100
    elif gross_salary <= 59999:
        nhif = 1200
    elif gross_salary <= 69999:
        nhif = 1300
    elif gross_salary <= 79999:
        nhif = 1400
    elif gross_salary <= 89999:
        nhif = 1500
    elif gross_salary <= 99999:
        nhif = 1600
    else:
        nhif = 1700
    
    total_deductions = paye_tax + sdl_tax + nssf + nhif
    net_salary = gross_salary - total_deductions
    
    return {
        "gross_salary": gross_salary,
        "paye_tax": paye_tax,
        "sdl_tax": sdl_tax,
        "nssf": nssf,
        "nhif": nhif,
        "total_deductions": total_deductions,
        "net_salary": net_salary
    }

# Payroll processing endpoints
@router.post("/payroll/process")
async def process_payroll(request: PayrollProcessRequest, db: Session = Depends(get_db)):
    """Process payroll for a specific period"""
    # Get all active staff
    query = db.query(Staff).filter(Staff.is_active == True, Staff.employment_status == EmploymentStatus.ACTIVE)
    
    if request.branch_id:
        query = query.filter(Staff.branch_id == request.branch_id)
    
    staff_members = query.all()
    
    payroll_records = []
    total_gross = 0
    total_deductions = 0
    total_net = 0
    
    for staff in staff_members:
        # Calculate payroll for this staff member
        calculation = calculate_payroll(staff.basic_salary, staff.allowances)
        
        # Create payroll record
        payroll_record = PayrollRecord(
            staff_id=staff.id,
            payroll_period=request.payroll_period,
            pay_date=datetime.now().date(),
            basic_salary=staff.basic_salary,
            allowances=staff.allowances,
            gross_salary=calculation["gross_salary"],
            paye_tax=calculation["paye_tax"],
            sdl_tax=calculation["sdl_tax"],
            nssf=calculation["nssf"],
            nhif=calculation["nhif"],
            total_deductions=calculation["total_deductions"],
            net_salary=calculation["net_salary"],
            status="calculated"
        )
        
        db.add(payroll_record)
        payroll_records.append(payroll_record)
        
        total_gross += calculation["gross_salary"]
        total_deductions += calculation["total_deductions"]
        total_net += calculation["net_salary"]
    
    # Create payroll calculation summary
    payroll_calculation = PayrollCalculation(
        payroll_period=request.payroll_period,
        branch_id=request.branch_id,
        total_employees=len(staff_members),
        total_gross_salary=total_gross,
        total_deductions=total_deductions,
        total_net_salary=total_net,
        total_paye_tax=sum(r.paye_tax for r in payroll_records),
        total_sdl_tax=sum(r.sdl_tax for r in payroll_records),
        total_nssf=sum(r.nssf for r in payroll_records),
        total_nhif=sum(r.nhif for r in payroll_records),
        status="calculated",
        calculated_at=datetime.utcnow()
    )
    
    db.add(payroll_calculation)
    db.commit()
    
    return {
        "message": f"Payroll processed for {len(staff_members)} employees",
        "payroll_period": request.payroll_period,
        "total_employees": len(staff_members),
        "total_gross_salary": total_gross,
        "total_deductions": total_deductions,
        "total_net_salary": total_net,
        "payroll_records": len(payroll_records)
    }

@router.get("/payroll/records", response_model=List[PayrollRecordResponse])
async def get_payroll_records(
    payroll_period: Optional[str] = None,
    staff_id: Optional[int] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """Get payroll records with optional filtering"""
    query = db.query(PayrollRecord)
    
    if payroll_period:
        query = query.filter(PayrollRecord.payroll_period == payroll_period)
    
    if staff_id:
        query = query.filter(PayrollRecord.staff_id == staff_id)
    
    records = query.offset(skip).limit(limit).all()
    return records

@router.get("/payroll/summary")
async def get_payroll_summary(
    payroll_period: Optional[str] = None,
    branch_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Get payroll summary statistics"""
    query = db.query(PayrollCalculation)
    
    if payroll_period:
        query = query.filter(PayrollCalculation.payroll_period == payroll_period)
    
    if branch_id:
        query = query.filter(PayrollCalculation.branch_id == branch_id)
    
    calculations = query.all()
    
    if not calculations:
        return {
            "total_employees": 0,
            "total_gross_salary": 0,
            "total_deductions": 0,
            "total_net_salary": 0,
            "total_paye_tax": 0,
            "total_sdl_tax": 0,
            "total_nssf": 0,
            "total_nhif": 0
        }
    
    # Sum up all calculations
    summary = {
        "total_employees": sum(c.total_employees for c in calculations),
        "total_gross_salary": sum(c.total_gross_salary for c in calculations),
        "total_deductions": sum(c.total_deductions for c in calculations),
        "total_net_salary": sum(c.total_net_salary for c in calculations),
        "total_paye_tax": sum(c.total_paye_tax for c in calculations),
        "total_sdl_tax": sum(c.total_sdl_tax for c in calculations),
        "total_nssf": sum(c.total_nssf for c in calculations),
        "total_nhif": sum(c.total_nhif for c in calculations)
    }
    
    return summary
