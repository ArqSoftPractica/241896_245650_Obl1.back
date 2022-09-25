export interface AddCategoryResponse {
  id: number;
  name: string;
  description: string;
  monthlySpendingLimit: number;
  imageURL: string;
  createdAt: Date;
}
