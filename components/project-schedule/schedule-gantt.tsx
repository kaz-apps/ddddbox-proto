import { useRef } from "react";
import { Gantt, ViewMode, Task as GanttTask } from "gantt-task-react";
import { Task } from "@/types/schedule";
import { useAutoScroll } from "@/lib/hooks/useAutoScroll";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ScheduleGanttProps {
  tasks: Task[];
  viewMode: keyof typeof ViewMode;
  onDateChange: (task: GanttTask) => void;
  onProgressChange: (task: GanttTask) => void;
  onTaskClick: (task: GanttTask) => void;
  onDragStart: (index: number) => void;
  onDragOver: (e: React.DragEvent, index: number) => void;
  onDrop: (e: React.DragEvent) => void;
}

export function ScheduleGantt({
  tasks,
  viewMode,
  onDateChange,
  onProgressChange,
  onTaskClick,
  onDragStart,
  onDragOver,
  onDrop,
}: ScheduleGanttProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  useAutoScroll(scrollContainerRef);

  const sortedTasks = tasks.filter(task => task.id !== "display_range");

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex h-[600px]">
        <div className="w-[560px] flex-shrink-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">グループ</TableHead>
                <TableHead className="w-[200px]">名前</TableHead>
                <TableHead className="w-[120px]">開始日</TableHead>
                <TableHead className="w-[120px]">終了日</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTasks.map((task, index) => (
                <TableRow 
                  key={task.id}
                  draggable
                  onDragStart={() => onDragStart(index)}
                  onDragOver={(e) => onDragOver(e, index)}
                  onDrop={onDrop}
                  className="cursor-move"
                >
                  <TableCell>
                    {task.id.startsWith("project_")
                      ? "設計ステージ"
                      : task.type === "milestone"
                      ? "マイルストーン"
                      : "タスク"}
                  </TableCell>
                  <TableCell>{task.name}</TableCell>
                  <TableCell>
                    {task.start.toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    {task.end.toLocaleDateString("ja-JP", {
                      year: "numeric",
                      month: "numeric",
                      day: "numeric",
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div 
          ref={scrollContainerRef}
          className="flex-grow overflow-auto scroll-smooth"
        >
          <div style={{ 
            minWidth: viewMode === ViewMode.Day ? "3000px" : "1500px",
            height: "100%"
          }}>
            <style jsx global>{`
              .bar-wrapper {
                position: relative;
                height: 50px !important;
              }
              .bar {
                position: relative;
                min-width: 100px;
                display: flex;
                align-items: center;
                opacity: 1 !important;
                height: 50px !important;
              }
              .bar > svg {
                opacity: 1 !important;
                height: 50px !important;
              }
              .bar > svg rect {
                opacity: 1 !important;
              }
              tr {
                height: 50px !important;
                min-height: 50px !important;
                max-height: 50px !important;
              }
              td {
                height: 50px !important;
                min-height: 50px !important;
                max-height: 50px !important;
                padding-top: 0 !important;
                padding-bottom: 0 !important;
              }
              .gantt-table-header {
                height: 50px !important;
              }
              .bar[data-task-id="display_range"] {
                display: none !important;
              }
              .bar[data-task-type="project"] > svg rect._31ERP {
                fill: #4F46E5 !important;
              }
              .bar[data-task-type="project"] > svg rect._3T42e {
                fill: #4338CA !important;
              }
              .bar[data-task-type="milestone"] > svg rect._31ERP {
                fill: #FA8072 !important;
              }
              .bar[data-task-type="milestone"] > svg rect._3T42e {
                fill: #E9967A !important;
              }
              .bar[data-task-type="task"] > svg rect._31ERP {
                fill: #4ADE80 !important;
              }
              .bar[data-task-type="task"] > svg rect._3T42e {
                fill: #22C55E !important;
              }
              .tooltip-default {
                display: none !important;
              }
              .gantt-row {
                height: 50px !important;
              }
              .gantt-row-bar {
                height: 50px !important;
              }
            `}</style>
            <Gantt
              tasks={sortedTasks.map(task => ({
                ...task,
                dependencies: task.dependencies || [],
                isDisabled: task.id === "display_range",
                styles: {
                  ...task.styles,
                  ...(task.id.startsWith("project_") ? {
                    barBackgroundColor: "#4F46E5",
                    backgroundColor: "#4F46E5",
                    backgroundSelectedColor: "#4338CA",
                    progressColor: "#4338CA",
                    progressSelectedColor: "#3730A3",
                    arrowColor: "#4F46E5",
                    arrowIndent: 20,
                  } :
                  task.type === "milestone" ? {
                    barBackgroundColor: "#FA8072",
                    backgroundColor: "#FA8072",
                    backgroundSelectedColor: "#E9967A",
                    progressColor: "#E9967A",
                    progressSelectedColor: "#CD5C5C",
                    arrowColor: "#FA8072",
                    arrowIndent: 20,
                  } : {
                    barBackgroundColor: "#4ADE80",
                    backgroundColor: "#4ADE80",
                    backgroundSelectedColor: "#22C55E",
                    progressColor: "#22C55E",
                    progressSelectedColor: "#16A34A",
                    arrowColor: "#4ADE80",
                    arrowIndent: 20,
                  })
                }
              }))}
              viewMode={viewMode}
              onDateChange={onDateChange}
              onProgressChange={onProgressChange}
              onDoubleClick={onTaskClick}
              listCellWidth=""
              columnWidth={viewMode === ViewMode.Day ? 40 : 200}
              locale="ja-JP"
              barFill={75}
              rowHeight={50}
              barCornerRadius={4}
              fontSize="12px"
              headerHeight={50}
              rtl={false}
              TaskListHeader={() => null}
              TaskListTable={() => null}
              TooltipContent={() => null}
              onExpanderClick={() => {}}
              ganttHeight={600}
              arrowColor="#64748B"
              arrowIndent={20}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 