'use client'

import { useState } from 'react'
import { GanttChart } from '@/components/project-schedule/gantt-chart'
import { TaskForm } from '@/components/project-schedule/task-form'
import { StageForm } from '@/components/project-schedule/stage-form'
import { dummyTasks } from '@/data/dummy-schedule'
import { Task, Stage } from '@/types/schedule'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { IconPlus } from '@tabler/icons-react'

export default function SchedulePage({ params }: { params: { projectId: string } }) {
  const [tasks, setTasks] = useState<Task[]>(dummyTasks)
  const [stages, setStages] = useState<Stage[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined)
  const [selectedStage, setSelectedStage] = useState<Stage | undefined>(undefined)
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [isStageDialogOpen, setIsStageDialogOpen] = useState(false)
  const [parentTask, setParentTask] = useState<Task | undefined>(undefined)
  const { toast } = useToast()

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setParentTask(undefined)
    setIsTaskDialogOpen(true)
  }

  const handleStageClick = (stage: Stage) => {
    setSelectedStage(stage)
    setIsStageDialogOpen(true)
  }

  const handleAddSubTask = (parent: Task) => {
    setSelectedTask(undefined)
    setParentTask(parent)
    setIsTaskDialogOpen(true)
  }

  const handleTaskSubmit = (taskData: Omit<Task, 'id'>) => {
    // デバッグ用ログ
    console.log('Submitting task:', taskData)

    if (selectedTask) {
      // 既存タスクの編集
      setTasks(prev => {
        const updatedTasks = prev.map(task =>
          task.id === selectedTask.id
            ? { ...task, ...taskData }
            : task
        )
        return updatedTasks
      })
    } else {
      // 新規タスク作成
      const newTask: Task = {
        id: Math.random().toString(36).substr(2, 9),
        ...taskData,
        parentId: parentTask?.id
      }

      if (parentTask) {
        // サブタスクとして追加
        setTasks(prev => {
          const updatedTasks = prev.map(task =>
            task.id === parentTask.id
              ? {
                  ...task,
                  children: [...(task.children || []), newTask],
                  isExpanded: true
                }
              : task
          )
          return [...updatedTasks, newTask]
        })
      } else {
        // トップレベルのタスクとして追加
        setTasks(prev => [...prev, newTask])
      }
    }

    setIsTaskDialogOpen(false)
    setSelectedTask(undefined)
    setParentTask(undefined)
    toast({
      title: selectedTask ? 'タスクを更新しました' : 'タスクを作成しました',
      description: `${taskData.title}を${selectedTask ? '更新' : '作成'}しました`,
    })
  }

  const handleStageSubmit = (stageData: Omit<Stage, 'id'>) => {
    if (selectedStage) {
      // 既存ステージの編集
      setStages(prev => prev.map(stage =>
        stage.id === selectedStage.id
          ? { ...stage, ...stageData }
          : stage
      ))
      toast({
        title: 'ステージを更新しました',
        description: `${stageData.title}を更新しました`,
      })
    } else {
      // 新規ステージ作成
      const newStage: Stage = {
        id: Math.random().toString(36).substr(2, 9),
        ...stageData
      }
      setStages(prev => [...prev, newStage])
      toast({
        title: 'ステージを作成しました',
        description: `${stageData.title}を作成しました`,
      })
    }
    setIsStageDialogOpen(false)
    setSelectedStage(undefined)
  }

  const handleTaskDragEnd = (task: Task, newStartDate: Date, newEndDate: Date) => {
    setTasks(prev => prev.map(t =>
      t.id === task.id
        ? { ...t, startDate: newStartDate, endDate: newEndDate }
        : t
    ))

    toast({
      title: 'スケジュールを更新しました',
      description: `${task.title}の期間を変更しました`,
    })
  }

  const handleStageDragEnd = (stage: Stage, newStartDate: Date, newEndDate: Date) => {
    setStages(prev => prev.map(s =>
      s.id === stage.id
        ? { ...s, startDate: newStartDate, endDate: newEndDate }
        : s
    ))

    toast({
      title: 'ステージを更新しました',
      description: `${stage.title}の期間を変更しました`,
    })
  }

  const handleToggleExpand = (task: Task) => {
    setTasks(prev => {
      const updateTask = (tasks: Task[]): Task[] => {
        return tasks.map(t => {
          if (t.id === task.id) {
            return { ...t, isExpanded: !t.isExpanded }
          }
          if (t.children) {
            return { ...t, children: updateTask(t.children) }
          }
          return t
        })
      }
      return updateTask(prev)
    })
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-2xl font-bold">スケジュール</h1>
        <div className="flex gap-2">
          <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setSelectedTask(undefined)
                setParentTask(undefined)
              }}>
                <IconPlus className="w-4 h-4 mr-2" />
                タスクを追加
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedTask ? 'タスクを編集' : 'タスクを追加'}
                </DialogTitle>
              </DialogHeader>
              <TaskForm
                task={selectedTask}
                onSubmit={handleTaskSubmit}
                onCancel={() => setIsTaskDialogOpen(false)}
                availableTasks={tasks.filter(t => t.id !== selectedTask?.id)}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={isStageDialogOpen} onOpenChange={setIsStageDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedStage(undefined)
                }}
              >
                <IconPlus className="w-4 h-4 mr-2" />
                設計ステージを追加
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedStage ? '設計ステージを編集' : '設計ステージを追加'}
                </DialogTitle>
              </DialogHeader>
              <StageForm
                stage={selectedStage}
                onSubmit={handleStageSubmit}
                onCancel={() => setIsStageDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <GanttChart
          tasks={tasks}
          onTaskClick={handleTaskClick}
          onTaskChange={handleTaskDragEnd}
        />
      </div>
    </div>
  )
}
