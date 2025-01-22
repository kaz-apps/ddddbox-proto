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
  const scale = useRef<ScaleType>("month");
  const ganttRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const initGantt = async () => {
      if (!containerRef.current) return;
      
      try {
        // dhtmlx-ganttのインポートと初期化
        if (!ganttRef.current) {
          const ganttModule = await import("dhtmlx-gantt");
          ganttRef.current = ganttModule.default;
          
          // 初期設定
          ganttRef.current.config.date_format = "%Y-%m-%d";
          ganttRef.current.config.drag_progress = false;
          ganttRef.current.config.drag_resize = true;
          ganttRef.current.config.drag_move = true;
          ganttRef.current.config.drag_links = true;
          ganttRef.current.config.row_height = 35;
          ganttRef.current.config.min_column_width = 35;

          // タスクの表示設定
          ganttRef.current.config.sort = false;
          ganttRef.current.config.readonly = false;
          ganttRef.current.config.auto_scheduling = true;
          ganttRef.current.config.work_time = true;
          ganttRef.current.config.skip_off_time = true;
          ganttRef.current.config.duration_unit = "day";
          ganttRef.current.config.xml_date = "%Y-%m-%d";
          ganttRef.current.config.autosize = "y";
          ganttRef.current.config.fit_tasks = true;

          // タスクタイプの設定
          ganttRef.current.config.types = {
            task: "task",
            stage: "stage",
          };

          // デフォルトの編集モーダルを無効化
          ganttRef.current.config.lightbox = { sections: [] };
          ganttRef.current.config.show_lightbox = false;
          ganttRef.current.config.details_on_dblclick = false;
          ganttRef.current.config.details_on_create = false;
          ganttRef.current.config.quick_info_detached = false;

          // グリッド列の設定
          ganttRef.current.config.columns = [
            {
              name: "group_type",
              label: "グループ",
              width: 120,
              template: (task: GanttTask) => {
                if (task.type === "stage") return "設計ステージ";
                if (task.type === "task") return "タスク";
                return "";
              },
            } as any,
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
                const date = new Date(task.start_date);
                return format(date, "yyyy/MM/dd");
              },
            } as any,
            {
              name: "end_date",
              label: "終了日",
              align: "center",
              width: 100,
              template: (task: GanttTask) => {
                if (!task.end_date) return "";
                const date = new Date(task.end_date);
                return format(date, "yyyy/MM/dd");
              },
            } as any,
            {
              name: "status",
              label: "ステータス",
              align: "center",
              width: 100,
              resize: true,
              template: (task: GanttTask) => {
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

          // スタイル設定
          ganttRef.current.templates.task_class = (start: Date, end: Date, task: GanttTask) => {
            return task.type === "stage" ? "gantt-stage-bar" : "gantt-task-bar";
          };

          ganttRef.current.templates.grid_row_class = (start: Date, end: Date, task: GanttTask) => {
            return task.type === "stage" ? "gantt-stage-row" : "gantt-task-row";
          };

          // タスクの制約設定
          ganttRef.current.attachEvent(
            "onBeforeTaskDrag",
            (id: string, mode: string, e: any) => {
              const task = ganttRef.current.getTask(id) as GanttTask;
              // ステージの場合はドラッグを禁止
              if (task.type === "stage") {
                return false;
              }
              return true;
            }
          );

          // タスクのクリックイベント
          ganttRef.current.attachEvent("onTaskClick", (id: string, e: any) => {
            const ganttTask = ganttRef.current.getTask(id) as GanttTask;
            if (ganttTask.type === "stage" && onStageClick) {
              const stage: Stage = {
                id: ganttTask.id,
                title: ganttTask.text,
                startDate: ganttTask.start_date,
                endDate: ganttTask.end_date,
                color: ganttTask.color,
                layer: ganttTask.layer,
              };
              onStageClick(stage);
            } else if (ganttTask.type === "task" && onTaskClick) {
              const task: Task = {
                id: ganttTask.id,
                title: ganttTask.text,
                startDate: ganttTask.start_date,
                endDate: ganttTask.end_date,
                description: ganttTask.description,
                status: ganttTask.status || "not_started",
                parentId: ganttTask.parent,
              };
              onTaskClick(task);
            }
            return true;
          });

          // レイアウト設定
          ganttRef.current.config.layout = {
            css: "gantt_container",
            rows: [
              {
                cols: [
                  {
                    view: "grid",
                    scrollX: "scrollHor",
                    scrollY: "scrollVer",
                    width: 500,
                  },
                  {
                    view: "timeline",
                    scrollX: "scrollHor",
                    scrollY: "scrollVer",
                  },
                  {
                    view: "scrollbar",
                    id: "scrollVer",
                  },
                ],
              },
              {
                view: "scrollbar",
                id: "scrollHor",
                height: 20,
              },
            ],
          };

          // ganttの設定
          ganttRef.current.config.links = {
            finish_to_start: "0",
            start_to_start: "1",
            finish_to_finish: "2",
            start_to_finish: "3"
          };

          // スケール設定
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

          // イベントハンドラの設定
          ganttRef.current.attachEvent("onTaskDblClick", (id: string, e: any) => {
            const ganttTask = ganttRef.current.getTask(id) as GanttTask;
            if (ganttTask.type === "stage" && onStageClick) {
              const stage: Stage = {
                id: ganttTask.id,
                title: ganttTask.text,
                startDate: ganttTask.start_date,
                endDate: ganttTask.end_date,
                color: ganttTask.color,
                layer: ganttTask.layer,
              };
              onStageClick(stage);
            } else if (ganttTask.type === "task" && onTaskEdit) {
              const task: Task = {
                id: ganttTask.id,
                title: ganttTask.text,
                startDate: ganttTask.start_date,
                endDate: ganttTask.end_date,
                description: ganttTask.description,
                status: ganttTask.status || "not_started",
                parentId: ganttTask.parent,
              };
              onTaskEdit(task);
            }
            return true;
          });

          // タスクの変更イベント
          ganttRef.current.attachEvent(
            "onAfterTaskDrag",
            (id: string, mode: string, e: any) => {
              const task = ganttRef.current.getTask(id) as GanttTask;
              if (task.type === "stage" && onStageChange) {
                const stage: Stage = {
                  id: task.id,
                  title: task.text,
                  startDate: task.start_date,
                  endDate: task.end_date,
                  color: task.color,
                  layer: task.layer,
                };
                onStageChange(
                  stage,
                  new Date(task.start_date),
                  new Date(task.end_date)
                );
              } else if (task.type === "task" && onTaskChange) {
                const updatedTask: Task = {
                  id: task.id,
                  title: task.text,
                  startDate: task.start_date,
                  endDate: task.end_date,
                  description: task.description,
                  status: task.status || "not_started",
                  parentId: task.parent,
                };
                onTaskChange(
                  updatedTask,
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
        const formattedData: { data: GanttTask[]; links: GanttLink[] } = {
          data: [],
          links: links.map(link => ({
            ...link,
            id: typeof link.id === 'string' ? parseInt(link.id) : link.id,
            type: link.type || "0",
          })),
        };

        // ステージの追加
        formattedData.data.push(
          ...stages.map((stage) => ({
            id: stage.id,
            text: stage.title,
            start_date: new Date(stage.startDate).toISOString().split('T')[0],
            end_date: new Date(stage.endDate).toISOString().split('T')[0],
            type: "stage",
            progress: 0,
            open: true,
            readonly: true,
            color: stage.color,
            layer: stage.layer,
            duration: 1,
            parent: 0,
          }))
        );

        // タスクの追加
        formattedData.data.push(
          ...tasks.map((task) => ({
            id: task.id,
            text: task.title,
            start_date: new Date(task.startDate).toISOString().split('T')[0],
            end_date: new Date(task.endDate).toISOString().split('T')[0],
            description: task.description,
            status: task.status,
            type: "task",
            progress: task.status === "completed" ? 1 : task.status === "in_progress" ? 0.5 : 0,
            parent: task.parentId || 0,
            duration: 1,
            readonly: false,
          }))
        );

        // データの更新
        ganttRef.current.clearAll();
        ganttRef.current.parse(formattedData);

      } catch (error) {
        console.error("Failed to initialize gantt chart:", error);
      }
    };

    initGantt();

    // クリーンアップ
    return () => {
      try {
        if (ganttRef.current && containerRef.current) {
          ganttRef.current.clearAll();
        }
      } catch (error) {
        console.error("Failed to cleanup gantt chart:", error);
      }
    };
  }, [tasks, stages, links, onTaskEdit, onTaskClick, onTaskChange, onStageClick, onStageChange]);

  return <div ref={containerRef} style={{ width: "100%", height: "500px" }} />;
}
