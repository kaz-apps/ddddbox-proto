"use client";

import { useState, useEffect } from "react";
import { Gantt, ViewMode, Task as GanttTask } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { Task } from "@/types/schedule";
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

export default function SharedSchedulePage({
  params,
}: {
  params: { shareId: string };
}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [viewMode, setViewMode] = useState<keyof typeof ViewMode>(ViewMode.Month);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);

  useEffect(() => {
    const fetchSharedSchedule = async () => {
      try {
        const response = await fetch(`/api/schedule/share/${params.shareId}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || "Failed to load schedule");
        }
        
        setTasks(data.tasks);
        setExpiresAt(new Date(data.expiresAt));
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchSharedSchedule();
  }, [params.shareId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="mx-auto py-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">共有スケジュール</h1>
        <div className="flex items-center space-x-4">
          {expiresAt && (
            <div className="text-sm text-gray-500">
              有効期限: {expiresAt.toLocaleString("ja-JP", {
                year: "numeric",
                month: "numeric",
                day: "numeric",
                hour: "numeric",
                minute: "numeric"
              })}まで
            </div>
          )}
          <Select
            value={viewMode}
            onValueChange={(value: keyof typeof ViewMode) => setViewMode(value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ViewMode.Day}>日表示</SelectItem>
              <SelectItem value={ViewMode.Month}>月表示</SelectItem>
            </SelectContent>
          </Select>
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
                {tasks.map((task) => (
                  <TableRow key={task.id}>
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
          <div className="flex-grow overflow-auto scroll-smooth">
            <div style={{ 
              minWidth: viewMode === ViewMode.Day ? "3000px" : "1500px",
              height: "100%"
            }}>
              <style jsx global>{`
                .bar-wrapper {
                  position: relative;
                }
                .bar {
                  position: relative;
                  min-width: 100px;
                  display: flex;
                  align-items: center;
                }
                .bar::before {
                  content: attr(data-task-name);
                  position: absolute;
                  left: 8px;
                  top: 50%;
                  transform: translateY(-50%);
                  z-index: 1;
                  white-space: nowrap;
                  font-size: 12px;
                  font-weight: 500;
                  color: #000;
                  pointer-events: none;
                  text-shadow: 
                    -1px -1px 0 #fff,
                    1px -1px 0 #fff,
                    -1px 1px 0 #fff,
                    1px 1px 0 #fff;
                }
                /* ツールチップを非表示にする */
                .tooltip-default {
                  display: none !important;
                }
              `}</style>
              <Gantt
                tasks={tasks.map(task => ({
                  ...task,
                  styles: {
                    ...task.styles,
                    barBackgroundColor: task.type === "project" ? "#FF8787" : task.type === "milestone" ? "#EF4444" : "#FFA5A5",
                    backgroundColor: task.type === "project" ? "#FFE5E5" : task.type === "milestone" ? "#FEE2E2" : "#FFF0F0",
                    backgroundSelectedColor: task.type === "project" ? "#FFD5D5" : task.type === "milestone" ? "#FECACA" : "#FFE0E0",
                    progressColor: task.type === "project" ? "#FF6B6B" : task.type === "milestone" ? "#DC2626" : "#FF8787",
                    progressSelectedColor: task.type === "project" ? "#FF5252" : task.type === "milestone" ? "#B91C1C" : "#FF6B6B",
                  }
                }))}
                viewMode={viewMode}
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
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 