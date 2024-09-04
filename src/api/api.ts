import axios from "axios";
import { User } from "../entities/user";
import { Month } from "../entities/month";
import { Paginated } from "../entities/paginated";
import { Origin } from "../entities/origin";
import { Category } from "../entities/category";
import { MonthEntry } from "../entities/month_entry";
import { FixedEntry } from "../entities/fixed_entry";
import { MonthlyExpectedPayment } from "../entities/monthly_expected_payment";

const API_URL = import.meta.env.VITE_API_URL;

const client = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = {
  getUser: () => client.get<User>("/user").then((data) => data.data),

  getLists: () => client.get<{ origins: Origin[]; categories: Category[] }>("/lists").then((data) => data.data),

  createMonth: (month: Month) => client.post<Month>(`/months`, month).then((data) => data.data),
  listMonths: (page: number) => client.get<Paginated<Month>>(`/months?page=${page}`).then((data) => data.data),

  getEntry: (monthId: number, entryId: number) =>
    client.get<MonthEntry>(`/months/${monthId}/entries/${entryId}`).then((data) => data.data),
  createEntry: (entry: MonthEntry) =>
    client.post<MonthEntry>(`/months/${entry.month_id}/entries`, entry).then((data) => data.data),
  payEntry: ({ id, monthId, date }: { id: number; monthId: number; date: Date }) =>
    client.patch<MonthEntry>(`/months/${monthId}/entries/${id}/pay`, { date }).then((data) => data.data),
  searchMonthEntries: (params: {
    page: number;
    month_id: number;
    category_id?: number;
    origin_id?: number;
    owner?: string;
  }) =>
    client
      .get<Paginated<MonthEntry>>(`/months/${params.month_id}/entries`, {
        params: {
          page: params.page,
          category_id: params.category_id,
          origin_id: params.origin_id,
          owner: params.owner,
        },
      })
      .then((data) => data.data),

  createFixedEntry: (entry: FixedEntry) => client.post<FixedEntry>(`/fixedEntries`, entry).then((data) => data.data),
  searchFixedEntries: (params: { page: number; category_id?: number; origin_id?: number; owner?: string }) =>
    client
      .get<Paginated<FixedEntry>>(`/fixedEntries`, {
        params: {
          page: params.page,
          category_id: params.category_id,
          origin_id: params.origin_id,
          owner: params.owner,
        },
      })
      .then((data) => data.data),

  listMonthlyExpectedPayments: () =>
    client.get<Paginated<MonthlyExpectedPayment>>(`/monthlyExpectedPayments`).then((data) => data.data),
  createMonthlyExpectedPayment: (ep: MonthlyExpectedPayment) => {
    console.log({ ep });
    client.post<MonthlyExpectedPayment>(`/monthlyExpectedPayments`, ep).then((data) => data.data);
  },
};
