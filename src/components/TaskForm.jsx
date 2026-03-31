import { useEffect, useState } from "react";
import {
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
  CATEGORY_OPTIONS,
} from "../utils/constants";

const initialForm = {
  title: "",
  description: "",
  category: "General",
  priority: "Medium",
  status: "Not Started",
  assigned_to: "",
  due_date: "",
  notes: "",
};

export default function TaskForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Save Task",
}) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (initialValues) {
      setForm({
        ...initialForm,
        ...initialValues,
        due_date: initialValues.due_date ? initialValues.due_date.slice(0, 10) : "",
      });
    } else {
      setForm(initialForm);
    }
  }, [initialValues]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim()) return;

    onSubmit({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      assigned_to: form.assigned_to.trim(),
      notes: form.notes.trim(),
    });
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Task title"
          required
        />
      </div>

      <div className="form-row">
        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Task description"
          rows={3}
        />
      </div>

      <div className="form-grid">
        <div className="form-row">
          <label>Category</label>
          <select name="category" value={form.category} onChange={handleChange}>
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label>Priority</label>
          <select name="priority" value={form.priority} onChange={handleChange}>
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label>Status</label>
          <select name="status" value={form.status} onChange={handleChange}>
            {STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label>Assigned To</label>
          <input
            name="assigned_to"
            value={form.assigned_to}
            onChange={handleChange}
            placeholder="Person name"
          />
        </div>

        <div className="form-row">
          <label>Due Date</label>
          <input
            type="date"
            name="due_date"
            value={form.due_date}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-row">
        <label>Notes</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Extra notes"
          rows={3}
        />
      </div>

      <div className="form-actions">
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}