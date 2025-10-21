'use client';

import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User,
  Phone,
  MapPin,
  Briefcase
} from 'lucide-react';
import { countries } from '../../../data/countries';

// Country codes mapping
const countryCodes = [
  { code: '+93', flag: '🇦🇫', country: 'Afghanistan' },
  { code: '+355', flag: '🇦🇱', country: 'Albania' },
  { code: '+213', flag: '🇩🇿', country: 'Algeria' },
  { code: '+1684', flag: '🇦🇸', country: 'American Samoa' },
  { code: '+376', flag: '🇦🇩', country: 'Andorra' },
  { code: '+244', flag: '🇦🇴', country: 'Angola' },
  { code: '+1264', flag: '🇦🇮', country: 'Anguilla' },
  { code: '+1268', flag: '🇦🇬', country: 'Antigua and Barbuda' },
  { code: '+54', flag: '🇦🇷', country: 'Argentina' },
  { code: '+374', flag: '🇦🇲', country: 'Armenia' },
  { code: '+297', flag: '🇦🇼', country: 'Aruba' },
  { code: '+61', flag: '🇦🇺', country: 'Australia' },
  { code: '+43', flag: '🇦🇹', country: 'Austria' },
  { code: '+994', flag: '🇦🇿', country: 'Azerbaijan' },
  { code: '+1242', flag: '🇧🇸', country: 'Bahamas' },
  { code: '+973', flag: '🇧🇭', country: 'Bahrain' },
  { code: '+880', flag: '🇧🇩', country: 'Bangladesh' },
  { code: '+1246', flag: '🇧🇧', country: 'Barbados' },
  { code: '+375', flag: '🇧🇾', country: 'Belarus' },
  { code: '+32', flag: '🇧🇪', country: 'Belgium' },
  { code: '+501', flag: '🇧🇿', country: 'Belize' },
  { code: '+229', flag: '🇧🇯', country: 'Benin' },
  { code: '+1441', flag: '🇧🇲', country: 'Bermuda' },
  { code: '+975', flag: '🇧🇹', country: 'Bhutan' },
  { code: '+591', flag: '🇧🇴', country: 'Bolivia' },
  { code: '+387', flag: '🇧🇦', country: 'Bosnia and Herzegovina' },
  { code: '+267', flag: '🇧🇼', country: 'Botswana' },
  { code: '+55', flag: '🇧🇷', country: 'Brazil' },
  { code: '+673', flag: '🇧🇳', country: 'Brunei' },
  { code: '+359', flag: '🇧🇬', country: 'Bulgaria' },
  { code: '+226', flag: '🇧🇫', country: 'Burkina Faso' },
  { code: '+257', flag: '🇧🇮', country: 'Burundi' },
  { code: '+855', flag: '🇰🇭', country: 'Cambodia' },
  { code: '+237', flag: '🇨🇲', country: 'Cameroon' },
  { code: '+1', flag: '🇨🇦', country: 'Canada' },
  { code: '+238', flag: '🇨🇻', country: 'Cape Verde' },
  { code: '+1345', flag: '🇰🇾', country: 'Cayman Islands' },
  { code: '+236', flag: '🇨🇫', country: 'Central African Republic' },
  { code: '+235', flag: '🇹🇩', country: 'Chad' },
  { code: '+56', flag: '🇨🇱', country: 'Chile' },
  { code: '+86', flag: '🇨🇳', country: 'China' },
  { code: '+57', flag: '🇨🇴', country: 'Colombia' },
  { code: '+269', flag: '🇰🇲', country: 'Comoros' },
  { code: '+242', flag: '🇨🇬', country: 'Congo' },
  { code: '+243', flag: '🇨🇩', country: 'Congo DR' },
  { code: '+682', flag: '🇨🇰', country: 'Cook Islands' },
  { code: '+506', flag: '🇨🇷', country: 'Costa Rica' },
  { code: '+225', flag: '🇨🇮', country: 'Côte d\'Ivoire' },
  { code: '+385', flag: '🇭🇷', country: 'Croatia' },
  { code: '+53', flag: '🇨🇺', country: 'Cuba' },
  { code: '+357', flag: '🇨🇾', country: 'Cyprus' },
  { code: '+420', flag: '🇨🇿', country: 'Czech Republic' },
  { code: '+45', flag: '🇩🇰', country: 'Denmark' },
  { code: '+253', flag: '🇩🇯', country: 'Djibouti' },
  { code: '+1767', flag: '🇩🇲', country: 'Dominica' },
  { code: '+1809', flag: '🇩🇴', country: 'Dominican Republic' },
  { code: '+593', flag: '🇪🇨', country: 'Ecuador' },
  { code: '+20', flag: '🇪🇬', country: 'Egypt' },
  { code: '+503', flag: '🇸🇻', country: 'El Salvador' },
  { code: '+240', flag: '🇬🇶', country: 'Equatorial Guinea' },
  { code: '+291', flag: '🇪🇷', country: 'Eritrea' },
  { code: '+372', flag: '🇪🇪', country: 'Estonia' },
  { code: '+251', flag: '🇪🇹', country: 'Ethiopia' },
  { code: '+679', flag: '🇫🇯', country: 'Fiji' },
  { code: '+358', flag: '🇫🇮', country: 'Finland' },
  { code: '+33', flag: '🇫🇷', country: 'France' },
  { code: '+594', flag: '🇬🇫', country: 'French Guiana' },
  { code: '+689', flag: '🇵🇫', country: 'French Polynesia' },
  { code: '+241', flag: '🇬🇦', country: 'Gabon' },
  { code: '+220', flag: '🇬🇲', country: 'Gambia' },
  { code: '+995', flag: '🇬🇪', country: 'Georgia' },
  { code: '+49', flag: '🇩🇪', country: 'Germany' },
  { code: '+233', flag: '🇬🇭', country: 'Ghana' },
  { code: '+350', flag: '🇬🇮', country: 'Gibraltar' },
  { code: '+30', flag: '🇬🇷', country: 'Greece' },
  { code: '+299', flag: '🇬🇱', country: 'Greenland' },
  { code: '+1473', flag: '🇬🇩', country: 'Grenada' },
  { code: '+590', flag: '🇬🇵', country: 'Guadeloupe' },
  { code: '+1671', flag: '🇬🇺', country: 'Guam' },
  { code: '+502', flag: '🇬🇹', country: 'Guatemala' },
  { code: '+224', flag: '🇬🇳', country: 'Guinea' },
  { code: '+245', flag: '🇬🇼', country: 'Guinea-Bissau' },
  { code: '+592', flag: '🇬🇾', country: 'Guyana' },
  { code: '+509', flag: '🇭🇹', country: 'Haiti' },
  { code: '+379', flag: '🇻🇦', country: 'Vatican' },
  { code: '+504', flag: '🇭🇳', country: 'Honduras' },
  { code: '+852', flag: '🇭🇰', country: 'Hong Kong' },
  { code: '+36', flag: '🇭🇺', country: 'Hungary' },
  { code: '+354', flag: '🇮🇸', country: 'Iceland' },
  { code: '+91', flag: '🇮🇳', country: 'India' },
  { code: '+62', flag: '🇮🇩', country: 'Indonesia' },
  { code: '+98', flag: '🇮🇷', country: 'Iran' },
  { code: '+964', flag: '🇮🇶', country: 'Iraq' },
  { code: '+353', flag: '🇮🇪', country: 'Ireland' },
  { code: '+972', flag: '🇮🇱', country: 'Israel' },
  { code: '+39', flag: '🇮🇹', country: 'Italy' },
  { code: '+1876', flag: '🇯🇲', country: 'Jamaica' },
  { code: '+81', flag: '🇯🇵', country: 'Japan' },
  { code: '+962', flag: '🇯🇴', country: 'Jordan' },
  { code: '+7', flag: '🇰🇿', country: 'Kazakhstan' },
  { code: '+254', flag: '🇰🇪', country: 'Kenya' },
  { code: '+686', flag: '🇰🇮', country: 'Kiribati' },
  { code: '+850', flag: '🇰🇵', country: 'North Korea' },
  { code: '+82', flag: '🇰🇷', country: 'South Korea' },
  { code: '+965', flag: '🇰🇼', country: 'Kuwait' },
  { code: '+996', flag: '🇰🇬', country: 'Kyrgyzstan' },
  { code: '+856', flag: '🇱🇦', country: 'Laos' },
  { code: '+371', flag: '🇱🇻', country: 'Latvia' },
  { code: '+961', flag: '🇱🇧', country: 'Lebanon' },
  { code: '+266', flag: '🇱🇸', country: 'Lesotho' },
  { code: '+231', flag: '🇱🇷', country: 'Liberia' },
  { code: '+218', flag: '🇱🇾', country: 'Libya' },
  { code: '+423', flag: '🇱🇮', country: 'Liechtenstein' },
  { code: '+370', flag: '🇱🇹', country: 'Lithuania' },
  { code: '+352', flag: '🇱🇺', country: 'Luxembourg' },
  { code: '+853', flag: '🇲🇴', country: 'Macao' },
  { code: '+389', flag: '🇲🇰', country: 'North Macedonia' },
  { code: '+261', flag: '🇲🇬', country: 'Madagascar' },
  { code: '+265', flag: '🇲🇼', country: 'Malawi' },
  { code: '+60', flag: '🇲🇾', country: 'Malaysia' },
  { code: '+960', flag: '🇲🇻', country: 'Maldives' },
  { code: '+223', flag: '🇲🇱', country: 'Mali' },
  { code: '+356', flag: '🇲🇹', country: 'Malta' },
  { code: '+692', flag: '🇲🇭', country: 'Marshall Islands' },
  { code: '+596', flag: '🇲🇶', country: 'Martinique' },
  { code: '+222', flag: '🇲🇷', country: 'Mauritania' },
  { code: '+230', flag: '🇲🇺', country: 'Mauritius' },
  { code: '+262', flag: '🇾🇹', country: 'Mayotte' },
  { code: '+52', flag: '🇲🇽', country: 'Mexico' },
  { code: '+691', flag: '🇫🇲', country: 'Micronesia' },
  { code: '+373', flag: '🇲🇩', country: 'Moldova' },
  { code: '+377', flag: '🇲🇨', country: 'Monaco' },
  { code: '+976', flag: '🇲🇳', country: 'Mongolia' },
  { code: '+382', flag: '🇲🇪', country: 'Montenegro' },
  { code: '+1664', flag: '🇲🇸', country: 'Montserrat' },
  { code: '+212', flag: '🇲🇦', country: 'Morocco' },
  { code: '+258', flag: '🇲🇿', country: 'Mozambique' },
  { code: '+95', flag: '🇲🇲', country: 'Myanmar' },
  { code: '+264', flag: '🇳🇦', country: 'Namibia' },
  { code: '+674', flag: '🇳🇷', country: 'Nauru' },
  { code: '+977', flag: '🇳🇵', country: 'Nepal' },
  { code: '+31', flag: '🇳🇱', country: 'Netherlands' },
  { code: '+687', flag: '🇳🇨', country: 'New Caledonia' },
  { code: '+64', flag: '🇳🇿', country: 'New Zealand' },
  { code: '+505', flag: '🇳🇮', country: 'Nicaragua' },
  { code: '+227', flag: '🇳🇪', country: 'Niger' },
  { code: '+234', flag: '🇳🇬', country: 'Nigeria' },
  { code: '+683', flag: '🇳🇺', country: 'Niue' },
  { code: '+672', flag: '🇳🇫', country: 'Norfolk Island' },
  { code: '+1670', flag: '🇲🇵', country: 'Northern Mariana Islands' },
  { code: '+47', flag: '🇳🇴', country: 'Norway' },
  { code: '+968', flag: '🇴🇲', country: 'Oman' },
  { code: '+92', flag: '🇵🇰', country: 'Pakistan' },
  { code: '+680', flag: '🇵🇼', country: 'Palau' },
  { code: '+970', flag: '🇵🇸', country: 'Palestine' },
  { code: '+507', flag: '🇵🇦', country: 'Panama' },
  { code: '+675', flag: '🇵🇬', country: 'Papua New Guinea' },
  { code: '+595', flag: '🇵🇾', country: 'Paraguay' },
  { code: '+51', flag: '🇵🇪', country: 'Peru' },
  { code: '+63', flag: '🇵🇭', country: 'Philippines' },
  { code: '+64', flag: '🇵🇳', country: 'Pitcairn' },
  { code: '+48', flag: '🇵🇱', country: 'Poland' },
  { code: '+351', flag: '🇵🇹', country: 'Portugal' },
  { code: '+1787', flag: '🇵🇷', country: 'Puerto Rico' },
  { code: '+974', flag: '🇶🇦', country: 'Qatar' },
  { code: '+262', flag: '🇷🇪', country: 'Réunion' },
  { code: '+40', flag: '🇷🇴', country: 'Romania' },
  { code: '+7', flag: '🇷🇺', country: 'Russia' },
  { code: '+250', flag: '🇷🇼', country: 'Rwanda' },
  { code: '+290', flag: '🇸🇭', country: 'Saint Helena' },
  { code: '+1869', flag: '🇰🇳', country: 'Saint Kitts and Nevis' },
  { code: '+1758', flag: '🇱🇨', country: 'Saint Lucia' },
  { code: '+508', flag: '🇵🇲', country: 'Saint Pierre and Miquelon' },
  { code: '+1784', flag: '🇻🇨', country: 'Saint Vincent and the Grenadines' },
  { code: '+685', flag: '🇼🇸', country: 'Samoa' },
  { code: '+378', flag: '🇸🇲', country: 'San Marino' },
  { code: '+239', flag: '🇸🇹', country: 'São Tomé and Príncipe' },
  { code: '+966', flag: '🇸🇦', country: 'Saudi Arabia' },
  { code: '+221', flag: '🇸🇳', country: 'Senegal' },
  { code: '+381', flag: '🇷🇸', country: 'Serbia' },
  { code: '+248', flag: '🇸🇨', country: 'Seychelles' },
  { code: '+232', flag: '🇸🇱', country: 'Sierra Leone' },
  { code: '+65', flag: '🇸🇬', country: 'Singapore' },
  { code: '+421', flag: '🇸🇰', country: 'Slovakia' },
  { code: '+386', flag: '🇸🇮', country: 'Slovenia' },
  { code: '+677', flag: '🇸🇧', country: 'Solomon Islands' },
  { code: '+252', flag: '🇸🇴', country: 'Somalia' },
  { code: '+27', flag: '🇿🇦', country: 'South Africa' },
  { code: '+211', flag: '🇸🇸', country: 'South Sudan' },
  { code: '+34', flag: '🇪🇸', country: 'Spain' },
  { code: '+94', flag: '🇱🇰', country: 'Sri Lanka' },
  { code: '+249', flag: '🇸🇩', country: 'Sudan' },
  { code: '+597', flag: '🇸🇷', country: 'Suriname' },
  { code: '+268', flag: '🇸🇿', country: 'Eswatini' },
  { code: '+46', flag: '🇸🇪', country: 'Sweden' },
  { code: '+41', flag: '🇨🇭', country: 'Switzerland' },
  { code: '+963', flag: '🇸🇾', country: 'Syria' },
  { code: '+886', flag: '🇹🇼', country: 'Taiwan' },
  { code: '+992', flag: '🇹🇯', country: 'Tajikistan' },
  { code: '+255', flag: '🇹🇿', country: 'Tanzania' },
  { code: '+66', flag: '🇹🇭', country: 'Thailand' },
  { code: '+670', flag: '🇹🇱', country: 'Timor-Leste' },
  { code: '+228', flag: '🇹🇬', country: 'Togo' },
  { code: '+690', flag: '🇹🇰', country: 'Tokelau' },
  { code: '+676', flag: '🇹🇴', country: 'Tonga' },
  { code: '+1868', flag: '🇹🇹', country: 'Trinidad and Tobago' },
  { code: '+216', flag: '🇹🇳', country: 'Tunisia' },
  { code: '+90', flag: '🇹🇷', country: 'Turkey' },
  { code: '+993', flag: '🇹🇲', country: 'Turkmenistan' },
  { code: '+1649', flag: '🇹🇨', country: 'Turks and Caicos Islands' },
  { code: '+688', flag: '🇹🇻', country: 'Tuvalu' },
  { code: '+256', flag: '🇺🇬', country: 'Uganda' },
  { code: '+380', flag: '🇺🇦', country: 'Ukraine' },
  { code: '+971', flag: '🇦🇪', country: 'United Arab Emirates' },
  { code: '+44', flag: '🇬🇧', country: 'United Kingdom' },
  { code: '+1', flag: '🇺🇸', country: 'United States' },
  { code: '+598', flag: '🇺🇾', country: 'Uruguay' },
  { code: '+998', flag: '🇺🇿', country: 'Uzbekistan' },
  { code: '+678', flag: '🇻🇺', country: 'Vanuatu' },
  { code: '+58', flag: '🇻🇪', country: 'Venezuela' },
  { code: '+84', flag: '🇻🇳', country: 'Vietnam' },
  { code: '+1284', flag: '🇻🇬', country: 'Virgin Islands (British)' },
  { code: '+1340', flag: '🇻🇮', country: 'Virgin Islands (U.S.)' },
  { code: '+681', flag: '🇼🇫', country: 'Wallis and Futuna' },
  { code: '+967', flag: '🇾🇪', country: 'Yemen' },
  { code: '+260', flag: '🇿🇲', country: 'Zambia' },
  { code: '+263', flag: '🇿🇼', country: 'Zimbabwe' }
];

export default function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    country: 'Tanzania, United Republic of',
    city: '',
    email: '',
    phone: '',
    businessName: '',
    address: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.country) {
      newErrors.country = 'Country is required';
    }
    
    if (!formData.city) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{9,15}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.businessName) {
      newErrors.businessName = 'Business name is required';
    }
    
    if (!formData.address) {
      newErrors.address = 'Address is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = '/';
    }, 2000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'Poppins, system-ui, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '550px',
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e5e7eb'
      }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#1f2937',
            margin: '0 0 8px 0'
          }}>
            Create Account
          </h1>
          
          <p style={{
            fontSize: '16px',
            color: '#6b7280',
            margin: 0
          }}>
            Join arisportal to manage your business operations
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Name Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                First Name
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }}>
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First name"
                  style={{
                    width: '100%',
                    padding: '10px 10px 10px 38px',
                    border: `1px solid ${errors.firstName ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '20px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: 'white',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.firstName ? '#ef4444' : '#d1d5db';
                  }}
                />
              </div>
              {errors.firstName && (
                <p style={{
                  fontSize: '12px',
                  color: '#ef4444',
                  margin: '4px 0 0 0'
                }}>
                  {errors.firstName}
                </p>
              )}
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Last Name
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }}>
                  <User size={18} />
                </div>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last name"
                  style={{
                    width: '100%',
                    padding: '10px 10px 10px 38px',
                    border: `1px solid ${errors.lastName ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '20px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: 'white',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.lastName ? '#ef4444' : '#d1d5db';
                  }}
                />
              </div>
              {errors.lastName && (
                <p style={{
                  fontSize: '12px',
                  color: '#ef4444',
                  margin: '4px 0 0 0'
                }}>
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Country and City Fields (Pair) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Country Field */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Country
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: `1px solid ${errors.country ? '#ef4444' : '#d1d5db'}`,
                  borderRadius: '20px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: 'white',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = errors.country ? '#ef4444' : '#d1d5db';
                }}
              >
                {countries.map((country) => (
                  <option key={country.code} value={country.name}>
                    {country.name}
                  </option>
                ))}
            </select>
              {errors.country && (
                <p style={{
                  fontSize: '12px',
                  color: '#ef4444',
                  margin: '4px 0 0 0'
                }}>
                  {errors.country}
                </p>
              )}
            </div>

            {/* City Field */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                City
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }}>
                  <MapPin size={18} />
                </div>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter your city"
                  style={{
                    width: '100%',
                    padding: '10px 10px 10px 38px',
                    border: `1px solid ${errors.city ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '20px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: 'white',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.city ? '#ef4444' : '#d1d5db';
                  }}
                />
              </div>
              {errors.city && (
                <p style={{
                  fontSize: '12px',
                  color: '#ef4444',
                  margin: '4px 0 0 0'
                }}>
                  {errors.city}
                </p>
              )}
            </div>
          </div>

          {/* Email and Phone Fields (Pair) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Email Field */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Email
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }}>
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  style={{
                    width: '100%',
                    padding: '10px 10px 10px 38px',
                    border: `1px solid ${errors.email ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '20px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: 'white',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.email ? '#ef4444' : '#d1d5db';
                  }}
                />
              </div>
              {errors.email && (
                <p style={{
                  fontSize: '12px',
                  color: '#ef4444',
                  margin: '4px 0 0 0'
                }}>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone Number Field */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Phone Number
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }}>
                  <Phone size={18} />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  style={{
                    width: '100%',
                    padding: '10px 10px 10px 38px',
                    border: `1px solid ${errors.phone ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '20px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: 'white',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.phone ? '#ef4444' : '#d1d5db';
                  }}
                />
              </div>
              {errors.phone && (
                <p style={{
                  fontSize: '12px',
                  color: '#ef4444',
                  margin: '4px 0 0 0'
                }}>
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          {/* Business Name and Address Fields (Pair) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Business Name Field */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Business Name
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }}>
                  <Briefcase size={18} />
                </div>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  placeholder="Enter business name"
                  style={{
                    width: '100%',
                    padding: '10px 10px 10px 38px',
                    border: `1px solid ${errors.businessName ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '20px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: 'white',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.businessName ? '#ef4444' : '#d1d5db';
                  }}
                />
              </div>
              {errors.businessName && (
                <p style={{
                  fontSize: '12px',
                  color: '#ef4444',
                  margin: '4px 0 0 0'
                }}>
                  {errors.businessName}
                </p>
              )}
            </div>

            {/* Address Field */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Address
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }}>
                  <MapPin size={18} />
                </div>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your address"
                  style={{
                    width: '100%',
                    padding: '10px 10px 10px 38px',
                    border: `1px solid ${errors.address ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '20px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: 'white',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.address ? '#ef4444' : '#d1d5db';
                  }}
                />
              </div>
              {errors.address && (
                <p style={{
                  fontSize: '12px',
                  color: '#ef4444',
                  margin: '4px 0 0 0'
                }}>
                  {errors.address}
                </p>
              )}
            </div>
          </div>

          {/* Password and Confirm Password Fields (Pair) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Password Field */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }}>
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password"
                  style={{
                    width: '100%',
                    padding: '10px 38px 10px 38px',
                    border: `1px solid ${errors.password ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '20px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: 'white',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.password ? '#ef4444' : '#d1d5db';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#9ca3af',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p style={{
                  fontSize: '12px',
                  color: '#ef4444',
                  margin: '4px 0 0 0'
                }}>
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <div style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af'
                }}>
                  <Lock size={18} />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  style={{
                    width: '100%',
                    padding: '10px 38px 10px 38px',
                    border: `1px solid ${errors.confirmPassword ? '#ef4444' : '#d1d5db'}`,
                    borderRadius: '20px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border-color 0.2s',
                    backgroundColor: 'white',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--mc-sidebar-bg)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = errors.confirmPassword ? '#ef4444' : '#d1d5db';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#9ca3af',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p style={{
                  fontSize: '12px',
                  color: '#ef4444',
                  margin: '4px 0 0 0'
                }}>
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Terms Agreement */}
          <div>
            <label style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#4b5563',
              lineHeight: '1.4'
            }}>
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                style={{
                  width: '16px',
                  height: '16px',
                  accentColor: 'var(--mc-sidebar-bg)',
                  marginTop: '2px'
                }}
              />
              <span>
                I agree to the <a href="/terms" style={{ color: 'var(--mc-sidebar-bg)', textDecoration: 'none' }}>Terms and Conditions</a> and <a href="/privacy" style={{ color: 'var(--mc-sidebar-bg)', textDecoration: 'none' }}>Privacy Policy</a>
              </span>
            </label>
            {errors.agreeToTerms && (
              <p style={{
                fontSize: '12px',
                color: '#ef4444',
                margin: '4px 0 0 0'
              }}>
                {errors.agreeToTerms}
              </p>
            )}
          </div>

          {/* Create Account Button */}
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: isLoading ? '#9ca3af' : 'var(--mc-sidebar-bg)',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg-hover)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.backgroundColor = 'var(--mc-sidebar-bg)';
              }
            }}
          >
            {isLoading ? (
              'Creating Account...'
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Login Link */}
        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          paddingTop: '24px',
          borderTop: '1px solid #e5e7eb'
        }}>
          <p style={{ fontSize: '14px', color: '#6b7280', margin: '0 0 4px 0' }}>
            Already have an account?
          </p>
          <a href="/authentication/login" style={{
            fontSize: '14px',
            color: 'var(--mc-sidebar-bg)',
            textDecoration: 'none',
            fontWeight: '500'
          }}>
            Login
          </a>
        </div>
      </div>
    </div>
  );
}