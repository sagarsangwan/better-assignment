function EmptyState({ title = "Nothing to show", description = "Try adjusting your filters." }) {
  return (
    <div className="rounded-lg border border-dashed bg-muted/30 p-6 text-center">
      <p className="font-medium text-foreground">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

export default EmptyState
