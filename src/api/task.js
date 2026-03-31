const API_BASE = "https://YOUR-CLOUD-RUN-URL-HERE";

async function parseResponse(res) {
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

  return data;
}

export async function getTasks() {
  const res = await fetch(`${API_BASE}/tasks`);
  return parseResponse(res);
}

export async function createTask(payload) {
  const res = await fetch(`${API_BASE}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
    body: JSON.stringify(payload),
  });

  return parseResponse(res);
}

export async function deleteTask(id) {
  const res = await fetch(`${API_BASE}/tasks/${id}`, {
    method: "DELETE",
  });

  return parseResponse(res);
}