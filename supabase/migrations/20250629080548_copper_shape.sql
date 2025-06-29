/*
  # Fix Users Table RLS Policies

  This migration fixes the infinite recursion issue in the users table RLS policies.
  The problem occurs when policies reference the same table they're protecting,
  creating circular dependencies.

  ## Changes Made
  1. Drop existing problematic policies
  2. Create new, simplified policies that avoid recursion
  3. Ensure proper access control without circular references

  ## New Policies
  - Users can read their own data (simple auth.uid() check)
  - Admin and librarian roles can manage all users (using auth.jwt() claims)
  - Users can update their own profiles
*/

-- Drop existing policies that cause infinite recursion
DROP POLICY IF EXISTS "Admin and librarian can manage users" ON users;
DROP POLICY IF EXISTS "Users can read own data" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Create new policies that avoid recursion by using auth.jwt() claims instead of querying users table

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
-- This uses a simpler approach by checking user metadata or creating a separate admin check
CREATE POLICY "Admin and librarian can manage users"
  ON users
  FOR ALL
  TO authenticated
  USING (
    -- Allow if user is accessing their own record
    auth.uid() = id
    OR
    -- Allow if user has admin/librarian role in their JWT claims
    (auth.jwt() ->> 'user_metadata' ->> 'role')::text IN ('admin', 'librarian')
    OR
    -- Fallback: check if the authenticated user's email indicates admin role
    (auth.jwt() ->> 'email')::text = 'admin@nit.ac.in'
  );

-- Create a function to safely check user role without recursion
CREATE OR REPLACE FUNCTION auth.get_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (auth.jwt() ->> 'user_metadata' ->> 'role')::text,
    CASE 
      WHEN (auth.jwt() ->> 'email')::text = 'admin@nit.ac.in' THEN 'admin'
      WHEN (auth.jwt() ->> 'email')::text LIKE '%@nit.ac.in' THEN 'student'
      ELSE 'student'
    END
  );
$$;

-- Alternative policy using the function (commented out, use if needed)
/*
CREATE POLICY "Admin and librarian can manage users v2"
  ON users
  FOR ALL
  TO authenticated
  USING (
    auth.uid() = id
    OR
    auth.get_user_role() IN ('admin', 'librarian')
  );
*/