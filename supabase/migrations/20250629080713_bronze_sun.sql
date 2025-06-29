/*
  # Fix RLS policies to avoid infinite recursion

  1. Security Changes
    - Drop existing recursive policies on users table
    - Create new policies that use JWT claims directly
    - Avoid querying users table within policies to prevent recursion

  2. Policy Structure
    - Users can read/update their own data using auth.uid()
    - Admin/librarian access based on email patterns in JWT
    - No recursive queries to users table
*/

-- Drop existing policies that cause infinite recursion
DROP POLICY IF EXISTS "Admin and librarian can manage users" ON users;
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Policy for users to read their own data
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy for users to update their own profile
CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy for admin and librarian to manage all users
-- Uses only JWT email claims to avoid recursion
CREATE POLICY "Admin and librarian can manage users"
  ON users
  FOR ALL
  TO authenticated
  USING (
    -- Allow if user is accessing their own record
    auth.uid() = id
    OR
    -- Allow if user's email indicates admin role
    COALESCE((auth.jwt() ->> 'email'), '') = 'admin@nit.ac.in'
    OR
    -- Allow if user's email indicates librarian role
    COALESCE((auth.jwt() ->> 'email'), '') = 'librarian@nit.ac.in'
  );

-- Create a simple function in public schema to get user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT 
    CASE 
      WHEN COALESCE((auth.jwt() ->> 'email'), '') = 'admin@nit.ac.in' THEN 'admin'
      WHEN COALESCE((auth.jwt() ->> 'email'), '') = 'librarian@nit.ac.in' THEN 'librarian'
      WHEN COALESCE((auth.jwt() ->> 'email'), '') LIKE '%@student.nit.ac.in' THEN 'student'
      WHEN COALESCE((auth.jwt() ->> 'email'), '') LIKE '%@nit.ac.in' THEN 'student'
      ELSE 'student'
    END;
$$;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.get_current_user_role() TO authenticated;

-- Add a trigger to automatically set role based on email when inserting new users
CREATE OR REPLACE FUNCTION public.set_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Set role based on email pattern
  IF NEW.email = 'admin@nit.ac.in' THEN
    NEW.role = 'admin';
  ELSIF NEW.email = 'librarian@nit.ac.in' THEN
    NEW.role = 'librarian';
  ELSE
    NEW.role = 'student';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically set role on insert
DROP TRIGGER IF EXISTS set_user_role_trigger ON users;
CREATE TRIGGER set_user_role_trigger
  BEFORE INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION public.set_user_role();

-- Update existing users to have proper roles based on email
UPDATE users 
SET role = CASE 
  WHEN email = 'admin@nit.ac.in' THEN 'admin'
  WHEN email = 'librarian@nit.ac.in' THEN 'librarian'
  ELSE 'student'
END
WHERE role IS NULL OR role = '';