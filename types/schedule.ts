export type Stage = {
  id: string
  title: string
  startDate: Date | string
  endDate: Date | string
  color: string
  layer: number // 表示する行番号（0から開始）
}

export type TaskStatus = "not_started" | "in_progress" | "completed";

export type Task = {
  id: string
  title: string
  startDate: Date | string
  endDate: Date | string
  description?: string
  status: TaskStatus
  isStage?: boolean // 設計ステージかどうか
  isMilestone?: boolean // マイルストーンかどうか
  dependencies?: string[] // 依存タスクのID配列
  parentId?: string // 親タスクのID
  children?: Task[] // 子タスク
  isExpanded?: boolean // 子タスクの表示/非表示
}

export type Link = {
  id: string | number
  source: string // 開始タスクのID
  target: string // 終了タスクのID
  type: string // リンクのタイプ（"0" = finish_to_start）
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
