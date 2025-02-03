import { Config } from './config';

export interface Execution {
  id: number;
  config_id: number;
  execution_date: string;
  status: 'running' | 'success' | 'error';
  message: string;
  config: Config;
} 