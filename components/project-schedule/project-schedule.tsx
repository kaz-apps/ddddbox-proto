'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { format, addDays, differenceInDays } from 'date-fns'
import { ja } from 'date-fns/locale'
import { IconGripVertical } from '@tabler/icons-react'

interface Task {
  id: number
  title: string
  start: Date
  end: Date
  milestone?: boolean
  dependencies?: number[]
}

export function ProjectSchedule({ projectId }: { projectId: string }) {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: '基本設計',
      start: new Date('2025-02-01'),
      end: new Date('2025-02-14'),
    },
    {
      id: 2,
      title: '実施設計',
      start: new Date('2025-02-15'),
      end: new Date('2025-03-14'),
      dependencies: [1],
    },
    {
      id: 3,
      title: '確認申請',
      start: new Date('2025-03-15'),
      end: new Date('2025-03-15'),
      dependencies: [2],
      milestone: true,
    },
  ])

  const handleTaskChange = (task: Task) => {
    setTasks(prevTasks => {
      const newTasks = prevTasks.map(t => t.id === task.id ? task : t)
      toast({
        title: 'タスクが更新されました',
        description: `${task.title}のスケジュールが変更されました`,
      })
      return newTasks
    })
  }

  const addTask = (milestone: boolean = false) => {
    const newTask: Task = {
      id: Math.max(...tasks.map(t => t.id)) + 1,
      title: milestone ? '新規マイルストーン' : '新規タスク',
      start: new Date(),
      end: milestone ? new Date() : addDays(new Date(), 7),
      milestone,
    }
    setTasks([...tasks, newTask])
  }

  // 全タスクの期間を含む開始日と終了日を計算
  const startDate = new Date(Math.min(...tasks.map(t => t.start.getTime())))
  const endDate = new Date(Math.max(...tasks.map(t => t.end.getTime())))
  const totalDays = differenceInDays(endDate, startDate) + 1

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button onClick={() => addTask(false)}>
          タスクを追加
        </Button>
        <Button onClick={() => addTask(true)}>
          マイルストーンを追加
        </Button>
      </div>
      <div className="border rounded-lg p-4 overflow-x-auto">
        <div className="min-w-[800px]">
          {/* ヘッダー（日付） */}
          <div className="flex border-b">
            <div className="w-48 flex-shrink-0" />
            <div className="flex-1 flex">
              {Array.from({ length: totalDays }).map((_, i) => {
                const date = addDays(startDate, i)
                return (
                  <div
                    key={i}
                    className="w-8 text-center text-sm border-l"
                    title={format(date, 'yyyy/MM/dd')}
                  >
                    {format(date, 'd')}
                  </div>
                )
              })}
            </div>
          </div>
          {/* タスク */}
          {tasks.map(task => {
            const offset = differenceInDays(task.start, startDate)
            const width = differenceInDays(task.end, task.start) + 1
            return (
              <div key={task.id} className="flex items-center border-b hover:bg-gray-50">
                <div className="w-48 p-2 flex-shrink-0 flex items-center gap-2">
                  <IconGripVertical className="text-gray-400" />
                  <span>{task.title}</span>
                </div>
                <div className="flex-1 relative h-8">
                  <div
                    className={`absolute h-6 top-1 rounded ${
                      task.milestone
                        ? 'w-6 h-6 bg-red-500 rotate-45'
                        : 'bg-blue-500'
                    }`}
                    style={{
                      left: `${offset * 2}rem`,
                      width: task.milestone ? '1.5rem' : `${width * 2}rem`,
                    }}
                    title={`${format(task.start, 'yyyy/MM/dd')} - ${format(
                      task.end,
                      'yyyy/MM/dd'
                    )}`}
                  />
                  {/* 依存関係の矢印 */}
                  {task.dependencies?.map(depId => {
                    const dep = tasks.find(t => t.id === depId)
                    if (!dep) return null
                    return (
                      <div
                        key={`${task.id}-${depId}`}
                        className="absolute h-0.5 bg-gray-300"
                        style={{
                          left: `${(differenceInDays(dep.end, startDate) + 1) * 2}rem`,
                          width: `${(offset - differenceInDays(dep.end, startDate) - 1) * 2}rem`,
                          top: '0.875rem',
                        }}
                      />
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
