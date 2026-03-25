import { useState } from "react"

import { Button } from "@/components/ui/button"

function LabelForm({ onSubmit, submitting, error }) {
  const [name, setName] = useState("")

  async function handleSubmit(event) {
    event.preventDefault()

    const trimmed = name.trim()
    if (trimmed.length === 0) {
      return
    }

    try {
      await onSubmit(trimmed)
      setName("")
    } catch {
      // Parent handles and displays API errors.
    }
  }

  return (
    <form className="rounded-lg border bg-card p-4" onSubmit={handleSubmit}>
      <h3 className="text-base font-semibold">Create Label</h3>
      <div className="mt-3 flex gap-2">
        <input
          className="w-full rounded-md border bg-background px-3 py-2"
          placeholder="Label name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <Button type="submit" disabled={submitting}>
          {submitting ? "Adding..." : "Add"}
        </Button>
      </div>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </form>
  )
}

export default LabelForm
