export type NotificationType = 'email_confirmation' | 'info' | 'warning' | 'success';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

