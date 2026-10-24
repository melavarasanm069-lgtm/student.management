import type { Student } from "../lib/supabase";
import { totalScore, gradeBadgeClass } from "../lib/stats";

interface Props {
  students: Student[];
  search: string;
  gradeFilter: string;
  onSearch: (v: string) => void;
  onGradeFilter: (v: string) => void;
  onAdd: () => void;
  onEdit: (s: Student) => void;
  onDelete: (s: Student) => void;
}

export default function StudentTable({
  students,
  search,
  gradeFilter,
  onSearch,
  onGradeFilter,
  onAdd,
  onEdit,
  onDelete,
}: Props) {
  const filtered = students.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesGrade = gradeFilter === "All" || s.grade === gradeFilter;
    return matchesSearch && matchesGrade;
  });

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Student Records</div>
          <div className="card-sub">{filtered.length} of {students.length} students</div>
        </div>
        <button className="btn btn-primary" onClick={onAdd}>
          + Add Student
        </button>
      </div>

      <div className="card-body" style={{ paddingTop: 16, paddingBottom: 16 }}>
        <div className="toolbar">
          <input
            className="search-input"
            placeholder="Search by name…"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
          />
          <select
            className="select-input"
            value={gradeFilter}
            onChange={(e) => onGradeFilter(e.target.value)}
          >
            <option value="All">All Grades</option>
            <option value="A">Grade A</option>
            <option value="B">Grade B</option>
            <option value="C">Grade C</option>
          </select>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Gender</th>
              <th>Age</th>
              <th>Grade</th>
              <th>Math</th>
              <th>Science</th>
              <th>English</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={10} style={{ textAlign: "center", padding: "32px", color: "var(--text-muted)" }}>
                  No students match your search.
                </td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr key={s.student_id}>
                  <td className="cell-id">#{s.student_id}</td>
                  <td className="cell-name">{s.name}</td>
                  <td><span className="gender-tag">{s.gender}</span></td>
                  <td className="cell-num">{s.age}</td>
                  <td><span className={gradeBadgeClass(s.grade)}>{s.grade}</span></td>
                  <td className="cell-num">{s.math_score}</td>
                  <td className="cell-num">{s.science_score}</td>
                  <td className="cell-num">{s.english_score}</td>
                  <td className="row-total">{totalScore(s)}</td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => onEdit(s)}>
                        Edit
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => onDelete(s)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
