declare module 'frappe-gantt-react' {
  export interface FrappeTask {
    id: string
    name: string
    start: Date
    end: Date
    progress: number
    dependencies: string[]
    custom_class?: string
  }

  export interface FrappeGanttProps {
    tasks: FrappeTask[]
    viewMode: 'Quarter Day' | 'Half Day' | 'Day' | 'Week' | 'Month'
    onClick: (task: FrappeTask) => void
    onDateChange: (task: FrappeTask, start: Date, end: Date) => void
    onProgressChange: (task: FrappeTask, progress: number) => void
  }

  const FrappeGantt: React.FC<FrappeGanttProps>
  export default FrappeGantt
}
