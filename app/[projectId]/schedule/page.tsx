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

// サンプルデータ
const initialTasks: Task[] = [
  {
    start: new Date(2024, 11, 1), // 2024年12月1日
    end: new Date(2025, 0, 31),   // 2025年1月31日
    name: "実施設計1",
    id: "project_1",
    type: "project",
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
    type: "project",
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
    project: "project_1",
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
    project: "project_2",
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
    project: "project_1",
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
    const projects = otherTasks.filter(task => task.type === 'project');
    const regularTasks = otherTasks.filter(task => task.type === 'task');

    // グループ内でのソート
    const sortByOrder = (a: Task, b: Task) => {
      const orderA = taskOrder[a.id] || 0;
      const orderB = taskOrder[b.id] || 0;
      return orderA - orderB;
    };

    // ソートされたタスクを結合
    const sortedTasks = [
      ...milestones.sort(sortByOrder),
      ...projects.sort(sortByOrder),
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
                project: data.type === "task" ? "project_1" : undefined,
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
        project: data.type === "task" ? "project_1" : undefined,
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
    const updatedTask = tasks.find((t) => t.id === task.id);
    if (updatedTask) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === task.id
            ? { ...t, start: task.start, end: task.end }
          : t
      )
    );
    }
    return true;
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
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert) => (
            <Alert key={alert.milestoneId} variant="destructive">
              <IconAlertTriangle className="h-4 w-4" />
              <AlertTitle>マイルストーン期限超過</AlertTitle>
              <AlertDescription>
                マイルストーン「{alert.milestoneName}」({alert.dueDate.toLocaleDateString("ja-JP")})に関連する
                以下のタスクが未完了です：
                <ul className="list-disc list-inside mt-2">
                  {alert.incompleteTasks.map((taskName, index) => (
                    <li key={index}>{taskName}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">スケジュール</h1>
        <div className="flex items-center space-x-4">
          <Select
            value={viewMode}
            onValueChange={(value: keyof typeof ViewMode) => setViewMode(value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="表示モード" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Day">日表示</SelectItem>
              <SelectItem value="Month">月表示</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="outline"
            onClick={() => setIsShareDialogOpen(true)}
          >
            <IconShare className="w-4 h-4 mr-2" />
            共有
          </Button>
          <button
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
            onClick={() => {
              const newTask: Task = {
                id: `task_${Date.now()}`,
                name: "新しいタスク",
                start: new Date(),
                end: new Date(),
                type: "task",
                progress: 0,
                status: "not_started",
                isDisabled: false,
                styles: {
                  progressColor: "#94A3B8",
                  progressSelectedColor: "#64748B",
                },
              };
              setTasks([...tasks, newTask]);
              setSelectedTask(newTask);
              setIsTaskDialogOpen(true);
            }}
          >
            タスクを追加
          </button>
        </div>
      </div>

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
                {sortedTasks.filter(task => task.id !== "display_range").map((task, index) => (
                  <TableRow 
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={handleDrop}
                    className="cursor-move"
                  >
                    <TableCell>
                      {task.type === "project" 
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
                /* その他の既存のスタイル */
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
                /* テーブルとガントチャートの行の高さを揃える */
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
                /* 表示期間タスクを完全に非表示にする */
                .bar[data-task-id="display_range"] {
                  display: none !important;
                }
                /* プロジェクトタスクのバー */
                .bar[data-task-type="project"] > svg rect._31ERP {
                  fill: #4F46E5 !important; /* インディゴ-600 */
                }
                .bar[data-task-type="project"] > svg rect._3T42e {
                  fill: #4338CA !important; /* インディゴ-700 */
                }
                /* マイルストーンのバー */
                .bar[data-task-type="milestone"] > svg rect._31ERP {
                  fill: #FA8072 !important; /* サーモンピンク */
                }
                .bar[data-task-type="milestone"] > svg rect._3T42e {
                  fill: #E9967A !important; /* ダークサーモン */
                }
                /* 通常タスクのバー */
                .bar[data-task-type="task"] > svg rect._31ERP {
                  fill: #4ADE80 !important; /* グリーン-500 */
                }
                .bar[data-task-type="task"] > svg rect._3T42e {
                  fill: #22C55E !important; /* グリーン-600 */
                }
                /* ツールチップを非表示にする */
                .tooltip-default {
                  display: none !important;
                }
                /* ガントチャートの行の高さを調整 */
                .gantt-row {
                  height: 50px !important;
                }
                .gantt-row-bar {
                  height: 50px !important;
                }
              `}</style>
              <Gantt
                tasks={sortedTasks
                  .filter(task => task.id !== "display_range")
                  .map(task => ({
                  ...task,
                  dependencies: task.dependencies || [],  // 依存関係を明示的に設定
                  styles: {
                    ...task.styles,
                    // プロジェクト
                    ...(task.type === "project" ? {
                      barBackgroundColor: "#4F46E5",
                      backgroundColor: "#4F46E5",
                      backgroundSelectedColor: "#4338CA",
                      progressColor: "#4338CA",
                      progressSelectedColor: "#3730A3",
                      arrowColor: "#4F46E5",  // 依存関係の矢印の色
                      arrowIndent: 20,  // 矢印のインデント
                    } :
                    // マイルストーン
                    task.type === "milestone" ? {
                      barBackgroundColor: "#FA8072",
                      backgroundColor: "#FA8072",
                      backgroundSelectedColor: "#E9967A",
                      progressColor: "#E9967A",
                      progressSelectedColor: "#CD5C5C",
                      arrowColor: "#FA8072",
                      arrowIndent: 20,
                    } :
                    // タスク
                    {
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
                onDateChange={handleDateChange}
                onProgressChange={handleProgressChange}
                onDoubleClick={handleTaskClick}
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
                arrowColor="#64748B"  // 依存関係の矢印のデフォルト色
                arrowIndent={20}      // 矢印のインデント
              />
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent aria-describedby="task-form-description">
          <DialogHeader>
            <DialogTitle>
              {selectedTask ? "タスクを編集" : "タスクを作成"}
            </DialogTitle>
            <DialogDescription id="task-form-description">
              タスクの詳細情報を入力してください。
            </DialogDescription>
          </DialogHeader>
          <TaskForm
            task={selectedTask}
            onSubmit={handleTaskSubmit}
            onCancel={() => {
              setIsTaskDialogOpen(false);
              setSelectedTask(undefined);
            }}
            milestones={tasks.filter(task => task.type === "milestone")}
            tasks={tasks.filter(task => task.id !== "display_range")}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent aria-describedby="share-dialog-description">
          <DialogHeader>
            <DialogTitle>スケジュールを共有</DialogTitle>
            <DialogDescription id="share-dialog-description">
              一時的な共有URLを生成します。URLは指定した期間後に無効になります。
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
    </div>
  );
}
