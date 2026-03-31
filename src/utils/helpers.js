export function formatDate(dateValue) {
  if (!dateValue) return "—";

  const raw =
    dateValue && typeof dateValue === "object" && "value" in dateValue
      ? dateValue.value
      : dateValue;

  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return String(raw);

  return date.toLocaleDateString();
}

export function sortTasks(tasks) {
  const priorityRank = {
    Urgent: 4,
    High: 3,
    Medium: 2,
    Low: 1,
  };

  return [...tasks].sort((a, b) => {
    const aCompleted = a.status === "Completed" ? 1 : 0;
    const bCompleted = b.status === "Completed" ? 1 : 0;

    if (aCompleted !== bCompleted) return aCompleted - bCompleted;

    const aPriority = priorityRank[a.priority] || 0;
    const bPriority = priorityRank[b.priority] || 0;
    if (aPriority !== bPriority) return bPriority - aPriority;

    const aDue = a.due_date ? new Date(a.due_date).getTime() : Infinity;
    const bDue = b.due_date ? new Date(b.due_date).getTime() : Infinity;
    return aDue - bDue;
  });
}