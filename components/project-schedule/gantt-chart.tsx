'use client'

import { useEffect, useRef } from "react";
import { Task, Stage, Link, GanttTask, GanttLink } from "@/types/schedule";
import { format } from "date-fns";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";

interface GanttChartProps {
  tasks: Task[];
  stages: Stage[];
  links: Link[];
  onTaskEdit?: (task: Task) => void;
  onTaskClick?: (task: Task) => void;
  onTaskChange?: (task: Task, start: Date, end: Date) => void;
  onStageClick?: (stage: Stage) => void;
  onStageChange?: (stage: Stage, start: Date, end: Date) => void;
}

type ScaleType = "month" | "day";

// サンプルデータ
const sampleData = {
  tasks: [
    {
      id: "task_1",
      title: "タスク1",
      startDate: "2024-01-01",
      endDate: "2024-01-10",
      status: "in_progress" as const,
    },
    {
      id: "task_2",
      title: "タスク2",
      startDate: "2024-01-11",
      endDate: "2024-01-20",
      status: "not_started" as const,
    },
    {
      id: "task_3",
      title: "タスク3",
      startDate: "2024-01-21",
      endDate: "2024-01-30",
      status: "not_started" as const,
    },
  ] as Task[],
  links: [
    { id: 1, source: "task_1", target: "task_2", type: "0" },
    { id: 2, source: "task_2", target: "task_3", type: "0" },
  ] as GanttLink[],
  stages: [] as Stage[],
};

export function GanttChart({
  tasks = sampleData.tasks,
  stages = sampleData.stages,
  links = sampleData.links,
  onTaskEdit,
  onTaskClick,
  onTaskChange,
  onStageClick,
  onStageChange,
}: GanttChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ganttRef = useRef<any>(null);
  const scale = useRef<ScaleType>("month");

  const handleScaleChange = () => {
    scale.current = scale.current === "day" ? "month" : "day";
    if (ganttRef.current) {
      if (scale.current === "month") {
        ganttRef.current.config.scale_unit = "month";
        ganttRef.current.config.date_scale = "%Y年%m月";
        ganttRef.current.config.subscales = [];
      } else {
        ganttRef.current.config.scale_unit = "day";
        ganttRef.current.config.date_scale = "%d";
        ganttRef.current.config.subscales = [
          { unit: "month", step: 1, date: "%Y年%m月" }
        ];
      }
      ganttRef.current.render();
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const initGantt = async () => {
      if (!containerRef.current) return;
      
      try {
        if (!ganttRef.current) {
          const ganttModule = await import("dhtmlx-gantt");
          ganttRef.current = ganttModule.default;
          
          // 初期設定
          ganttRef.current.config.date_format = "%Y-%m-%d";
          ganttRef.current.config.xml_date = "%Y-%m-%d";
          ganttRef.current.config.drag_progress = false;
          ganttRef.current.config.drag_resize = true;
          ganttRef.current.config.drag_move = true;
          ganttRef.current.config.drag_links = true;
          ganttRef.current.config.row_height = 35;
          ganttRef.current.config.min_column_width = 35;
          ganttRef.current.config.sort = false;
          ganttRef.current.config.readonly = false;
          ganttRef.current.config.auto_scheduling = true;
          ganttRef.current.config.work_time = true;
          ganttRef.current.config.skip_off_time = true;
          ganttRef.current.config.duration_unit = "day";
          ganttRef.current.config.autosize = "y";
          ganttRef.current.config.fit_tasks = true;

          // グリッド列の設定
          ganttRef.current.config.columns = [
            {
              name: "group_type",
              label: "グループ",
              width: 120,
              template: (task: GanttTask) => {
                return task.type === "stage" ? "設計ステージ" : "タスク";
              },
            },
            {
              name: "text",
              label: "名前",
              tree: true,
              width: 200,
              resize: true,
            },
            {
              name: "start_date",
              label: "開始日",
              align: "center",
              width: 100,
              template: (task: GanttTask) => {
                if (!task.start_date) return "";
                return format(new Date(task.start_date), "yyyy/MM/dd");
              },
            },
            {
              name: "end_date",
              label: "終了日",
              align: "center",
              width: 100,
              template: (task: GanttTask) => {
                if (!task.end_date) return "";
                return format(new Date(task.end_date), "yyyy/MM/dd");
              },
            },
            {
              name: "status",
              label: "ステータス",
              align: "center",
              width: 100,
              template: (task: GanttTask) => {
                if (task.type === "stage") return "";
                switch (task.status) {
                  case "not_started":
                    return "未着手";
                  case "in_progress":
                    return "進行中";
                  case "completed":
                    return "完了";
                  default:
                    return "";
                }
              },
            },
          ];

          // タスクの制約設定
          ganttRef.current.attachEvent(
            "onBeforeTaskDrag",
            (id: string, mode: string, e: any) => {
              const task = ganttRef.current.getTask(id) as GanttTask;
              return task.type !== "stage"; // ステージの場合はドラッグを禁止
            }
          );

          // タスクのクリックイベント
          ganttRef.current.attachEvent("onTaskClick", (id: string) => {
            const task = ganttRef.current.getTask(id) as GanttTask;
            if (task.type === "stage" && onStageClick) {
              onStageClick({
                id: task.id,
                title: task.text,
                startDate: task.start_date,
                endDate: task.end_date,
                color: task.color,
                layer: task.layer,
              });
            } else if (task.type === "task" && onTaskClick) {
              onTaskClick({
                id: task.id,
                title: task.text,
                startDate: task.start_date,
                endDate: task.end_date,
                description: task.description,
                status: task.status || "not_started",
                parentId: task.parent,
              });
            }
            return true;
          });

          // タスクの変更イベント
          ganttRef.current.attachEvent(
            "onAfterTaskDrag",
            (id: string) => {
              const task = ganttRef.current.getTask(id) as GanttTask;
              if (task.type === "stage" && onStageChange) {
                onStageChange(
                  {
                    id: task.id,
                    title: task.text,
                    startDate: task.start_date,
                    endDate: task.end_date,
                    color: task.color,
                    layer: task.layer,
                  },
                  new Date(task.start_date),
                  new Date(task.end_date)
                );
              } else if (task.type === "task" && onTaskChange) {
                onTaskChange(
                  {
                    id: task.id,
                    title: task.text,
                    startDate: task.start_date,
                    endDate: task.end_date,
                    description: task.description,
                    status: task.status || "not_started",
                    parentId: task.parent,
                  },
                  new Date(task.start_date),
                  new Date(task.end_date)
                );
              }
            }
          );

          // ガントチャートの初期化
          ganttRef.current.init(containerRef.current);
        }

        // データの設定
        const formattedData = {
          data: [
            ...stages.map((stage) => ({
              id: stage.id,
              text: stage.title,
              start_date: format(new Date(stage.startDate), "yyyy-MM-dd"),
              end_date: format(new Date(stage.endDate), "yyyy-MM-dd"),
              type: "stage" as const,
              progress: 0,
              parent: "0",
              open: true,
              readonly: true,
              color: stage.color,
              layer: stage.layer,
            })),
            ...tasks.map((task) => ({
              id: task.id,
              text: task.title,
              start_date: format(new Date(task.startDate), "yyyy-MM-dd"),
              end_date: format(new Date(task.endDate), "yyyy-MM-dd"),
              type: "task" as const,
              progress: task.status === "completed" ? 1 : task.status === "in_progress" ? 0.5 : 0,
              parent: task.parentId || "0",
              open: true,
              readonly: false,
              description: task.description,
              status: task.status,
            })),
          ],
          links: links.map((link) => ({
            id: typeof link.id === 'string' ? parseInt(link.id) : link.id,
            source: link.source,
            target: link.target,
            type: link.type || "0",
          })),
        };

        // データの更新
        ganttRef.current.clearAll();
        ganttRef.current.parse(formattedData);

      } catch (error) {
        console.error("Failed to initialize gantt chart:", error);
      }
    };

    initGantt();
  }, [tasks, stages, links, onTaskEdit, onTaskClick, onTaskChange, onStageClick, onStageChange]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleScaleChange}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          {scale.current === "day" ? "月表示" : "日表示"}に切り替え
        </button>
      </div>
      <div ref={containerRef} style={{ width: "100%", height: "500px" }} />
    </div>
  );
}
