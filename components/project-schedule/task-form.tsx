import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Task, TaskFormData, TaskStatus, TaskType } from '@/types/schedule'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { ja } from 'date-fns/locale/ja'
import { MultiSelect } from '@/components/ui/multi-select'

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
  milestones: Task[]; // 利用可能なマイルストーンのリスト
  tasks: Task[]; // 依存関係の選択用に全タスクを受け取る
}

export function TaskForm({ task, onSubmit, onCancel, milestones, tasks }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    name: task?.name || "",
    start: task?.start || new Date(),
    end: task?.end || new Date(),
    status: (task?.status as TaskStatus) || "not_started",
    type: (task?.type as TaskType) || "task",
    progress: task?.progress || 0,
    project: task?.project,
    milestoneId: task?.milestoneId,
    dependencies: task?.dependencies || [],
  });

  // 依存関係として選択可能なタスクのリスト
  const availableDependencies = tasks.filter(t => 
    t.id !== task?.id && // 自分自身は除外
    t.type === formData.type && // 同じタイプのタスクのみ
    t.project === formData.project // 同じプロジェクト内のタスクのみ
  );

  console.log('Available tasks for dependencies:', {
    allTasks: tasks,
    filteredTasks: availableDependencies,
    currentTaskId: task?.id,
    currentType: formData.type,
    currentProject: formData.project
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="space-y-4 p-4">
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
            onValueChange={(value: TaskType) =>
              setFormData((prev) => ({ ...prev, type: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="project">設計ステージ</SelectItem>
              <SelectItem value="milestone">マイルストーン</SelectItem>
              <SelectItem value="task">タスク</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start">開始日</Label>
            <DatePicker
              id="start"
              selected={formData.start}
              onChange={(date: Date | null) =>
                setFormData((prev) => ({ ...prev, start: date || new Date() }))
              }
              dateFormat="yyyy/MM/dd"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              locale={ja}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="end">終了日</Label>
            <DatePicker
              id="end"
              selected={formData.end}
              onChange={(date: Date | null) =>
                setFormData((prev) => ({ ...prev, end: date || new Date() }))
              }
              dateFormat="yyyy/MM/dd"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              minDate={formData.start}
              locale={ja}
            />
          </div>
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

        {formData.type === "task" && (
          <>
            <div className="space-y-2">
              <Label htmlFor="milestone">関連マイルストーン</Label>
              <Select
                value={formData.milestoneId || "none"}
                onValueChange={(value: string) =>
                  setFormData((prev) => ({ ...prev, milestoneId: value === "none" ? undefined : value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="選択してください" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">なし</SelectItem>
                  {milestones.map((milestone) => (
                    <SelectItem key={milestone.id} value={milestone.id}>
                      {milestone.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dependencies">依存タスク（複数選択可）</Label>
              <MultiSelect
                options={availableDependencies.map(dep => ({
                  value: dep.id,
                  label: dep.name
                }))}
                selected={formData.dependencies || []}
                onChange={(values: string[]) =>
                  setFormData((prev) => ({
                    ...prev,
                    dependencies: values
                  }))
                }
                placeholder="依存タスクを選択"
              />
            </div>
          </>
        )}

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            キャンセル
          </Button>
          <Button type="submit">保存</Button>
        </div>
      </form>
    </div>
  );
} 