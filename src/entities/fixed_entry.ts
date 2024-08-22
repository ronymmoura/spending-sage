import { Category } from "./category";
import { Origin } from "./origin";

export class FixedEntry {
  id?: number;
  name: string;
  due_date: Date;
  pay_day: number;
  paid_date?: Date;
  amount: number;
  owner: string | undefined;
  origin_id: number;
  category_id: number;
  category?: Category;
  origin?: Origin;
}
