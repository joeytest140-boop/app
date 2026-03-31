import { formatDate } from "../utils/helpers";

export default function TaskCard({ task, onEdit, onDelete }) {
  return (
    <div className="task-card">
      <div className="task-card-top">
        <div>
          <h3>{task.title}</h3>
          <p className="task-meta">
            {task.category} • {task.priority} • {task.status}
          </p>
        </div>

        <div className="task-card-actions">
          <button className="btn btn-secondary" onClick={() => onEdit(task)}>
            Edit
          </button>
          <button className="btn btn-danger" onClick={() => onDelete(task.id)}>
            Delete
          </button>
        </div>
      </div>

      {task.description ? <p className="task-description">{task.description}</p> : null}

      <div className="task-details">
        <span>
          <strong>Assigned:</strong> {task.assigned_to || "—"}
        </span>
        <span>
          <strong>Due:</strong> {formatDate(task.due_date)}
        </span>
      </div>

      {task.notes ? (
        <div className="task-notes">
          <strong>Notes:</strong> {task.notes}
        </div>
      ) : null}
    </div>
  );
}