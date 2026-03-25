import LoadingState from "@/components/common/LoadingState"
import ErrorState from "@/components/common/ErrorState"

const summaryConfig = [
  { key: "total", label: "Total Tasks" },
  { key: "todo", label: "Todo" },
  { key: "in_progress", label: "In Progress" },
  { key: "done", label: "Done" },
  { key: "high_priority", label: "High Priority" },
]

function TaskSummaryCards({ summary, loading, error }) {
  if (loading) {
    return <LoadingState label="Loading summary..." />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {summaryConfig.map((item) => (
        <div key={item.key} className="rounded-lg border bg-card p-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{item.label}</p>
          <p className="mt-2 text-2xl font-semibold">{summary?.[item.key] ?? 0}</p>
        </div>
      ))}
    </div>
  )
}

export default TaskSummaryCards
