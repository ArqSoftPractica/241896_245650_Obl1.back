
export default interface ISubscriptionsRepository {
  createSubscription(userId: number, categoryId: number): Promise<void>;
  deleteSubscription(userId: number, subscriptionId: number): Promise<void>;
}
