declare module 'gantt-task-react' {
  export interface Task {
    id: string;
    name: string;
    start: Date;
    end: Date;
    progress: number;
    type: 'task' | 'milestone' | 'project';
    hideChildren?: boolean;
    displayOrder?: number;
    dependencies?: string[];
    project?: string;
    styles?: {
      backgroundColor?: string;
      backgroundSelectedColor?: string;
      progressColor?: string;
      progressSelectedColor?: string;
    };
  }

  export interface GanttProps {
    tasks: Task[];
    viewMode?: 'Hour' | 'QuarterDay' | 'HalfDay' | 'Day' | 'Week' | 'Month' | 'QuarterYear' | 'Year';
    onDateChange?: (task: Task, start: Date, end: Date) => void;
    onProgressChange?: (task: Task, progress: number) => void;
    onDoubleClick?: (task: Task) => void;
    onClick?: (task: Task) => void;
    onDelete?: (task: Task) => void;
    onSelect?: (task: Task, isSelected: boolean) => void;
    onExpanderClick?: (task: Task) => void;
    listCellWidth?: string;
    columnWidth?: number;
    rowHeight?: number;
    ganttHeight?: number;
    barCornerRadius?: number;
    barFill?: number;
    handleWidth?: number;
    timeStep?: number;
    arrowColor?: string;
    arrowIndent?: number;
    fontFamily?: string;
    fontSize?: string;
    rtl?: boolean;
    locale?: string;
    headerHeight?: number;
    TooltipContent?: React.FC<{ task: Task; fontSize: string; fontFamily: string }>;
    TaskListHeader?: React.FC<{ headerHeight: number; rowWidth: string }>;
    TaskListTable?: React.FC<{ rowHeight: number; rowWidth: string; fontFamily: string; fontSize: string; locale: string; tasks: Task[]; selectedTaskId: string; setSelectedTask: (taskId: string) => void }>;
  }

  export const Gantt: React.FC<GanttProps>;
  export const ViewMode: {
    Hour: 'Hour';
    QuarterDay: 'QuarterDay';
    HalfDay: 'HalfDay';
    Day: 'Day';
    Week: 'Week';
    Month: 'Month';
    QuarterYear: 'QuarterYear';
    Year: 'Year';
  };
} 