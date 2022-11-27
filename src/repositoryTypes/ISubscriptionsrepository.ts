export default interface ISubscriptionsRepository {
  createSubscription(userId: number, categoryId: number, isSpendingSubscription: boolean): Promise<void>;
  deleteSubscription(userId: number, subscriptionId: number): Promise<void>;
}
