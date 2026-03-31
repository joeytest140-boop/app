import { useEffect, useMemo, useState } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../api/tasks";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import FilterBar from "../components/FilterBar";
import { sortTasks } from "../utils/helpers";

const defaultFilters = {
  search: "",
  status: "",
  priority: "",
  category: "",
};

export default function PlannerPage() {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  async function loadTasks() {
    try {
      setLoading(true);
      setError("");

      const data = await getTasks();
      const nextTasks = Array.isArray(data) ? data : data.tasks || [];
      setTasks(nextTasks);
    } catch (err) {
      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function handleCreateTask(payload) {
    try {
      setSaving(true);
      setError("");
      await createTask(payload);
      await loadTasks();
    } catch (err) {
      setError(err.message || "Failed to create task");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateTask(payload) {
    if (!editingTask) return;

    try {
      setSaving(true);
      setError("");
      await updateTask(editingTask.id, payload);
      setEditingTask(null);
      await loadTasks();
    } catch (err) {
      setError(err.message || "Failed to update task");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteTask(id) {
    const confirmed = window.confirm("Delete this task?");
    if (!confirmed) return;

    try {
      setError("");
      await deleteTask(id);
      await loadTasks();
    } catch (err) {
      setError(err.message || "Failed to delete task");
    }
  }

  const filteredTasks = useMemo(() => {
    let next = [...tasks];

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      next = next.filter((task) =>
        [
          task.title,
          task.description,
          task.category,
          task.priority,
          task.status,
          task.assigned_to,
          task.notes,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }

    if (filters.status) {
      next = next.filter((task) => task.status === filters.status);
    }

    if (filters.priority) {
      next = next.filter((task) => task.priority === filters.priority);
    }

    if (filters.category) {
      next = next.filter((task) => task.category === filters.category);
    }

    return sortTasks(next);
  }, [tasks, filters]);

  return (
    <div className="page-shell">
      <div className="page-header">
        <div>
          <p className="eyebrow">Planner App</p>
          <h1>Action Items</h1>
          <p className="subtext">
            Create, track, update, and manage your tasks.
          </p>
        </div>
      </div>

      {error ? <div className="alert">{error}</div> : null}

      <div className="layout-grid">
        <div className="panel">
          <h2>{editingTask ? "Edit Task" : "Create Task"}</h2>
          <TaskForm
            initialValues={editingTask}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onCancel={editingTask ? () => setEditingTask(null) : null}
            submitLabel={saving ? "Saving..." : editingTask ? "Update Task" : "Create Task"}
          />
        </div>

        <div className="panel">
          <div className="tasks-header">
            <h2>Tasks</h2>
            <button className="btn btn-secondary" onClick={loadTasks}>
              Refresh
            </button>
          </div>

          <FilterBar
            filters={filters}
            onChange={setFilters}
            onClear={() => setFilters(defaultFilters)}
          />

          {loading ? (
            <div className="empty-state">Loading tasks...</div>
          ) : filteredTasks.length === 0 ? (
            <div className="empty-state">No tasks found.</div>
          ) : (
            <div className="tasks-list">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={setEditingTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}