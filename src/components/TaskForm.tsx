import { useEffect, useMemo, useState } from "react";
import type { Task } from "../types/task";

type Props = {
  editingTask: Task | null;
  onCreate: (title: string, note: string) => void;
  onUpdate: (id: string, title: string, note: string) => void;
  onCancelEdit: () => void;
};

export default function TaskForm({
  editingTask,
  onCreate,
  onUpdate,
  onCancelEdit,
}: Props) {
  const isEditing = useMemo(() => !!editingTask, [editingTask]);

  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setNote(editingTask.note);
      setError("");
    } else {
      setTitle("");
      setNote("");
      setError("");
    }
  }, [editingTask]);

  function validate() {
    if (!title.trim()) return "El título es obligatorio.";
    if (title.trim().length < 3) return "El título debe tener al menos 3 caracteres.";
    if (note.trim().length > 200) return "La nota no debe exceder 200 caracteres.";
    return "";
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    setError("");

    if (editingTask) {
      onUpdate(editingTask.id, title.trim(), note.trim());
    } else {
      onCreate(title.trim(), note.trim());
    }

    setTitle("");
    setNote("");
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div className="cardHeader">
        <h2>{isEditing ? "Editar tarea/nota" : "Nueva tarea/nota"}</h2>
        <p className="muted">
          {isEditing ? "Modifica y guarda cambios." : "Registra una nueva tarea o nota."}
        </p>
      </div>

      <label className="label">
        Título (requerido)
        <input
          className="input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}   // EVENTO: onChange
          placeholder="Ej: Entregar evidencia"
          maxLength={60}
        />
      </label>

      <label className="label">
        Nota (opcional)
        <textarea
          className="textarea"
          value={note}
          onChange={(e) => setNote(e.target.value)}    // EVENTO: onChange
          placeholder="Detalles…"
          maxLength={200}
          rows={4}
        />
        <span className="hint">{note.length}/200</span>
      </label>

      {error && <div className="error" role="alert">{error}</div>}

      <div className="row">
        <button className="btn primary" type="submit">
          {isEditing ? "Guardar cambios" : "Agregar"}
        </button>

        {isEditing && (
          <button className="btn" type="button" onClick={onCancelEdit}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}