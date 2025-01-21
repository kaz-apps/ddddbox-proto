declare module 'frappe-gantt' {
  export interface GanttOptions {
    header_height?: number
    column_width?: number
    step?: number
    view_modes?: string[]
    bar_height?: number
    bar_corner_radius?: number
    arrow_curve?: number
    padding?: number
    view_mode?: 'Quarter Day' | 'Half Day' | 'Day' | 'Week' | 'Month'
    date_format?: string
    popup_trigger?: 'click' | 'hover'
    custom_popup_html?: (task: GanttTask) => string
    language?: string
    on_click?: (task: GanttTask) => void
    on_date_change?: (task: GanttTask, start: Date, end: Date) => void
    on_progress_change?: (task: GanttTask, progress: number) => void
    on_view_change?: (mode: string) => void
  }

  export interface GanttTask {
    id: string
    name: string
    start: Date
    end: Date
    progress: number
    dependencies?: string[]
    custom_class?: string
  }

  class Gantt {
    constructor(
      wrapper: HTMLElement,
      tasks: GanttTask[],
      options?: GanttOptions
    )
    change_view_mode(mode: string): void
    refresh(tasks: GanttTask[]): void
    destroy(): void
  }

  export default Gantt
}
