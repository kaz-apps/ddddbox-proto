declare module 'react-frappe-gantt' {
  export interface GanttTask {
    id: string
    name: string
    start: Date
    end: Date
    progress: number
    dependencies: string[]
    custom_class?: string
  }

  export interface GanttProps {
    tasks: GanttTask[]
    viewMode?: 'Quarter Day' | 'Half Day' | 'Day' | 'Week' | 'Month'
    onClick?: (task: GanttTask) => void
    onDateChange?: (task: GanttTask, start: Date, end: Date) => void
    onProgressChange?: (task: GanttTask, progress: number) => void
    onViewChange?: (mode: string) => void
  }

  const GanttChart: React.FC<GanttProps>
  export default GanttChart
}
