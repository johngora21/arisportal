import { getApiUrl } from '../../../config/api';

export interface Branch {
  id: number;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  phone?: string;
  email?: string;
  is_active: boolean;
  created_at: string;
}

export interface Department {
  id: number;
  name: string;
  description?: string;
  branch_id: number;
  budget: number;
  is_active: boolean;
  created_at: string;
}

export interface Role {
  id: number;
  name: string;
  description?: string;
  department_id: number;
  min_salary: number;
  max_salary: number;
  responsibilities?: string;
  requirements?: string;
  is_active: boolean;
  created_at: string;
}

export interface Staff {
  id: number;
  employee_id: string;
  employee_number: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female' | 'other';
  national_id?: string;
  marital_status?: 'single' | 'married' | 'divorced' | 'widowed';
  blood_group?: string;
  email: string;
  phone: string;
  alternative_phone?: string;
  address_full?: string;
  address_city?: string;
  address_state?: string;
  address_country?: string;
  address_postal_code?: string;
  emergency_contact_name?: string;
  emergency_contact_relationship?: string;
  emergency_contact_phone?: string;
  emergency_contact2_name?: string;
  emergency_contact2_relationship?: string;
  emergency_contact2_phone?: string;
  linkedin_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  branch_id: number;
  department_id: number;
  role_id: number;
  employment_type: 'full_time' | 'part_time' | 'contract' | 'intern';
  employment_status: 'active' | 'inactive' | 'terminated' | 'on_leave';
  hire_date: string;
  probation_end_date?: string;
  contract_end_date?: string;
  reporting_manager_id?: number;
  work_location?: string;
  basic_salary: number;
  allowances: number;
  total_package: number;
  bank_name?: string;
  bank_account?: string;
  tax_id?: string;
  last_review_date?: string;
  next_review_date?: string;
  benefits?: any;
  performance_rating?: string;
  technical_skills?: string;
  languages?: string;
  certifications?: any;
  work_schedule?: string;
  holiday_entitlement: number;
  annual_leave_balance: number;
  sick_leave_balance: number;
  personal_leave_balance: number;
  maternity_leave_balance: number;
  is_active: boolean;
  created_at: string;
}

export interface PayrollRecord {
  id: number;
  staff_id: number;
  payroll_period: string;
  pay_date: string;
  basic_salary: number;
  allowances: number;
  overtime_pay: number;
  bonus: number;
  gross_salary: number;
  paye_tax: number;
  sdl_tax: number;
  nssf: number;
  nhif: number;
  pension_contribution: number;
  other_deductions: number;
  total_deductions: number;
  net_salary: number;
  hours_worked: number;
  days_worked: number;
  notes?: string;
  status: string;
  processed_at?: string;
  paid_at?: string;
  created_at: string;
}

export interface PayrollSummary {
  total_employees: number;
  total_gross_salary: number;
  total_deductions: number;
  total_net_salary: number;
  total_paye_tax: number;
  total_sdl_tax: number;
  total_nssf: number;
  total_nhif: number;
}

export interface PayrollProcessRequest {
  payroll_period: string;
  branch_id?: number;
}

export interface PayrollProcessResponse {
  message: string;
  payroll_period: string;
  total_employees: number;
  total_gross_salary: number;
  total_deductions: number;
  total_net_salary: number;
  payroll_records: number;
}

// Service classes for API calls
export class BranchService {
  static async fetchBranches(search?: string): Promise<Branch[]> {
    try {
      const url = new URL(getApiUrl('PAYROLL.BRANCHES'));
      if (search) url.searchParams.append('search', search);
      
      const response = await fetch(url.toString());
      if (!response.ok) throw new Error('Failed to fetch branches');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching branches:', error);
      return [];
    }
  }

  static async createBranch(branchData: Partial<Branch>): Promise<Branch> {
    try {
      const response = await fetch(getApiUrl('PAYROLL.BRANCHES'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(branchData)
      });
      
      if (!response.ok) throw new Error('Failed to create branch');
      return await response.json();
    } catch (error) {
      console.error('Error creating branch:', error);
      throw error;
    }
  }
}

export class DepartmentService {
  static async fetchDepartments(branchId?: number, search?: string): Promise<Department[]> {
    try {
      const url = new URL(getApiUrl('PAYROLL.DEPARTMENTS'));
      if (branchId) url.searchParams.append('branch_id', branchId.toString());
      if (search) url.searchParams.append('search', search);
      
      const response = await fetch(url.toString());
      if (!response.ok) throw new Error('Failed to fetch departments');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching departments:', error);
      return [];
    }
  }

  static async createDepartment(departmentData: Partial<Department>): Promise<Department> {
    try {
      const response = await fetch(getApiUrl('PAYROLL.DEPARTMENTS'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(departmentData)
      });
      
      if (!response.ok) throw new Error('Failed to create department');
      return await response.json();
    } catch (error) {
      console.error('Error creating department:', error);
      throw error;
    }
  }
}

export class RoleService {
  static async fetchRoles(departmentId?: number, search?: string): Promise<Role[]> {
    try {
      const url = new URL(getApiUrl('PAYROLL.ROLES'));
      if (departmentId) url.searchParams.append('department_id', departmentId.toString());
      if (search) url.searchParams.append('search', search);
      
      const response = await fetch(url.toString());
      if (!response.ok) throw new Error('Failed to fetch roles');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching roles:', error);
      return [];
    }
  }

  static async createRole(roleData: Partial<Role>): Promise<Role> {
    try {
      const response = await fetch(getApiUrl('PAYROLL.ROLES'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(roleData)
      });
      
      if (!response.ok) throw new Error('Failed to create role');
      return await response.json();
    } catch (error) {
      console.error('Error creating role:', error);
      throw error;
    }
  }
}

export class StaffService {
  static async fetchStaff(
    branchId?: number, 
    departmentId?: number, 
    employmentStatus?: string,
    search?: string
  ): Promise<Staff[]> {
    try {
      const url = new URL(getApiUrl('PAYROLL.STAFF'));
      if (branchId) url.searchParams.append('branch_id', branchId.toString());
      if (departmentId) url.searchParams.append('department_id', departmentId.toString());
      if (employmentStatus) url.searchParams.append('employment_status', employmentStatus);
      if (search) url.searchParams.append('search', search);
      
      const response = await fetch(url.toString());
      if (!response.ok) throw new Error('Failed to fetch staff');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching staff:', error);
      return [];
    }
  }

  static async createStaff(staffData: Partial<Staff>): Promise<Staff> {
    try {
      const response = await fetch(getApiUrl('PAYROLL.STAFF'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(staffData)
      });
      
      if (!response.ok) throw new Error('Failed to create staff');
      return await response.json();
    } catch (error) {
      console.error('Error creating staff:', error);
      throw error;
    }
  }

  static async getStaffMember(staffId: number): Promise<Staff> {
    try {
      const response = await fetch(`${getApiUrl('PAYROLL.STAFF')}/${staffId}`);
      if (!response.ok) throw new Error('Failed to fetch staff member');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching staff member:', error);
      throw error;
    }
  }
}

export class PayrollService {
  static async processPayroll(request: PayrollProcessRequest): Promise<PayrollProcessResponse> {
    try {
      const response = await fetch(getApiUrl('PAYROLL.PROCESS'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });
      
      if (!response.ok) throw new Error('Failed to process payroll');
      return await response.json();
    } catch (error) {
      console.error('Error processing payroll:', error);
      throw error;
    }
  }

  static async fetchPayrollRecords(
    payrollPeriod?: string,
    staffId?: number
  ): Promise<PayrollRecord[]> {
    try {
      const url = new URL(getApiUrl('PAYROLL.RECORDS'));
      if (payrollPeriod) url.searchParams.append('payroll_period', payrollPeriod);
      if (staffId) url.searchParams.append('staff_id', staffId.toString());
      
      const response = await fetch(url.toString());
      if (!response.ok) throw new Error('Failed to fetch payroll records');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching payroll records:', error);
      return [];
    }
  }

  static async getPayrollSummary(
    payrollPeriod?: string,
    branchId?: number
  ): Promise<PayrollSummary> {
    try {
      const url = new URL(getApiUrl('PAYROLL.SUMMARY'));
      if (payrollPeriod) url.searchParams.append('payroll_period', payrollPeriod);
      if (branchId) url.searchParams.append('branch_id', branchId.toString());
      
      const response = await fetch(url.toString());
      if (!response.ok) throw new Error('Failed to fetch payroll summary');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching payroll summary:', error);
      return {
        total_employees: 0,
        total_gross_salary: 0,
        total_deductions: 0,
        total_net_salary: 0,
        total_paye_tax: 0,
        total_sdl_tax: 0,
        total_nssf: 0,
        total_nhif: 0
      };
    }
  }
}
