import { useEffect, useMemo, useState } from "react";
import "./styles/app.css";
import type { Task } from "./types/task";
import { loadTasks, saveTasks } from "./utils/storage";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";

function uid() {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now()) + Math.random().toString(16).slice(2);
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (a.status !== b.status) return a.status === "pending" ? -1 : 1;
      return b.updatedAt.localeCompare(a.updatedAt);
    });
  }, [tasks]);

  function createTask(title: string, note: string) {
    const now = new Date().toISOString();
    const newTask: Task = {
      id: uid(),
      title,
      note,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    };
    setTasks((prev) => [newTask, ...prev]);
  }

  function updateTask(id: string, title: string, note: string) {
    const now = new Date().toISOString();
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title, note, updatedAt: now } : t))
    );
    setEditingTask(null);
  }

  function toggleStatus(id: string) {
    const now = new Date().toISOString();
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: t.status === "pending" ? "done" : "pending",
              updatedAt: now,
            }
          : t
      )
    );
  }

  function edit(task: Task) {
    setEditingTask(task);
  }

  function remove(id: string) {
    const ok = confirm("¿Seguro que deseas eliminar esta tarea/nota?");
    if (!ok) return;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (editingTask?.id === id) setEditingTask(null);
  }

  function cancelEdit() {
    setEditingTask(null);
  }

  function clearDone() {
    const ok = confirm("¿Eliminar todas las tareas completadas?");
    if (!ok) return;
    setTasks((prev) => prev.filter((t) => t.status !== "done"));
    if (editingTask && editingTask.status === "done") setEditingTask(null);
  }

  return (
    <div className="container">
      <header className="header">
        <h1>Blog – Tareas/Notas</h1>
      </header>

      <main className="grid">
        <TaskForm
          editingTask={editingTask}
          onCreate={createTask}
          onUpdate={updateTask}
          onCancelEdit={cancelEdit}
        />

        <TaskList
          tasks={sortedTasks}
          onToggleStatus={toggleStatus}
          onEdit={edit}
          onDelete={remove}
          onClearDone={clearDone}
        />
      </main>
    </div>
  );
}