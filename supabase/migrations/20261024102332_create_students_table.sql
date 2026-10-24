/*
# Create students table for Student Management & Performance Analysis

1. New Tables
- `students`
  - `student_id` (int, primary key, auto-incremented via identity)
  - `name` (text, not null)
  - `gender` (text, not null)
  - `age` (int, not null)
  - `grade` (text, not null)  -- letter grade A/B/C
  - `math_score` (int, not null)
  - `science_score` (int, not null)
  - `english_score` (int, not null)
  - `created_at` (timestamptz default now())

2. Security
- Enable RLS on `students`.
- Grant CRUD to `anon` + `authenticated` so the Data API can reach the table.
- Allow anon + authenticated CRUD because the data is intentionally shared/public (single-tenant, no sign-in).

3. Seed Data
- Inserts 10 sample student records matching the internship project.
*/

CREATE TABLE IF NOT EXISTS students (
  student_id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name text NOT NULL,
  gender text NOT NULL,
  age int NOT NULL,
  grade text NOT NULL,
  math_score int NOT NULL,
  science_score int NOT NULL,
  english_score int NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON students TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_students" ON students;
CREATE POLICY "anon_select_students" ON students FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_students" ON students;
CREATE POLICY "anon_insert_students" ON students FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_students" ON students;
CREATE POLICY "anon_update_students" ON students FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_students" ON students;
CREATE POLICY "anon_delete_students" ON students FOR DELETE
  TO anon, authenticated USING (true);

INSERT INTO students (name, gender, age, grade, math_score, science_score, english_score) VALUES
  ('Arjun', 'Male', 16, 'A', 88, 90, 85),
  ('Divya', 'Female', 17, 'A', 95, 94, 96),
  ('Karan', 'Male', 16, 'B', 72, 78, 70),
  ('Priya', 'Female', 17, 'A', 91, 89, 93),
  ('Rahul', 'Male', 15, 'C', 60, 65, 58),
  ('Sneha', 'Female', 16, 'B', 75, 80, 82),
  ('Vikram', 'Male', 17, 'B', 68, 74, 71),
  ('Anjali', 'Female', 16, 'A', 89, 92, 88),
  ('Manish', 'Male', 15, 'C', 55, 60, 62),
  ('Pooja', 'Female', 17, 'B', 83, 79, 84)
ON CONFLICT (student_id) DO NOTHING;
