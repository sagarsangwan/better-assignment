import { useState } from "react"

import { getAIPlan } from "@/api/ai"
import ErrorState from "@/components/common/ErrorState"
import { Button } from "@/components/ui/button"

function AIPlanner() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [plan, setPlan] = useState(null)

  async function handleGeneratePlan() {
    setLoading(true)
    setError("")

    try {
      const result = await getAIPlan()
      setPlan(result)
    } catch (err) {
      setError(err.message || "Failed to generate AI plan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="rounded-lg border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-base font-semibold">AI Planning</h3>
        <Button type="button" onClick={handleGeneratePlan} disabled={loading}>
          {loading ? "Planning..." : "Plan my next 3 tasks"}
        </Button>
      </div>

      {error ? (
        <div className="mt-3">
          <ErrorState message={error} />
        </div>
      ) : null}

      {plan ? (
        <div className="mt-4 space-y-4">
          <div>
            <p className="text-sm font-medium">Top tasks</p>
            {plan.top_tasks?.length ? (
              <ul className="mt-2 space-y-2">
                {plan.top_tasks.map((task) => (
                  <li key={task.id} className="rounded-md border p-3 text-sm">
                    <p className="font-medium">{task.title}</p>
                    <p className="mt-1 text-muted-foreground">
                      Priority: {task.priority} | Status: {task.status}
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      Reasons: {task.reasons && task.reasons.length ? task.reasons.join(", ") : "None"}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">No active tasks to plan.</p>
            )}
          </div>

          <div>
            <p className="text-sm font-medium">Reasoning</p>
            <p className="mt-1 text-sm text-muted-foreground">{plan.reasoning || "No reasoning returned."}</p>
          </div>

          <div>
            <p className="text-sm font-medium">Warnings</p>
            {plan.warnings?.length ? (
              <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {plan.warnings.map((warning, index) => (
                  <li key={warning + index}>{warning}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">No warnings.</p>
            )}
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default AIPlanner
