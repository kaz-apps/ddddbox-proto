"use client";

import { useState, useRef, useEffect } from "react";
import { Button, type ButtonProps, buttonVariants } from "@/components/ui/button";
import { Gantt, ViewMode, Task as GanttTask } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { Task, TaskFormData } from "@/types/schedule";
import { TaskForm } from "@/components/project-schedule/task-form";
import { useAutoScroll } from "@/lib/hooks/useAutoScroll";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { IconShare, IconCopy } from "@tabler/icons-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IconAlertTriangle } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { ScheduleHeader } from "@/components/project-schedule/schedule-header";
import { ScheduleAlerts } from "@/components/project-schedule/schedule-alerts";
import { ScheduleGantt } from "@/components/project-schedule/schedule-gantt";

// サンプルデータ
const initialTasks: Task[] = [
  {
    start: new Date(2024, 11, 1), // 2024年12月1日
    end: new Date(2025, 0, 31),   // 2025年1月31日
    name: "実施設計1",
    id: "project_1",
    type: "task",
    progress: 0,
    status: "not_started",
    isDisabled: false,
    styles: { progressColor: "#F59E0B", progressSelectedColor: "#D97706" },
  },
  {
    start: new Date(2025, 1, 1),  // 2025年2月1日
    end: new Date(2025, 2, 31),   // 2025年3月31日
    name: "実施設計2",
    id: "project_2",
    type: "task",
    progress: 0,
    status: "not_started",
    isDisabled: false,
    styles: { progressColor: "#F59E0B", progressSelectedColor: "#D97706" },
  },
  {
    start: new Date(2024, 11, 15), // 2024年12月15日
    end: new Date(2025, 0, 31),    // 2025年1月31日
    name: "タスク1",
    id: "task_1",
    type: "task",
    progress: 0,
    status: "not_started",
    isDisabled: false,
    styles: { progressColor: "#94A3B8", progressSelectedColor: "#64748B" },
  },
  {
    start: new Date(2025, 1, 1),  // 2025年2月1日
    end: new Date(2025, 2, 15),   // 2025年3月15日
    name: "タスク2",
    id: "task_2",
    type: "task",
    progress: 0,
    status: "not_started",
    isDisabled: false,
    styles: { progressColor: "#94A3B8", progressSelectedColor: "#64748B" },
  },
  {
    start: new Date(2024, 11, 31), // 2024年12月31日
    end: new Date(2024, 11, 31),   // 2024年12月31日
    name: "設計完了",
    id: "milestone_1",
    type: "milestone",
    progress: 0,
    status: "not_started",
    isDisabled: false,
    styles: {
      progressColor: "#EF4444",
      progressSelectedColor: "#DC2626",
      backgroundColor: "#FEE2E2",
      backgroundSelectedColor: "#FECACA",
    },
  },
  // 表示期間を制御するための非表示タスク
  {
    start: new Date(2024, 11, 1),  // 2024年12月1日
    end: new Date(2025, 11, 31),   // 2025年12月31日
    name: "表示期間",
    id: "display_range",
    type: "task",
    progress: 0,
    status: "not_started",
    isDisabled: true,
    hideChildren: true,
    styles: { progressColor: "transparent", progressSelectedColor: "transparent" },
  },
];

interface TaskBarProps {
  task: GanttTask;
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected: boolean;
  isDateChangeable: boolean;
  onMouseDown?: (event: React.MouseEvent<SVGGElement, MouseEvent>) => void;
}

export default function SchedulePage() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  useAutoScroll(scrollContainerRef);

  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<keyof typeof ViewMode>(ViewMode.Month);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [shareExpiry, setShareExpiry] = useState("24"); // 有効期限（時間）
  const [alerts, setAlerts] = useState<{
    milestoneId: string;
    milestoneName: string;
    dueDate: Date;
    incompleteTasks: string[];
  }[]>([]);

  // タスクの並び順を管理するstate
  const [taskOrder, setTaskOrder] = useState<{ [key: string]: number }>({});

  // タスクをグループごとにソートする関数
  const getSortedTasks = (tasks: Task[]) => {
    const displayRangeTask = tasks.find(task => task.id === 'display_range');
    const otherTasks = tasks.filter(task => task.id !== 'display_range');

    // グループごとにタスクを分類
    const milestones = otherTasks.filter(task => task.type === 'milestone');
    const designStages = otherTasks.filter(task => task.id.startsWith('project_')); // 設計ステージ
    const regularTasks = otherTasks.filter(task => 
      task.type === 'task' && !task.id.startsWith('project_') // 通常のタスク
    );

    // グループ内でのソート
    const sortByOrder = (a: Task, b: Task) => {
      const orderA = taskOrder[a.id] || 0;
      const orderB = taskOrder[b.id] || 0;
      return orderA - orderB;
    };

    // ソートされたタスクを結合
    const sortedTasks = [
      ...milestones.sort(sortByOrder),
      ...designStages.sort(sortByOrder),
      ...regularTasks.sort(sortByOrder),
    ];

    // display_range タスクを追加
    return displayRangeTask ? [...sortedTasks, displayRangeTask] : sortedTasks;
  };

  // ドラッグ開始時のインデックスを保持
  const dragStartIndex = useRef<number | null>(null);
  const dragOverIndex = useRef<number | null>(null);

  // ドラッグ&ドロップのイベントハンドラ
  const handleDragStart = (index: number) => {
    dragStartIndex.current = index;
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    dragOverIndex.current = index;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (dragStartIndex.current === null || dragOverIndex.current === null) return;

    const currentTasks = getSortedTasks(tasks).filter(task => task.id !== 'display_range');
    const draggedTask = currentTasks[dragStartIndex.current];
    const targetTask = currentTasks[dragOverIndex.current];

    // 同じタイプのタスク間でのみ並び替えを許可
    if (draggedTask.type !== targetTask.type) return;

    // 新しい順序を計算
    const newOrder = { ...taskOrder };
    const sameTypeTasks = currentTasks.filter(t => t.type === draggedTask.type);
    const targetIndex = sameTypeTasks.findIndex(t => t.id === targetTask.id);

    // 移動先の前後のタスクの順序値を取得
    const prevTask = sameTypeTasks[targetIndex - 1];
    const nextTask = sameTypeTasks[targetIndex + 1];
    
    let newOrderValue: number;
    if (!prevTask) {
      // 先頭に移動
      newOrderValue = (taskOrder[targetTask.id] || 0) - 1000;
    } else if (!nextTask) {
      // 末尾に移動
      newOrderValue = (taskOrder[targetTask.id] || 0) + 1000;
    } else {
      // 間に移動
      newOrderValue = ((taskOrder[prevTask.id] || 0) + (taskOrder[targetTask.id] || 0)) / 2;
    }

    newOrder[draggedTask.id] = newOrderValue;
    setTaskOrder(newOrder);

    // リセット
    dragStartIndex.current = null;
    dragOverIndex.current = null;
  };

  // Ganttコンポーネントに渡すタスクを並び替え
  const sortedTasks = getSortedTasks(tasks);

  // マイルストーンのアラートをチェックする関数
  const checkMilestoneAlerts = () => {
    const now = new Date();
    const newAlerts: typeof alerts = [];

    const milestones = tasks.filter(task => task.type === "milestone");
    const regularTasks = tasks.filter(task => task.type === "task");

    milestones.forEach(milestone => {
      if (milestone.end < now) {
        const relatedTasks = regularTasks.filter(task => task.milestoneId === milestone.id);
        const incompleteTasks = relatedTasks.filter(task => task.status !== "completed");

        if (incompleteTasks.length > 0) {
          newAlerts.push({
            milestoneId: milestone.id,
            milestoneName: milestone.name,
            dueDate: milestone.end,
            incompleteTasks: incompleteTasks.map(task => task.name),
          });
        }
      }
    });

    setAlerts(newAlerts);
  };

  // タスクが変更されたときにアラートをチェック
  useEffect(() => {
    checkMilestoneAlerts();
  }, [tasks]);

  const handleTaskSubmit = (data: TaskFormData) => {
    console.log('Submitting task with data:', data); // デバッグログを追加
    if (selectedTask) {
      // 既存タスクの更新
      setTasks((prev) =>
        prev.map((task) =>
          task.id === selectedTask.id
            ? {
                ...task,
                ...data,
                dependencies: data.dependencies, // 依存関係を明示的に設定
                styles:
                  data.type === "project"
                    ? { 
                        progressColor: "#F59E0B", 
                        progressSelectedColor: "#D97706",
                        arrowColor: "#F59E0B",
                        arrowIndent: 20,
                        barBackgroundColor: "#FEF3C7",
                        backgroundColor: "#FEF3C7",
                        backgroundSelectedColor: "#FDE68A",
                      }
                    : { 
                        progressColor: "#94A3B8", 
                        progressSelectedColor: "#64748B",
                        arrowColor: "#94A3B8",
                        arrowIndent: 20,
                        barBackgroundColor: "#F1F5F9",
                        backgroundColor: "#F1F5F9",
                        backgroundSelectedColor: "#E2E8F0",
                      },
              }
            : task
        )
      );
    } else {
      // 新規タスク作成
      const newTask: Task = {
        ...data,
        id: `${data.type}_${Math.random().toString(36).substr(2, 9)}`,
        dependencies: data.dependencies, // 依存関係を明示的に設定
        isDisabled: false,
        styles:
          data.type === "project"
            ? { 
                progressColor: "#F59E0B", 
                progressSelectedColor: "#D97706",
                arrowColor: "#F59E0B",
                arrowIndent: 20,
                barBackgroundColor: "#FEF3C7",
                backgroundColor: "#FEF3C7",
                backgroundSelectedColor: "#FDE68A",
              }
            : { 
                progressColor: "#94A3B8", 
                progressSelectedColor: "#64748B",
                arrowColor: "#94A3B8",
                arrowIndent: 20,
                barBackgroundColor: "#F1F5F9",
                backgroundColor: "#F1F5F9",
                backgroundSelectedColor: "#E2E8F0",
              },
      };
      console.log('Creating new task:', newTask); // デバッグログを追加
      setTasks((prev) => [...prev, newTask]);
    }
    setIsTaskDialogOpen(false);
    setSelectedTask(undefined);
  };

  const handleTaskChange = (task: GanttTask) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, ...task, status: t.status } : t))
    );
  };

  const handleTaskClick = (task: GanttTask) => {
    const selectedTask = tasks.find((t) => t.id === task.id);
    if (selectedTask) {
      setSelectedTask(selectedTask);
      setIsTaskDialogOpen(true);
    }
  };

  const handleProgressChange = (task: GanttTask) => {
    const updatedTask = tasks.find((t) => t.id === task.id);
    if (updatedTask) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, progress: task.progress } : t
        )
      );
    }
    return true;
  };

  const handleDateChange = (task: GanttTask) => {
    // すべてのタスクタイプで日付変更を許可
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
          ? { ...t, start: task.start, end: task.end }
          : t
      )
    );
    return true;
  };

  const handleAddTask = (taskType: "design" | "milestone" | "task") => {
    const newTask: Task = {
      id: taskType === "design" 
        ? `project_${Date.now()}`
        : taskType === "milestone"
        ? `milestone_${Date.now()}`
        : `task_${Date.now()}`,
      name: taskType === "design"
        ? "新しい設計ステージ"
        : taskType === "milestone"
        ? "新しいマイルストーン"
        : "新しいタスク",
      start: new Date(),
      end: new Date(),
      type: taskType === "milestone" ? "milestone" : "task",
      progress: 0,
      status: "not_started",
      isDisabled: false,
      styles: taskType === "design"
        ? {
            progressColor: "#F59E0B",
            progressSelectedColor: "#D97706",
          }
        : taskType === "milestone"
        ? {
            progressColor: "#EF4444",
            progressSelectedColor: "#DC2626",
            backgroundColor: "#FEE2E2",
            backgroundSelectedColor: "#FECACA",
          }
        : {
            progressColor: "#94A3B8",
            progressSelectedColor: "#64748B",
          },
    };
    setTasks([...tasks, newTask]);
    setSelectedTask(newTask);
    setIsTaskDialogOpen(true);
  };

  // 共有URLを生成する関数
  const generateShareUrl = async () => {
    // デモ用の固定URLを返す
    const demoUrl = `${process.env.NEXT_PUBLIC_APP_URL}/schedule/share/demo`;
    setShareUrl(demoUrl);
  };

  // URLをクリップボードにコピーする関数
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      // TODO: コピー成功通知
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      // TODO: エラー処理
    }
  };

  return (
    <div className="mx-auto py-6 space-y-4">
      <ScheduleAlerts alerts={alerts} />
      
      <ScheduleHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onShareClick={() => setIsShareDialogOpen(true)}
        onAddTask={handleAddTask}
      />

      <ScheduleGantt
        tasks={sortedTasks}
        viewMode={viewMode}
        onDateChange={handleDateChange}
        onProgressChange={handleProgressChange}
        onTaskClick={handleTaskClick}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      />

      {isTaskDialogOpen && (
        <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedTask ? "タスクを編集" : "新しいタスク"}
              </DialogTitle>
              <DialogDescription>
                タスクの詳細情報を入力してください。
              </DialogDescription>
            </DialogHeader>
            <TaskForm
              task={selectedTask}
              tasks={tasks.filter(task => task.id !== "display_range")}
              milestones={tasks.filter(task => task.type === "milestone")}
              onSubmit={handleTaskSubmit}
              onCancel={() => {
                setIsTaskDialogOpen(false);
                setSelectedTask(undefined);
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {isShareDialogOpen && (
        <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>スケジュールを共有</DialogTitle>
              <DialogDescription>
                共有用のURLを生成します。
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="expiry" className="text-sm font-medium">
                  有効期限
                </label>
                <Select
                  value={shareExpiry}
                  onValueChange={setShareExpiry}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1時間</SelectItem>
                    <SelectItem value="24">24時間</SelectItem>
                    <SelectItem value="72">3日間</SelectItem>
                    <SelectItem value="168">7日間</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {shareUrl ? (
                <div className="space-y-2">
                  <label htmlFor="share-url" className="text-sm font-medium">
                    共有URL
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      id="share-url"
                      value={shareUrl}
                      readOnly
                      className="flex-grow"
                    />
                    <Button
                      variant="outline"
                      onClick={copyToClipboard}
                    >
                      <IconCopy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <button
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
                  onClick={generateShareUrl}
                >
                  <IconShare className="mr-2 h-4 w-4" />
                  共有URLを生成
                </button>
              )}
            </div>
            <button
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
              onClick={() => setIsShareDialogOpen(false)}
            >
              キャンセル
            </button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
