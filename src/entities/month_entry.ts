import { Category } from "./category";
import { Origin } from "./origin";

export class MonthEntry {
  id?: number;
  name: string;
  due_date: Date;
  pay_date: Date;
  paid_date?: Date;
  amount: number;
  owner: string | undefined;
  origin_id: number;
  category_id: number;
  month_id: number;
  category?: Category;
  origin?: Origin;
}
