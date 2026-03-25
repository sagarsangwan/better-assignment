import { Button } from "@/components/ui/button"
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from "@/lib/constants"

function TaskFilters({ filters, labels, onChange, onReset }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="grid gap-3 md:grid-cols-4">
        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">Search</span>
          <input
            className="w-full rounded-md border bg-background px-3 py-2"
            type="text"
            placeholder="Search by title"
            value={filters.search}
            onChange={(event) => onChange("search", event.target.value)}
          />
        </label>

        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">Status</span>
          <select
            className="w-full rounded-md border bg-background px-3 py-2"
            value={filters.status}
            onChange={(event) => onChange("status", event.target.value)}
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">Priority</span>
          <select
            className="w-full rounded-md border bg-background px-3 py-2"
            value={filters.priority}
            onChange={(event) => onChange("priority", event.target.value)}
          >
            <option value="">All priorities</option>
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm">
          <span className="text-muted-foreground">Label</span>
          <select
            className="w-full rounded-md border bg-background px-3 py-2"
            value={filters.label_id}
            onChange={(event) => onChange("label_id", event.target.value)}
          >
            <option value="">All labels</option>
            {labels.map((label) => (
              <option key={label.id} value={label.id}>
                {label.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-3 flex justify-end">
        <Button type="button" variant="outline" onClick={onReset}>
          Reset Filters
        </Button>
      </div>
    </div>
  )
}

export default TaskFilters
