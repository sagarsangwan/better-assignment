import { apiRequest } from "@/api/client"

export function getLabels() {
  return apiRequest("/api/labels/")
}

export function createLabel(data) {
  return apiRequest("/api/labels/", {
    method: "POST",
    body: data,
  })
}

export function deleteLabel(labelId) {
  return apiRequest(`/api/labels/${labelId}`, {
    method: "DELETE",
  })
}
