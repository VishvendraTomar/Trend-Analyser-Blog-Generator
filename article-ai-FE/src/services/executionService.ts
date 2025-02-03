import { Execution } from '@/types/execution';

export const executionService = {
  async getExecutions(): Promise<Execution[]> {
    const API_BASE_URL = "http://127.0.0.1:8000"
    const response = await fetch(`${API_BASE_URL}/execution/`);
    if (!response.ok) {
      throw new Error('Failed to fetch executions');
    }
    return response.json();
  }
}; 