'use client'

import { useRef, useEffect } from 'react'
import { Task } from '@/types/schedule'
import { gantt } from 'dhtmlx-gantt'
import '@/styles/dhtmlxgantt.css'

// DHTMLXガントチャートのタスク型定義
interface GanttTaskData {
  id: string
  text: string
  start_date: Date
  end_date: Date
  progress: number
  parent?: string
  status?: string
  open?: boolean
}

interface GanttLinkData {
  id: string
  source: string
  target: string
  type: string
}

interface GanttChartProps {
  tasks: Task[]
  onTaskClick?: (task: Task) => void
  onTaskChange?: (task: Task, start: Date, end: Date) => void
}

export function GanttChart({
  tasks,
  onTaskClick,
  onTaskChange
}: GanttChartProps) {
  const ganttContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ganttContainer.current) return

    // 日付を安全に変換する関数
    const toDate = (date: Date | string): Date => {
      if (date instanceof Date) return date
      return new Date(date)
    }

    // ガントチャートの設定
    gantt.config.date_format = '%Y-%m-%d'
    gantt.config.drag_progress = false
    gantt.config.drag_resize = true
    gantt.config.drag_move = true
    gantt.config.drag_links = true
    gantt.config.row_height = 40
    gantt.config.min_column_width = 40

    // 週末の背景色を変更
    gantt.templates.timeline_cell_class = (date: any) => {
      const d = toDate(date)
      if (d.getDay() === 0 || d.getDay() === 6) return 'weekend'
      return ''
    }

    // 今日の日付の背景色を変更
    const today = new Date()
    const todayStr = today.toDateString()
    gantt.templates.timeline_cell_class = (date: any) => {
      const d = toDate(date)
      if (d.toDateString() === todayStr) return 'today'
      return ''
    }

    // タスクの進捗状態に応じた色を設定
    gantt.templates.task_class = (_start: Date, _end: Date, task: GanttTaskData) => {
      switch (task.status) {
        case 'completed':
          return 'task-completed'
        case 'in_progress':
          return 'task-progress'
        default:
          return 'task-not-started'
      }
    }

    // イベントハンドラの設定
    gantt.attachEvent('onTaskClick', (id: string) => {
      const task = tasks.find(t => t.id === id)
      if (task && onTaskClick) {
        onTaskClick(task)
      }
      return true
    })

    gantt.attachEvent('onAfterTaskDrag', (id: string) => {
      const task = tasks.find(t => t.id === id)
      if (task && onTaskChange) {
        const ganttTask = gantt.getTask(id) as GanttTaskData
        onTaskChange(task, new Date(ganttTask.start_date), new Date(ganttTask.end_date))
      }
    })

    // ガントチャートの初期化
    gantt.init(ganttContainer.current)

    // データの設定
    const ganttTasks = {
      data: tasks.map(task => ({
        id: task.id,
        text: task.title,
        start_date: toDate(task.startDate),
        end_date: toDate(task.endDate),
        progress: task.status === 'completed' ? 1 : task.status === 'in_progress' ? 0.5 : 0,
        parent: task.parentId,
        status: task.status,
        open: task.isExpanded
      })),
      links: tasks
        .filter(task => task.dependencies && task.dependencies.length > 0)
        .flatMap(task => 
          task.dependencies!.map(depId => ({
            id: `${depId}-${task.id}`,
            source: depId,
            target: task.id,
            type: '0'
          }))
        )
    }

    gantt.parse(ganttTasks)

    return () => {
      gantt.clearAll()
    }
  }, [tasks, onTaskClick, onTaskChange])

  return (
    <div className="gantt-container" ref={ganttContainer} />
  )
}
