'use client';

import { useRef, useEffect, useState } from "react";
import { Task, Stage, Link } from "@/types/schedule";
import { format } from "date-fns";
import "dhtmlx-gantt/codebase/dhtmlxgantt.css";
import gantt from "dhtmlx-gantt";
import { GanttTask } from "./types";

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
  links: [
    {
      id: "link_1",
      source: "task_1",
      target: "task_2",
      type: "finish_to_start",
    },
    {
      id: "link_2",
      source: "task_2",
      target: "task_3",
      type: "finish_to_start",
    },
  ] as Link[],
};

interface GanttChartProps {
  tasks?: Task[];
  stages?: Stage[];
  links?: Link[];
  onTaskEdit?: (task: Task) => void;
  onTaskClick?: (task: Task) => void;
  onTaskChange?: (task: Task, start: Date, end: Date) => void;
  onStageClick?: (stage: Stage) => void;
  onStageChange?: (stage: Stage, start: Date, end: Date) => void;
}

type ScaleType = "month" | "day";

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
  const handleTaskEdit = (ganttTask: GanttTask) => {
    if (onTaskEdit) {
      // GanttTaskからTaskへの変換
      const task: Task = {
        id: ganttTask.id,
        title: ganttTask.text,
        startDate: new Date(ganttTask.start_date),
        endDate: new Date(ganttTask.end_date),
        description: ganttTask.description,
        status: ganttTask.status || "not_started",
      };
      onTaskEdit(task);
    }
  };

  const handleTaskClick = (ganttTask: GanttTask) => {
    if (onTaskClick) {
      const task: Task = {
        id: ganttTask.id,
        title: ganttTask.text,
        startDate: new Date(ganttTask.start_date),
        endDate: new Date(ganttTask.end_date),
        description: ganttTask.description,
        status: ganttTask.status || "not_started",
      };
      onTaskClick(task);
    }
  };

  return (
    <div className="relative">
      <GanttChartContent
        tasks={tasks}
        stages={stages}
        links={links}
        onTaskEdit={handleTaskEdit}
        onTaskClick={handleTaskClick}
        onTaskChange={onTaskChange}
        onStageClick={onStageClick}
        onStageChange={onStageChange}
      />
    </div>
  );
}

interface GanttChartContentProps {
  tasks: Task[];
  stages: Stage[];
  links: Link[];
  onTaskEdit: (task: GanttTask) => void;
  onTaskClick?: (task: GanttTask) => void;
  onTaskChange?: (task: Task, start: Date, end: Date) => void;
  onStageClick?: (stage: Stage) => void;
  onStageChange?: (stage: Stage, start: Date, end: Date) => void;
}

function GanttChartContent({
  tasks,
  stages,
  links,
  onTaskEdit,
  onTaskClick,
  onTaskChange,
  onStageClick,
  onStageChange,
}: GanttChartContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<ScaleType>("month");

  useEffect(() => {
    const initGantt = async () => {
      try {
        if (!containerRef.current) return;

        // 基本的な設定
        gantt.config.date_format = "%Y-%m-%d";
        gantt.config.scale_height = 30;
        (gantt.config as any).grid_width = 200;
        gantt.config.row_height = 30;

        // ドラッグ＆ドロップの設定
        (gantt.config as any).drag_project = false;
        gantt.config.drag_resize = true;
        gantt.config.drag_progress = false;
        gantt.config.drag_links = true;

        // リンクの設定
        gantt.config.links = {
          finish_to_start: "0",
        };

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

        // タスクの変更イベント
        gantt.attachEvent(
          "onAfterTaskDrag",
          (id: string, mode: string, e: any) => {
            const task = gantt.getTask(id);
            if (task.type === "stage" && onStageChange) {
              const stage: Stage = {
                id: task.id,
                title: task.text,
                startDate: task.start_date,
                endDate: task.end_date,
                color: task.color,
                layer: task.layer,
              };
              onStageChange(stage, new Date(task.start_date), new Date(task.end_date));
            } else if (task.type === "task" && onTaskChange) {
              const updatedTask: Task = {
                id: task.id,
                title: task.text,
                startDate: task.start_date,
                endDate: task.end_date,
                description: task.description,
                status: task.status,
                parentId: task.parent,
              };
              onTaskChange(updatedTask, new Date(task.start_date), new Date(task.end_date));
            }
          }
        );

        // データの更新イベント
        gantt.attachEvent("onTaskClick", (id: string, e: any) => {
          const task = gantt.getTask(id);
          if (task.type === "stage" && onStageClick) {
            const stage: Stage = {
              id: task.id,
              title: task.text,
              startDate: task.start_date,
              endDate: task.end_date,
              color: task.color,
              layer: task.layer,
            };
            onStageClick(stage);
          } else if (task.type === "task" && onTaskClick) {
            const clickedTask: Task = {
              id: task.id,
              title: task.text,
              startDate: task.start_date,
              endDate: task.end_date,
              description: task.description,
              status: task.status,
              parentId: task.parent,
            };
            onTaskClick(clickedTask);
          }
          return false;
        });

        gantt.attachEvent("onTaskDblClick", (id: string, e: any) => {
          const task = gantt.getTask(id);
          if (task.type === "task" && onTaskEdit) {
            const editTask: Task = {
              id: task.id,
              title: task.text,
              startDate: task.start_date,
              endDate: task.end_date,
              description: task.description,
              status: task.status,
              parentId: task.parent,
            };
            onTaskEdit(editTask);
          }
          return false;
        });

        // デフォルトの編集モーダルを無効化
        (gantt.config as any).lightbox = { sections: [] };
        (gantt.config as any).show_lightbox = false;
        (gantt.config as any).details_on_dblclick = false;
        (gantt.config as any).details_on_create = false;
        (gantt.config as any).quick_info_detached = false;

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

        // タスクタイプの設定
        (gantt.config as any).types = {
          task: "task",
          stage: "stage",
        };

        // スタイル設定
        (gantt as any).templates.task_class = (start: Date, end: Date, task: GanttTask) => {
          return task.type === "stage" ? "gantt-stage-bar" : "gantt-task-bar";
        };

        (gantt as any).templates.grid_row_class = (start: Date, end: Date, task: GanttTask) => {
          return task.type === "stage" ? "gantt-stage-row" : "gantt-task-row";
        };

        // データの設定
        const formattedData: { data: GanttTask[]; links: Link[] } = {
          data: [],
          links: links,
        };

        // ステージの追加
        formattedData.data.push(
          ...stages.map((stage) => ({
            id: stage.id,
            text: stage.title,
            start_date: format(new Date(stage.startDate), "yyyy-MM-dd"),
            end_date: format(new Date(stage.endDate), "yyyy-MM-dd"),
            type: "stage",
            progress: 0,
            open: true,
            readonly: false,  // ステージの編集を許可
            color: stage.color,
            layer: stage.layer,
          }))
        );

        // タスクの追加
        formattedData.data.push(
          ...tasks.map((task) => ({
            id: task.id,
            text: task.title,
            start_date: format(new Date(task.startDate), "yyyy-MM-dd"),
            end_date: format(new Date(task.endDate), "yyyy-MM-dd"),
            description: task.description,
            status: task.status,
            type: "task",
            progress: task.status === "completed" ? 1 : task.status === "in_progress" ? 0.5 : 0,
            parent: task.parentId,
          }))
        );

        // スケール設定
        if (scale === "month") {
          (gantt.config as any).scale_unit = "month";
          (gantt.config as any).date_scale = "%Y年%m月";
          (gantt.config as any).subscales = [];
          gantt.config.min_column_width = 100;
        } else {
          (gantt.config as any).scale_unit = "day";
          (gantt.config as any).date_scale = "%d";
          (gantt.config as any).subscales = [{ unit: "month", step: 1, date: "%Y年%m月" }];
          gantt.config.min_column_width = 35;
        }

        // データの表示範囲を設定
        const minDate = new Date("2025-01-01");
        const maxDate = new Date("2025-04-30");
        (gantt.config as any).start_date = minDate;
        (gantt.config as any).end_date = maxDate;

        // ganttの初期化とデータの設定
        gantt.init(containerRef.current);
        gantt.clearAll();
        gantt.parse(formattedData);

        // タスクのダブルクリックとクリックの処理
        gantt.attachEvent("onTaskDblClick", (id: string, e: any) => {
          const task = gantt.getTask(id);
          // タスクの場合のみ編集モーダルを表示
          if (task.type === "task" && onTaskEdit) {
            const editTask: Task = {
              id: task.id,
              title: task.text,
              startDate: task.start_date,
              endDate: task.end_date,
              description: task.description,
              status: task.status,
              parentId: task.parent,
            };
            onTaskEdit(editTask);
          }
          return false;
        });

        gantt.attachEvent("onTaskClick", (id: string, e: any) => {
          const task = gantt.getTask(id);
          if (task.type === "stage" && onStageClick) {
            // ステージの場合はステージ編集モーダルを表示
            const stage: Stage = {
              id: task.id,
              title: task.text,
              startDate: task.start_date,
              endDate: task.end_date,
              color: task.color,
              layer: task.layer,
            };
            onStageClick(stage);
          } else if (task.type === "task" && onTaskClick) {
            // タスクの場合はタスク選択のみ
            const clickedTask: Task = {
              id: task.id,
              title: task.text,
              startDate: task.start_date,
              endDate: task.end_date,
              description: task.description,
              status: task.status,
              parentId: task.parent,
            };
            onTaskClick(clickedTask);
          }
          return false;
        });
      } catch (error) {
        console.error("Failed to initialize gantt chart:", error);
      }
    };

    initGantt();

    // クリーンアップ
    return () => {
      if (containerRef.current) {
        gantt.clearAll();
      }
    };
  }, [tasks, stages, links, scale, onTaskEdit, onTaskClick]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <button
          className={`px-4 py-2 rounded ${
            scale === "month"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setScale("month")}
        >
          月表示
        </button>
        <button
          className={`px-4 py-2 rounded ${
            scale === "day"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setScale("day")}
        >
          日表示
        </button>
      </div>
      <div ref={containerRef} style={{ width: "100%", height: "500px" }} />
    </div>
  );
}
