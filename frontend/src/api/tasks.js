import { apiRequest } from "@/api/client"

export function getTasks(filters = {}) {
  return apiRequest("/api/tasks/", { params: filters })
}

export function getTaskSummary() {
  return apiRequest("/api/tasks/summary")
}

export function getTaskById(taskId) {
  return apiRequest(`/api/tasks/${taskId}`)
}

export function createTask(data) {
  return apiRequest("/api/tasks/", {
    method: "POST",
    body: data,
  })
}

export function updateTask(taskId, data) {
  return apiRequest(`/api/tasks/${taskId}`, {
    method: "PUT",
    body: data,
  })
}

export function deleteTask(taskId) {
  return apiRequest(`/api/tasks/${taskId}`, {
    method: "DELETE",
  })
}
