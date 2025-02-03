'use client';

import { useState, useEffect } from 'react';
import { ConfigFormData } from '@/types/config';
import { configService } from '@/services/configService';

export default function ConfigurationPage() {
  const [formData, setFormData] = useState<ConfigFormData>({
    company_name: '',
    target_audience: '',
    business_objectives: '',
    audience_description: '',
    industry: '',
    audience_needs: '',
    organization_overview: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const config = await configService.getActiveConfig();
        setFormData(config);
      } catch (err) {
        setError('Failed to load configuration');
        console.error('Error loading configuration:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await configService.createConfig(formData);
      alert('Configuration saved successfully!');
    } catch (error) {
      console.error('Error saving configuration:', error);
      alert('Failed to save configuration');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-primary">
          <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <h1 className="text-xl font-semibold text-gray-900 mb-1">Configuration</h1>
      <p className="text-sm text-gray-500 mb-6">Set up your content generation preferences</p>
      
      <div className="card">
        <form onSubmit={handleSubmit}>
          {/* Company Information */}
          <div className="form-section">
            <h2 className="section-title">Company Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="company_name" className="form-label">Company Name</label>
                <input
                  type="text"
                  id="company_name"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter company name"
                />
              </div>
              <div>
                <label htmlFor="industry" className="form-label">Industry</label>
                <input
                  type="text"
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="e.g. Technology"
                />
              </div>
            </div>
            <div>
              <label htmlFor="organization_overview" className="form-label">Organization Overview</label>
              <textarea
                id="organization_overview"
                name="organization_overview"
                value={formData.organization_overview}
                onChange={handleChange}
                rows={2}
                className="form-input"
                placeholder="Brief overview of your organization"
              />
            </div>
          </div>

          {/* Audience Information */}
          <div className="form-section border-t border-gray-100 pt-4">
            <h2 className="section-title">Audience & Objectives</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="target_audience" className="form-label">Target Audience</label>
                <textarea
                  id="target_audience"
                  name="target_audience"
                  value={formData.target_audience}
                  onChange={handleChange}
                  rows={2}
                  className="form-input"
                  placeholder="Describe your target audience"
                />
              </div>
              <div>
                <label htmlFor="audience_description" className="form-label">Audience Description</label>
                <textarea
                  id="audience_description"
                  name="audience_description"
                  value={formData.audience_description}
                  onChange={handleChange}
                  rows={2}
                  className="form-input"
                  placeholder="Detailed description of your audience"
                />
              </div>
              <div>
                <label htmlFor="audience_needs" className="form-label">Audience Needs</label>
                <textarea
                  id="audience_needs"
                  name="audience_needs"
                  value={formData.audience_needs}
                  onChange={handleChange}
                  rows={2}
                  className="form-input"
                  placeholder="What are your audience's needs?"
                />
              </div>
              <div>
                <label htmlFor="business_objectives" className="form-label">Business Objectives</label>
                <textarea
                  id="business_objectives"
                  name="business_objectives"
                  value={formData.business_objectives}
                  onChange={handleChange}
                  rows={2}
                  className="form-input"
                  placeholder="What are your business goals?"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="border-t border-gray-100 pt-4 flex justify-end">
            <button type="submit" className="btn-primary">
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 