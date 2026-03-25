import { apiRequest } from "@/api/client"

export function getAIPlan() {
  return apiRequest("/api/ai/plan")
}
