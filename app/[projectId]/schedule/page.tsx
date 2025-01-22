'use client';

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { GanttChart } from '@/components/project-schedule/gantt-chart'
import { Task, Stage } from '@/types/schedule'
import { useToast } from '@/components/ui/use-toast'
import { TaskForm } from '@/components/project-schedule/task-form'
import { StageForm } from '@/components/project-schedule/stage-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

// サンプルデータ
const sampleData = {
  stages: [
    {
      id: "stage_1",
      title: "基本設計1",
      startDate: "2025-01-01",
      endDate: "2025-02-28",
      color: "#94a3b8",
      layer: 0,
    },
    {
      id: "stage_2",
      title: "実施設計1",
      startDate: "2025-02-01",
      endDate: "2025-03-30",
      color: "#94a3b8",
      layer: 0,
    },
    {
      id: "stage_3",
      title: "実施設計2",
      startDate: "2025-03-01",
      endDate: "2025-04-30",
      color: "#94a3b8",
      layer: 0,
    },
  ] as Stage[],
  tasks: [
    {
      id: "task_1",
      title: "基本設計書作成",
      startDate: "2025-01-15",
      endDate: "2025-02-15",
      status: "not_started" as const,
    },
    {
      id: "task_2",
      title: "構造計算書作成",
      startDate: "2025-02-01",
      endDate: "2025-03-15",
      status: "not_started" as const,
    },
    {
      id: "task_3",
      title: "確認申請準備",
      startDate: "2025-03-16",
      endDate: "2025-04-15",
      status: "not_started" as const,
    },
  ] as Task[],
};

export default function SchedulePage() {
  const { toast } = useToast()
  const [tasks, setTasks] = useState<Task[]>(sampleData.tasks)
  const [stages, setStages] = useState<Stage[]>(sampleData.stages)
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined)
  const [selectedStage, setSelectedStage] = useState<Stage | undefined>(undefined)
  const [parentTask, setParentTask] = useState<Task | undefined>(undefined)
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
      toast({
        title: 'タスクを更新しました',
        description: `${taskData.title}を更新しました`,
      })
    } else {
      // 新規タスク作成
      const newTask: Task = {
        id: Math.random().toString(36).substr(2, 9),
        ...taskData,
      }
      setTasks(prev => [...prev, newTask])
      toast({
        title: 'タスクを作成しました',
        description: `${taskData.title}を作成しました`,
      })
    }
    setIsTaskDialogOpen(false)
    setSelectedTask(undefined)
    setParentTask(undefined)
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
        ...stageData,
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

  const handleTaskEdit = (task: Task) => {
    setSelectedTask(task)
    setIsTaskDialogOpen(true)
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setIsTaskDialogOpen(true)
  }

  const handleTaskChange = (task: Task, start: Date, end: Date) => {
    setTasks(prev => prev.map(t =>
      t.id === task.id
        ? { ...t, startDate: start, endDate: end }
        : t
    ))
  }

  const handleStageClick = (stage: Stage) => {
    setSelectedStage(stage)
    setIsStageDialogOpen(true)
  }

  const handleStageChange = (stage: Stage, start: Date, end: Date) => {
    setStages(prev => prev.map(s =>
      s.id === stage.id
        ? { ...s, startDate: start, endDate: end }
        : s
    ))
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">プロジェクトスケジュール</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsStageDialogOpen(true)}>
            設計ステージを作成
          </Button>
          <Button onClick={() => setIsTaskDialogOpen(true)}>
            タスクを作成
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <GanttChart
          tasks={tasks}
          stages={stages}
          onTaskEdit={handleTaskEdit}
          onTaskClick={handleTaskClick}
          onTaskChange={handleTaskChange}
          onStageClick={handleStageClick}
          onStageChange={handleStageChange}
        />
      </div>

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
              {selectedStage ? 'ステージを編集' : 'ステージを作成'}
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
