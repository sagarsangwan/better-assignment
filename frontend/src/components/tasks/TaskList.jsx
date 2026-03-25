import EmptyState from "@/components/common/EmptyState"
import ErrorState from "@/components/common/ErrorState"
import LoadingState from "@/components/common/LoadingState"
import TaskCard from "@/components/tasks/TaskCard"

function TaskList({ tasks, loading, error, onEdit, onDelete }) {
  if (loading) {
    return <LoadingState label="Loading tasks..." />
  }

  if (error) {
    return <ErrorState message={error} />
  }

  if (tasks.length === 0) {
    return (
      <EmptyState
        title="No tasks found"
        description="Create a task or adjust filters to see results."
      />
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  )
}

export default TaskList
