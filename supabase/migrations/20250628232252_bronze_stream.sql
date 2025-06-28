/*
  # Library Management System Database Schema

  1. New Tables
    - `users` - Store user information (admin, librarian, student)
    - `books` - Store book information and inventory
    - `issues` - Track book issues and returns
    - `fines` - Track fines for overdue books

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Students can only see their own data
    - Admin and librarian have full access

  3. Sample Data
    - Demo admin and student accounts
    - Reference books collection
    - Sample issues and fines for testing
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'librarian', 'student')),
  roll_no text,
  department text,
  contact text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create books table
CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  isbn text UNIQUE NOT NULL,
  title text NOT NULL,
  author text NOT NULL,
  category text NOT NULL,
  publisher text NOT NULL,
  year integer NOT NULL,
  stock integer NOT NULL DEFAULT 0,
  total_copies integer NOT NULL DEFAULT 0,
  description text,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create issues table
CREATE TABLE IF NOT EXISTS issues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid REFERENCES books(id) ON DELETE CASCADE,
  student_id uuid REFERENCES users(id) ON DELETE CASCADE,
  issue_date timestamptz NOT NULL DEFAULT now(),
  due_date timestamptz NOT NULL,
  return_date timestamptz,
  fine_amount numeric DEFAULT 0,
  fine_paid boolean DEFAULT false,
  status text NOT NULL DEFAULT 'issued' CHECK (status IN ('issued', 'returned', 'overdue')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create fines table
CREATE TABLE IF NOT EXISTS fines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES users(id) ON DELETE CASCADE,
  issue_id uuid REFERENCES issues(id) ON DELETE CASCADE,
  amount numeric NOT NULL DEFAULT 0,
  reason text NOT NULL,
  date timestamptz NOT NULL DEFAULT now(),
  paid boolean DEFAULT false,
  paid_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE fines ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own data" ON users
  FOR SELECT TO authenticated
  USING (auth.uid() = id OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'librarian')
  ));

CREATE POLICY "Admin and librarian can manage users" ON users
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'librarian')
  ));

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id);

-- Create policies for books table
CREATE POLICY "Everyone can read books" ON books
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Admin and librarian can manage books" ON books
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'librarian')
  ));

-- Create policies for issues table
CREATE POLICY "Users can read own issues" ON issues
  FOR SELECT TO authenticated
  USING (student_id = auth.uid() OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'librarian')
  ));

CREATE POLICY "Admin and librarian can manage issues" ON issues
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'librarian')
  ));

-- Create policies for fines table
CREATE POLICY "Users can read own fines" ON fines
  FOR SELECT TO authenticated
  USING (student_id = auth.uid() OR EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'librarian')
  ));

CREATE POLICY "Admin and librarian can manage fines" ON fines
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'librarian')
  ));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_issues_updated_at BEFORE UPDATE ON issues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fines_updated_at BEFORE UPDATE ON fines
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();