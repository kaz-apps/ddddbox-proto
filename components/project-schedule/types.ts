// DHTMLXガントチャートの型定義
export interface GanttTask {
  id: string;
  text: string;
  start_date: string | Date;
  end_date: string | Date;
  progress: number;
  type?: string;
  readonly?: boolean;
  open?: boolean;
  description?: string;
  status?: "not_started" | "in_progress" | "completed";
}
