import { useEffect, useMemo, useState } from "react";
import { supabase } from "./lib/supabase";
import type { Student, StudentInput } from "./lib/supabase";
import { computeStats } from "./lib/stats";
import StudentTable from "./components/StudentTable";
import Analysis from "./components/Analysis";
import StudentForm from "./components/StudentForm";

type Tab = "dashboard" | "students" | "analysis";

export default function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("dashboard");

  // table view state
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("All");

  // modal state
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);

  const stats = useMemo(() => computeStats(students), [students]);

  async function fetchStudents() {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("student_id", { ascending: true });
    if (error) {
      setError(error.message);
    } else if (data) {
      setStudents(data as Student[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchStudents();
  }, []);

  async function handleAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  async function handleEdit(s: Student) {
    setEditing(s);
    setFormOpen(true);
  }

  async function handleDelete(s: Student) {
    if (!confirm(`Delete ${s.name}? This cannot be undone.`)) return;
    const { error } = await supabase
      .from("students")
      .delete()
      .eq("student_id", s.student_id);
    if (error) {
      setError(error.message);
      return;
    }
    await fetchStudents();
  }

  async function handleSubmit(input: StudentInput) {
    if (editing) {
      const { error } = await supabase
        .from("students")
        .update(input)
        .eq("student_id", editing.student_id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("students").insert([input]);
      if (error) throw error;
    }
    await fetchStudents();
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <div className="brand-icon">S</div>
            <div>
              <div className="brand-title">Student Management</div>
              <div className="brand-sub">Performance Analysis · Maincrafts Technology</div>
            </div>
          </div>
          <nav className="tabs">
            <button className={`tab ${tab === "dashboard" ? "active" : ""}`} onClick={() => setTab("dashboard")}>
              Dashboard
            </button>
            <button className={`tab ${tab === "students" ? "active" : ""}`} onClick={() => setTab("students")}>
              Students
            </button>
            <button className={`tab ${tab === "analysis" ? "active" : ""}`} onClick={() => setTab("analysis")}>
              Analysis
            </button>
          </nav>
        </div>
      </header>

      <main className="container">
        {error && <div className="error-banner">{error}</div>}

        {loading ? (
          <div className="state-box">
            <div className="spinner" />
            Loading student data…
          </div>
        ) : tab === "dashboard" ? (
          <Dashboard students={students} stats={stats} onAdd={handleAdd} />
        ) : tab === "students" ? (
          <StudentTable
            students={students}
            search={search}
            gradeFilter={gradeFilter}
            onSearch={setSearch}
            onGradeFilter={setGradeFilter}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <Analysis students={students} stats={stats} />
        )}
      </main>

      <footer className="footer">
        SQL Data Analysis Internship · Task 1 · Student Management Database
      </footer>

      {formOpen && (
        <StudentForm
          initial={editing}
          onClose={() => setFormOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

function Dashboard({
  students,
  stats,
  onAdd,
}: {
  students: Student[];
  stats: ReturnType<typeof computeStats>;
  onAdd: () => void;
}) {
  return (
    <div>
      <div className="section">
        <div className="section-title">Overview</div>
        <div className="stats-grid">
          <div className="stat-tile">
            <div className="stat-label">Total Students</div>
            <div className="stat-value">{stats.count}</div>
          </div>
          <div className="stat-tile">
            <div className="stat-label">Avg. Math</div>
            <div className="stat-value">{stats.avgMath}</div>
            <div className="stat-meta">out of 100</div>
          </div>
          <div className="stat-tile">
            <div className="stat-label">Avg. Science</div>
            <div className="stat-value">{stats.avgScience}</div>
            <div className="stat-meta">out of 100</div>
          </div>
          <div className="stat-tile">
            <div className="stat-label">Avg. English</div>
            <div className="stat-value">{stats.avgEnglish}</div>
            <div className="stat-meta">out of 100</div>
          </div>
        </div>
      </div>

      <div className="analysis-grid">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Top Performer</div>
          </div>
          <div className="card-body">
            {stats.topPerformer ? (
              <div className="top-performer">
                <div className="medal">1</div>
                <div>
                  <div className="top-name">{stats.topPerformer.name}</div>
                  <div className="top-total">
                    <strong>
                      {stats.topPerformer.math_score + stats.topPerformer.science_score + stats.topPerformer.english_score}
                    </strong>{" "}
                    total marks · Grade {stats.topPerformer.grade}
                  </div>
                </div>
              </div>
            ) : (
              <div className="state-box">No data.</div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Grade Distribution</div>
            <button className="btn btn-primary btn-sm" onClick={onAdd}>
              + Add Student
            </button>
          </div>
          <div className="card-body">
            <GradeBar label="Grade A" count={stats.gradeCounts["A"] || 0} total={stats.count} />
            <GradeBar label="Grade B" count={stats.gradeCounts["B"] || 0} total={stats.count} />
            <GradeBar label="Grade C" count={stats.gradeCounts["C"] || 0} total={stats.count} />
          </div>
        </div>
      </div>

      <div className="card section" style={{ marginTop: 20 }}>
        <div className="card-header">
          <div className="card-title">Recent Students</div>
          <div className="card-sub">{students.length} total</div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Gender</th>
                <th>Grade</th>
                <th>Math</th>
                <th>Science</th>
                <th>English</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {students.slice(0, 5).map((s) => (
                <tr key={s.student_id}>
                  <td className="cell-name">{s.name}</td>
                  <td><span className="gender-tag">{s.gender}</span></td>
                  <td>
                    <span className={s.grade === "A" ? "badge badge-a" : s.grade === "B" ? "badge badge-b" : "badge badge-c"}>
                      {s.grade}
                    </span>
                  </td>
                  <td className="cell-num">{s.math_score}</td>
                  <td className="cell-num">{s.science_score}</td>
                  <td className="cell-num">{s.english_score}</td>
                  <td className="row-total">{s.math_score + s.science_score + s.english_score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function GradeBar({ label, count, total }: { label: string; count: number; total: number }) {
  const max = total || 1;
  const pct = Math.max(4, Math.round((count / max) * 100));
  const colorClass = label.includes("A") ? "bar-fill-success" : label.includes("B") ? "bar-fill-primary" : "bar-fill-warning";
  return (
    <div className="bar-row">
      <div className="bar-label">{label}</div>
      <div className="bar-track">
        <div className={`bar-fill ${colorClass}`} style={{ width: `${pct}%` }}>
          {count}
        </div>
      </div>
    </div>
  );
}
