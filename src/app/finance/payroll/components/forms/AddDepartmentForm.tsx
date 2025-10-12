import React, { useState } from 'react';
import { Briefcase, X, Save } from 'lucide-react';

interface AddDepartmentFormProps {
  onSave: (departmentData: any) => void;
  onCancel: () => void;
  branches: Array<{ id: string; name: string }>;
}

const AddDepartmentForm: React.FC<AddDepartmentFormProps> = ({ onSave, onCancel, branches }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    manager: '',
    branch: '',
    phone: '',
    email: '',
    establishedDate: '',
    monthlyBudget: '',
    annualBudget: '',
    status: 'active',
    objectives: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

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
    setFormData(prev => ({
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

    if (!formData.name.trim()) newErrors.name = 'Department name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.manager.trim()) newErrors.manager = 'Manager name is required';
    if (!formData.branch) newErrors.branch = 'Branch is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.establishedDate) newErrors.establishedDate = 'Established date is required';
    if (!formData.monthlyBudget) newErrors.monthlyBudget = 'Monthly budget is required';
    if (!formData.annualBudget) newErrors.annualBudget = 'Annual budget is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave({
        ...formData,
        id: Date.now().toString(),
        monthlyBudget: parseFloat(formData.monthlyBudget),
        annualBudget: parseFloat(formData.annualBudget),
        objectives: formData.objectives.split('\n').filter(obj => obj.trim()),
        expenses: []
      });
    }
  };

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
          <Briefcase size={20} color="var(--mc-sidebar-bg)" />
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
            Add New Department
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

      <form onSubmit={handleSubmit} style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Department Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              style={inputStyle(!!errors.name)}
              placeholder="Enter department name"
            />
            {errors.name && <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>{errors.name}</span>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Manager Name *
            </label>
            <input
              type="text"
              name="manager"
              value={formData.manager}
              onChange={handleInputChange}
              style={inputStyle(!!errors.manager)}
              placeholder="Enter manager name"
            />
            {errors.manager && <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>{errors.manager}</span>}
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
              Phone Number *
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
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Established Date *
            </label>
            <input
              type="date"
              name="establishedDate"
              value={formData.establishedDate}
              onChange={handleInputChange}
              style={inputStyle(!!errors.establishedDate)}
            />
            {errors.establishedDate && <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>{errors.establishedDate}</span>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Monthly Budget *
            </label>
            <input
              type="number"
              name="monthlyBudget"
              value={formData.monthlyBudget}
              onChange={handleInputChange}
              style={inputStyle(!!errors.monthlyBudget)}
              placeholder="Enter monthly budget"
            />
            {errors.monthlyBudget && <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>{errors.monthlyBudget}</span>}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
              Annual Budget *
            </label>
            <input
              type="number"
              name="annualBudget"
              value={formData.annualBudget}
              onChange={handleInputChange}
              style={inputStyle(!!errors.annualBudget)}
              placeholder="Enter annual budget"
            />
            {errors.annualBudget && <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>{errors.annualBudget}</span>}
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
            placeholder="Enter department description"
          ></textarea>
          {errors.description && <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' }}>{errors.description}</span>}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
            Objectives (one per line)
          </label>
          <textarea
            name="objectives"
            value={formData.objectives}
            onChange={handleInputChange}
            rows={3}
            style={inputStyle(false)}
            placeholder="Enter each objective on a new line"
          ></textarea>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: 'auto' }}>
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
            Save Department
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDepartmentForm;