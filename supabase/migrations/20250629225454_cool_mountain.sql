/*
  # Initial Library Management System Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `name` (text)
      - `role` (text, check constraint for admin/librarian/student)
      - `roll_no` (text, nullable for students)
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
      - `stock` (integer, default 0)
      - `total_copies` (integer, default 0)
      - `description` (text, nullable)
      - `image_url` (text, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `issues`
      - `id` (uuid, primary key)
      - `book_id` (uuid, foreign key to books)
      - `student_id` (uuid, foreign key to users)
      - `issue_date` (timestamp)
      - `due_date` (timestamp)
      - `return_date` (timestamp, nullable)
      - `fine_amount` (numeric, default 0)
      - `fine_paid` (boolean, default false)
      - `status` (text, check constraint for issued/returned/overdue)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `fines`
      - `id` (uuid, primary key)
      - `student_id` (uuid, foreign key to users)
      - `issue_id` (uuid, foreign key to issues)
      - `amount` (numeric, default 0)
      - `reason` (text)
      - `date` (timestamp)
      - `paid` (boolean, default false)
      - `paid_date` (timestamp, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for different user roles
    - Admin and librarian can manage all data
    - Students can only read their own data

  3. Functions
    - Auto-update timestamps
    - Set user role based on email domain
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'librarian', 'student');
CREATE TYPE issue_status AS ENUM ('issued', 'returned', 'overdue');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role user_role NOT NULL,
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
  stock integer DEFAULT 0 NOT NULL,
  total_copies integer DEFAULT 0 NOT NULL,
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
  issue_date timestamptz DEFAULT now() NOT NULL,
  due_date timestamptz NOT NULL,
  return_date timestamptz,
  fine_amount numeric DEFAULT 0,
  fine_paid boolean DEFAULT false,
  status issue_status DEFAULT 'issued' NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create fines table
CREATE TABLE IF NOT EXISTS fines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid REFERENCES users(id) ON DELETE CASCADE,
  issue_id uuid REFERENCES issues(id) ON DELETE CASCADE,
  amount numeric DEFAULT 0 NOT NULL,
  reason text NOT NULL,
  date timestamptz DEFAULT now() NOT NULL,
  paid boolean DEFAULT false,
  paid_date timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create function to set user role based on email
CREATE OR REPLACE FUNCTION set_user_role()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email = 'admin@nit.ac.in' THEN
    NEW.role = 'admin';
  ELSIF NEW.email = 'librarian@nit.ac.in' THEN
    NEW.role = 'librarian';
  ELSE
    NEW.role = 'student';
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_books_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_issues_updated_at
  BEFORE UPDATE ON issues
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fines_updated_at
  BEFORE UPDATE ON fines
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create trigger to set user role
CREATE TRIGGER set_user_role_trigger
  BEFORE INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION set_user_role();

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE fines ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin and librarian can manage users"
  ON users
  FOR ALL
  TO authenticated
  USING (
    auth.uid() = id OR 
    COALESCE((auth.jwt() ->> 'email'), '') = 'admin@nit.ac.in' OR
    COALESCE((auth.jwt() ->> 'email'), '') = 'librarian@nit.ac.in'
  );

-- Create policies for books table
CREATE POLICY "Everyone can read books"
  ON books
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin and librarian can manage books"
  ON books
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'librarian')
    )
  );

-- Create policies for issues table
CREATE POLICY "Users can read own issues"
  ON issues
  FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'librarian')
    )
  );

CREATE POLICY "Admin and librarian can manage issues"
  ON issues
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'librarian')
    )
  );

-- Create policies for fines table
CREATE POLICY "Users can read own fines"
  ON fines
  FOR SELECT
  TO authenticated
  USING (
    student_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'librarian')
    )
  );

CREATE POLICY "Admin and librarian can manage fines"
  ON fines
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'librarian')
    )
  );