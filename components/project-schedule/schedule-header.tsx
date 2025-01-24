import { Button } from "@/components/ui/button";
import { Task } from "@/types/schedule";
import { IconShare } from "@tabler/icons-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ViewMode } from "gantt-task-react";

interface ScheduleHeaderProps {
  viewMode: keyof typeof ViewMode;
  onViewModeChange: (value: keyof typeof ViewMode) => void;
  onShareClick: () => void;
  onAddTask: (taskType: "design" | "milestone" | "task") => void;
}

export function ScheduleHeader({
  viewMode,
  onViewModeChange,
  onShareClick,
  onAddTask,
}: ScheduleHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">スケジュール</h1>
      <div className="flex items-center space-x-4">
        <Select
          value={viewMode}
          onValueChange={onViewModeChange}
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
          onClick={onShareClick}
        >
          <IconShare className="w-4 h-4 mr-2" />
          共有
        </Button>
        <div className="flex space-x-2">
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={() => onAddTask("design")}
          >
            設計ステージを追加
          </Button>
          <Button
            className="bg-rose-600 hover:bg-rose-700 text-white"
            onClick={() => onAddTask("milestone")}
          >
            マイルストーンを追加
          </Button>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => onAddTask("task")}
          >
            タスクを追加
          </Button>
        </div>
      </div>
    </div>
  );
} 