import { useState } from 'react';
import { Config } from '@/types/config';
import { configService } from '@/services/configService';

interface ConfigInfoModalProps {
  config?: Config;
  onClose: () => void;
  onSave?: () => void;
}

export default function ConfigInfoModal({ config, onClose, onSave }: ConfigInfoModalProps) {
  const [formData, setFormData] = useState<Config>({
    company_name: config?.company_name || '',
    industry: config?.industry || '',
    target_audience: config?.target_audience || '',
    business_objectives: config?.business_objectives || '',
    audience_description: config?.audience_description || '',
    audience_needs: config?.audience_needs || '',
    organization_overview: config?.organization_overview || '',
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await configService.createConfig(formData);
      onSave?.();
      onClose();
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-auto">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white">
          <h3 className="text-lg font-medium text-gray-900">
            {config ? 'Configuration Details' : 'Create New Configuration'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500">Company Name</label>
                {config ? (
                  <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded-md">
                    {config.company_name || '-'}
                  </p>
                ) : (
                  <input
                    type="text"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                    placeholder="Enter company name"
                  />
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Industry</label>
                {config ? (
                  <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded-md">
                    {config.industry || '-'}
                  </p>
                ) : (
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                    placeholder="e.g. Technology"
                  />
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500">Organization Overview</label>
              {config ? (
                <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded-md whitespace-pre-wrap">
                  {config.organization_overview || '-'}
                </p>
              ) : (
                <textarea
                  name="organization_overview"
                  value={formData.organization_overview}
                  onChange={handleChange}
                  rows={2}
                  className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  placeholder="Brief overview of your organization"
                />
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500">Target Audience</label>
              {config ? (
                <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded-md whitespace-pre-wrap">
                  {config.target_audience || '-'}
                </p>
              ) : (
                <textarea
                  name="target_audience"
                  value={formData.target_audience}
                  onChange={handleChange}
                  rows={2}
                  className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  placeholder="Describe your target audience"
                />
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500">Audience Description</label>
              {config ? (
                <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded-md whitespace-pre-wrap">
                  {config.audience_description || '-'}
                </p>
              ) : (
                <textarea
                  name="audience_description"
                  value={formData.audience_description}
                  onChange={handleChange}
                  rows={2}
                  className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  placeholder="Detailed description of your audience"
                />
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500">Audience Needs</label>
              {config ? (
                <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded-md whitespace-pre-wrap">
                  {config.audience_needs || '-'}
                </p>
              ) : (
                <textarea
                  name="audience_needs"
                  value={formData.audience_needs}
                  onChange={handleChange}
                  rows={2}
                  className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  placeholder="What are your audience's needs?"
                />
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500">Business Objectives</label>
              {config ? (
                <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-2 rounded-md whitespace-pre-wrap">
                  {config.business_objectives || '-'}
                </p>
              ) : (
                <textarea
                  name="business_objectives"
                  value={formData.business_objectives}
                  onChange={handleChange}
                  rows={2}
                  className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 text-sm"
                  placeholder="What are your business goals?"
                />
              )}
            </div>
          </div>

          {!config && (
            <div className="p-4 border-t border-gray-200 flex justify-end gap-2 sticky bottom-0 bg-white">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Configuration'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
} 