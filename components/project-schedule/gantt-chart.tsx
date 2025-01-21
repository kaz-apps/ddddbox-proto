'use client'

import { useRef, useEffect } from 'react'
import { Task, Stage } from '@/types/schedule'
import { format, addMonths } from 'date-fns'
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css'

interface GanttChartProps {
  tasks: Task[];
  stages: Stage[];
}

// サンプルデータ
const sampleData = {
  stages: [
    {
      id: 'stage_1',
      title: '実施設計1',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      status: 'not_started'
    },
    {
      id: 'stage_2',
      title: '実施設計2',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      status: 'not_started'
    }
  ],
  tasks: [
    {
      id: 'task_1',
      title: 'タスク1',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      status: 'not_started'
    },
    {
      id: 'task_2',
      title: 'タスク2',
      startDate: '2024-01-01',
      endDate: '2024-01-31',
      status: 'not_started'
    }
  ]
};

function GanttChartContent({ tasks = sampleData.tasks, stages = sampleData.stages }: GanttChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initGantt = async () => {
      try {
        const gantt = (await import('dhtmlx-gantt')).default;

        if (!containerRef.current) return;

        // 基本的な設定
        gantt.config.date_format = '%Y-%m-%d';
        gantt.config.min_column_width = 100;
        gantt.config.grid_width = 520; // 全列の合計
        gantt.config.row_height = 40; // 行の高さを少し増やす

        // グリッド列の設定
        gantt.config.columns = [
          { 
            name: "group_type", 
            label: "グループ", 
            width: 120,
            template: (task) => {
              if (task.type === 'stage') return '設計ステージ';
              if (task.type === 'task') return 'タスク';
              return '';
            }
          },
          { 
            name: "text", 
            label: "名前", 
            width: 200
          },
          { 
            name: "start_date", 
            label: "開始日", 
            align: "center", 
            width: 100,
            template: (task) => {
              if (!task.start_date) return '';
              const date = new Date(task.start_date);
              return format(date, 'yyyy/MM/dd');
            }
          },
          { 
            name: "end_date", 
            label: "終了日", 
            align: "center", 
            width: 100,
            template: (task) => {
              if (!task.end_date) return '';
              const date = new Date(task.end_date);
              return format(date, 'yyyy/MM/dd');
            }
          }
        ];

        // タスクタイプの設定
        gantt.config.types = {
          task: 'task',
          stage: 'stage'
        };

        // グリッドヘッダーのスタイル
        gantt.templates.grid_header_class = (columnName, column) => {
          return 'gantt-header';
        };

        // タスクの行スタイル
        gantt.templates.grid_row_class = (start, end, task) => {
          return task.type === 'stage' ? 'gantt-stage-row' : 'gantt-task-row';
        };

        // タスクバーのスタイル
        gantt.templates.task_class = (start, end, task) => {
          return task.type === 'stage' ? 'gantt-stage-bar' : 'gantt-task-bar';
        };

        // タイムラインのスケール設定
        gantt.config.scale_height = 30;
        gantt.config.subscales = [];
        
        // 日付フォーマットの設定
        gantt.templates.date_grid = (date) => {
          return format(date, 'yyyy/MM/dd');
        };

        // 初期化
        gantt.init(containerRef.current);

        // データの読み込み
        const formattedData = [];

        // ステージの追加
        if (stages?.length > 0) {
          formattedData.push(...stages.map(stage => ({
            id: stage.id,
            text: stage.title,
            start_date: stage.startDate,
            end_date: stage.endDate,
            type: 'stage',
            progress: 0,
            open: true,
            readonly: true
          })));
        }

        // タスクの追加
        if (tasks?.length > 0) {
          formattedData.push(...tasks.map(task => ({
            id: task.id,
            text: task.title,
            start_date: task.startDate,
            end_date: task.endDate,
            progress: task.status === 'completed' ? 1 : task.status === 'in_progress' ? 0.5 : 0,
            type: 'task'
          })));
        }

        gantt.parse({ data: formattedData });

        // カスタムCSSの追加
        const styleElement = document.createElement('style');
        styleElement.textContent = `
          .gantt-header {
            background-color: #f3f4f6;
            font-weight: bold;
            border-bottom: 1px solid #e5e7eb;
            padding: 8px 12px;
          }
          .gantt-stage-row, .gantt-task-row {
            background-color: white;
          }
          .gantt-stage-bar {
            background-color: #94a3b8;
            border-radius: 4px;
            border: 1px solid #64748b;
          }
          .gantt-stage-bar .gantt-task-content {
            color: #1e293b;
            font-weight: bold;
          }
          .gantt-task-bar {
            background-color: #60a5fa;
            border-radius: 4px;
            border: 1px solid #3b82f6;
          }
          .gantt-task-bar .gantt-task-content {
            color: white;
          }
          .gantt_cell {
            border-right: 1px solid #e5e7eb;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            white-space: normal;
            line-height: 1.4;
            overflow: visible;
          }
          .gantt_grid_head_cell {
            border-right: 1px solid #e5e7eb;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            padding: 8px 12px;
          }
          .gantt_grid_data .gantt_cell {
            padding: 8px 12px;
            font-size: 13px;
          }
          .gantt_grid_data .gantt_cell[data-column-name="group_type"] {
            color: #374151;
          }
          .gantt_grid {
            border-right: 1px solid #e5e7eb;
          }
          .gantt_grid_scale {
            font-size: 13px;
            line-height: 1.4;
          }
          .gantt_scale_cell {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          }
        `;
        document.head.appendChild(styleElement);

      } catch (error) {
        console.error('Failed to initialize gantt chart:', error);
      }
    };

    initGantt();

    return () => {
      const element = containerRef.current;
      if (element) {
        while (element.firstChild) {
          element.removeChild(element.firstChild);
        }
      }
    };
  }, [tasks, stages]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '500px' }} />
  );
}

export function GanttChart(props: GanttChartProps) {
  return (
    <div className="w-full h-full">
      <GanttChartContent {...props} />
    </div>
  );
}

export default GanttChart;
