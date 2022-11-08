export interface INotificationsModel {
  id: number;
  createdAt: Date;
  deletedAt?: Date;
  iUser: number;
  notificationClient: boolean;
  notificationContact: boolean;
  notificationResume: boolean;
  updatedAt: Date;
}
