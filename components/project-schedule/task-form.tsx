'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectSeparator,
} from '@/components/ui/select'
import { Task, TaskFormData, TaskStatus, TaskType } from '@/types/schedule'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import ja from 'date-fns/locale/ja'

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  milestones: Task[]; // 利用可能なマイルストーンのリスト
}

export function TaskForm({ task, onSubmit, onCancel, milestones }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    name: task?.name || "",
    start: task?.start || new Date(),
    end: task?.end || new Date(),
    status: (task?.status as TaskStatus) || "not_started",
    type: (task?.type as TaskType) || "task",
    progress: task?.progress || 0,
    milestoneId: task?.milestoneId,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="space-y-4 p-4">
      {task && task.parentId && (
        <div className="text-sm text-gray-500">
          親タスク: {task.parentId}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">名前</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">タイプ</Label>
          <Select
            value={formData.type}
            onValueChange={(value: "task" | "milestone" | "project") =>
              setFormData((prev) => ({ ...prev, type: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="task">タスク</SelectItem>
              <SelectItem value="milestone">マイルストーン</SelectItem>
              <SelectItem value="project">設計ステージ</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.type === "task" && (
          <div className="space-y-2">
            <Label htmlFor="milestone">関連マイルストーン</Label>
            <Select
              value={formData.milestoneId || ""}
              onValueChange={(value: string) =>
                setFormData((prev) => ({ ...prev, milestoneId: value || undefined }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="マイルストーンを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">なし</SelectItem>
                {milestones.map((milestone) => (
                  <SelectItem key={milestone.id} value={milestone.id}>
                    {milestone.name} ({milestone.end.toLocaleDateString("ja-JP")})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="start">開始日</Label>
          <div className="relative">
            <DatePicker
              selected={formData.start}
              onChange={(date: Date) =>
                setFormData((prev) => ({
                  ...prev,
                  start: date,
                }))
              }
              locale={ja}
              dateFormat="yyyy/MM/dd"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              minDate={new Date()}
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="end">終了日</Label>
          <div className="relative">
            <DatePicker
              selected={formData.end}
              onChange={(date: Date) =>
                setFormData((prev) => ({
                  ...prev,
                  end: date,
                }))
              }
              locale={ja}
              dateFormat="yyyy/MM/dd"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              minDate={formData.start}
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">ステータス</Label>
          <Select
            value={formData.status}
            onValueChange={(value: TaskStatus) =>
              setFormData((prev) => ({ ...prev, status: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not_started">未着手</SelectItem>
              <SelectItem value="in_progress">進行中</SelectItem>
              <SelectItem value="completed">完了</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="progress">進捗 (%)</Label>
          <Input
            id="progress"
            type="number"
            min="0"
            max="100"
            value={formData.progress * 100}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                progress: Number(e.target.value) / 100,
              }))
            }
            required
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            キャンセル
          </Button>
          <Button type="submit">保存</Button>
        </div>
      </form>
    </div>
  )
}
