'use client'

import { useState } from 'react'
import { Task, Stage } from '@/types/schedule'
import { GanttChart } from '@/components/project-schedule/gantt-chart'
import { TaskForm } from '@/components/project-schedule/task-form'
import { StageForm } from '@/components/project-schedule/stage-form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { dummyTasks } from '@/data/dummy-schedule'

export default function SchedulePage() {
  const { toast } = useToast()
  const [tasks, setTasks] = useState<Task[]>(dummyTasks)
  const [stages, setStages] = useState<Stage[]>([])
  const [selectedTask, setSelectedTask] = useState<Task>()
  const [selectedStage, setSelectedStage] = useState<Stage>()
  const [parentTask, setParentTask] = useState<Task>()
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [isStageDialogOpen, setIsStageDialogOpen] = useState(false)

  const handleTaskSubmit = (taskData: Omit<Task, 'id'>) => {
    if (selectedTask) {
      // 既存タスクの編集
      setTasks(prev => prev.map(task =>
        task.id === selectedTask.id
          ? { ...task, ...taskData }
          : task
      ))
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
    } else {
      // 新規ステージ作成
      const newStage: Stage = {
        id: Math.random().toString(36).substr(2, 9),
        ...stageData
      }
      setStages(prev => [...prev, newStage])
    }

    setIsStageDialogOpen(false)
    setSelectedStage(undefined)
    toast({
      title: selectedStage ? 'ステージを更新しました' : 'ステージを作成しました',
      description: `${stageData.title}を${selectedStage ? '更新' : '作成'}しました`,
    })
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setIsTaskDialogOpen(true)
  }

  const handleStageClick = (stage: Stage) => {
    setSelectedStage(stage)
    setIsStageDialogOpen(true)
  }

  const handleTaskChange = (task: Task, start: Date, end: Date) => {
    setTasks(prev => prev.map(t =>
      t.id === task.id
        ? { ...t, startDate: start, endDate: end }
        : t
    ))
    toast({
      title: 'タスクを更新しました',
      description: `${task.title}のスケジュールを変更しました`,
    })
  }

  const handleStageChange = (stage: Stage, start: Date, end: Date) => {
    setStages(prev => prev.map(s =>
      s.id === stage.id
        ? { ...s, startDate: start, endDate: end }
        : s
    ))
    toast({
      title: 'ステージを更新しました',
      description: `${stage.title}のスケジュールを変更しました`,
    })
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">プロジェクトスケジュール</h1>
        <div className="space-x-2">
          <Button onClick={() => setIsStageDialogOpen(true)}>
            設計ステージを作成
          </Button>
          <Button onClick={() => setIsTaskDialogOpen(true)}>
            タスクを作成
          </Button>
        </div>
      </div>

      <GanttChart
        tasks={tasks}
        stages={stages}
        onTaskClick={handleTaskClick}
        onTaskChange={handleTaskChange}
        onStageClick={handleStageClick}
        onStageChange={handleStageChange}
      />

      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedTask ? 'タスクを編集' : 'タスクを作成'}
            </DialogTitle>
          </DialogHeader>
          <TaskForm
            task={selectedTask}
            availableTasks={tasks}
            onSubmit={handleTaskSubmit}
            onCancel={() => {
              setIsTaskDialogOpen(false)
              setSelectedTask(undefined)
              setParentTask(undefined)
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isStageDialogOpen} onOpenChange={setIsStageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedStage ? '設計ステージを編集' : '設計ステージを作成'}
            </DialogTitle>
          </DialogHeader>
          <StageForm
            stage={selectedStage}
            onSubmit={handleStageSubmit}
            onCancel={() => {
              setIsStageDialogOpen(false)
              setSelectedStage(undefined)
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
