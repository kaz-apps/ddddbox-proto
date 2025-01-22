'use client'

import { useState } from 'react'
import { Task } from '@/types/schedule'
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

interface TaskFormProps {
  task?: Task | undefined;
  availableTasks?: Task[];
  onSubmit: (taskData: Omit<Task, 'id'>) => void;
  onCancel: () => void;
}

export function TaskForm({
  task,
  availableTasks,
  onSubmit,
  onCancel
}: TaskFormProps) {
  // フォームデータの型を定義
  type TaskStatus = 'not_started' | 'in_progress' | 'completed'

  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    startDate: task?.startDate || new Date().toISOString().split('T')[0],
    endDate: task?.endDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: (task?.status || 'not_started') as TaskStatus,
    dependencies: task?.dependencies || []
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // デバッグ用ログ
    console.log('Form data before submit:', formData)
    
    const taskData = {
      title: formData.title,
      description: formData.description,
      startDate: new Date(formData.startDate + 'T00:00:00'),
      endDate: new Date(formData.endDate + 'T00:00:00'),
      status: formData.status,
      dependencies: formData.dependencies,
      parentId: task?.parentId,
      children: task?.children || [],
      isExpanded: task?.isExpanded || false
    }
    
    // デバッグ用ログ
    console.log('Task data after processing:', taskData)
    
    onSubmit(taskData)
  }

  return (
    <div className="space-y-4 p-4">
      {task && task.parentId && (
        <div className="text-sm text-gray-500">
          親タスク: {task.parentId}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="title">タイトル</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">説明</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate">開始日</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="endDate">終了日</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="status">ステータス</Label>
          <Select
            value={formData.status}
            onValueChange={(value: TaskStatus) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="ステータスを選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not_started">未着手</SelectItem>
              <SelectItem value="in_progress">進行中</SelectItem>
              <SelectItem value="completed">完了</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {availableTasks && availableTasks.length > 0 && (
          <div>
            <Label>依存タスク</Label>
            <div className="space-y-2">
              {availableTasks.map((availableTask) => (
                <div key={availableTask.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`dependency-${availableTask.id}`}
                    checked={formData.dependencies.includes(availableTask.id)}
                    onCheckedChange={(checked) => {
                      const newDependencies = checked
                        ? [...formData.dependencies, availableTask.id]
                        : formData.dependencies.filter(id => id !== availableTask.id)
                      setFormData({ ...formData, dependencies: newDependencies })
                    }}
                  />
                  <Label htmlFor={`dependency-${availableTask.id}`}>
                    {availableTask.title}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            キャンセル
          </Button>
          <Button type="submit">
            {task ? '更新' : '作成'}
          </Button>
        </div>
      </form>
    </div>
  )
}
