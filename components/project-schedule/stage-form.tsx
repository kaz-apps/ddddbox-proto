'use client'

import { useState } from 'react'
import { Stage } from '@/types/schedule'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface StageFormProps {
  stage?: Stage | undefined;
  onSubmit: (stageData: Omit<Stage, 'id'>) => void;
  onCancel: () => void;
}

export function StageForm({ stage, onSubmit, onCancel }: StageFormProps) {
  // 日付を文字列に変換する関数
  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return ''
    const d = date instanceof Date ? date : new Date(date)
    return d.toISOString().split('T')[0]
  }

  const [formData, setFormData] = useState({
    title: stage?.title || '',
    startDate: formatDate(stage?.startDate),
    endDate: formatDate(stage?.endDate),
    color: stage?.color || '#E5E7EB',
    layer: stage?.layer ?? 0,
    status: stage?.status || 'not_started',
    order: stage?.order ?? 0
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      name: formData.title,
      title: formData.title,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      color: formData.color,
      layer: formData.layer,
      status: formData.status,
      order: formData.order
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <Label htmlFor="title">設計ステージ名</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
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
        <Label htmlFor="color">ステージの色</Label>
        <div className="flex items-center space-x-2">
          <Input
            id="color"
            type="color"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            className="w-20 h-8 p-1"
          />
          <span className="text-sm text-gray-500">
            ステージの背景色を選択してください
          </span>
        </div>
      </div>

      <div>
        <Label htmlFor="layer">レイヤー</Label>
        <Select
          value={formData.layer.toString()}
          onValueChange={(value) => setFormData({ ...formData, layer: parseInt(value) })}
        >
          <SelectTrigger>
            <SelectValue placeholder="レイヤーを選択" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">レイヤー 1</SelectItem>
            <SelectItem value="1">レイヤー 2</SelectItem>
            <SelectItem value="2">レイヤー 3</SelectItem>
            <SelectItem value="3">レイヤー 4</SelectItem>
            <SelectItem value="4">レイヤー 5</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          キャンセル
        </Button>
        <Button type="submit">
          {stage ? '更新' : '作成'}
        </Button>
      </div>
    </form>
  )
}
