'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface FormData {
  business_name: string;
  industry: string;
  location: string;
  years_in_business: number;
  annual_revenue: string;
  employee_count: string;
  business_type: 'sole_proprietorship' | 'llc' | 'corporation' | 'partnership' | 'franchise';
  reason_for_selling: string;
  timeline: string;
  key_assets: string[];
  challenges: string[];
  growth_opportunities: string[];
  contact_email: string;
  contact_phone: string;
  additional_info: string;
}

interface FormDataContextType {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
}

const FormDataContext = createContext<FormDataContextType | undefined>(undefined);

export function FormDataProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>({
    business_name: '',
    industry: '',
    location: '',
    years_in_business: 0,
    annual_revenue: '',
    employee_count: '',
    business_type: 'llc',
    reason_for_selling: '',
    timeline: '',
    key_assets: [],
    challenges: [],
    growth_opportunities: [],
    contact_email: '',
    contact_phone: '',
    additional_info: ''
  });

  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  return (
    <FormDataContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormDataContext.Provider>
  );
}

export function useFormData() {
  const context = useContext(FormDataContext);
  if (context === undefined) {
    throw new Error('useFormData must be used within a FormDataProvider');
  }
  return context;
}
