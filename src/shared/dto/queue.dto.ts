export enum NotificationType {
  VERIFY_ACCOUNT = 'verify-account',
  OTP = 'otp',
}

export class EmailNotificationDTO {
  email: string;
  firstName: string;
  lastName: string;
  token?: string;
  otp?: string;
  userId?: string;
  type: NotificationType;
}
