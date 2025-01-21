declare module 'dhtmlx-gantt' {
  interface GanttStatic {
    config: {
      date_format: string
      drag_progress: boolean
      drag_resize: boolean
      drag_move: boolean
      drag_links: boolean
      row_height: number
      min_column_width: number
      layout: {
        css: string
        rows: Array<{
          cols: Array<{
            view: string
            width?: number
            scrollX?: string
            scrollY?: string
          }>
        }>
      }
      readonly?: boolean
      editable?: boolean
      columns?: Array<{
        name: string
        label: string
        width?: number
        align?: string
        tree?: boolean
        resize?: boolean
        hide?: boolean
      }>
      scale_height?: number
      subscales?: Array<{
        unit: string
        step: number
        date: string
      }>
    }
    init: (container: HTMLElement | string) => void
    parse: (data: { data: any[] }) => void
    clearAll: () => void
    destructor: () => void
    resetConfig: () => void
    attachEvent: (eventName: string, callback: Function) => number
    detachEvent: (id: number) => void
    detachAllEvents: () => void
    render: () => void
    refreshData: () => void
    getTask: (id: string | number) => any
    updateTask: (id: string | number, task: any) => void
    deleteTask: (id: string | number) => void
    addTask: (task: any, parent?: string | number) => string | number
    getTaskBy: (propertyName: string, propertyValue: any) => any[]
    calculateTaskLevel: (task: any) => number
    getChildren: (id: string | number) => Array<string | number>
    getParent: (id: string | number) => string | number
    isTaskExists: (id: string | number) => boolean
    refreshLink: (id: string | number) => void
    refreshTask: (id: string | number) => void
    showTask: (id: string | number) => void
    getTaskPosition: (id: string | number) => { left: number; top: number }
    scrollTo: (left: number, top: number) => void
    sort: (field: string, desc?: boolean, parent?: string | number) => void
    changeTaskId: (oldId: string | number, newId: string | number) => void
    calculateEndDate: (config: { start_date: Date; duration: number; task?: any }) => Date
    calculateDuration: (config: { start_date: Date; end_date: Date; task?: any }) => number
    getSlack: (task: any) => { start: number; end: number }
    isCriticalTask: (task: any) => boolean
    updateTaskDuration: (id: string | number, duration: number) => void
    updateTaskStartDate: (id: string | number, startDate: Date) => void
    updateTaskEndDate: (id: string | number, endDate: Date) => void
    getTaskByTime: (from: Date, to: Date) => any[]
    eachTask: (callback: (task: any) => void, parent?: string | number) => void
    eachParent: (callback: (task: any) => void, startTask?: any) => void
    eachSelectedTask: (callback: (task: any) => void) => void
    getSelectedTasks: () => Array<string | number>
    getTaskCount: () => number
    getLinkCount: () => number
    getVisibleTaskCount: () => number
    exportToPDF: (config?: any) => void
    exportToPNG: (config?: any) => void
    exportToExcel: (config?: any) => void
    exportToMSProject: (config?: any) => void
    undo: () => void
    redo: () => void
    clearUndoStack: () => void
    getUndoStack: () => any[]
    getRedoStack: () => any[]
    createTask: (config: any, parent?: string | number, index?: number) => string | number
    silent: (callback: Function) => void
    batchUpdate: (callback: Function) => void
  }

  const gantt: GanttStatic
  export default gantt
}
