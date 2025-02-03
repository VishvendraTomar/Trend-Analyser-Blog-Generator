'use client';

import { useState, useEffect } from 'react';
import { Execution } from '@/types/execution';
import { executionService } from '@/services/executionService';
import ConfigInfoModal from '@/components/ConfigInfoModal';
import Link from 'next/link';

function ExecutionCard({ execution }: { execution: Execution }) {
  const [showConfig, setShowConfig] = useState(false);

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 p-3 flex items-center gap-3">
        <div className="flex-shrink-0">
          <span className={`w-2 h-2 rounded-full block
            ${execution.status === 'running' ? 'bg-yellow-400' : ''}
            ${execution.status === 'success' ? 'bg-green-400' : ''}
            ${execution.status === 'error' ? 'bg-red-400' : ''}`}
          />
        </div>
        
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-900 truncate">
              {execution.config?.company_name || 'No Configuration'}
            </p>
            <span className={`px-2 py-0.5 text-xs rounded-full
              ${execution.status === 'running' ? 'bg-yellow-50 text-yellow-700' : ''}
              ${execution.status === 'success' ? 'bg-green-50 text-green-700' : ''}
              ${execution.status === 'error' ? 'bg-red-50 text-red-600' : ''}`}
            >
              {execution.status}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{new Date(execution.execution_date).toLocaleDateString()}</span>
            <span>•</span>
            <span className="truncate">{execution.message}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {execution.status === 'success' && (
            <Link
              href={`/blog/${execution.id}`}
              className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-700 bg-green-50 
                       rounded-md hover:bg-green-100 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0h8v12H6V4z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M8 7a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1zm0 4a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              View Blog
            </Link>
          )}
          
          <button 
            onClick={() => setShowConfig(true)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-50"
            title={execution.config ? "View Configuration" : "Create Configuration"}
          >
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {showConfig && (
        <ConfigInfoModal 
          config={execution.config}
          onClose={() => setShowConfig(false)}
          onSave={() => window.location.reload()}
        />
      )}
    </>
  );
}

export default function ExecutionPage() {
  const [executions, setExecutions] = useState<Execution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentExecutionId, setCurrentExecutionId] = useState<number | null>(null);

  const checkExecutionStatus = async (executionId: number) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/execution/');
      const executions = await response.json();
      
      // Find the execution we're monitoring
      const currentExecution = executions.find((e: Execution) => e.id === executionId);
      
      if (currentExecution) {
        // Update executions list
        setExecutions(executions);
        
        // Check if execution is complete
        if (['success', 'error', 'COMPLETED', 'FAILED'].includes(currentExecution.status)) {
          setIsExecuting(false);
          setCurrentExecutionId(null);
        }
      }
    } catch (err) {
      console.error('Error checking execution status:', err);
    }
  };

  const handleReExecute = async () => {
    try {
      // Prevent multiple executions
      if (isExecuting) return;

      setIsExecuting(true);
      setError(null);

      // Trigger the AI agents
      const response = await fetch('http://127.0.0.1:8000/agent/trigger', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to trigger AI agents');
      }

      // Get the latest execution to monitor
      const executionsResponse = await fetch('http://127.0.0.1:8000/execution/');
      const latestExecutions = await executionsResponse.json();
      
      if (latestExecutions && latestExecutions.length > 0) {
        const latestExecutionId = latestExecutions[0].id;
        setCurrentExecutionId(latestExecutionId);

        // Start polling for status updates
        const pollInterval = setInterval(() => {
          if (!isExecuting) {
            clearInterval(pollInterval);
            return;
          }
          checkExecutionStatus(latestExecutionId);
        }, 5000); // Check every 5 seconds

        // Safety cleanup after 5 minutes
        setTimeout(() => {
          clearInterval(pollInterval);
          setIsExecuting(false);
          setCurrentExecutionId(null);
        }, 300000);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to trigger AI agents');
      setIsExecuting(false);
      console.error('Error triggering AI agents:', err);
    }
  };

  useEffect(() => {
    const fetchExecutions = async () => {
      try {
        const data = await executionService.getExecutions();
        setExecutions(data);
      } catch (err) {
        setError('Failed to load executions');
        console.error('Error loading executions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExecutions();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-red-600">
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
      <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="mt-10 flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Executions</h1>
          <p className="text-sm text-gray-500">Monitor content generation progress</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <button
            onClick={handleReExecute}
            disabled={isExecuting}
            className="inline-flex items-center px-4 py-2 border border-red-200 
                     text-sm font-medium rounded-md shadow-sm text-red-700 
                     bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 
                     focus:ring-offset-2 focus:ring-red-200 disabled:opacity-50 
                     disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isExecuting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-700" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Executing...
              </>
            ) : (
              <>
                <svg className="mr-2 h-4 w-4 text-red-700" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Re-execute
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="space-y-2">
        {executions.map((execution) => (
          <ExecutionCard key={execution.id} execution={execution} />
        ))}
        
        {executions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No executions found
          </div>
        )}
      </div>
    </div>
  );
} 