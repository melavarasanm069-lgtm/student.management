# Student Management Database & Performance Analysis

**SQL Data Analysis Internship – Task 1**
Organization: Maincrafts Technology

A web application that manages student records and analyzes academic performance based on marks, grades, and gender. Built with React, TypeScript, Vite, and Supabase (PostgreSQL).

## Aim

To create a student management database using SQL and analyze academic performance based on marks, grades, and gender.

## Tools Used

- **Frontend:** React + TypeScript + Vite
- **Database:** PostgreSQL (Supabase)
- **Styling:** Custom CSS

## Database Design

The database contains a `students` table with the following columns:

| Column           | Type    | Description                          |
|------------------|---------|--------------------------------------|
| `student_id`     | int     | Primary key (auto-incremented)       |
| `name`           | text    | Student name                         |
| `gender`         | text    | Male / Female / Other                |
| `age`            | int     | Student age                          |
| `grade`          | text    | Letter grade (A / B / C)             |
| `math_score`     | int     | Mathematics score (0–100)            |
| `science_score`  | int     | Science score (0–100)                |
| `english_score`  | int     | English score (0–100)                |
| `created_at`     | timestamptz | Record creation timestamp        |

Row Level Security (RLS) is enabled with public read/write policies (single-tenant, no auth).

## Features

### Dashboard
- Total student count
- Average scores for Math, Science, and English
- Top performer highlight
- Grade distribution chart

### Student Records (CRUD)
- View all students in a searchable, filterable table
- Add a new student
- Edit an existing student's details
- Delete a student record

### Performance Analysis
- Subject-wise average scores (bar charts)
- Grade distribution (A / B / C counts)
- Average score comparison by gender
- Filtered list of students scoring above 80 in Mathematics
- Top performer identification

## SQL Operations Demonstrated

This project demonstrates the following SQL concepts:

- Database & table creation
- Data insertion (10 sample records)
- `SELECT` queries with filtering
- Aggregation functions (`AVG`, `COUNT`, `SUM`)
- `GROUP BY` (grade counts, gender comparison)
- `ORDER BY` (sorting by total marks)
- `UPDATE` (editing student grades)
- `DELETE` (removing student records)

## Sample Data

10 student records are seeded on first migration:

| Name    | Gender | Age | Grade | Math | Science | English |
|---------|--------|-----|-------|------|---------|---------|
| Arjun   | Male   | 16  | A     | 88   | 90      | 85      |
| Divya   | Female | 17  | A     | 95   | 94      | 96      |
| Karan   | Male   | 16  | B     | 72   | 78      | 70      |
| Priya   | Female | 17  | A     | 91   | 89      | 93      |
| Rahul   | Male   | 15  | C     | 60   | 65      | 58      |
| Sneha   | Female | 16  | B     | 75   | 80      | 82      |
| Vikram  | Male   | 17  | B     | 68   | 74      | 71      |
| Anjali  | Female | 16  | A     | 89   | 92      | 88      |
| Manish  | Male   | 15  | C     | 55   | 60      | 62      |
| Pooja   | Female | 17  | B     | 83   | 79      | 84      |

## Findings

- **Average Mathematics score:** 77.6
- **Average Science score:** 80.1
- **Average English score:** 78.9
- **Top Performer:** Divya with 285 total marks
- **Grade distribution:** 4 students with Grade A, 4 with Grade B, 2 with Grade C

## Setup

### Prerequisites

- Node.js 18+
- A Supabase project (free tier works)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/student-management.git
   cd student-management
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (see `.env.example`):
   ```env
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Run the database migration in your Supabase SQL Editor (see `supabase/migrations/20261024102332_create_students_table.sql`).

5. Start the dev server:
   ```bash
   npm run dev
   ```

6. Build for production:
   ```bash
   npm run build
   ```

## Project Structure

```
student-management/
├── src/
│   ├── components/
│   │   ├── Analysis.tsx       # Performance analysis view
│   │   ├── StudentForm.tsx    # Add/Edit student modal
│   │   └── StudentTable.tsx   # Student records table
│   ├── lib/
│   │   ├── stats.ts           # Statistics calculations
│   │   └── supabase.ts        # Supabase client + types
│   ├── App.tsx                # Main app + dashboard
│   ├── main.tsx               # React entry point
│   └── index.css              # Styles
├── supabase/
│   └── migrations/
│       └── ...create_students_table.sql
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Conclusion

This project demonstrates SQL database creation, data insertion, filtering, aggregation, grouping, sorting, and updating through a practical student management system. It provides a simple way to analyze student performance and identify academic trends, with a clean web interface for interactive data exploration.

---

**Internship:** SQL Data Analysis Internship – Task 1
**Organization:** Maincrafts Technology
