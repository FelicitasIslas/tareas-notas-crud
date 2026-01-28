import type { Task } from "../types/task";

type Props = {
  tasks: Task[];
  onToggleStatus: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onClearDone: () => void;
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function TaskList({
  tasks,
  onToggleStatus,
  onEdit,
  onDelete,
  onClearDone,
}: Props) {
  const pending = tasks.filter((t) => t.status === "pending").length;
  const done = tasks.filter((t) => t.status === "done").length;

  return (
    <section className="card">
      <div className="between">
        <div>
          <h2>Lista</h2>
          <p className="muted">
            Pendientes: <b>{pending}</b> · Completadas: <b>{done}</b>
          </p>
        </div>

        <button
          className="btn danger"
          type="button"
          onClick={onClearDone}  // EVENTO: onClick
          disabled={done === 0}
          title="Elimina todas las tareas completadas"
        >
          Limpiar completadas
        </button>
      </div>

      {tasks.length === 0 ? (
        <p className="empty">No hay tareas/notas aún. Agrega una arriba 👆</p>
      ) : (
        <ul className="list">
          {tasks.map((task) => (
            <li key={task.id} className={`item ${task.status === "done" ? "done" : ""}`}>
              <label className="check">
                <input
                  type="checkbox"
                  checked={task.status === "done"}
                  onChange={() => onToggleStatus(task.id)} // EVENTO: onChange
                />
                <span className="title">{task.title}</span>
              </label>

              {task.note && <p className="note">{task.note}</p>}

              <div className="meta">
                <span className="muted">Creada: {formatDate(task.createdAt)}</span>
                <span className="muted">Actualizada: {formatDate(task.updatedAt)}</span>
              </div>

              <div className="row">
                <button className="btn" type="button" onClick={() => onEdit(task)}>
                  Editar
                </button>
                <button className="btn danger" type="button" onClick={() => onDelete(task.id)}>
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}