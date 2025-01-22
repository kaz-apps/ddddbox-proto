export interface Task {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  description?: string;
  status: 'not_started' | 'in_progress' | 'completed';
  parentId?: string;
}

export interface Stage {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  color?: string;
  layer?: number;
}

export interface Link {
  id: number;
  source: string;
  target: string;
  type: string;
}

// DHTMLXガントチャート用の型定義
export interface GanttTask {
  id: string;
  text: string;
  start_date: string;
  end_date: string;
  type: 'task' | 'stage';
  progress: number;
  parent: string;
  description?: string;
  status?: 'not_started' | 'in_progress' | 'completed';
  color?: string;
  layer?: number;
  open?: boolean;
  readonly?: boolean;
  parents?: string[];
}

export interface GanttLink {
  id: number;
  source: string;
  target: string;
  type: string;
}

export type ScheduleShare = {
  id: string
  token: string
  expiresAt: Date | string
}

export type MilestoneAlert = {
  id: string
  taskId: string
  daysBefore: number
  notificationSent: boolean
}

export type ScheduleNotification = {
  id: string
  taskId: string
  changeType: 'created' | 'updated' | 'deleted'
  changeDetails: any
  createdAt: Date | string
}
