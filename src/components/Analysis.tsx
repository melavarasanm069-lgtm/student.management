import type { Student } from "../lib/supabase";
import type { Stats } from "../lib/stats";
import { totalScore } from "../lib/stats";

interface Props {
  students: Student[];
  stats: Stats;
}

function Bar({ label, value, max, colorClass }: { label: string; value: number; max: number; colorClass: string }) {
  const pct = Math.max(4, Math.round((value / max) * 100));
  return (
    <div className="bar-row">
      <div className="bar-label">{label}</div>
      <div className="bar-track">
        <div className={`bar-fill ${colorClass}`} style={{ width: `${pct}%` }}>
          {value}
        </div>
      </div>
    </div>
  );
}

export default function Analysis({ students, stats }: Props) {
  const maxScore = 100;

  return (
    <div>
      {/* Top performer + averages */}
      <div className="stats-grid">
        <div className="stat-tile">
          <div className="stat-label">Total Students</div>
          <div className="stat-value">{stats.count}</div>
        </div>
        <div className="stat-tile">
          <div className="stat-label">Avg. Math Score</div>
          <div className="stat-value">{stats.avgMath}</div>
          <div className="stat-meta">out of 100</div>
        </div>
        <div className="stat-tile">
          <div className="stat-label">Avg. Science Score</div>
          <div className="stat-value">{stats.avgScience}</div>
          <div className="stat-meta">out of 100</div>
        </div>
        <div className="stat-tile">
          <div className="stat-label">Avg. English Score</div>
          <div className="stat-value">{stats.avgEnglish}</div>
          <div className="stat-meta">out of 100</div>
        </div>
      </div>

      <div className="analysis-grid">
        {/* Top performer */}
        <div className="card section">
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
                    <strong>{totalScore(stats.topPerformer)}</strong> total marks · Grade {stats.topPerformer.grade}
                  </div>
                </div>
              </div>
            ) : (
              <div className="state-box">No data yet.</div>
            )}
          </div>
        </div>

        {/* Grade distribution */}
        <div className="card section">
          <div className="card-header">
            <div className="card-title">Grade Distribution</div>
          </div>
          <div className="card-body">
            <Bar label="Grade A" value={stats.gradeCounts["A"] || 0} max={stats.count || 1} colorClass="bar-fill-success" />
            <Bar label="Grade B" value={stats.gradeCounts["B"] || 0} max={stats.count || 1} colorClass="bar-fill-primary" />
            <Bar label="Grade C" value={stats.gradeCounts["C"] || 0} max={stats.count || 1} colorClass="bar-fill-warning" />
          </div>
        </div>

        {/* Subject averages */}
        <div className="card section">
          <div className="card-header">
            <div className="card-title">Subject Averages</div>
          </div>
          <div className="card-body">
            <Bar label="Math" value={stats.avgMath} max={maxScore} colorClass="bar-fill-primary" />
            <Bar label="Science" value={stats.avgScience} max={maxScore} colorClass="bar-fill-success" />
            <Bar label="English" value={stats.avgEnglish} max={maxScore} colorClass="bar-fill-warning" />
          </div>
        </div>

        {/* Gender comparison */}
        <div className="card section">
          <div className="card-header">
            <div className="card-title">Average Score by Gender</div>
          </div>
          <div className="card-body">
            <div className="gender-grid">
              <div className="gender-card male">
                <div className="gender-name">Male</div>
                {stats.maleAvg ? (
                  <>
                    <div className="gender-avg">{stats.maleAvg.overall}</div>
                    <div className="gender-subjects">
                      <span>M {stats.maleAvg.math}</span>
                      <span>S {stats.maleAvg.science}</span>
                      <span>E {stats.maleAvg.english}</span>
                    </div>
                  </>
                ) : (
                  <div className="gender-subjects">No data</div>
                )}
              </div>
              <div className="gender-card female">
                <div className="gender-name">Female</div>
                {stats.femaleAvg ? (
                  <>
                    <div className="gender-avg">{stats.femaleAvg.overall}</div>
                    <div className="gender-subjects">
                      <span>M {stats.femaleAvg.math}</span>
                      <span>S {stats.femaleAvg.science}</span>
                      <span>E {stats.femaleAvg.english}</span>
                    </div>
                  </>
                ) : (
                  <div className="gender-subjects">No data</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Students above 80 in math */}
      <div className="card section" style={{ marginTop: 20 }}>
        <div className="card-header">
          <div className="card-title">Students Scoring Above 80 in Mathematics</div>
          <div className="card-sub">{stats.above80Math} students</div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Gender</th>
                <th>Math Score</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {students.filter((s) => s.math_score > 80).length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "24px", color: "var(--text-muted)" }}>
                    No students above 80 in Mathematics.
                  </td>
                </tr>
              ) : (
                students
                  .filter((s) => s.math_score > 80)
                  .sort((a, b) => b.math_score - a.math_score)
                  .map((s) => (
                    <tr key={s.student_id}>
                      <td className="cell-name">{s.name}</td>
                      <td><span className="gender-tag">{s.gender}</span></td>
                      <td className="cell-num">{s.math_score}</td>
                      <td><span className={s.grade === "A" ? "badge badge-a" : s.grade === "B" ? "badge badge-b" : "badge badge-c"}>{s.grade}</span></td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
