export type TaskStatus = "not_started" | "in_progress" | "completed";
export type TaskType = "project" | "milestone" | "task";

export interface Task {
  id: string;
  name: string;
  type: TaskType;
  start: Date;
  end: Date;
  progress: number;
  status: TaskStatus;
  isDisabled: boolean;
  project?: string;
  milestoneId?: string;
  dependencies?: string[];  // 依存するタスクのID配列
  hideChildren?: boolean;
  styles?: {
    backgroundColor?: string;
    backgroundSelectedColor?: string;
    progressColor?: string;
    progressSelectedColor?: string;
    barBackgroundColor?: string;
    barProgressColor?: string;
    arrowColor?: string;
    arrowIndent?: number;
  };
}

export interface TaskFormData {
  name: string;
  type: TaskType;
  start: Date;
  end: Date;
  progress: number;
  status: TaskStatus;
  project?: string;
  milestoneId?: string;
  dependencies?: string[];  // 依存するタスクのID配列
} 