"use client";

import { useState } from "react";
import { ViewMode, Gantt } from "gantt-task-react";
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

// デモ用のダミーデータ
const demoTasks: Task[] = [
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
];

// デモ用の固定有効期限
const demoExpiresAt = new Date("2025-12-31T23:59:59");

export default function SharedSchedulePage() {
  const [viewMode, setViewMode] = useState<"Day" | "Month">("Month");
  
  return (
    <div className="mx-auto py-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">共有スケジュール</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            有効期限: {demoExpiresAt.toLocaleString("ja-JP", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
              hour: "numeric",
              minute: "numeric"
            })}まで
          </div>
          <Select
            value={viewMode}
            onValueChange={(value: "Day" | "Month") => setViewMode(value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Day">日表示</SelectItem>
              <SelectItem value="Month">月表示</SelectItem>
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
                {demoTasks.map((task) => (
                  <TableRow key={task.id}>
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
          <div className="flex-grow overflow-auto scroll-smooth">
            <div style={{ 
              minWidth: viewMode === "Day" ? "3000px" : "1500px",
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
                tasks={demoTasks.map(task => ({
                  ...task,
                  isDisabled: false,
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
                listCellWidth=""
                columnWidth={viewMode === "Day" ? 40 : 200}
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
                ganttHeight={600}
                arrowColor="#64748B"
                arrowIndent={20}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
