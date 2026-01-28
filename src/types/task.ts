export type TaskStatus = "pending" | "done";

export interface Task {
  id: string;
  title: string;
  note: string;
  status: TaskStatus;
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}