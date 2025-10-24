from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from database import get_db
from models.payroll import Staff, Branch, Department, Role, PayrollRecord, PayrollCalculation, EmploymentStatus, EmploymentType, MaritalStatus, Gender
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date
import logging
import json

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
    employee_id: Optional[str] = None
    employee_number: Optional[str] = None
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
    account_name: Optional[str] = None
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

class SimpleStaffResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: str
    phone: str
    department_name: Optional[str] = None
    role_name: Optional[str] = None
    branch_name: Optional[str] = None
    
    class Config:
        from_attributes = True

class StaffResponse(BaseModel):
    id: int
    employee_id: Optional[str]
    employee_number: Optional[str]
    first_name: str
    last_name: str
    middle_name: Optional[str]
    date_of_birth: Optional[date]
    gender: Optional[str]
    national_id: Optional[str]
    marital_status: Optional[str]
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
    employment_type: Optional[str]
    employment_status: Optional[str]
    hire_date: Optional[date]
    probation_end_date: Optional[date]
    contract_end_date: Optional[date]
    reporting_manager_id: Optional[int]
    work_location: Optional[str]
    basic_salary: float
    allowances: float
    total_package: float
    bank_name: Optional[str]
    bank_account: Optional[str]
    account_name: Optional[str]
    tax_id: Optional[str]
    paye_eligible: Optional[bool]
    allowances_detail: Optional[str]
    social_security: Optional[str]
    insurance: Optional[str]
    loans: Optional[str]
    last_review_date: Optional[date]
    next_review_date: Optional[date]
    benefits: Optional[str]
    performance_rating: Optional[str]
    technical_skills: Optional[str]
    languages: Optional[str]
    certifications: Optional[str]
    documents: Optional[str]
    work_schedule: Optional[str]
    holiday_entitlement: Optional[int]
    leave_status: Optional[str]
    leave_end_date: Optional[date]
    annual_leave_balance: Optional[int]
    sick_leave_balance: Optional[int]
    personal_leave_balance: Optional[int]
    maternity_leave_balance: Optional[int]
    is_active: Optional[bool]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    department_name: Optional[str] = None
    role_name: Optional[str] = None
    branch_name: Optional[str] = None
    
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
@router.get("/branches")
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
    
    # Transform to match frontend expectations
    result = []
    for branch in branches:
        # Count employees in this branch
        employee_count = db.query(Staff).filter(Staff.branch_id == branch.id).count()
        
        result.append({
            "id": str(branch.id),
            "name": branch.name,
            "address": branch.address or "",
            "phone": branch.phone or "",
            "email": branch.email or "",
            "manager": branch.manager or "No Manager",
            "employees": employee_count,
            "status": "active" if branch.is_active else "inactive",
            "establishedDate": branch.created_at.strftime("%Y-%m-%d") if branch.created_at else "",
            "monthlyBudget": 0,  # TODO: Calculate from departments
            "annualBudget": 0,  # TODO: Calculate from departments
            "departments": [],  # TODO: Get actual departments
            "staff": [],  # TODO: Get actual staff
            "attendance": {
                "available": employee_count,
                "onLeave": 0,
                "absent": 0
            }
        })
    
    return result

@router.post("/branches")
async def create_branch(branch_data: dict, db: Session = Depends(get_db)):
    """Create a new branch"""
    print(f"Received branch data: {branch_data}")
    # Filter out fields that don't exist in the Branch model
    valid_fields = {
        'name': branch_data.get('name'),
        'address': branch_data.get('address'),
        'city': branch_data.get('city'),
        'state': branch_data.get('state'),
        'country': branch_data.get('country'),
        'postal_code': branch_data.get('postal_code'),
        'phone': branch_data.get('phone'),
        'email': branch_data.get('email'),
        'manager': branch_data.get('manager')
    }
    
    # Remove None values
    valid_fields = {k: v for k, v in valid_fields.items() if v is not None}
    
    db_branch = Branch(**valid_fields)
    db.add(db_branch)
    db.commit()
    db.refresh(db_branch)
    
    # Return in the format the frontend expects
    return {
        "id": str(db_branch.id),
        "name": db_branch.name,
        "address": db_branch.address or "",
        "phone": db_branch.phone or "",
        "email": db_branch.email or "",
        "manager": db_branch.manager or "No Manager",
        "employees": 0,
        "status": "active" if db_branch.is_active else "inactive",
        "establishedDate": db_branch.created_at.strftime("%Y-%m-%d") if db_branch.created_at else "",
        "monthlyBudget": 0,
        "annualBudget": 0,
        "departments": [],
        "staff": [],
        "attendance": {
            "available": 0,
            "onLeave": 0,
            "absent": 0
        }
    }

@router.get("/branches/{branch_id}", response_model=BranchResponse)
async def get_branch(branch_id: int, db: Session = Depends(get_db)):
    """Get a specific branch"""
    branch = db.query(Branch).filter(Branch.id == branch_id).first()
    if not branch:
        raise HTTPException(status_code=404, detail="Branch not found")
    return branch

# Department endpoints
@router.get("/departments")
async def get_departments(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    branch_id: Optional[int] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all departments with optional filtering"""
    from sqlalchemy.orm import joinedload
    
    query = db.query(Department).filter(Department.is_active == True)
    
    if branch_id:
        query = query.filter(Department.branch_id == branch_id)
    
    if search:
        query = query.filter(Department.name.ilike(f"%{search}%"))
    
    departments = query.offset(skip).limit(limit).all()
    
    # Transform to match frontend expectations
    result = []
    for dept in departments:
        # Get branch name
        branch = db.query(Branch).filter(Branch.id == dept.branch_id).first()
        branch_name = branch.name if branch else f"Branch {dept.branch_id}"
        
        # Get manager name
        manager_name = dept.manager or "No Manager"
        
        result.append({
            "id": str(dept.id),
            "name": dept.name,
            "description": dept.description or "",
            "manager": manager_name,
            "employees": 0,  # TODO: Count actual employees
            "branch": branch_name,
            "branch_id": dept.branch_id,  # Add branch_id for frontend filtering
            "status": "active" if dept.is_active else "inactive",
            "phone": dept.phone or "",
            "email": dept.email or "",
            "establishedDate": dept.created_at.strftime("%Y-%m-%d") if dept.created_at else "",
            "budget": dept.budget,
            "objectives": json.loads(dept.objectives) if dept.objectives else [],
            "teamMembers": []  # TODO: Get actual team members
        })
    
    return result

@router.post("/departments")
async def create_department(department_data: dict, db: Session = Depends(get_db)):
    """Create a new department"""
    print(f"Received department data: {department_data}")
    
    # Handle branch name to branch_id conversion
    branch_id = None
    if 'branch' in department_data:
        # Find branch by name (case insensitive and trim whitespace)
        branch_name = department_data['branch'].strip()
        branch = db.query(Branch).filter(Branch.name.ilike(f"%{branch_name}%")).first()
        if branch:
            branch_id = branch.id
            print(f"Found branch '{branch.name}' with ID {branch_id}")
        else:
            # If branch not found, use first available branch
            first_branch = db.query(Branch).first()
            branch_id = first_branch.id if first_branch else 1
            print(f"Branch '{branch_name}' not found, using branch ID {branch_id}")
    
    # Filter out fields that don't exist in the Department model
    valid_fields = {
        'name': department_data.get('name'),
        'description': department_data.get('description'),
        'branch_id': branch_id or department_data.get('branch_id'),
        'manager': department_data.get('manager'),
        'phone': department_data.get('phone'),
        'email': department_data.get('email'),
        'objectives': json.dumps(department_data.get('objectives', [])) if department_data.get('objectives') else None,
        'budget': department_data.get('budget', 0)
    }
    
    # Remove None values
    valid_fields = {k: v for k, v in valid_fields.items() if v is not None}
    
    db_department = Department(**valid_fields)
    db.add(db_department)
    db.commit()
    db.refresh(db_department)
    
    # Return in the format the frontend expects
    return {
        "id": str(db_department.id),
        "name": db_department.name,
        "description": db_department.description or "",
        "manager": db_department.manager or "No Manager",
        "employees": 0,
        "branch": department_data.get('branch') or "Unknown Branch",
        "status": "active" if db_department.is_active else "inactive",
        "phone": db_department.phone or "",
        "email": db_department.email or "",
        "establishedDate": db_department.created_at.strftime("%Y-%m-%d") if db_department.created_at else "",
        "budget": db_department.budget or 0,
        "objectives": json.loads(db_department.objectives) if db_department.objectives else [],
        "teamMembers": []
    }

# Role endpoints
@router.get("/roles")
async def get_roles(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    department_id: Optional[int] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get all roles with optional filtering"""
    try:
        query = db.query(Role).filter(Role.is_active == True)
        
        if department_id:
            query = query.filter(Role.department_id == department_id)
        
        if search:
            query = query.filter(Role.name.ilike(f"%{search}%"))
        
        roles = query.offset(skip).limit(limit).all()
        
        # Transform to match frontend expectations
        result = []
        for role in roles:
            try:
                # Get department name
                department = db.query(Department).filter(Department.id == role.department_id).first()
                department_name = department.name if department else f"Department {role.department_id}"
                
                # Get branch name from department
                branch_name = "Unknown Branch"
                if department and department.branch_id:
                    branch = db.query(Branch).filter(Branch.id == department.branch_id).first()
                    branch_name = branch.name if branch else f"Branch {department.branch_id}"
                
                # Safely parse JSON fields
                key_skills = []
                responsibilities = []
                requirements = []
                
                if role.key_skills:
                    try:
                        key_skills = json.loads(role.key_skills)
                    except json.JSONDecodeError:
                        print(f"Warning: Invalid JSON in key_skills for role {role.id}: {role.key_skills}")
                        key_skills = []
                
                if role.responsibilities:
                    try:
                        responsibilities = json.loads(role.responsibilities)
                    except json.JSONDecodeError:
                        print(f"Warning: Invalid JSON in responsibilities for role {role.id}: {role.responsibilities}")
                        responsibilities = []
                
                if role.requirements:
                    try:
                        requirements = json.loads(role.requirements)
                    except json.JSONDecodeError:
                        print(f"Warning: Invalid JSON in requirements for role {role.id}: {role.requirements}")
                        requirements = []
                
                result.append({
                    "id": str(role.id),
                    "name": role.name,
                    "description": role.description or "",
                    "department": department_name,
                    "department_id": role.department_id,  # Add department_id for frontend filtering
                    "level": role.level or "Mid",
                    "branch": branch_name,
                    "branch_id": department.branch_id if department else None,  # Add branch_id for frontend
                    "reports_to": role.reports_to or "",
                    "status": role.status or "active",
                    "experience_required": role.experience_required or "",
                    "education_required": role.education_required or "",
                    "key_skills": key_skills,
                    "minSalary": role.min_salary or 0,
                    "maxSalary": role.max_salary or 0,
                    "responsibilities": responsibilities,
                    "requirements": requirements,
                    "createdDate": role.created_at.strftime("%Y-%m-%d") if role.created_at else "",
                    "employees": 0  # TODO: Count actual employees
                })
            except Exception as e:
                print(f"Error processing role {role.id}: {str(e)}")
                # Skip this role and continue with others
                continue
        
        return result
    
    except Exception as e:
        print(f"Error fetching roles: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching roles: {str(e)}")

@router.post("/roles")
async def create_role(role_data: dict, db: Session = Depends(get_db)):
    """Create a new role"""
    print(f"Received role data: {role_data}")
    
    # Handle department name to department_id conversion
    department_id = None
    if 'department' in role_data:
        # Find department by name (case insensitive and trim whitespace)
        department_name = role_data['department'].strip()
        department = db.query(Department).filter(Department.name.ilike(f"%{department_name}%")).first()
        if department:
            department_id = department.id
            print(f"Found department '{department.name}' with ID {department_id}")
        else:
            # If department not found, use first available department
            first_department = db.query(Department).first()
            department_id = first_department.id if first_department else 1
            print(f"Department '{department_name}' not found, using department ID {department_id}")
    
    # Filter out fields that don't exist in the Role model
    valid_fields = {
        'name': role_data.get('title') or role_data.get('name'),  # Frontend sends 'title'
        'description': role_data.get('description'),
        'department_id': department_id or role_data.get('department_id'),
        'level': role_data.get('level'),
        'reports_to': role_data.get('reports_to'),
        'status': role_data.get('status', 'active'),
        'experience_required': role_data.get('experience_required'),
        'education_required': role_data.get('education_required'),
        'key_skills': json.dumps(role_data.get('key_skills', [])) if role_data.get('key_skills') else None,
        'min_salary': role_data.get('min_salary', 0),
        'max_salary': role_data.get('max_salary', 0),
        'responsibilities': json.dumps(role_data.get('responsibilities', [])) if role_data.get('responsibilities') else None,
        'requirements': json.dumps(role_data.get('requirements', [])) if role_data.get('requirements') else None
    }
    
    # Remove None values
    valid_fields = {k: v for k, v in valid_fields.items() if v is not None}
    
    db_role = Role(**valid_fields)
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    
    # Return in the format the frontend expects
    return {
        "id": str(db_role.id),
        "name": db_role.name,
        "description": db_role.description or "",
        "department": role_data.get('department') or "Unknown Department",
        "level": db_role.level or role_data.get('level') or "Mid",
        "branch": role_data.get('branch') or "Unknown Branch",
        "reports_to": db_role.reports_to or "",
        "status": db_role.status or "active",
        "experience_required": db_role.experience_required or "",
        "education_required": db_role.education_required or "",
        "key_skills": json.loads(db_role.key_skills) if db_role.key_skills else [],
        "minSalary": db_role.min_salary or 0,
        "maxSalary": db_role.max_salary or 0,
        "responsibilities": json.loads(db_role.responsibilities) if db_role.responsibilities else [],
        "requirements": json.loads(db_role.requirements) if db_role.requirements else [],
        "createdDate": role_data.get('created_date') or (db_role.created_at.strftime("%Y-%m-%d") if db_role.created_at else ""),
        "employees": 0  # TODO: Count actual employees
    }

@router.put("/roles/{role_id}")
async def update_role(role_id: int, role_data: dict, db: Session = Depends(get_db)):
    """Update an existing role"""
    print(f"Updating role {role_id} with data: {role_data}")
    
    try:
        # Find the role
        role = db.query(Role).filter(Role.id == role_id).first()
        if not role:
            raise HTTPException(status_code=404, detail="Role not found")
        
        # Handle department_id if provided
        if 'department_id' in role_data:
            # Convert to integer and validate that the department exists
            try:
                dept_id = int(role_data['department_id'])
                department = db.query(Department).filter(Department.id == dept_id).first()
                if not department:
                    raise HTTPException(status_code=400, detail=f"Department with ID {dept_id} not found")
                role_data['department_id'] = dept_id
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid department ID format")
        elif 'department' in role_data:
            # Handle department name to department_id conversion if provided (legacy support)
            department = db.query(Department).filter(Department.name == role_data['department']).first()
            if department:
                role_data['department_id'] = department.id
            del role_data['department']  # Remove the department name from update data
        
        # Handle branch field - for now, get branch from department since roles table doesn't have branch_id yet
        branch_name = "Unknown Branch"
        if 'branch' in role_data:
            try:
                branch_id = int(role_data['branch'])
                # Validate branch exists
                branch = db.query(Branch).filter(Branch.id == branch_id).first()
                if branch:
                    branch_name = branch.name
                del role_data['branch']  # Remove branch from update data since we don't store it
            except ValueError:
                # Invalid branch ID, just ignore it
                del role_data['branch']
        
        # Map frontend field names to backend field names
        field_mapping = {
            'title': 'name',
            'experience': 'experience_required',
            'education': 'education_required',
            'skills': 'key_skills',
            'reportsTo': 'reports_to',
            'salaryMin': 'min_salary',
            'salaryMax': 'max_salary'
        }
        
        # Apply field mapping
        for frontend_field, backend_field in field_mapping.items():
            if frontend_field in role_data:
                role_data[backend_field] = role_data[frontend_field]
                del role_data[frontend_field]
        
        # Update fields (exclude id and other non-updatable fields)
        excluded_fields = ['id', 'created_at', 'updated_at', 'branch']
        for field, value in role_data.items():
            if hasattr(role, field) and value is not None and field not in excluded_fields:
                if field in ['key_skills', 'responsibilities', 'requirements'] and isinstance(value, list):
                    setattr(role, field, json.dumps(value))
                else:
                    setattr(role, field, value)
        
        db.commit()
        db.refresh(role)
        
        # Get department and branch names for response
        department_name = "Unknown Department"
        response_branch_name = "Unknown Branch"
        
        if role.department_id:
            dept = db.query(Department).filter(Department.id == role.department_id).first()
            department_name = dept.name if dept else "Unknown Department"
            
            # Get branch name from department
            if dept and dept.branch_id:
                branch = db.query(Branch).filter(Branch.id == dept.branch_id).first()
                response_branch_name = branch.name if branch else "Unknown Branch"
        
        # Return in the format the frontend expects
        return {
            "id": str(role.id),
            "name": role.name,
            "description": role.description or "",
            "department": department_name,
            "level": role.level or "Mid",
            "branch": response_branch_name,
            "reports_to": role.reports_to or "",
            "status": role.status or "active",
            "experience_required": role.experience_required or "",
            "education_required": role.education_required or "",
            "key_skills": json.loads(role.key_skills) if role.key_skills else [],
            "minSalary": role.min_salary or 0,
            "maxSalary": role.max_salary or 0,
            "responsibilities": json.loads(role.responsibilities) if role.responsibilities else [],
            "requirements": json.loads(role.requirements) if role.requirements else [],
            "createdDate": role.created_at.strftime("%Y-%m-%d") if role.created_at else "",
            "employees": 0
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating role: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error updating role: {str(e)}")

@router.delete("/roles/{role_id}")
async def delete_role(role_id: int, db: Session = Depends(get_db)):
    """Delete a role (soft delete)"""
    print(f"Deleting role {role_id}")
    
    # Find the role
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    
    # Check if role has any staff assigned
    staff_count = db.query(Staff).filter(Staff.role_id == role_id).count()
    if staff_count > 0:
        raise HTTPException(
            status_code=400, 
            detail=f"Cannot delete role. {staff_count} staff members are assigned to this role."
        )
    
    # Soft delete by setting is_active to False
    role.is_active = False
    db.commit()
    
    return {"message": "Role deleted successfully"}

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
    
    # Add names to each staff member
    for member in staff:
        # Get department name
        if member.department_id:
            dept = db.query(Department).filter(Department.id == member.department_id).first()
            member.department_name = dept.name if dept else None
        
        # Get role name
        if member.role_id:
            role = db.query(Role).filter(Role.id == member.role_id).first()
            member.role_name = role.name if role else None
        
        # Get branch name
        if member.branch_id:
            branch = db.query(Branch).filter(Branch.id == member.branch_id).first()
            member.branch_name = branch.name if branch else None
        
        # JSON fields are already stored as strings in the database
        # No need to parse them here as they'll be returned as strings
    
    return staff

@router.post("/staff", response_model=StaffResponse)
async def create_staff(staff_data: dict, db: Session = Depends(get_db)):
    """Create a new staff member"""
    print(f"Received staff data: {staff_data}")
    
    # Map frontend field names to backend field names
    field_mapping = {
        'firstName': 'first_name',
        'lastName': 'last_name',
        'middleName': 'middle_name',
        'dateOfBirth': 'date_of_birth',
        'phone': 'phone',
        'alternativePhone': 'alternative_phone',
        'emergencyContactName1': 'emergency_contact_name',
        'emergencyContactRelationship1': 'emergency_contact_relationship',
        'emergencyContactPhone1': 'emergency_contact_phone',
        'emergencyContactName2': 'emergency_contact2_name',
        'emergencyContactRelationship2': 'emergency_contact2_relationship',
        'emergencyContactPhone2': 'emergency_contact2_phone',
        'linkedin': 'linkedin_url',
        'twitter': 'twitter_url',
        'instagram': 'instagram_url',
        'addressCity': 'address_city',
        'addressState': 'address_state',
        'addressCountry': 'address_country',
        'addressPostalCode': 'address_postal_code',
        'hireDate': 'hire_date',
        'probationEndDate': 'probation_end_date',
        'contractEndDate': 'contract_end_date',
        'basicSalary': 'basic_salary',
        'employmentType': 'employment_type',
        'maritalStatus': 'marital_status',
        'reportingManager': 'reporting_manager_id',
        'department': 'department_id',  # Form sends department as ID
        'branch': 'branch_id',         # Form sends branch as ID
        'position': 'role_id',         # Form sends position as role ID
        'bankName': 'bank_name',
        'bankAccount': 'bank_account',
        'taxId': 'tax_id',
        'workSchedule': 'work_schedule',
        'holidayEntitlement': 'holiday_entitlement',
        'leaveStatus': 'leave_status',
        'leaveEndDate': 'leave_end_date',
        'documents': 'documents'
    }
    
    # Apply field mapping
    mapped_data = {}
    for frontend_field, backend_field in field_mapping.items():
        if frontend_field in staff_data:
            mapped_data[backend_field] = staff_data[frontend_field]
    
    # Add any remaining unmapped fields
    for field, value in staff_data.items():
        if field not in field_mapping:
            mapped_data[field] = value
    
    staff_data = mapped_data
    
    # Auto-generate employee_id and employee_number if not provided
    if 'employee_id' not in staff_data or not staff_data.get('employee_id'):
        # Generate employee_id based on first name and last name initials + timestamp
        first_name = staff_data.get('first_name', '').upper()[:2]
        last_name = staff_data.get('last_name', '').upper()[:2]
        timestamp = str(int(datetime.now().timestamp()))[-4:]
        staff_data['employee_id'] = f"{first_name}{last_name}{timestamp}"
    
    if 'employee_number' not in staff_data or not staff_data.get('employee_number'):
        # Generate employee_number as sequential number
        last_staff = db.query(Staff).order_by(Staff.id.desc()).first()
        next_number = (last_staff.id + 1) if last_staff else 1
        staff_data['employee_number'] = f"EMP{next_number:04d}"
    
    # Set default employment_status if not provided
    if 'employment_status' not in staff_data:
        staff_data['employment_status'] = 'active'
    
    # Set default hire_date if not provided
    if 'hire_date' not in staff_data or not staff_data.get('hire_date'):
        from datetime import date
        staff_data['hire_date'] = date.today()
    
    # Convert employment_type values to match enum
    employment_type_mapping = {
        'full-time': 'full_time',
        'part-time': 'part_time',
        'contract': 'contract',
        'intern': 'intern'
    }
    if 'employment_type' in staff_data and staff_data['employment_type'] in employment_type_mapping:
        staff_data['employment_type'] = employment_type_mapping[staff_data['employment_type']]
    
    # Handle branch, department, and role name to ID conversion
    if 'branch' in staff_data and staff_data['branch']:
        branch_name = staff_data['branch'].strip()
        branch = db.query(Branch).filter(Branch.name.ilike(f"%{branch_name}%")).first()
        if branch:
            staff_data['branch_id'] = branch.id
            print(f"Found branch '{branch.name}' with ID {branch.id}")
        else:
            first_branch = db.query(Branch).first()
            staff_data['branch_id'] = first_branch.id if first_branch else 1
            print(f"Branch '{branch_name}' not found, using branch ID {staff_data['branch_id']}")
    
    if 'department' in staff_data and staff_data['department']:
        department_name = staff_data['department'].strip()
        department = db.query(Department).filter(Department.name.ilike(f"%{department_name}%")).first()
        if department:
            staff_data['department_id'] = department.id
            print(f"Found department '{department.name}' with ID {department.id}")
        else:
            first_department = db.query(Department).first()
            staff_data['department_id'] = first_department.id if first_department else 1
            print(f"Department '{department_name}' not found, using department ID {staff_data['department_id']}")
    
    if 'position' in staff_data and staff_data['position']:
        role_name = staff_data['position'].strip()
        role = db.query(Role).filter(Role.name.ilike(f"%{role_name}%")).first()
        if role:
            staff_data['role_id'] = role.id
            print(f"Found role '{role.name}' with ID {role.id}")
        else:
            first_role = db.query(Role).first()
            staff_data['role_id'] = first_role.id if first_role else 1
            print(f"Role '{role_name}' not found, using role ID {staff_data['role_id']}")
    
    # Convert IDs from strings to integers
    id_fields = ['branch_id', 'department_id', 'role_id']
    for field in id_fields:
        if field in staff_data and staff_data[field]:
            try:
                staff_data[field] = int(staff_data[field])
            except (ValueError, TypeError):
                pass  # Keep original value if conversion fails
    
    # Handle reporting_manager_id separately - if it's a string (name), set to None
    if 'reporting_manager_id' in staff_data and staff_data['reporting_manager_id']:
        if isinstance(staff_data['reporting_manager_id'], str):
            # If it's a string (manager name), we can't convert it to ID, so set to None
            staff_data['reporting_manager_id'] = None
        else:
            try:
                staff_data['reporting_manager_id'] = int(staff_data['reporting_manager_id'])
            except (ValueError, TypeError):
                staff_data['reporting_manager_id'] = None
    
    # Calculate allowances total and store as numeric value
    allowances_total = 0
    if 'allowances' in staff_data and staff_data['allowances']:
        if isinstance(staff_data['allowances'], list):
            for allowance in staff_data['allowances']:
                if isinstance(allowance, dict) and 'amount' in allowance:
                    try:
                        allowances_total += float(allowance['amount'])
                    except (ValueError, TypeError):
                        pass
        elif isinstance(staff_data['allowances'], (int, float)):
            allowances_total = float(staff_data['allowances'])
    
    # Store the numeric total instead of JSON
    staff_data['allowances'] = allowances_total
    
    # Calculate total_package if not provided
    if 'total_package' not in staff_data or not staff_data.get('total_package'):
        basic_salary = float(staff_data.get('basic_salary', 0)) if staff_data.get('basic_salary') else 0
        staff_data['total_package'] = basic_salary + allowances_total
    
    # Process JSON fields
    json_fields = ['allowances_detail', 'social_security', 'insurance', 'loans', 'documents']
    for field in json_fields:
        if field in staff_data and staff_data[field]:
            staff_data[field] = json.dumps(staff_data[field])
    
    # Filter out fields that don't exist in the Staff model
    valid_fields = {}
    for field, value in staff_data.items():
        if hasattr(Staff, field) and value is not None and value != '':
            valid_fields[field] = value
    
    print(f"Creating staff with valid fields: {valid_fields}")
    
    try:
        db_staff = Staff(**valid_fields)
        db.add(db_staff)
        db.commit()
        db.refresh(db_staff)
        return db_staff
    except Exception as e:
        db.rollback()
        print(f"Error creating staff: {str(e)}")
        
        # Handle specific database errors
        error_message = str(e)
        if "Duplicate entry" in error_message and "email" in error_message:
            raise HTTPException(status_code=400, detail="Email address already exists. Please use a different email.")
        elif "Duplicate entry" in error_message and "phone" in error_message:
            raise HTTPException(status_code=400, detail="Phone number already exists. Please use a different phone number.")
        else:
            raise HTTPException(status_code=400, detail=f"Error creating staff: {str(e)}")

@router.get("/staff/{staff_id}", response_model=StaffResponse)
async def get_staff_member(staff_id: int, db: Session = Depends(get_db)):
    """Get a specific staff member"""
    try:
        staff = db.query(Staff).filter(Staff.id == staff_id).first()
        if not staff:
            raise HTTPException(status_code=404, detail="Staff member not found")
        
        # Add names to the staff member
        if staff.department_id:
            dept = db.query(Department).filter(Department.id == staff.department_id).first()
            staff.department_name = dept.name if dept else None
        
        if staff.role_id:
            role = db.query(Role).filter(Role.id == staff.role_id).first()
            staff.role_name = role.name if role else None
        
        if staff.branch_id:
            branch = db.query(Branch).filter(Branch.id == staff.branch_id).first()
            staff.branch_name = branch.name if branch else None
        
        return staff
    except Exception as e:
        print(f"Error in get_staff_member: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.put("/staff/{staff_id}", response_model=StaffResponse)
async def update_staff(staff_id: int, staff_data: dict, db: Session = Depends(get_db)):
    """Update an existing staff member"""
    print(f"Updating staff {staff_id} with data: {staff_data}")
    
    # Find the staff member
    staff = db.query(Staff).filter(Staff.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff member not found")
    
    # Map frontend field names to backend field names
    field_mapping = {
        'firstName': 'first_name',
        'lastName': 'last_name',
        'middleName': 'middle_name',
        'dateOfBirth': 'date_of_birth',
        'gender': 'gender',
        'nationalId': 'national_id',
        'maritalStatus': 'marital_status',
        'email': 'email',
        'phone': 'phone',
        'alternativePhone': 'alternative_phone',
        'linkedin': 'linkedin_url',
        'twitter': 'twitter_url',
        'instagram': 'instagram_url',
        'emergencyContactName1': 'emergency_contact_name',
        'emergencyContactRelationship1': 'emergency_contact_relationship',
        'emergencyContactPhone1': 'emergency_contact_phone',
        'emergencyContactName2': 'emergency_contact2_name',
        'emergencyContactRelationship2': 'emergency_contact2_relationship',
        'emergencyContactPhone2': 'emergency_contact2_phone',
        'addressFull': 'address_full',
        'addressCity': 'address_city',
        'addressState': 'address_state',
        'addressCountry': 'address_country',
        'addressPostalCode': 'address_postal_code',
        'department': 'department_id',
        'position': 'role_id',
        'employmentType': 'employment_type',
        'hireDate': 'hire_date',
        'probationEndDate': 'probation_end_date',
        'contractEndDate': 'contract_end_date',
        'reportingManager': 'reporting_manager_id',
        'branch': 'branch_id',
        'basicSalary': 'basic_salary',
        'allowances': 'allowances_detail',
        'bankName': 'bank_name',
        'bankAccount': 'bank_account',
        'accountName': 'account_name',
        'taxId': 'tax_id',
        'payeEligible': 'paye_eligible',
        'allowancesDetail': 'allowances_detail',
        'socialSecurity': 'social_security',
        'insurance': 'insurance',
        'loans': 'loans',
        'workSchedule': 'work_schedule',
        'holidayEntitlement': 'holiday_entitlement',
        'leaveStatus': 'leave_status',
        'leaveEndDate': 'leave_end_date',
        'documents': 'documents'
    }
    
    # Apply field mapping and data conversion
    updated_fields = {}
    for frontend_field, backend_field in field_mapping.items():
        if frontend_field in staff_data:
            value = staff_data[frontend_field]
            
            # Convert data types appropriately
            if backend_field in ['department_id', 'role_id', 'branch_id'] and value:
                try:
                    updated_fields[backend_field] = int(value)
                except (ValueError, TypeError):
                    updated_fields[backend_field] = None
            elif backend_field == 'basic_salary' and value:
                try:
                    updated_fields[backend_field] = float(value)
                except (ValueError, TypeError):
                    updated_fields[backend_field] = 0.0
            elif backend_field == 'allowances_detail' and isinstance(value, list):
                # Calculate total allowances and store detail
                total_allowances = 0
                for allowance in value:
                    if isinstance(allowance, dict) and 'amount' in allowance:
                        try:
                            total_allowances += float(allowance['amount'])
                        except (ValueError, TypeError):
                            pass
                # Store the detail and calculate total
                updated_fields['allowances_detail'] = json.dumps(value) if value else None
                updated_fields['allowances'] = total_allowances
            elif backend_field in ['social_security', 'insurance', 'loans', 'documents']:
                # Store JSON data directly
                updated_fields[backend_field] = json.dumps(value) if value else None
            elif backend_field in ['paye_eligible']:
                updated_fields[backend_field] = bool(value)
            elif backend_field == 'employment_type':
                # Convert frontend values to enum values
                employment_type_mapping = {
                    'full-time': 'full_time',
                    'part-time': 'part_time',
                    'contract': 'contract',
                    'intern': 'intern'
                }
                updated_fields[backend_field] = employment_type_mapping.get(value, value)
            elif backend_field == 'employment_status':
                # Convert frontend values to enum values
                employment_status_mapping = {
                    'active': 'active',
                    'inactive': 'inactive',
                    'terminated': 'terminated',
                    'on-leave': 'on_leave'
                }
                updated_fields[backend_field] = employment_status_mapping.get(value, value)
            elif backend_field == 'gender':
                # Convert frontend values to enum values
                gender_mapping = {
                    'male': 'male',
                    'female': 'female',
                    'other': 'other'
                }
                updated_fields[backend_field] = gender_mapping.get(value, value)
            elif backend_field == 'marital_status':
                # Convert frontend values to enum values
                marital_status_mapping = {
                    'single': 'single',
                    'married': 'married',
                    'divorced': 'divorced',
                    'widowed': 'widowed'
                }
                updated_fields[backend_field] = marital_status_mapping.get(value, value)
            elif value is not None and value != '':
                updated_fields[backend_field] = value
    
    # Update fields (exclude id and other non-updatable fields)
    excluded_fields = ['id', 'created_at', 'updated_at', 'employee_id', 'employee_number']
    for field, value in updated_fields.items():
        if hasattr(staff, field) and field not in excluded_fields:
            setattr(staff, field, value)
    
    # Recalculate total package
    if 'basic_salary' in updated_fields or 'allowances' in updated_fields:
        staff.total_package = staff.basic_salary + staff.allowances
    
    db.commit()
    db.refresh(staff)
    
    # Add related entity names for response
    if staff.department_id:
        department = db.query(Department).filter(Department.id == staff.department_id).first()
        staff.department_name = department.name if department else None
    
    if staff.role_id:
        role = db.query(Role).filter(Role.id == staff.role_id).first()
        staff.role_name = role.name if role else None
    
    if staff.branch_id:
        branch = db.query(Branch).filter(Branch.id == staff.branch_id).first()
        staff.branch_name = branch.name if branch else None
    
    # JSON fields are already stored as strings in the database
    # No need to parse them here as they'll be returned as strings
    
    return staff

@router.delete("/staff/{staff_id}")
async def delete_staff(staff_id: int, db: Session = Depends(get_db)):
    """Delete a staff member (soft delete)"""
    print(f"Deleting staff {staff_id}")
    
    # Find the staff member
    staff = db.query(Staff).filter(Staff.id == staff_id).first()
    if not staff:
        raise HTTPException(status_code=404, detail="Staff member not found")
    
    # Check if staff has any payroll records
    payroll_count = db.query(PayrollRecord).filter(PayrollRecord.staff_id == staff_id).count()
    if payroll_count > 0:
        raise HTTPException(
            status_code=400, 
            detail=f"Cannot delete staff member. {payroll_count} payroll records exist for this staff member."
        )
    
    # Soft delete by setting is_active to False
    staff.is_active = False
    db.commit()
    
    return {"message": "Staff member deleted successfully"}

# Payroll calculation function
def calculate_payroll(basic_salary: float, allowances: float = 0, paye_eligible: bool = True):
    """Calculate payroll deductions and net salary"""
    # Total Package = Basic Salary + Allowances (without deductions)
    total_package = basic_salary + allowances
    # Gross Salary = Basic Salary + Allowances (no overtime/bonus)
    gross_salary = basic_salary + allowances
    
    # Tax calculations (Tanzania PAYE rates) - ONLY ON BASIC SALARY
    paye_tax = 0
    if paye_eligible:
        # Tanzania monthly tax brackets - using basic_salary only
        if basic_salary <= 270000:
            paye_tax = 0
        elif basic_salary <= 520000:
            paye_tax = (basic_salary - 270000) * 0.08
        elif basic_salary <= 760000:
            paye_tax = 20000 + (basic_salary - 520000) * 0.20
        elif basic_salary <= 1000000:
            paye_tax = 68000 + (basic_salary - 760000) * 0.25
        else:
            paye_tax = 128000 + (basic_salary - 1000000) * 0.30
    
    # SDL Tax (3.5% of gross salary) - paid by employer, not deducted from employee
    # Note: In Tanzania, SDL is paid by the company, not deducted from employee salary
    sdl_tax = 0  # This should be tracked separately as employer cost, not employee deduction
    
    # NSSF (National Social Security Fund) - Tanzania: 10% employee contribution - ONLY ON BASIC SALARY
    nssf = basic_salary * 0.10
    
    # NHIF - Not applicable in Tanzania (this is Kenya's system)
    # Tanzania uses different health insurance schemes
    nhif = 0
    
    total_deductions = paye_tax + sdl_tax + nssf + nhif
    # Net Salary = Basic Salary - Deductions + Allowances
    net_salary = basic_salary - total_deductions + allowances
    
    return {
        "total_package": total_package,
        "gross_salary": gross_salary,
        "paye_tax": paye_tax,
        "sdl_tax": sdl_tax,
        "nssf": nssf,
        "nhif": nhif,
        "total_deductions": total_deductions,
        "net_salary": net_salary
    }

def calculate_employer_costs(gross_salary: float, basic_salary: float):
    """Calculate employer costs (SDL, WCF, NSSF employer portion)"""
    # SDL (Skills Development Levy) - 3.5% of gross salary, paid by employer
    sdl_employer_cost = gross_salary * 0.035
    
    # WCF (Workers Compensation Fund) - 0.5% of gross salary, paid by employer
    wcf_cost = gross_salary * 0.005
    
    # NSSF employer portion - 10% of BASIC SALARY ONLY, paid by employer
    nssf_employer_cost = basic_salary * 0.10
    
    total_employer_costs = sdl_employer_cost + wcf_cost + nssf_employer_cost
    
    return {
        "sdl_employer_cost": sdl_employer_cost,
        "wcf_cost": wcf_cost,
        "nssf_employer_cost": nssf_employer_cost,
        "total_employer_costs": total_employer_costs
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
        calculation = calculate_payroll(
            staff.basic_salary, 
            staff.allowances, 
            paye_eligible=staff.paye_eligible
        )
        
        # Calculate employer costs
        employer_costs = calculate_employer_costs(
            calculation["gross_salary"],
            staff.basic_salary
        )
        
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
