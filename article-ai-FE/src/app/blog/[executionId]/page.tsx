'use client';

import { useState, useEffect, use } from 'react';
import { Blog } from '@/types/blog';
import { blogService } from '@/services/blogService';
import ReactMarkdown from 'react-markdown';
import dynamic from 'next/dynamic';
import 'react-markdown-editor-lite/lib/index.css';

// Dynamically import the editor to avoid SSR issues
const MdEditor = dynamic(() => import('react-markdown-editor-lite'), {
  ssr: false
});

export default function BlogPage({ params }: Readonly<{ params: Promise<{ executionId: string }> }>) {
  const resolvedParams = use(params);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  console.log(blog?.content);
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const data = await blogService.getBlogByExecutionId(Number(resolvedParams.executionId));
        setBlog(data);
        setEditContent(data.content);
      } catch (err) {
        setError('Failed to load blog');
        console.error('Error loading blog:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [resolvedParams.executionId]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updatedBlog = await blogService.updateBlog(Number(blog?.id), editContent);
      setBlog(updatedBlog);
      setIsEditing(false);
      setError(null);
    } catch (err) {
      setError('Failed to save blog');
      console.error('Error saving blog:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditorChange = ({ text }: { text: string }) => {
    setEditContent(text);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-red-700">
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
    <div className="max-w-4xl mt-10 mx-auto">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h1 className="text-lg font-semibold text-gray-900">Blog Content</h1>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditContent(blog?.content || '');
                  }}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-3 py-1.5 text-sm bg-red-700 text-white rounded-md hover:bg-red-600 disabled:opacity-50 flex items-center gap-1"
                >
                  {isSaving ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Edit
              </button>
            )}
          </div>
        </div>
        
        <div className="p-6">
          {isEditing ? (
            <MdEditor
              value={editContent}
              style={{ height: '500px' }}
              renderHTML={text => <ReactMarkdown>{text}</ReactMarkdown>}
              onChange={handleEditorChange}
              view={{ menu: true, md: true, html: false }}
              canView={{ menu: true, md: true, html: false, fullScreen: false, hideMenu: false, both: false }}
              config={{
                view: {
                  menu: true,
                  md: true,
                  html: false,
                },
                canView: {
                  menu: true,
                  md: true,
                  html: false,
                  fullScreen: false,
                  hideMenu: false,
                  both: false
                },
                shortcuts: true,
              }}
            />
          ) : (
            <article className="prose prose-sm max-w-none">
              <ReactMarkdown>{blog?.content || ''}</ReactMarkdown>
            </article>
          )}
        </div>
        
        <div className="mt-4 px-6 py-4 border-t border-gray-100 text-xs text-gray-500">
          Last updated: {new Date(blog?.updated_at || '').toLocaleString()}
        </div>
      </div>
    </div>
  );
} 