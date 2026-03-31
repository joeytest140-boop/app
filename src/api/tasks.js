const API_BASE = "https://planner-api-710385487022.us-central1.run.app";

function unwrapBigQueryValue(value) {
  if (value && typeof value === "object" && "value" in value) {
    return value.value;
  }
  return value;
}

function normalizeTask(task) {
  return {
    id: unwrapBigQueryValue(task.id) || "",
    title: unwrapBigQueryValue(task.title) || "",
    description: unwrapBigQueryValue(task.description) || "",
    category: unwrapBigQueryValue(task.category) || "General",
    priority: unwrapBigQueryValue(task.priority) || "Medium",
    status: unwrapBigQueryValue(task.status) || "Not Started",
    assigned_to: unwrapBigQueryValue(task.assigned_to) || "",
    due_date: unwrapBigQueryValue(task.due_date) || "",
    notes: unwrapBigQueryValue(task.notes) || "",
    tags: Array.isArray(task.tags) ? task.tags.map(unwrapBigQueryValue) : [],
    created_at: unwrapBigQueryValue(task.created_at) || "",
    updated_at: unwrapBigQueryValue(task.updated_at) || "",
    completed_at: unwrapBigQueryValue(task.completed_at) || null,
    is_deleted: Boolean(unwrapBigQueryValue(task.is_deleted)),
  };
}

async function parseResponse(res) {
  if (res.status === 204) return null;

  const text = await res.text();

  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text };
  }

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  if (Array.isArray(data.tasks)) {
    return {
      ...data,
      tasks: data.tasks.map(normalizeTask),
    };
  }

  return data;
}

export async function getTasks() {
  const res = await fetch(`${API_BASE}/tasks`, {
    cache: "no-store",
  });
  return parseResponse(res);
}

export async function createTask(payload) {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(payload),
  });

  return parseResponse(res);
}

export async function updateTask(id, payload) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(payload),
  });

  return parseResponse(res);
}

export async function deleteTask(id) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "DELETE",
    cache: "no-store",
  });

  return parseResponse(res);
}