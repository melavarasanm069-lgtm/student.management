import { useState } from "react";
import type { Student, StudentInput } from "../lib/supabase";

interface Props {
  initial?: Student | null;
  onClose: () => void;
  onSubmit: (input: StudentInput) => Promise<void>;
}

const empty: StudentInput = {
  name: "",
  gender: "Male",
  age: 16,
  grade: "B",
  math_score: 75,
  science_score: 75,
  english_score: 75,
};

export default function StudentForm({ initial, onClose, onSubmit }: Props) {
  const [form, setForm] = useState<StudentInput>(
    initial
      ? {
          name: initial.name,
          gender: initial.gender,
          age: initial.age,
          grade: initial.grade,
          math_score: initial.math_score,
          science_score: initial.science_score,
          english_score: initial.english_score,
        }
      : empty
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof StudentInput>(key: K, value: StudentInput[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }
    if (form.age < 5 || form.age > 100) {
      setError("Age must be between 5 and 100.");
      return;
    }
    for (const [k, v] of [
      ["Math", form.math_score],
      ["Science", form.science_score],
      ["English", form.english_score],
    ] as const) {
      if (v < 0 || v > 100) {
        setError(`${k} score must be between 0 and 100.`);
        return;
      }
    }

    setSaving(true);
    try {
      await onSubmit({
        ...form,
        name: form.name.trim(),
        gender: form.gender.trim(),
        grade: form.grade.trim().toUpperCase(),
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{initial ? "Edit Student" : "Add Student"}</div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="error-banner">{error}</div>}
            <div className="form-grid">
              <div className="form-field full">
                <label className="form-label" htmlFor="name">
                  Full Name
                </label>
                <input
                  id="name"
                  className="form-input"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g. Arjun Sharma"
                  autoFocus
                />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="gender">
                  Gender
                </label>
                <select
                  id="gender"
                  className="form-input"
                  value={form.gender}
                  onChange={(e) => set("gender", e.target.value)}
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="age">
                  Age
                </label>
                <input
                  id="age"
                  className="form-input"
                  type="number"
                  min={5}
                  max={100}
                  value={form.age}
                  onChange={(e) => set("age", Number(e.target.value))}
                />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="grade">
                  Grade
                </label>
                <select
                  id="grade"
                  className="form-input"
                  value={form.grade}
                  onChange={(e) => set("grade", e.target.value)}
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                </select>
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="math">
                  Math Score (0–100)
                </label>
                <input
                  id="math"
                  className="form-input"
                  type="number"
                  min={0}
                  max={100}
                  value={form.math_score}
                  onChange={(e) => set("math_score", Number(e.target.value))}
                />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="science">
                  Science Score (0–100)
                </label>
                <input
                  id="science"
                  className="form-input"
                  type="number"
                  min={0}
                  max={100}
                  value={form.science_score}
                  onChange={(e) => set("science_score", Number(e.target.value))}
                />
              </div>

              <div className="form-field">
                <label className="form-label" htmlFor="english">
                  English Score (0–100)
                </label>
                <input
                  id="english"
                  className="form-input"
                  type="number"
                  min={0}
                  max={100}
                  value={form.english_score}
                  onChange={(e) => set("english_score", Number(e.target.value))}
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? "Saving…" : initial ? "Save Changes" : "Add Student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
