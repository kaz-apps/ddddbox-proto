"use client";

import { useRef, useEffect, useState } from "react";
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

type ScaleType = "month" | "day";

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
  const [scale, setScale] = useState<ScaleType>("month");
  const [ganttInstance, setGanttInstance] = useState<any>(null);

  // スケール設定を更新する関数
  const updateScale = (gantt: any, newScale: ScaleType) => {
    if (newScale === "month") {
      gantt.config.scale_unit = "month";
      gantt.config.date_scale = "%Y年%m月";
      gantt.config.subscales = [];
      gantt.config.min_column_width = 100;
      // 月表示用のクラスを追加
      gantt.templates.scale_cell_class = () => "gantt_scale_cell_month";
    } else {
      gantt.config.scale_unit = "day";
      gantt.config.date_scale = "%d";
      gantt.config.subscales = [{ unit: "month", step: 1, date: "%Y年%m月" }];
      gantt.config.min_column_width = 35; // 日表示時は列幅を狭く
      // 日表示用のクラスを追加
      gantt.templates.scale_cell_class = () => "gantt_scale_cell_day";
    }
    gantt.render();
  };

  // スケール切り替えハンドラー
  const handleScaleChange = (newScale: ScaleType) => {
    setScale(newScale);
    if (ganttInstance) {
      updateScale(ganttInstance, newScale);
    }
  };

  useEffect(() => {
    const initGantt = async () => {
      try {
        const gantt = (await import("dhtmlx-gantt")).default;
        setGanttInstance(gantt);

        if (!containerRef.current) return;

        // 基本的な設定
        gantt.config.date_format = "%Y-%m-%d";
        gantt.config.min_column_width = scale === "month" ? 100 : 35;
        (gantt.config as any).grid_width = 520;
        gantt.config.row_height = 40;

        // ドラッグ＆ドロップの設定
        gantt.config.drag_progress = false; // 進捗バーのドラッグは無効
        gantt.config.drag_resize = true; // タスクのリサイズを有効
        gantt.config.drag_move = true; // タスクの移動を有効
        gantt.config.drag_links = false; // リンクの作成は無効

        // タスクの制約設定
        gantt.attachEvent(
          "onBeforeTaskDrag",
          (id: string, mode: string, e: any) => {
            const task = gantt.getTask(id);
            // ステージの場合はドラッグを禁止
            if (task.type === "stage") {
              return false;
            }
            return true;
          }
        );

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
        (gantt.config as any).scale_unit = scale;
        (gantt.config as any).date_scale = scale === "month" ? "%Y年%m月" : "%d";
        if (scale === "day") {
          (gantt.config as any).subscales = [
            { unit: "month", step: 1, date: "%Y年%m月" },
          ];
          gantt.templates.scale_cell_class = () => "gantt_scale_cell_day";
        } else {
          gantt.templates.scale_cell_class = () => "gantt_scale_cell_month";
        }
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
            height: 46px !important;
          }
          .gantt_scale_cell {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            height: 46px !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
          }
          .gantt_task_scale {
            height: 46px !important;
          }
          .gantt_scale_line {
            height: 22px !important;
            display: flex !important;
            align-items: center !important;
          }
          .gantt_row_task .gantt_task_scale .gantt_scale_cell {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            height: 100% !important;
          }
          .gantt_scale_cell div {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            width: 100% !important;
            height: 100% !important;
          }
          .gantt_scale_cell_month span {
            position:relative;
            top:10px;
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
  }, [tasks, stages, scale]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <button
          className={`px-4 py-2 rounded ${
            scale === "month"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => handleScaleChange("month")}
        >
          月表示
        </button>
        <button
          className={`px-4 py-2 rounded ${
            scale === "day"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => handleScaleChange("day")}
        >
          日表示
        </button>
      </div>
      <div ref={containerRef} style={{ width: "100%", height: "500px" }} />
    </div>
  );
}

export default GanttChart;
