export default interface ISubscriptionsRepository {
  createSubscription(userId: number, categoryId: number, isSpendingSubscription: boolean): Promise<void>;
  deleteAlertSubscriptions(userId: number): Promise<void>;
  deleteNotificationSubscriptions(userId: number): Promise<void>;
}
