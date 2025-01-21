import { Task, MilestoneAlert, ScheduleShare } from '@/types/schedule'

export const dummyTasks: Task[] = [
  {
    id: '1',
    title: '基本設計',
    description: 'プロジェクトの基本設計フェーズ',
    startDate: new Date('2025-02-01'),
    endDate: new Date('2025-02-15'),
    isMilestone: false,
    status: 'completed'
  },
  {
    id: '2',
    title: '実施設計',
    description: '詳細な実施設計の作成',
    startDate: new Date('2025-02-16'),
    endDate: new Date('2025-03-15'),
    isMilestone: false,
    status: 'in_progress',
    dependencies: ['1']
  },
  {
    id: '3',
    title: '申請書類提出',
    description: '建築確認申請書類の提出',
    startDate: new Date('2025-03-20'),
    endDate: new Date('2025-03-20'),
    isMilestone: true,
    status: 'not_started',
    dependencies: ['2']
  }
]

export const dummyMilestoneAlerts: MilestoneAlert[] = [
  {
    id: '1',
    taskId: '3',
    daysBefore: 7,
    notificationSent: false
  }
]

export const dummyScheduleShares: ScheduleShare[] = [
  {
    id: '1',
    token: 'share-token-123',
    expiresAt: new Date('2025-04-01')
  }
]
