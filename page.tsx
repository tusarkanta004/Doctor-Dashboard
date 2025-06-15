'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  medicalLicense: string;
  experience: string;
  medicalSchool: string;
  graduationYear: string;
  specializations: string[];
  clinicName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  consultationFee: string;
  licenseDocument: File | null;
  profilePhoto: File | null;
  bio: string;
  terms: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const DoctorRegistration: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    medicalLicense: '',
    experience: '',
    medicalSchool: '',
    graduationYear: '',
    specializations: [],
    clinicName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    consultationFee: '',
    licenseDocument: null,
    profilePhoto: null,
    bio: '',
    terms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [progress, setProgress] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  
  const licenseInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const specializations = [
    { id: 'cardiology', label: 'Cardiology' },
    { id: 'dermatology', label: 'Dermatology' },
    { id: 'neurology', label: 'Neurology' },
    { id: 'pediatrics', label: 'Pediatrics' },
    { id: 'orthopedics', label: 'Orthopedics' },
    { id: 'psychiatry', label: 'Psychiatry' },
    { id: 'surgery', label: 'General Surgery' },
    { id: 'internal', label: 'Internal Medicine' },
  ];

  const requiredFields = [
    'firstName', 'lastName', 'email', 'phone', 'dateOfBirth', 'gender',
    'medicalLicense', 'experience', 'medicalSchool', 'graduationYear',
    'clinicName', 'address', 'city', 'state', 'zipCode', 'consultationFee',
    'terms'
  ];

  // Update progress bar
  useEffect(() => {
    let filledFields = 0;
    
    requiredFields.forEach(field => {
      if (field === 'terms') {
        if (formData.terms) filledFields++;
      } else if (field === 'specializations') {
        if (formData.specializations.length > 0) filledFields++;
      } else {
        const value = formData[field as keyof FormData];
        if (typeof value === 'string' && value.trim() !== '') filledFields++;
      }
    });

    // Include specializations as required
    if (formData.specializations.length > 0) filledFields++;
    
    const totalFields = requiredFields.length + 1; // +1 for specializations
    const progressPercent = (filledFields / totalFields) * 100;
    setProgress(progressPercent);
  }, [formData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSpecializationChange = (specializationId: string) => {
    setFormData(prev => ({
      ...prev,
      specializations: prev.specializations.includes(specializationId)
        ? prev.specializations.filter(id => id !== specializationId)
        : [...prev.specializations, specializationId]
    }));

    // Clear specializations error
    if (errors.specializations) {
      setErrors(prev => ({ ...prev, specializations: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'licenseDocument' | 'profilePhoto') => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, [fieldName]: file }));

    // Clear error when file is selected
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const re = /^[\+]?[1-9][\d]{0,15}$/;
    return re.test(phone.replace(/\s/g, ''));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Required field validation
    requiredFields.forEach(field => {
      if (field === 'terms') {
        if (!formData.terms) {
          newErrors[field] = 'You must agree to the terms and conditions';
        }
      } else {
        const value = formData[field as keyof FormData];
        if (typeof value === 'string' && value.trim() === '') {
          newErrors[field] = 'This field is required';
        }
      }
    });

    // Specializations validation
    if (formData.specializations.length === 0) {
      newErrors.specializations = 'Please select at least one specialization';
    }

    // License document validation
    if (!formData.licenseDocument) {
      newErrors.licenseDocument = 'Medical license document is required';
    }

    // Email validation
    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Experience validation
    const experience = parseInt(formData.experience);
    if (formData.experience && (experience < 0 || experience > 50)) {
      newErrors.experience = 'Experience must be between 0 and 50 years';
    }

    // Graduation year validation
    const graduationYear = parseInt(formData.graduationYear);
    const currentYear = new Date().getFullYear();
    if (formData.graduationYear && (graduationYear < 1950 || graduationYear > currentYear)) {
      newErrors.graduationYear = `Graduation year must be between 1950 and ${currentYear}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.getElementById(firstErrorField);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setShowSuccess(true);
      
      // Redirect after success
      setTimeout(() => {
        router.push('/doctor-dashboard');
      }, 3000);
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveDraft = () => {
    // In a real application, save to API or localStorage
    const draftData = { ...formData };
    console.log('Draft saved:', draftData);
    alert('Draft saved successfully!');
  };

  const goBack = () => {
    if (confirm('Are you sure you want to go back? Any unsaved changes will be lost.')) {
      router.back();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-800 flex items-center justify-center p-4 lg:p-8">
      {/* Back Button */}
      <button
        onClick={goBack}
        className="absolute top-8 left-8 bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full font-medium transition-all duration-300 hover:bg-white/30 hover:-translate-x-1"
      >
        ← Back to Home
      </button>

      <div className="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 max-w-4xl w-full overflow-hidden animate-[slideIn_0.8s_ease]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-8 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-white/10 animate-pulse" />
          <h1 className="text-4xl font-bold mb-2 relative z-10">👨‍⚕️ Doctor Registration</h1>
          <p className="text-xl opacity-90 relative z-10">Join our network of healthcare professionals</p>
          
          {/* Progress Bar */}
          <div className="w-full h-1 bg-white/30 rounded-full mt-4 overflow-hidden">
            <div 
              className="h-full bg-white/80 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-500 text-white p-4 text-center">
            ✅ Registration submitted successfully! We will review your application and contact you within 24-48 hours.
          </div>
        )}

        {/* Form Content */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-base transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-blue-100 ${
                    errors.firstName ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500 hover:-translate-y-0.5'
                  }`}
                />
                {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-base transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-blue-100 ${
                    errors.lastName ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500 hover:-translate-y-0.5'
                  }`}
                />
                {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-base transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-blue-100 ${
                    errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500 hover:-translate-y-0.5'
                  }`}
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-base transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-blue-100 ${
                    errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500 hover:-translate-y-0.5'
                  }`}
                />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-gray-700">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-base transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-blue-100 ${
                    errors.dateOfBirth ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500 hover:-translate-y-0.5'
                  }`}
                />
                {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="gender" className="block text-sm font-semibold text-gray-700">
                  Gender *
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-base transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-blue-100 ${
                    errors.gender ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500 hover:-translate-y-0.5'
                  }`}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
                {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
              </div>
            </div>

            {/* Professional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="medicalLicense" className="block text-sm font-semibold text-gray-700">
                  Medical License Number *
                </label>
                <input
                  type="text"
                  id="medicalLicense"
                  name="medicalLicense"
                  value={formData.medicalLicense}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-base transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-blue-100 ${
                    errors.medicalLicense ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500 hover:-translate-y-0.5'
                  }`}
                />
                {errors.medicalLicense && <p className="text-red-500 text-sm">{errors.medicalLicense}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="experience" className="block text-sm font-semibold text-gray-700">
                  Years of Experience *
                </label>
                <input
                  type="number"
                  id="experience"
                  name="experience"
                  min="0"
                  max="50"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-base transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-blue-100 ${
                    errors.experience ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500 hover:-translate-y-0.5'
                  }`}
                />
                {errors.experience && <p className="text-red-500 text-sm">{errors.experience}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="medicalSchool" className="block text-sm font-semibold text-gray-700">
                  Medical School *
                </label>
                <input
                  type="text"
                  id="medicalSchool"
                  name="medicalSchool"
                  value={formData.medicalSchool}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-base transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-blue-100 ${
                    errors.medicalSchool ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500 hover:-translate-y-0.5'
                  }`}
                />
                {errors.medicalSchool && <p className="text-red-500 text-sm">{errors.medicalSchool}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="graduationYear" className="block text-sm font-semibold text-gray-700">
                  Graduation Year *
                </label>
                <input
                  type="number"
                  id="graduationYear"
                  name="graduationYear"
                  min="1950"
                  max="2024"
                  value={formData.graduationYear}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-base transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-blue-100 ${
                    errors.graduationYear ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500 hover:-translate-y-0.5'
                  }`}
                />
                {errors.graduationYear && <p className="text-red-500 text-sm">{errors.graduationYear}</p>}
              </div>
            </div>

            {/* Specializations */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Specializations *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {specializations.map((spec) => (
                  <div
                    key={spec.id}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    <input
                      type="checkbox"
                      id={spec.id}
                      checked={formData.specializations.includes(spec.id)}
                      onChange={() => handleSpecializationChange(spec.id)}
                      className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={spec.id} className="text-sm font-medium text-gray-700 cursor-pointer">
                      {spec.label}
                    </label>
                  </div>
                ))}
              </div>
              {errors.specializations && <p className="text-red-500 text-sm">{errors.specializations}</p>}
            </div>

            {/* Practice Information */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="clinicName" className="block text-sm font-semibold text-gray-700">
                  Clinic/Hospital Name *
                </label>
                <input
                  type="text"
                  id="clinicName"
                  name="clinicName"
                  value={formData.clinicName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-base transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-blue-100 ${
                    errors.clinicName ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500 hover:-translate-y-0.5'
                  }`}
                />
                {errors.clinicName && <p className="text-red-500 text-sm">{errors.clinicName}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="block text-sm font-semibold text-gray-700">
                  Practice Address *
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter your practice address"
                  rows={3}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-base transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-blue-100 resize-vertical ${
                    errors.address ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500 hover:-translate-y-0.5'
                  }`}
                />
                {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label htmlFor="city" className="block text-sm font-semibold text-gray-700">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl text-base transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-blue-100 ${
                      errors.city ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500 hover:-translate-y-0.5'
                    }`}
                  />
                  {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="state" className="block text-sm font-semibold text-gray-700">
                    State *
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl text-base transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-blue-100 ${
                      errors.state ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500 hover:-translate-y-0.5'
                    }`}
                  />
                  {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="zipCode" className="block text-sm font-semibold text-gray-700">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl text-base transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-blue-100 ${
                      errors.zipCode ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500 hover:-translate-y-0.5'
                    }`}
                  />
                  {errors.zipCode && <p className="text-red-500 text-sm">{errors.zipCode}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="consultationFee" className="block text-sm font-semibold text-gray-700">
                  Consultation Fee ($) *
                </label>
                <input
                  type="number"
                  id="consultationFee"
                  name="consultationFee"
                  min="0"
                  step="0.01"
                  value={formData.consultationFee}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl text-base transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-blue-100 ${
                    errors.consultationFee ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500 hover:-translate-y-0.5'
                  }`}
                />
                {errors.consultationFee && <p className="text-red-500 text-sm">{errors.consultationFee}</p>}
              </div>
            </div>

            {/* Document Upload */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="licenseDocument" className="block text-sm font-semibold text-gray-700">
                  Medical License Document *
                </label>
                <div
                  onClick={() => licenseInputRef.current?.click()}
                  className={`w-full p-4 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all duration-300 hover:border-blue-500 hover:bg-blue-50 ${
                    errors.licenseDocument ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <input
                    ref={licenseInputRef}
                    type="file"
                    id="licenseDocument"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(e, 'licenseDocument')}
                    className="hidden"
                  />
                  <div className="text-gray-600">
                    {formData.licenseDocument ? (
                      <span className="text-green-600">✅ {formData.licenseDocument.name}</span>
                    ) : (
                      <span>📄 Upload License Document</span>
                    )}
                  </div>
                </div>
                {errors.licenseDocument && <p className="text-red-500 text-sm">{errors.licenseDocument}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="profilePhoto" className="block text-sm font-semibold text-gray-700">
                  Profile Photo
                </label>
                <div
                  onClick={() => photoInputRef.current?.click()}
                  className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl text-center cursor-pointer transition-all duration-300 hover:border-blue-500 hover:bg-blue-50