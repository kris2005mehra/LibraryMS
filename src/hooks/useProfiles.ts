import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export function useProfiles() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (id: string, updates: ProfileUpdate) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setProfiles(prev => prev.map(profile => profile.id === id ? data : profile));
      return data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const deleteProfile = async (id: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProfiles(prev => prev.filter(profile => profile.id !== id));
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  return {
    profiles,
    loading,
    error,
    updateProfile,
    deleteProfile,
    refetch: fetchProfiles,
  };
}