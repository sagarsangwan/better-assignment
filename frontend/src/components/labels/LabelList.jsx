import { Button } from "@/components/ui/button"

function LabelList({ labels, onDelete, deletingId }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <h3 className="text-base font-semibold">Labels</h3>

      {labels.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">No labels yet.</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {labels.map((label) => (
            <li key={label.id} className="flex items-center justify-between rounded-md border p-2">
              <span className="text-sm">{label.name}</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onDelete(label)}
                disabled={deletingId === label.id}
              >
                {deletingId === label.id ? "Deleting..." : "Delete"}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default LabelList
