import React, { useState } from 'react';
import {
  Plus,
  X,
  Building,
  Briefcase,
  Shield,
  User,
  ChevronDown
} from 'lucide-react';

// Import form components
import AddBranchForm from './forms/AddBranchForm';
import AddDepartmentForm from './forms/AddDepartmentForm';
import AddRoleForm from './forms/AddRoleForm';
import AddStaffForm from './forms/AddStaffForm';

interface AddNewModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalType: 'branch' | 'department' | 'role' | 'staff';
  branches: Array<{ id: string; name: string }>;
  departments: Array<{ id: string; name: string }>;
  roles: Array<{ id: string; name: string }>;
  onAddBranch?: (branchData: any) => void;
  onAddDepartment?: (departmentData: any) => void;
  onAddRole?: (roleData: any) => void;
  onAddStaff?: (staffData: any) => void;
}

const AddNewModal: React.FC<AddNewModalProps> = ({
  isOpen,
  onClose,
  modalType,
  branches,
  departments,
  roles,
  onAddBranch,
  onAddDepartment,
  onAddRole,
  onAddStaff
}) => {

  const entityTypes = [
    {
      id: 'branch',
      label: 'Branch',
      icon: <Building size={20} />,
      description: 'Add a new branch location'
    },
    {
      id: 'department',
      label: 'Department',
      icon: <Briefcase size={20} />,
      description: 'Add a new department'
    },
    {
      id: 'role',
      label: 'Role',
      icon: <Shield size={20} />,
      description: 'Add a new job role'
    },
    {
      id: 'staff',
      label: 'Staff Member',
      icon: <User size={20} />,
      description: 'Add a new staff member'
    }
  ];

  const handleFormSave = (data: any) => {
    switch (modalType) {
      case 'branch':
        onAddBranch?.(data);
        break;
      case 'department':
        onAddDepartment?.(data);
        break;
      case 'role':
        onAddRole?.(data);
        break;
      case 'staff':
        onAddStaff?.(data);
        break;
    }
    handleClose();
  };

  const handleFormCancel = () => {
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  const renderForm = () => {
    const commonProps = {
      onSave: handleFormSave,
      onCancel: handleFormCancel
    };

    switch (modalType) {
      case 'branch':
        return <AddBranchForm {...commonProps} />;
      case 'department':
        return <AddDepartmentForm {...commonProps} branches={branches} />;
      case 'role':
        return <AddRoleForm {...commonProps} branches={branches} departments={departments} />;
      case 'staff':
        return <AddStaffForm {...commonProps} branches={branches} departments={departments} roles={roles} />;
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        width: '90%',
        maxWidth: '1000px',
        maxHeight: '90vh',
        overflow: 'auto',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}>
        {/* Show the form directly */}
        {renderForm()}
      </div>
    </div>
  );
};

export default AddNewModal;
