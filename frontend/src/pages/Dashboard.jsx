import { useEffect, useState } from "react"

import { createTask, deleteTask, getTaskSummary, getTasks, updateTask } from "@/api/tasks"
import { createLabel, deleteLabel, getLabels } from "@/api/labels"
import AIPlanner from "@/components/ai/AIPlanner"
import ConfirmDialog from "@/components/common/ConfirmDialog"
import ErrorState from "@/components/common/ErrorState"
import LoadingState from "@/components/common/LoadingState"
import SectionHeader from "@/components/common/SectionHeader"
import LabelForm from "@/components/labels/LabelForm"
import LabelList from "@/components/labels/LabelList"
import TaskFilters from "@/components/tasks/TaskFilters"
import TaskForm from "@/components/tasks/TaskForm"
import TaskList from "@/components/tasks/TaskList"
import TaskSummaryCards from "@/components/tasks/TaskSummaryCards"

const initialFilters = {
  status: "",
  priority: "",
  search: "",
  label_id: "",
}

const emptySummary = {
  total: 0,
  todo: 0,
  in_progress: 0,
  done: 0,
  high_priority: 0,
}

function Dashboard() {
  const [filters, setFilters] = useState(initialFilters)

  const [tasks, setTasks] = useState([])
  const [tasksLoading, setTasksLoading] = useState(true)
  const [tasksError, setTasksError] = useState("")

  const [summary, setSummary] = useState(emptySummary)
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [summaryError, setSummaryError] = useState("")

  const [labels, setLabels] = useState([])
  const [labelsLoading, setLabelsLoading] = useState(true)
  const [labelsError, setLabelsError] = useState("")

  const [taskMode, setTaskMode] = useState("create")
  const [editingTask, setEditingTask] = useState(null)
  const [taskSubmitting, setTaskSubmitting] = useState(false)
  const [taskFormError, setTaskFormError] = useState("")

  const [taskToDelete, setTaskToDelete] = useState(null)
  const [taskDeleting, setTaskDeleting] = useState(false)

  const [labelSubmitting, setLabelSubmitting] = useState(false)
  const [labelActionError, setLabelActionError] = useState("")
  const [labelDeletingId, setLabelDeletingId] = useState(null)

  async function loadTasks(nextFilters) {
    setTasksLoading(true)
    setTasksError("")

    try {
      const data = await getTasks(nextFilters)
      setTasks(Array.isArray(data) ? data : [])
    } catch (err) {
      setTasksError(err.message || "Failed to load tasks")
    } finally {
      setTasksLoading(false)
    }
  }

  async function loadSummary() {
    setSummaryLoading(true)
    setSummaryError("")

    try {
      const data = await getTaskSummary()
      setSummary({ ...emptySummary, ...data })
    } catch (err) {
      setSummaryError(err.message || "Failed to load summary")
    } finally {
      setSummaryLoading(false)
    }
  }

  async function loadLabels() {
    setLabelsLoading(true)
    setLabelsError("")

    try {
      const data = await getLabels()
      setLabels(Array.isArray(data) ? data : [])
    } catch (err) {
      setLabelsError(err.message || "Failed to load labels")
    } finally {
      setLabelsLoading(false)
    }
  }

  useEffect(() => {
    loadSummary()
    loadLabels()
  }, [])

  useEffect(() => {
    loadTasks(filters)
  }, [filters])

  function handleFilterChange(field, value) {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  function handleResetFilters() {
    setFilters(initialFilters)
  }

  function handleEditTask(task) {
    setTaskMode("edit")
    setEditingTask(task)
    setTaskFormError("")
  }

  function handleCancelEdit() {
    setTaskMode("create")
    setEditingTask(null)
    setTaskFormError("")
  }

  async function refreshTasksAndSummary() {
    await Promise.all([loadTasks(filters), loadSummary()])
  }

  async function handleSubmitTask(payload) {
    setTaskSubmitting(true)
    setTaskFormError("")

    try {
      if (payload.title.length === 0) {
        setTaskFormError("Title is required")
        return
      }

      if (taskMode === "edit" && editingTask) {
        await updateTask(editingTask.id, payload)
      } else {
        await createTask(payload)
      }

      await refreshTasksAndSummary()
      setTaskMode("create")
      setEditingTask(null)
    } catch (err) {
      setTaskFormError(err.message || "Failed to save task")
    } finally {
      setTaskSubmitting(false)
    }
  }

  function handleDeleteTaskClick(task) {
    setTaskToDelete(task)
  }

  async function handleConfirmDeleteTask() {
    if (!taskToDelete) {
      return
    }

    setTaskDeleting(true)

    try {
      await deleteTask(taskToDelete.id)
      setTaskToDelete(null)

      if (editingTask && editingTask.id === taskToDelete.id) {
        setTaskMode("create")
        setEditingTask(null)
      }

      await refreshTasksAndSummary()
    } catch (err) {
      setTasksError(err.message || "Failed to delete task")
    } finally {
      setTaskDeleting(false)
    }
  }

  async function handleCreateLabel(name) {
    setLabelSubmitting(true)
    setLabelActionError("")

    try {
      await createLabel({ name })
      await Promise.all([loadLabels(), loadTasks(filters)])
    } catch (err) {
      setLabelActionError(err.message || "Failed to create label")
      throw err
    } finally {
      setLabelSubmitting(false)
    }
  }

  async function handleDeleteLabel(label) {
    const confirmed = window.confirm('Delete label "' + label.name + '"?')
    if (!confirmed) {
      return
    }

    setLabelDeletingId(label.id)
    setLabelActionError("")

    try {
      await deleteLabel(label.id)
      await Promise.all([loadLabels(), loadTasks(filters)])

      if (String(filters.label_id) === String(label.id)) {
        setFilters((prev) => ({ ...prev, label_id: "" }))
      }
    } catch (err) {
      setLabelActionError(err.message || "Failed to delete label")
    } finally {
      setLabelDeletingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <header className="rounded-lg border bg-card p-6">
          <h1 className="text-2xl font-bold">Task Planner</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Plan tasks, manage labels, and use AI suggestions for your next priorities.
          </p>
        </header>

        <section className="space-y-3">
          <SectionHeader
            title="Summary"
            subtitle="A quick snapshot of your task progress."
          />
          <TaskSummaryCards summary={summary} loading={summaryLoading} error={summaryError} />
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="space-y-4 lg:col-span-2">
            <SectionHeader
              title="Tasks"
              subtitle="Filter, review, and manage all tasks in one place."
            />

            <TaskFilters
              filters={filters}
              labels={labels}
              onChange={handleFilterChange}
              onReset={handleResetFilters}
            />

            <TaskList
              tasks={tasks}
              loading={tasksLoading}
              error={tasksError}
              onEdit={handleEditTask}
              onDelete={handleDeleteTaskClick}
            />
          </section>

          <aside className="space-y-4">
            <TaskForm
              mode={taskMode}
              labels={labels}
              initialTask={editingTask}
              onSubmit={handleSubmitTask}
              onCancel={handleCancelEdit}
              submitting={taskSubmitting}
              error={taskFormError}
            />

            <SectionHeader
              title="Labels"
              subtitle="Create labels to organize your tasks."
            />

            {labelsLoading ? <LoadingState label="Loading labels..." /> : null}
            {labelsError ? <ErrorState message={labelsError} /> : null}

            <LabelForm
              onSubmit={handleCreateLabel}
              submitting={labelSubmitting}
              error={labelActionError}
            />

            <LabelList
              labels={labels}
              onDelete={handleDeleteLabel}
              deletingId={labelDeletingId}
            />

            <AIPlanner />
          </aside>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(taskToDelete)}
        title="Delete task"
        description={
          taskToDelete
            ? 'Are you sure you want to delete "' + taskToDelete.title + '"? This action cannot be undone.'
            : ""
        }
        confirmText="Delete"
        onCancel={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDeleteTask}
        loading={taskDeleting}
      />
    </div>
  )
}

export default Dashboard
