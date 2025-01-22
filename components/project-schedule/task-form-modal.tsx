'use client';

import { format, parseISO } from "date-fns";
import { GanttTask } from "@/types/schedule";
import { FormEvent, useRef } from "react";

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: GanttTask;
  onSubmit: (task: GanttTask) => void;
  availableTasks?: GanttTask[];
}

export function TaskFormModal({ isOpen, onClose, task, onSubmit, availableTasks = [] }: TaskFormModalProps) {
  if (!isOpen) return null;

  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const parentValue = formData.get("parent") as string;
    const updatedTask: GanttTask = {
      id: task?.id || Math.random().toString(36).substr(2, 9),
      text: formData.get("title") as string,
      description: formData.get("description") as string,
      start_date: formData.get("start_date") as string,
      end_date: formData.get("end_date") as string,
      status: formData.get("status") as "not_started" | "in_progress" | "completed",
      progress: task?.progress || 0,
      type: task?.type || "task",
      parent: parentValue || "0",
      color: task?.color,
      layer: task?.layer,
      open: task?.open ?? true,
      readonly: task?.readonly ?? false,
      parents: task?.parents || [],
    };

    onSubmit(updatedTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {task ? "タスクを編集" : "タスクを作成"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="text-2xl">×</span>
          </button>
        </div>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2">タイトル</label>
            <input
              type="text"
              name="title"
              className="w-full px-3 py-2 border rounded-md"
              defaultValue={task?.text || ""}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-2">説明</label>
            <textarea
              name="description"
              className="w-full px-3 py-2 border rounded-md"
              rows={4}
              defaultValue={task?.description || ""}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">開始日</label>
              <input
                type="date"
                name="start_date"
                className="w-full px-3 py-2 border rounded-md"
                defaultValue={task?.start_date ? format(parseISO(task.start_date), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")}
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-2">終了日</label>
              <input
                type="date"
                name="end_date"
                className="w-full px-3 py-2 border rounded-md"
                defaultValue={task?.end_date ? format(parseISO(task.end_date), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm mb-2">ステータス</label>
            <select
              name="status"
              className="w-full px-3 py-2 border rounded-md"
              defaultValue={task?.status || "not_started"}
              required
            >
              <option value="not_started">未着手</option>
              <option value="in_progress">進行中</option>
              <option value="completed">完了</option>
            </select>
          </div>
          <div>
            <label className="block text-sm mb-2">依存タスク</label>
            <select
              name="parent"
              className="w-full px-3 py-2 border rounded-md"
              defaultValue={task?.parent || ""}
            >
              <option value="">なし</option>
              {availableTasks
                .filter(t => t.id !== task?.id)
                .map(t => (
                  <option key={t.id} value={t.id}>
                    {t.text}
                  </option>
                ))}
            </select>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              {task ? "更新" : "作成"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
