import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/supabase';

type Issue = Database['public']['Tables']['issues']['Row'];
type IssueInsert = Database['public']['Tables']['issues']['Insert'];
type IssueUpdate = Database['public']['Tables']['issues']['Update'];

export function useIssues() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('issues')
        .select(`
          *,
          books (
            id,
            title,
            author,
            isbn
          ),
          profiles (
            id,
            name,
            roll_no,
            department
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIssues(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addIssue = async (issue: IssueInsert) => {
    try {
      const { data, error } = await supabase
        .from('issues')
        .insert(issue)
        .select(`
          *,
          books (
            id,
            title,
            author,
            isbn
          ),
          profiles (
            id,
            name,
            roll_no,
            department
          )
        `)
        .single();

      if (error) throw error;
      setIssues(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const updateIssue = async (id: string, updates: IssueUpdate) => {
    try {
      const { data, error } = await supabase
        .from('issues')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          books (
            id,
            title,
            author,
            isbn
          ),
          profiles (
            id,
            name,
            roll_no,
            department
          )
        `)
        .single();

      if (error) throw error;
      setIssues(prev => prev.map(issue => issue.id === id ? data : issue));
      return data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  return {
    issues,
    loading,
    error,
    addIssue,
    updateIssue,
    refetch: fetchIssues,
  };
}