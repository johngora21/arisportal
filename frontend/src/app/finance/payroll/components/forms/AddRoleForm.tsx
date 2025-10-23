import React, { useState } from 'react';
import { Shield, X, Save } from 'lucide-react';

interface AddRoleFormProps {
  onSave: (roleData: any) => void;
  onCancel: () => void;
  branches: Array<{ id: string; name: string }>;
  departments: Array<{ id: string; name: string }>;
  initialData?: any; // For editing existing roles
}

const AddRoleForm: React.FC<AddRoleFormProps> = ({ onSave, onCancel, branches, departments, initialData }) => {
  const [formData, setFormData] = useState({
    title: initialData?.name || '',
    department: initialData?.department || '',
    branch: initialData?.branch || '',
    level: initialData?.level || '',
    description: initialData?.description || '',
    salaryMin: initialData?.minSalary?.toString() || '',
    salaryMax: initialData?.maxSalary?.toString() || '',
    requirements: initialData?.requirements?.join('\n') || '',
    responsibilities: initialData?.responsibilities?.join('\n') || '',
    skills: initialData?.key_skills?.join('\n') || '',
    experience: initialData?.experience_required || '',
    education: initialData?.education_required || '',
    createdDate: initialData?.createdDate || '',
    reportsTo: initialData?.reports_to || '',
    status: initialData?.status || 'active'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filter departments based on selected branch
  const filteredDepartments = departments.filter(dept => 
    formData.branch ? dept.branch_id === formData.branch : true
  );

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
    
    // If branch changes, clear department selection
    if (name === 'branch') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        department: '' // Clear department when branch changes
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
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

    if (!formData.title.trim()) newErrors.title = 'Role title is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.branch) newErrors.branch = 'Branch is required';
    if (!formData.level.trim()) newErrors.level = 'Level is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.salaryMin) newErrors.salaryMin = 'Minimum salary is required';
    if (!formData.salaryMax) newErrors.salaryMax = 'Maximum salary is required';
    if (!formData.requirements.trim()) newErrors.requirements = 'Requirements are required';
    if (!formData.responsibilities.trim()) newErrors.responsibilities = 'Responsibilities are required';
    if (!formData.skills.trim()) newErrors.skills = 'Skills are required';
    if (!formData.experience.trim()) newErrors.experience = 'Experience is required';
    if (!formData.education.trim()) newErrors.education = 'Education is required';
    if (!formData.createdDate) newErrors.createdDate = 'Created date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const roleData = {
        ...formData,
        salaryMin: parseFloat(formData.salaryMin),
        salaryMax: parseFloat(formData.salaryMax),
        requirements: formData.requirements.split('\n').filter(req => req.trim()),
        responsibilities: formData.responsibilities.split('\n').filter(resp => resp.trim()),
        skills: formData.skills.split('\n').filter(skill => skill.trim())
      };
      
      // Only add id for new roles, not when editing
      if (!initialData) {
        roleData.id = Date.now().toString();
      }
      
      onSave(roleData);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%' }}>
      {/* Header with close button */}
      <div style={{
        padding: '20px 24px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Shield size={20} color="var(--mc-sidebar-bg)" />
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
            {initialData ? 'Edit Role' : 'Add New Role'}
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

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1, minHeight: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Role Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              style={inputStyle(!!errors.title)}
              placeholder="e.g., Senior Software Engineer"
            />
            {errors.title && <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>{errors.title}</span>}
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
              <option value="">Select a department</option>
              {filteredDepartments.map(dept => (
                <option key={dept.id} value={dept.name}>{dept.name}</option>
              ))}
            </select>
            {errors.department && <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>{errors.department}</span>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Branch *
            </label>
            <select
              name="branch"
              value={formData.branch}
              onChange={handleInputChange}
              style={selectStyle(!!errors.branch)}
            >
              <option value="">Select a branch</option>
              {branches.map(branch => (
                <option key={branch.id} value={branch.name}>{branch.name}</option>
              ))}
            </select>
            {errors.branch && <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>{errors.branch}</span>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Level *
            </label>
            <input
              type="text"
              name="level"
              value={formData.level}
              onChange={handleInputChange}
              style={inputStyle(!!errors.level)}
              placeholder="e.g., Senior, Junior, Manager"
            />
            {errors.level && <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>{errors.level}</span>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Reports To
            </label>
            <input
              type="text"
              name="reportsTo"
              value={formData.reportsTo}
              onChange={handleInputChange}
              style={inputStyle(false)}
              placeholder="e.g., Engineering Manager"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              style={selectStyle(!!errors.status)}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Min Salary *
            </label>
            <input
              type="number"
              name="salaryMin"
              value={formData.salaryMin}
              onChange={handleInputChange}
              style={inputStyle(!!errors.salaryMin)}
              placeholder="e.g., 80000"
            />
            {errors.salaryMin && <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>{errors.salaryMin}</span>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Max Salary *
            </label>
            <input
              type="number"
              name="salaryMax"
              value={formData.salaryMax}
              onChange={handleInputChange}
              style={inputStyle(!!errors.salaryMax)}
              placeholder="e.g., 120000"
            />
            {errors.salaryMax && <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>{errors.salaryMax}</span>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Created Date *
            </label>
            <input
              type="date"
              name="createdDate"
              value={formData.createdDate}
              onChange={handleInputChange}
              style={inputStyle(!!errors.createdDate)}
            />
            {errors.createdDate && <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>{errors.createdDate}</span>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Experience Required *
            </label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              style={inputStyle(!!errors.experience)}
              placeholder="e.g., 5+ years"
            />
            {errors.experience && <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>{errors.experience}</span>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Education Required *
            </label>
            <input
              type="text"
              name="education"
              value={formData.education}
              onChange={handleInputChange}
              style={inputStyle(!!errors.education)}
              placeholder="e.g., Bachelor's in CS"
            />
            {errors.education && <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>{errors.education}</span>}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            style={inputStyle(!!errors.description)}
            placeholder="Provide a detailed job description"
          ></textarea>
          {errors.description && <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>{errors.description}</span>}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
            Requirements (one per line) *
          </label>
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleInputChange}
            rows={3}
            style={inputStyle(!!errors.requirements)}
            placeholder="e.g., Bachelor's degree, 5+ years experience, Strong communication skills"
          ></textarea>
          {errors.requirements && <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>{errors.requirements}</span>}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
            Responsibilities (one per line) *
          </label>
          <textarea
            name="responsibilities"
            value={formData.responsibilities}
            onChange={handleInputChange}
            rows={3}
            style={inputStyle(!!errors.responsibilities)}
            placeholder="e.g., Lead development projects, Code review, Mentor junior developers"
          ></textarea>
          {errors.responsibilities && <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>{errors.responsibilities}</span>}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
            Key Skills (one per line) *
          </label>
          <textarea
            name="skills"
            value={formData.skills}
            onChange={handleInputChange}
            rows={3}
            style={inputStyle(!!errors.skills)}
            placeholder="e.g., React, Node.js, AWS, SQL"
          ></textarea>
          {errors.skills && <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>{errors.skills}</span>}
        </div>
        </div>

        {/* Action Buttons */}
        <div style={{ 
          padding: '24px', 
          borderTop: '1px solid #e5e7eb', 
          display: 'flex', 
          gap: '12px', 
          justifyContent: 'flex-end',
          flexShrink: 0,
          backgroundColor: 'white'
        }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '12px 24px',
              borderRadius: '20px',
              border: '1px solid #d1d5db',
              backgroundColor: 'white',
              color: '#374151',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              padding: '12px 24px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: 'var(--mc-sidebar-bg-hover)',
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
            {initialData ? 'Update Role' : 'Save Role'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRoleForm;