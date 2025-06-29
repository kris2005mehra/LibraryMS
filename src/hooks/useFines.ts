import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/supabase';

type Fine = Database['public']['Tables']['fines']['Row'];
type FineInsert = Database['public']['Tables']['fines']['Insert'];
type FineUpdate = Database['public']['Tables']['fines']['Update'];

export function useFines() {
  const [fines, setFines] = useState<Fine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFines = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('fines')
        .select(`
          *,
          profiles (
            id,
            name,
            roll_no,
            department
          ),
          issues (
            id,
            books (
              title,
              author
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFines(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addFine = async (fine: FineInsert) => {
    try {
      const { data, error } = await supabase
        .from('fines')
        .insert(fine)
        .select(`
          *,
          profiles (
            id,
            name,
            roll_no,
            department
          ),
          issues (
            id,
            books (
              title,
              author
            )
          )
        `)
        .single();

      if (error) throw error;
      setFines(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const updateFine = async (id: string, updates: FineUpdate) => {
    try {
      const { data, error } = await supabase
        .from('fines')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          profiles (
            id,
            name,
            roll_no,
            department
          ),
          issues (
            id,
            books (
              title,
              author
            )
          )
        `)
        .single();

      if (error) throw error;
      setFines(prev => prev.map(fine => fine.id === id ? data : fine));
      return data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  useEffect(() => {
    fetchFines();
  }, []);

  return {
    fines,
    loading,
    error,
    addFine,
    updateFine,
    refetch: fetchFines,
  };
}