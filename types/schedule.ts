import { Task as GanttTask, ViewMode } from "gantt-task-react";

export type TaskStatus = 'not_started' | 'in_progress' | 'completed';

export interface Task extends GanttTask {
  status: TaskStatus;
  styles?: {
    progressColor?: string;
    progressSelectedColor?: string;
    backgroundColor?: string;
    backgroundSelectedColor?: string;
    barBackgroundColor?: string;
    arrowColor?: string;
    arrowIndent?: number;
  };
  milestoneId?: string;
}

export interface TaskFormData {
  name: string;
  start: Date;
  end: Date;
  status: TaskStatus;
  type: "task" | "milestone" | "project";
  progress: number;
  isDisabled?: boolean;
  dependencies?: string[];
  project?: string;
  milestoneId?: string;
} 