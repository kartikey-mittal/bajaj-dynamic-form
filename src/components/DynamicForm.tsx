import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormResponse, FormSection as FormSectionType } from '../types/form';
import { getForm } from '../services/api';
import FormSection from './FormSection';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

const DynamicForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Record<string, string | string[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentSection, setCurrentSection] = useState(0);
  const [formStructure, setFormStructure] = useState<FormResponse['form'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const rollNumber = localStorage.getItem('rollNumber');
    if (!rollNumber) {
      navigate('/login');
      return;
    }

    const fetchForm = async () => {
      try {
        const response = await getForm(rollNumber);
        setFormStructure(response.form);
      } catch (err) {
        setError('Failed to load form. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [navigate]);

  const validateSection = (section: FormSectionType) => {
    const newErrors: Record<string, string> = {};

    section.fields.forEach(field => {
      const value = formData[field.fieldId];
      
      if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
        newErrors[field.fieldId] = field.validation?.message || 'This field is required';
      } else if (field.minLength && typeof value === 'string' && value.length < field.minLength) {
        newErrors[field.fieldId] = field.validation?.message || `Minimum length is ${field.minLength} characters`;
      } else if (field.maxLength && typeof value === 'string' && value.length > field.maxLength) {
        newErrors[field.fieldId] = field.validation?.message || `Maximum length is ${field.maxLength} characters`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFieldChange = (fieldId: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
    
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const handleNext = () => {
    if (!formStructure) return;
    
    const currentSectionData = formStructure.sections[currentSection];
    if (validateSection(currentSectionData)) {
      if (currentSection === formStructure.sections.length - 1) {
        console.log('Form Data:', formData);
        setIsSubmitted(true);
      } else {
        setCurrentSection(prev => prev + 1);
      }
    }
  };

  const handlePrev = () => {
    setCurrentSection(prev => prev - 1);
  };

  const handleReturnToLogin = () => {
    localStorage.removeItem('rollNumber');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="text-center min-h-screen flex flex-col justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading form...</p>
      </div>
    );
  }

  if (error || !formStructure) {
    return (
      <div className="text-center min-h-screen flex flex-col justify-center">
        <p className="text-red-600">{error || 'Failed to load form'}</p>
        <button
  onClick={() => window.location.reload()}
  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md mt-4 mx-auto block"
>
  Try Again
</button>

      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="max-w-md mx-auto text-center bg-white rounded-xl shadow-lg p-8 mt-12">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Form Submitted Successfully!</h2>
        <p className="text-gray-600 mb-8">Thank you for completing the form.</p>
        <button
          onClick={handleReturnToLogin}
          className="btn btn-primary w-full"
        >
          Return to Login
        </button>
      </div>
    );
  }

  const currentSectionData = formStructure.sections[currentSection];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      
      
      <div className="w-full bg-blue-600 text-white py-4 px-6 text-center">
        <h1 className="text-3xl font-bold">{formStructure.formTitle}</h1>
        <p className="mt-2 text-sm">Form ID: {formStructure.formId}</p>
      </div>

     
      <div className="max-w-5xl w-full mx-auto p-8 bg-white rounded-xl ">

 
  <div className="flex items-center justify-between mb-6">
    <p className="text-sm text-gray-600">
      Section {currentSection + 1} of {formStructure.sections.length}
    </p>
    <div className="h-2 flex-1 mx-4 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-blue-600 transition-all duration-300"
        style={{
          width: `${((currentSection + 1) / formStructure.sections.length) * 100}%`
        }}
      />
    </div>
  </div>

 
  <FormSection
    section={currentSectionData}
    formData={formData}
    onChange={handleFieldChange}
    errors={errors}
  />

  
  <div className="mt-8 flex justify-between">
    <button
      onClick={handlePrev}
      className="btn btn-secondary flex items-center"
      disabled={currentSection === 0}
    >
      <ChevronLeft className="w-4 h-4 mr-2" />
      Previous
    </button>

    <button
      onClick={handleNext}
      className="btn btn-primary flex items-center"
    >
      {currentSection === formStructure.sections.length - 1 ? (
        'Submit'
      ) : (
        <>
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </>
      )}
    </button>
  </div>

</div>

    </div>
  );
};

export default DynamicForm;
