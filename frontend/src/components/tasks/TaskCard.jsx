import { Button } from "@/components/ui/button"
import { formatDate, statusLabel } from "@/lib/utils"

function badgeClass(type, value) {
  if (type === "status") {
    if (value === "done") {
      return "bg-green-100 text-green-700"
    }
    if (value === "in_progress") {
      return "bg-blue-100 text-blue-700"
    }
    return "bg-zinc-100 text-zinc-700"
  }

  if (value === "high") {
    return "bg-red-100 text-red-700"
  }
  if (value === "medium") {
    return "bg-amber-100 text-amber-700"
  }

  return "bg-zinc-100 text-zinc-700"
}

function TaskCard({ task, onEdit, onDelete }) {
  return (
    <article className="rounded-lg border bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">{task.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {task.description || "No description"}
          </p>
        </div>

        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => onEdit(task)}>
            Edit
          </Button>
          <Button type="button" variant="destructive" size="sm" onClick={() => onDelete(task)}>
            Delete
          </Button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span className={"rounded-full px-2 py-1 font-medium " + badgeClass("status", task.status)}>
          {statusLabel(task.status)}
        </span>
        <span className={"rounded-full px-2 py-1 font-medium " + badgeClass("priority", task.priority)}>
          {task.priority}
        </span>
        <span className="rounded-full bg-muted px-2 py-1 text-muted-foreground">
          Due: {formatDate(task.due_date)}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {task.labels?.length ? (
          task.labels.map((label) => (
            <span key={label.id} className="rounded-full border px-2 py-1 text-xs text-muted-foreground">
              {label.name}
            </span>
          ))
        ) : (
          <span className="text-xs text-muted-foreground">No labels</span>
        )}
      </div>
    </article>
  )
}

export default TaskCard
