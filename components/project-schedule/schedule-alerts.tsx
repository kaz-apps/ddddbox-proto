import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IconAlertTriangle } from "@tabler/icons-react";

interface ScheduleAlert {
  milestoneId: string;
  milestoneName: string;
  dueDate: Date;
  incompleteTasks: string[];
}

interface ScheduleAlertsProps {
  alerts: ScheduleAlert[];
}

export function ScheduleAlerts({ alerts }: ScheduleAlertsProps) {
  if (alerts.length === 0) return null;

  return (
    <div className="space-y-2">
      {alerts.map((alert) => (
        <Alert key={alert.milestoneId} variant="destructive">
          <IconAlertTriangle className="h-4 w-4" />
          <AlertTitle>マイルストーン期限超過</AlertTitle>
          <AlertDescription>
            マイルストーン「{alert.milestoneName}」({alert.dueDate.toLocaleDateString("ja-JP")})に関連する
            以下のタスクが未完了です：
            <ul className="list-disc list-inside mt-2">
              {alert.incompleteTasks.map((taskName, index) => (
                <li key={index}>{taskName}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      ))}
    </div>
  );
} 