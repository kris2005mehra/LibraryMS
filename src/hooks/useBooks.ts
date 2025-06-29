import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/supabase';

type Book = Database['public']['Tables']['books']['Row'];
type BookInsert = Database['public']['Tables']['books']['Insert'];
type BookUpdate = Database['public']['Tables']['books']['Update'];

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBooks(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addBook = async (book: BookInsert) => {
    try {
      const { data, error } = await supabase
        .from('books')
        .insert(book)
        .select()
        .single();

      if (error) throw error;
      setBooks(prev => [data, ...prev]);
      return data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const updateBook = async (id: string, updates: BookUpdate) => {
    try {
      const { data, error } = await supabase
        .from('books')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setBooks(prev => prev.map(book => book.id === id ? data : book));
      return data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const deleteBook = async (id: string) => {
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setBooks(prev => prev.filter(book => book.id !== id));
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return {
    books,
    loading,
    error,
    addBook,
    updateBook,
    deleteBook,
    refetch: fetchBooks,
  };
}