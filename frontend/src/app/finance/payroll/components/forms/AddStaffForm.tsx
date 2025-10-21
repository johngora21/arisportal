import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Briefcase, DollarSign, Calendar, X, Save, FileText, Plus, Eye, Trash2, Shield, Award, GraduationCap, Clock } from 'lucide-react';

interface AddStaffFormProps {
  onSave: (staffData: any) => void;
  onCancel: () => void;
  branches: Array<{ id: string; name: string }>;
  departments: Array<{ id: string; name: string }>;
  roles: Array<{ id: string; name: string }>;
}

const AddStaffForm: React.FC<AddStaffFormProps> = ({ onSave, onCancel, branches, departments, roles }) => {
  const [formData, setFormData] = useState<any>({
    // Personal
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    nationalId: '',
    maritalStatus: '',
    bloodGroup: '',
    // Contact
    email: '',
    phone: '',
    alternativePhone: '',
    linkedin: '',
    twitter: '',
    instagram: '',
    // Emergency Contact 1
    emergencyContactName1: '',
    emergencyContactRelationship1: '',
    emergencyContactPhone1: '',
    // Emergency Contact 2
    emergencyContactName2: '',
    emergencyContactRelationship2: '',
    emergencyContactPhone2: '',
    // Address
    addressFull: '',
    addressCity: '',
    addressState: '',
    addressCountry: '',
    addressPostalCode: '',
    // Employment
    employeeId: '',
    employeeNumber: '',
    department: '',
    position: '',
    employmentType: '',
    employmentStatus: 'active',
    hireDate: '',
    probationEndDate: '',
    contractEndDate: '',
    reportingManager: '',
    branch: '',
    // Salary
    basicSalary: '',
    allowances: [],
    bankName: '',
    bankAccount: '',
    taxId: '',
    payeEligible: false,
    sdlEligible: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('personal');

  const inputStyle = (hasError: boolean) => ({
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box' as const,
    paddingTop: '12px',
    paddingBottom: '12px',
    paddingLeft: '16px',
    paddingRight: '16px',
    border: `1px solid ${hasError ? '#ef4444' : '#d1d5db'}`,
    borderRadius: '20px',
    fontSize: '14px',
    outline: 'none'
  });

  const selectStyle = (hasError: boolean) => ({
    width: '100%',
    maxWidth: '100%',
    boxSizing: 'border-box' as const,
    paddingTop: '12px',
    paddingBottom: '12px',
    paddingLeft: '16px',
    paddingRight: '16px',
    border: `1px solid ${hasError ? '#ef4444' : '#d1d5db'}`,
    borderRadius: '20px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: 'white'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.employeeId.trim()) newErrors.employeeId = 'Employee ID is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.basicSalary) newErrors.basicSalary = 'Basic salary is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        ...formData,
        id: Date.now().toString(),
        basicSalary: parseFloat(formData.basicSalary),
        fullName: `${formData.firstName} ${formData.lastName}`,
        status: formData.employmentStatus
      });
    }
  };

  const tabs = [
    { id: 'personal', label: 'Personal', icon: <User size={16} /> },
    { id: 'contact', label: 'Contact', icon: <Mail size={16} /> },
    { id: 'employment', label: 'Employment', icon: <Briefcase size={16} /> },
    { id: 'salary', label: 'Salary', icon: <DollarSign size={16} /> },
    { id: 'attendance', label: 'Attendance', icon: <Calendar size={16} /> },
    { id: 'documents', label: 'Documents', icon: <FileText size={16} /> },
  ];

  const renderPersonalTab = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
          First Name *
        </label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          style={inputStyle(!!errors.firstName)}
          placeholder="Enter first name"
        />
        {errors.firstName && <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>{errors.firstName}</span>}
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
          Middle Name
        </label>
        <input
          type="text"
          name="middleName"
          value={formData.middleName}
          onChange={handleInputChange}
          style={inputStyle(false)}
          placeholder="Enter middle name"
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
          Last Name *
        </label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          style={inputStyle(!!errors.lastName)}
          placeholder="Enter last name"
        />
        {errors.lastName && <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>{errors.lastName}</span>}
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
          Date of Birth
        </label>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleInputChange}
          style={inputStyle(false)}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
          Gender
        </label>
        <select
          name="gender"
          value={formData.gender}
          onChange={handleInputChange}
          style={selectStyle(false)}
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
          National ID
        </label>
        <input
          type="text"
          name="nationalId"
          value={formData.nationalId}
          onChange={handleInputChange}
          style={inputStyle(false)}
          placeholder="Enter national ID"
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
          Marital Status
        </label>
        <select
          name="maritalStatus"
          value={formData.maritalStatus}
          onChange={handleInputChange}
          style={selectStyle(false)}
        >
          <option value="">Select status</option>
          <option value="single">Single</option>
          <option value="married">Married</option>
          <option value="divorced">Divorced</option>
          <option value="widowed">Widowed</option>
        </select>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
          Blood Group
        </label>
        <select
          name="bloodGroup"
          value={formData.bloodGroup}
          onChange={handleInputChange}
          style={selectStyle(false)}
        >
          <option value="">Select blood group</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>
      </div>
    </div>
  );

  const renderContactTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Basic Contact */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            style={inputStyle(!!errors.email)}
            placeholder="Enter email address"
          />
          {errors.email && <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>{errors.email}</span>}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
            Main Phone Number *
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            style={inputStyle(!!errors.phone)}
            placeholder="Enter phone number"
          />
          {errors.phone && <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>{errors.phone}</span>}
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
            Alternative Phone
          </label>
          <input
            type="text"
            name="alternativePhone"
            value={formData.alternativePhone}
            onChange={handleInputChange}
            style={inputStyle(false)}
            placeholder="Enter alternative phone"
          />
        </div>
      </div>

      {/* Social Media */}
      <div>
        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
          Social Media & Portfolio
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              LinkedIn
            </label>
            <input
              type="text"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleInputChange}
              style={inputStyle(false)}
              placeholder="linkedin.com/in/username"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Twitter/X
            </label>
            <input
              type="text"
              name="twitter"
              value={formData.twitter}
              onChange={handleInputChange}
              style={inputStyle(false)}
              placeholder="@username"
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Instagram
            </label>
            <input
              type="text"
              name="instagram"
              value={formData.instagram}
              onChange={handleInputChange}
              style={inputStyle(false)}
              placeholder="@username"
            />
          </div>
        </div>
      </div>

      {/* Emergency Contacts */}
      <div>
        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
          Emergency Contacts
        </h4>
        
        {/* Emergency Contact 1 */}
        <div style={{ marginBottom: '16px' }}>
          <h5 style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '12px' }}>Primary Emergency Contact</h5>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Contact Name
              </label>
              <input
                type="text"
                name="emergencyContactName1"
                value={formData.emergencyContactName1}
                onChange={handleInputChange}
                style={inputStyle(false)}
                placeholder="Enter contact name"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Relationship
              </label>
              <input
                type="text"
                name="emergencyContactRelationship1"
                value={formData.emergencyContactRelationship1}
                onChange={handleInputChange}
                style={inputStyle(false)}
                placeholder="e.g., Spouse, Parent, Sibling"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Phone
              </label>
              <input
                type="text"
                name="emergencyContactPhone1"
                value={formData.emergencyContactPhone1}
                onChange={handleInputChange}
                style={inputStyle(false)}
                placeholder="Enter phone number"
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact 2 */}
        <div>
          <h5 style={{ fontSize: '14px', fontWeight: '500', color: '#6b7280', marginBottom: '12px' }}>Secondary Emergency Contact</h5>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Contact Name
              </label>
              <input
                type="text"
                name="emergencyContactName2"
                value={formData.emergencyContactName2}
                onChange={handleInputChange}
                style={inputStyle(false)}
                placeholder="Enter contact name"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Relationship
              </label>
              <input
                type="text"
                name="emergencyContactRelationship2"
                value={formData.emergencyContactRelationship2}
                onChange={handleInputChange}
                style={inputStyle(false)}
                placeholder="e.g., Spouse, Parent, Sibling"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Phone
              </label>
              <input
                type="text"
                name="emergencyContactPhone2"
                value={formData.emergencyContactPhone2}
                onChange={handleInputChange}
                style={inputStyle(false)}
                placeholder="Enter phone number"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Current Address */}
      <div>
        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
          Current Address
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Full Address
            </label>
            <input
              type="text"
              name="addressFull"
              value={formData.addressFull}
              onChange={handleInputChange}
              style={inputStyle(false)}
              placeholder="Enter full address"
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                City
              </label>
              <input
                type="text"
                name="addressCity"
                value={formData.addressCity}
                onChange={handleInputChange}
                style={inputStyle(false)}
                placeholder="Enter city"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                State/Region
              </label>
              <input
                type="text"
                name="addressState"
                value={formData.addressState}
                onChange={handleInputChange}
                style={inputStyle(false)}
                placeholder="Enter state/region"
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Country
              </label>
              <input
                type="text"
                name="addressCountry"
                value={formData.addressCountry}
                onChange={handleInputChange}
                style={inputStyle(false)}
                placeholder="Enter country"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmploymentTab = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
          Employee ID *
        </label>
        <input
          type="text"
          name="employeeId"
          value={formData.employeeId}
          onChange={handleInputChange}
          style={inputStyle(!!errors.employeeId)}
          placeholder="Enter employee ID"
        />
        {errors.employeeId && <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>{errors.employeeId}</span>}
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
          Employee Number
        </label>
        <input
          type="text"
          name="employeeNumber"
          value={formData.employeeNumber}
          onChange={handleInputChange}
          style={inputStyle(false)}
          placeholder="Enter employee number"
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
          Branch *
        </label>
        <select
          name="branch"
          value={formData.branch}
          onChange={handleInputChange}
          style={selectStyle(false)}
        >
          <option value="">Select branch</option>
          {branches.map(branch => (
            <option key={branch.id} value={branch.name}>{branch.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
          Department *
        </label>
        <select
          name="department"
          value={formData.department}
          onChange={handleInputChange}
          style={selectStyle(!!errors.department)}
        >
          <option value="">Select department</option>
          {departments.map(dept => (
            <option key={dept.id} value={dept.name}>{dept.name}</option>
          ))}
        </select>
        {errors.department && <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>{errors.department}</span>}
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
          Position *
        </label>
        <select
          name="position"
          value={formData.position}
          onChange={handleInputChange}
          style={selectStyle(!!errors.position)}
        >
          <option value="">Select position</option>
          {roles.map(role => (
            <option key={role.id} value={role.name}>{role.name}</option>
          ))}
        </select>
        {errors.position && <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>{errors.position}</span>}
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
          Employment Type
        </label>
        <select
          name="employmentType"
          value={formData.employmentType}
          onChange={handleInputChange}
          style={selectStyle(false)}
        >
          <option value="">Select type</option>
          <option value="full-time">Full Time</option>
          <option value="part-time">Part Time</option>
          <option value="contract">Contract</option>
          <option value="intern">Intern</option>
        </select>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
          Employment Status
        </label>
        <select
          name="employmentStatus"
          value={formData.employmentStatus}
          onChange={handleInputChange}
          style={selectStyle(false)}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="on-leave">On Leave</option>
          <option value="terminated">Terminated</option>
        </select>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
          Hire Date
        </label>
        <input
          type="date"
          name="hireDate"
          value={formData.hireDate}
          onChange={handleInputChange}
          style={inputStyle(false)}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
          Probation End Date
        </label>
        <input
          type="date"
          name="probationEndDate"
          value={formData.probationEndDate}
          onChange={handleInputChange}
          style={inputStyle(false)}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
          Contract End Date
        </label>
        <input
          type="date"
          name="contractEndDate"
          value={formData.contractEndDate}
          onChange={handleInputChange}
          style={inputStyle(false)}
        />
      </div>


      <div style={{ gridColumn: '1 / -1' }}>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
          Reporting Manager
        </label>
        <input
          type="text"
          name="reportingManager"
          value={formData.reportingManager}
          onChange={handleInputChange}
          style={inputStyle(false)}
          placeholder="Enter reporting manager name"
        />
      </div>
    </div>
  );

  const renderSalaryTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Basic Salary & Bank Details */}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
          Basic Salary *
        </label>
        <input
          type="number"
          name="basicSalary"
          value={formData.basicSalary}
          onChange={handleInputChange}
          style={inputStyle(!!errors.basicSalary)}
          placeholder="Enter basic salary"
        />
        {errors.basicSalary && <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>{errors.basicSalary}</span>}
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
            Tax ID
        </label>
        <input
            type="text"
            name="taxId"
            value={formData.taxId}
          onChange={handleInputChange}
          style={inputStyle(false)}
            placeholder="Enter tax ID"
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
          Bank Name
        </label>
        <input
          type="text"
          name="bankName"
          value={formData.bankName}
          onChange={handleInputChange}
          style={inputStyle(false)}
          placeholder="Enter bank name"
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
          Bank Account Number
        </label>
        <input
          type="text"
          name="bankAccount"
          value={formData.bankAccount}
          onChange={handleInputChange}
          style={inputStyle(false)}
          placeholder="Enter bank account number"
        />
      </div>
    </div>

      {/* Tax Eligibility */}
      <div>
        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
          Tax Eligibility
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              name="payeEligible"
              checked={formData.payeEligible || false}
              onChange={(e) => setFormData({...formData, payeEligible: e.target.checked})}
              style={{ width: '16px', height: '16px' }}
            />
            <label style={{ fontSize: '14px', color: '#374151' }}>PAYE Tax Eligible</label>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              name="sdlEligible"
              checked={formData.sdlEligible || false}
              onChange={(e) => setFormData({...formData, sdlEligible: e.target.checked})}
              style={{ width: '16px', height: '16px' }}
            />
            <label style={{ fontSize: '14px', color: '#374151' }}>SDL Tax Eligible</label>
          </div>
        </div>
      </div>

      {/* Allowances */}
      <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
            Allowances
        </h3>
          <button
            type="button"
            onClick={() => {
              setFormData({
                ...formData,
                allowances: [...(formData.allowances || []), { name: '', amount: '' }]
              });
            }}
            style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '12px 20px',
          backgroundColor: 'var(--mc-sidebar-bg)',
          color: 'white',
          border: 'none',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
          <Plus size={16} />
            Add Allowance
        </button>
      </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {(formData.allowances || []).map((allowance: any, index: number) => (
            <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Allowance Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Housing, Transport"
                  value={allowance.name}
                  onChange={(e) => {
                    const newAllowances = [...(formData.allowances || [])];
                    newAllowances[index].name = e.target.value;
                    setFormData({ ...formData, allowances: newAllowances });
                  }}
                  style={inputStyle(false)}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Amount
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={allowance.amount}
                  onChange={(e) => {
                    const newAllowances = [...(formData.allowances || [])];
                    newAllowances[index].amount = e.target.value;
                    setFormData({ ...formData, allowances: newAllowances });
                  }}
                  style={inputStyle(false)}
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  const newAllowances = [...(formData.allowances || [])];
                  newAllowances.splice(index, 1);
                  setFormData({ ...formData, allowances: newAllowances });
                }}
                style={{
                  padding: '12px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
        borderRadius: '20px',
        cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Trash2 size={16} />
              </button>
        </div>
          ))}
        </div>
      </div>

      {/* Social Security */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
            Social Security
          </h3>
          <button
            type="button"
            onClick={() => {
              setFormData({
                ...formData,
                socialSecurity: [...(formData.socialSecurity || []), { name: '', percentage: '' }]
              });
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              backgroundColor: 'var(--mc-sidebar-bg)',
              color: 'white',
              border: 'none',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: '500',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Plus size={16} />
            Add Social Security
        </button>
      </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {(formData.socialSecurity || []).map((item: any, index: number) => (
            <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Social Security Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., NSSF, NHIF"
                  value={item.name}
                  onChange={(e) => {
                    const newSocialSecurity = [...(formData.socialSecurity || [])];
                    newSocialSecurity[index].name = e.target.value;
                    setFormData({ ...formData, socialSecurity: newSocialSecurity });
                  }}
                  style={inputStyle(false)}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Percentage (%)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  step="0.01"
                  value={item.percentage}
                  onChange={(e) => {
                    const newSocialSecurity = [...(formData.socialSecurity || [])];
                    newSocialSecurity[index].percentage = e.target.value;
                    setFormData({ ...formData, socialSecurity: newSocialSecurity });
                  }}
                  style={inputStyle(false)}
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  const newSocialSecurity = [...(formData.socialSecurity || [])];
                  newSocialSecurity.splice(index, 1);
                  setFormData({ ...formData, socialSecurity: newSocialSecurity });
                }}
                style={{
                  padding: '12px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Trash2 size={16} />
                </button>
            </div>
          ))}
          </div>
              </div>

      {/* Insurance */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
            Insurance
          </h3>
          <button
            type="button"
            onClick={() => {
              setFormData({
                ...formData,
                insurance: [...(formData.insurance || []), { name: '', annualAmount: '' }]
              });
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              backgroundColor: 'var(--mc-sidebar-bg)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Plus size={16} />
            Add Insurance
                </button>
              </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {(formData.insurance || []).map((item: any, index: number) => (
            <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Insurance Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Medical Insurance, Life Insurance"
                  value={item.name}
                  onChange={(e) => {
                    const newInsurance = [...(formData.insurance || [])];
                    newInsurance[index].name = e.target.value;
                    setFormData({ ...formData, insurance: newInsurance });
                  }}
                  style={inputStyle(false)}
                />
            </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Annual Amount
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={item.annualAmount}
                  onChange={(e) => {
                    const newInsurance = [...(formData.insurance || [])];
                    newInsurance[index].annualAmount = e.target.value;
                    setFormData({ ...formData, insurance: newInsurance });
                  }}
                  style={inputStyle(false)}
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  const newInsurance = [...(formData.insurance || [])];
                  newInsurance.splice(index, 1);
                  setFormData({ ...formData, insurance: newInsurance });
                }}
                style={{
                  padding: '12px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Trash2 size={16} />
                </button>
              </div>
          ))}
          </div>
        </div>

      {/* Loans & Deductions */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
            Loans & Deductions
          </h3>
          <button
            type="button"
            onClick={() => {
              setFormData({
                ...formData,
                loans: [...(formData.loans || []), { name: '', amount: '', type: 'student' }]
              });
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              backgroundColor: 'var(--mc-sidebar-bg)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            <Plus size={16} />
            Add Loan
          </button>
            </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {(formData.loans || []).map((loan: any, index: number) => (
            <div key={index} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '16px', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Loan Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Student Loan, Staff Loan"
                  value={loan.name}
                  onChange={(e) => {
                    const newLoans = [...(formData.loans || [])];
                    newLoans[index].name = e.target.value;
                    setFormData({ ...formData, loans: newLoans });
                  }}
                  style={inputStyle(false)}
                />
          </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Monthly Deduction
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={loan.amount}
                  onChange={(e) => {
                    const newLoans = [...(formData.loans || [])];
                    newLoans[index].amount = e.target.value;
                    setFormData({ ...formData, loans: newLoans });
                  }}
                  style={inputStyle(false)}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Loan Type
                </label>
                <select
                  value={loan.type}
                  onChange={(e) => {
                    const newLoans = [...(formData.loans || [])];
                    newLoans[index].type = e.target.value;
                    setFormData({ ...formData, loans: newLoans });
                  }}
                  style={selectStyle(false)}
                >
                  <option value="student">Student Loan</option>
                  <option value="staff">Staff Loan</option>
                  <option value="advance">Salary Advance</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newLoans = [...(formData.loans || [])];
                  newLoans.splice(index, 1);
                  setFormData({ ...formData, loans: newLoans });
                }}
                style={{
                  padding: '12px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Trash2 size={16} />
                </button>
              </div>
          ))}
            </div>
          </div>
        </div>
  );

  const renderAttendanceTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Work Schedule */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
            Work Schedule *
          </label>
          <select
            name="workSchedule"
            value={formData.workSchedule || ''}
            onChange={handleInputChange}
            style={selectStyle(false)}
          >
            <option value="">Select work schedule</option>
            <option value="full-time">Full Time (8 hours)</option>
            <option value="part-time">Part Time (4 hours)</option>
            <option value="flexible">Flexible Hours</option>
            <option value="shift">Shift Work</option>
            <option value="remote">Remote Work</option>
          </select>
            </div>

              <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
            Holiday Entitlement
          </label>
          <input
            type="number"
            name="holidayEntitlement"
            value={formData.holidayEntitlement || ''}
            onChange={handleInputChange}
            style={inputStyle(false)}
            placeholder="Enter holiday entitlement days"
          />
              </div>
              </div>


      {/* Leave Status */}
      <div>
        <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#1f2937', marginBottom: '16px' }}>
          Leave Status
            </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Current Status
            </label>
            <select
              name="leaveStatus"
              value={formData.leaveStatus || 'available'}
              onChange={handleInputChange}
              style={selectStyle(false)}
            >
              <option value="available">Available</option>
              <option value="on-leave">On Leave</option>
              <option value="suspended">Suspended</option>
            </select>
            </div>

              <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Leave End Date
            </label>
            <input
              type="date"
              name="leaveEndDate"
              value={formData.leaveEndDate || ''}
              onChange={handleInputChange}
              style={inputStyle(false)}
            />
              </div>
              </div>
            </div>
          </div>
  );

  const renderDocumentsTab = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
          Documents
        </h3>
        <button 
          onClick={() => {
            setFormData({
              ...formData,
              documents: [...(formData.documents || []), { name: '', file: null }]
            });
          }}
          style={{
              display: 'flex',
              alignItems: 'center',
          gap: '8px',
          padding: '12px 20px',
          backgroundColor: 'var(--mc-sidebar-bg)',
          color: 'white',
          border: 'none',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Plus size={16} />
          Add Document
                </button>
            </div>

      {/* Documents List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {(formData.documents || []).map((doc: any, index: number) => (
          <div key={index} style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr auto', 
            gap: '16px', 
            alignItems: 'end'
          }}>
              <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Document Name
              </label>
              <input
                type="text"
                placeholder="e.g., National ID, Passport, Contract"
                value={doc.name}
                onChange={(e) => {
                  const newDocuments = [...(formData.documents || [])];
                  newDocuments[index].name = e.target.value;
                  setFormData({ ...formData, documents: newDocuments });
                }}
                style={inputStyle(false)}
              />
              </div>
              <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Upload File
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const newDocuments = [...(formData.documents || [])];
                    newDocuments[index].file = file;
                    setFormData({ ...formData, documents: newDocuments });
                  }
                }}
                style={{
                  ...inputStyle(false),
                  backgroundColor: 'white'
                }}
              />
              </div>
            <button
              onClick={() => {
                const newDocuments = [...(formData.documents || [])];
                newDocuments.splice(index, 1);
                setFormData({ ...formData, documents: newDocuments });
              }}
              style={{
                padding: '12px',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            >
              <Trash2 size={16} />
                </button>
              </div>
        ))}

        {(!formData.documents || formData.documents.length === 0) && (
            <div style={{
            textAlign: 'center', 
            padding: '40px 20px',
            color: '#6b7280',
            fontSize: '14px'
          }}>
            No documents added yet. Click "Add Document" to get started.
            </div>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Header with close button */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <User size={20} color="var(--mc-sidebar-bg)" />
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
            Add New Staff Member
          </h2>
        </div>
        <button
          onClick={onCancel}
          style={{
            padding: '6px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: '#f3f4f6',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        padding: '4px 24px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        gap: '8px',
        width: '100%'
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 20px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: activeTab === tab.id ? 'var(--mc-sidebar-bg)' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#6b7280',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '-1px',
              flex: 1,
              justifyContent: 'center'
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeTab === 'personal' && renderPersonalTab()}
        {activeTab === 'contact' && renderContactTab()}
        {activeTab === 'employment' && renderEmploymentTab()}
            {activeTab === 'salary' && renderSalaryTab()}
        {activeTab === 'attendance' && renderAttendanceTab()}
            {activeTab === 'documents' && renderDocumentsTab()}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: 'auto', paddingTop: '40px' }}>
          <button
            type="submit"
            style={{
              padding: '12px 24px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: 'var(--mc-sidebar-bg)',
              color: 'white',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Save size={16} />
            Save Staff Member
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStaffForm;