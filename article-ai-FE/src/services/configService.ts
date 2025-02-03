import { Config, ConfigFormData } from '@/types/config';

export const configService = {
  async getActiveConfig(): Promise<Config> {
    const API_BASE_URL = "http://127.0.0.1:8000"
    const response = await fetch(`${API_BASE_URL}/config/active`);
    if (response.status > 400 && response.status < 500) {
        return {
          "company_name": "",
          "industry": "",
          "target_audience": "",
          "business_objectives": "",
          "audience_description": "",
          "audience_needs": "",
          "organization_overview": "",
      }
    }
    if (!response.ok) {
      throw new Error('Failed to fetch configuration');
    }
    return response.json();
  },

  async createConfig(data: ConfigFormData): Promise<Config> {
    const API_BASE_URL = "http://127.0.0.1:8000"
    const response = await fetch(`${API_BASE_URL}/config/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create configuration');
    }
    return response.json();
  },
}; 