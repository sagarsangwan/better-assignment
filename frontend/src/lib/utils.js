import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(value) {
  if (!value) {
    return "No due date"
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return "Invalid date"
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date)
}

export function toDateTimeLocal(value) {
  if (!value) {
    return ""
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return ""
  }

  const timezoneOffsetMs = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - timezoneOffsetMs).toISOString().slice(0, 16)
}

export function statusLabel(value) {
  if (value === "in_progress") {
    return "In Progress"
  }

  return value ? value.charAt(0).toUpperCase() + value.slice(1) : ""
}
