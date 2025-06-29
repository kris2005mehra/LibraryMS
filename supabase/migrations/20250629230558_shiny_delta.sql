/*
  # Library Management System Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `name` (text)
      - `role` (text) - admin, librarian, student
      - `roll_no` (text, nullable)
      - `department` (text, nullable)
      - `contact` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `books`
      - `id` (uuid, primary key)
      - `isbn` (text, unique)
      - `title` (text)
      - `author` (text)
      - `category` (text)
      - `publisher` (text)
      - `year` (integer)
      - `stock` (integer)
      - `total_copies` (integer)
      - `description` (text, nullable)
      - `image_url` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `issues`
      - `id` (uuid, primary key)
      - `book_id` (uuid, references books)
      - `student_id` (uuid, references profiles)
      - `issue_date` (timestamp)
      - `due_date` (timestamp)
      - `return_date` (timestamp, nullable)
      - `fine_amount` (decimal, nullable)
      - `fine_paid` (boolean, default false)
      - `status` (text) - issued, returned, overdue
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

    - `fines`
      - `id` (uuid, primary key)
      - `student_id` (uuid, references profiles)
      - `issue_id` (uuid, references issues)
      - `amount` (decimal)
      - `reason` (text)
      - `paid` (boolean, default false)
      - `paid_date` (timestamp, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users based on roles
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
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
  book_id uuid NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  issue_date timestamptz NOT NULL DEFAULT now(),
  due_date timestamptz NOT NULL,
  return_date timestamptz,
  fine_amount decimal(10,2) DEFAULT 0,
  fine_paid boolean DEFAULT false,
  status text NOT NULL DEFAULT 'issued' CHECK (status IN ('issued', 'returned', 'overdue')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create fines table
CREATE TABLE IF NOT EXISTS fines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  issue_id uuid NOT NULL REFERENCES issues(id) ON DELETE CASCADE,
  amount decimal(10,2) NOT NULL,
  reason text NOT NULL,
  paid boolean DEFAULT false,
  paid_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE fines ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins and librarians can read all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'librarian')
    )
  );

CREATE POLICY "Admins can manage all profiles"
  ON profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Books policies
CREATE POLICY "Anyone can read books"
  ON books
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins and librarians can manage books"
  ON books
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'librarian')
    )
  );

-- Issues policies
CREATE POLICY "Students can read own issues"
  ON issues
  FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'librarian')
    )
  );

CREATE POLICY "Admins and librarians can manage issues"
  ON issues
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'librarian')
    )
  );

-- Fines policies
CREATE POLICY "Students can read own fines"
  ON fines
  FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'librarian')
    )
  );

CREATE POLICY "Admins and librarians can manage fines"
  ON fines
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('admin', 'librarian')
    )
  );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_issues_updated_at BEFORE UPDATE ON issues FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fines_updated_at BEFORE UPDATE ON fines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();