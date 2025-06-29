/*
  # Fix RLS policies to resolve infinite recursion

  1. Problem
    - Existing RLS policies on users table cause infinite recursion
    - Policies were querying the users table within the policy itself

  2. Solution
    - Drop problematic policies that cause recursion
    - Create new policies using auth.uid() and JWT claims
    - Add helper function for safe role checking
    - Use proper JSON operators for JWT parsing

  3. Changes
    - Remove recursive policies
    - Add simple self-access policies
    - Add admin/librarian management policy using JWT claims
    - Create utility function for role checking
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
-- Uses JWT claims and email patterns to avoid recursion
CREATE POLICY "Admin and librarian can manage users"
  ON users
  FOR ALL
  TO authenticated
  USING (
    -- Allow if user is accessing their own record
    auth.uid() = id
    OR
    -- Allow if user has admin/librarian role in their JWT user_metadata
    COALESCE((auth.jwt() -> 'user_metadata' ->> 'role'), '') IN ('admin', 'librarian')
    OR
    -- Allow if user's email indicates admin role
    COALESCE((auth.jwt() ->> 'email'), '') = 'admin@nit.ac.in'
    OR
    -- Allow if user's email indicates librarian role
    COALESCE((auth.jwt() ->> 'email'), '') = 'librarian@nit.ac.in'
  );

-- Create a function to safely check user role without recursion
CREATE OR REPLACE FUNCTION auth.get_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'user_metadata' ->> 'role'),
    CASE 
      WHEN COALESCE((auth.jwt() ->> 'email'), '') = 'admin@nit.ac.in' THEN 'admin'
      WHEN COALESCE((auth.jwt() ->> 'email'), '') = 'librarian@nit.ac.in' THEN 'librarian'
      WHEN COALESCE((auth.jwt() ->> 'email'), '') LIKE '%@nit.ac.in' THEN 'student'
      ELSE 'student'
    END
  );
$$;

-- Update existing users to have proper role metadata if needed
-- This ensures the JWT claims will have the role information
UPDATE auth.users 
SET user_metadata = COALESCE(user_metadata, '{}'::jsonb) || 
  CASE 
    WHEN email = 'admin@nit.ac.in' THEN '{"role": "admin"}'::jsonb
    WHEN email = 'librarian@nit.ac.in' THEN '{"role": "librarian"}'::jsonb
    WHEN email LIKE '%@student.nit.ac.in' THEN '{"role": "student"}'::jsonb
    ELSE '{"role": "student"}'::jsonb
  END
WHERE user_metadata IS NULL OR user_metadata ->> 'role' IS NULL;