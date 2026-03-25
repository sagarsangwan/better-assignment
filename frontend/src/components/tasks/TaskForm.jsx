import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from "@/lib/constants"
import { toDateTimeLocal } from "@/lib/utils"

const defaultValues = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  due_date: "",
  label_ids: [],
}

function mapTaskToForm(task) {
  if (!task) {
    return defaultValues
  }

  return {
    title: task.title || "",
    description: task.description || "",
    status: task.status || "todo",
    priority: task.priority || "medium",
    due_date: toDateTimeLocal(task.due_date),
    label_ids: task.labels ? task.labels.map((label) => label.id) : [],
  }
}

function TaskForm({
  mode = "create",
  labels = [],
  initialTask,
  onSubmit,
  onCancel,
  submitting,
  error,
}) {
  const [form, setForm] = useState(defaultValues)

  useEffect(() => {
    setForm(mapTaskToForm(initialTask))
  }, [initialTask])

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function toggleLabel(labelId) {
    setForm((prev) => {
      const hasLabel = prev.label_ids.includes(labelId)
      const nextLabelIds = hasLabel
        ? prev.label_ids.filter((id) => id !== labelId)
        : [...prev.label_ids, labelId]

      return { ...prev, label_ids: nextLabelIds }
    })
  }

  function handleSubmit(event) {
    event.preventDefault()

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      priority: form.priority,
      due_date: form.due_date || null,
      label_ids: form.label_ids,
    }

    onSubmit(payload)
  }

  const heading = mode === "edit" ? "Edit Task" : "Create Task"

  return (
    <form className="rounded-lg border bg-card p-4" onSubmit={handleSubmit}>
      <h3 className="text-base font-semibold">{heading}</h3>

      <div className="mt-3 space-y-3">
        <label className="block text-sm">
          <span className="text-muted-foreground">Title</span>
          <input
            className="mt-1 w-full rounded-md border bg-background px-3 py-2"
            value={form.title}
            onChange={(event) => updateField("title", event.target.value)}
            required
          />
        </label>

        <label className="block text-sm">
          <span className="text-muted-foreground">Description</span>
          <textarea
            className="mt-1 w-full rounded-md border bg-background px-3 py-2"
            rows={3}
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-muted-foreground">Status</span>
            <select
              className="mt-1 w-full rounded-md border bg-background px-3 py-2"
              value={form.status}
              onChange={(event) => updateField("status", event.target.value)}
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="text-muted-foreground">Priority</span>
            <select
              className="mt-1 w-full rounded-md border bg-background px-3 py-2"
              value={form.priority}
              onChange={(event) => updateField("priority", event.target.value)}
            >
              {PRIORITY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="block text-sm">
          <span className="text-muted-foreground">Due Date</span>
          <input
            type="datetime-local"
            className="mt-1 w-full rounded-md border bg-background px-3 py-2"
            value={form.due_date}
            onChange={(event) => updateField("due_date", event.target.value)}
          />
        </label>

        <fieldset className="rounded-md border p-3">
          <legend className="px-1 text-sm text-muted-foreground">Labels</legend>
          <div className="mt-1 grid gap-2 sm:grid-cols-2">
            {labels.length === 0 ? (
              <p className="text-sm text-muted-foreground">No labels available yet.</p>
            ) : (
              labels.map((label) => (
                <label key={label.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={form.label_ids.includes(label.id)}
                    onChange={() => toggleLabel(label.id)}
                  />
                  <span>{label.name}</span>
                </label>
              ))
            )}
          </div>
        </fieldset>
      </div>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : mode === "edit" ? "Update Task" : "Create Task"}
        </Button>
        {mode === "edit" ? (
          <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  )
}

export default TaskForm
