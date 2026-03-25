function LoadingState({ label = "Loading..." }) {
  return (
    <div className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
      {label}
    </div>
  )
}

export default LoadingState
