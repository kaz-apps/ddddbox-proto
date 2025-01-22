"use client";

import { useRef, useEffect } from "react";
import { Task, Stage } from "@/types/schedule";
import { format } from "date-fns";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";

interface GanttChartProps {
  tasks?: Task[];
  stages?: Stage[];
}

// DHTMLXガントチャートの型定義
interface GanttTask {
  id: string;
  text: string;
  start_date: string | Date;
  end_date: string | Date;
  progress: number;
  type?: string;
  readonly?: boolean;
  open?: boolean;
}

// サンプルデータ
const sampleData = {
  stages: [
    {
      id: "stage_1",
      title: "基本設計1",
      startDate: "2025-01-01",
      endDate: "2025-02-28",
      color: "#94a3b8",
      layer: 0,
    },
    {
      id: "stage_2",
      title: "実施設計1",
      startDate: "2025-02-01",
      endDate: "2025-03-30",
      color: "#94a3b8",
      layer: 0,
    },
    {
      id: "stage_3",
      title: "実施設計2",
      startDate: "2025-03-01",
      endDate: "2025-04-30",
      color: "#94a3b8",
      layer: 0,
    },
  ] as Stage[],
  tasks: [
    {
      id: "task_1",
      title: "基本設計書作成",
      startDate: "2025-01-15",
      endDate: "2025-02-15",
      status: "not_started" as const,
    },
    {
      id: "task_2",
      title: "構造計算書作成",
      startDate: "2025-02-01",
      endDate: "2025-03-15",
      status: "not_started" as const,
    },
    {
      id: "task_3",
      title: "確認申請準備",
      startDate: "2025-03-16",
      endDate: "2025-04-15",
      status: "not_started" as const,
    },
  ] as Task[],
};

export function GanttChart() {
  return (
    <div className="w-full h-full">
      <GanttChartContent tasks={sampleData.tasks} stages={sampleData.stages} />
    </div>
  );
}

function GanttChartContent({ tasks = [], stages = [] }: GanttChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initGantt = async () => {
      try {
        const gantt = (await import("dhtmlx-gantt")).default;

        if (!containerRef.current) return;

        // 基本的な設定
        gantt.config.date_format = "%Y-%m-%d";
        gantt.config.min_column_width = 100;
        (gantt.config as any).grid_width = 520;
        gantt.config.row_height = 40;

        // ドラッグ＆ドロップの無効化
        gantt.config.drag_progress = false;
        gantt.config.drag_resize = false;
        gantt.config.drag_move = false;
        gantt.config.drag_links = false;

        // グリッド列の設定
        gantt.config.columns = [
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
            tree: true, // ツリー表示を有効化
            width: 200,
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
        ];

        // タスクタイプの設定
        (gantt.config as any).types = {
          task: "task",
          stage: "stage",
        };

        // タイムラインのスケール設定
        gantt.config.scale_height = 30;
        (gantt.config as any).subscales = [];
        (gantt.config as any).scale_unit = "month";
        (gantt.config as any).date_scale = "%Y年%m月";
        (gantt.config as any).start_date = new Date("2025-01-01");
        (gantt.config as any).end_date = new Date("2025-04-30");

        // 日付フォーマットの設定
        (gantt as any).templates.date_grid = (date: Date) => {
          return format(date, "yyyy/MM/dd");
        };

        // グリッドヘッダーのスタイル
        (gantt as any).templates.grid_header_class = (columnName: string) => {
          return "gantt-header";
        };

        // タスクの行スタイル
        (gantt as any).templates.grid_row_class = (
          start: Date,
          end: Date,
          task: GanttTask
        ) => {
          return task.type === "stage" ? "gantt-stage-row" : "gantt-task-row";
        };

        // タスクバーのスタイル
        (gantt as any).templates.task_class = (
          start: Date,
          end: Date,
          task: GanttTask
        ) => {
          return task.type === "stage" ? "gantt-stage-bar" : "gantt-task-bar";
        };

        // 初期化
        gantt.init(containerRef.current);

        // データの読み込み
        const formattedData: GanttTask[] = [];

        // ステージの追加
        if (stages?.length > 0) {
          formattedData.push(
            ...stages.map((stage) => {
              const startDate = new Date(stage.startDate);
              const endDate = new Date(stage.endDate);
              return {
                id: stage.id,
                text: stage.title,
                start_date: format(startDate, "yyyy-MM-dd"),
                end_date: format(endDate, "yyyy-MM-dd"),
                type: "stage",
                progress: 0,
                open: true,
                readonly: true,
              };
            })
          );
        }

        // タスクの追加
        if (tasks?.length > 0) {
          formattedData.push(
            ...tasks.map((task) => {
              const startDate = new Date(task.startDate);
              const endDate = new Date(task.endDate);
              return {
                id: task.id,
                text: task.title,
                start_date: format(startDate, "yyyy-MM-dd"),
                end_date: format(endDate, "yyyy-MM-dd"),
                progress:
                  task.status === "completed"
                    ? 1
                    : task.status === "in_progress"
                    ? 0.5
                    : 0,
                type: "task",
              };
            })
          );
        }

        // データの設定
        gantt.parse({ data: formattedData });

        // スケールを自動調整
        (gantt.config as any).fit_tasks = true;
        gantt.render();

        // スタイル設定
        const styleElement = document.createElement("style");
        styleElement.textContent = `
          .gantt-header {
            background-color: #f3f4f6;
            font-weight: bold;
            border-bottom: 1px solid #e5e7eb;
            padding: 8px 12px;
          }
          .gantt-stage-row, .gantt-task-row {
            background-color: white;
          }
          .gantt-stage-bar {
            background-color: #94a3b8;
            border-radius: 4px;
            border: 1px solid #64748b;
          }
          .gantt-stage-bar .gantt-task-content {
            color: #1e293b;
            font-weight: bold;
          }
          .gantt-task-bar {
            background-color: #60a5fa;
            border-radius: 4px;
            border: 1px solid #3b82f6;
          }
          .gantt-task-bar .gantt-task-content {
            color: white;
          }
          .gantt_cell {
            border-right: 1px solid #e5e7eb;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            white-space: normal;
            line-height: 1.4;
            overflow: visible;
          }
          .gantt_grid_head_cell {
            border-right: 1px solid #e5e7eb;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            padding: 8px 12px;
          }
          .gantt_grid_data .gantt_cell {
            padding: 8px 12px;
            font-size: 13px;
          }
          .gantt_grid_data .gantt_cell[data-column-name="group_type"] {
            color: #374151;
          }
          .gantt_grid {
            border-right: 1px solid #e5e7eb;
          }
          .gantt_grid_scale {
            font-size: 13px;
            line-height: 1.4;
          }
          .gantt_scale_cell {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          }
        `;
        document.head.appendChild(styleElement);
      } catch (error) {
        console.error("Failed to initialize gantt chart:", error);
      }
    };

    initGantt();

    return () => {
      const element = containerRef.current;
      if (element) {
        while (element.firstChild) {
          element.removeChild(element.firstChild);
        }
      }
    };
  }, [tasks, stages]);

  return <div ref={containerRef} style={{ width: "100%", height: "500px" }} />;
}

export default GanttChart;
