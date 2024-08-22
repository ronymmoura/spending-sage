import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input, useDialog } from "@kamalion/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "../api/api";
import { MonthEntry } from "../entities/month_entry";
import { useEffect } from "react";
import { FixedEntry } from "../entities/fixed_entry";

const formSchema = z.object({
  origin_id: z.coerce.number(),
  category_id: z.coerce.number(),
  name: z.string().min(1, "Required"),
  due_date: z.date(),
  pay_date: z.date().or(z.string().optional()).optional(),
  pay_day: z.coerce.number().optional(),
  amount: z.coerce.number(),
  owner: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

type Props = { monthId?: number; entry?: MonthEntry | FixedEntry; isFixed?: boolean };

export function EntryFormDialog({ monthId, entry, isFixed }: Props) {
  const { closeDialog } = useDialog();

  const queryClient = useQueryClient();

  const addEntry = useMutation({
    mutationFn: api.createEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries"] });
    },
  });

  const addFixedEntry = useMutation({
    mutationFn: api.createFixedEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fixedEntries"] });
    },
  });

  const { data: lists, isLoading } = useQuery({ queryKey: ["lists"], queryFn: api.getLists });

  const form = useForm<FormData>({ resolver: zodResolver(formSchema) });

  useEffect(() => {
    if (entry) {
      form.setValue("name", entry.name);
      form.setValue("due_date", new Date(entry.due_date));
      form.setValue("amount", entry.amount);
      form.setValue("owner", entry.owner);
      form.setValue("category_id", entry.category_id);
      form.setValue("origin_id", entry.origin_id);

      if (isFixed) {
        form.setValue("pay_day", (entry as FixedEntry).pay_day);
      } else {
        form.setValue("pay_date", new Date((entry as MonthEntry).pay_date));
      }
    }
  }, [entry]);

  function handleSaveEntry(data: FormData) {
    if (isFixed) {
      addFixedEntry.mutate({
        name: data.name,
        due_date: data.due_date,
        pay_day: data.pay_day as number,
        amount: data.amount,
        owner: data.owner,
        category_id: data.category_id,
        origin_id: data.origin_id,
      });
    } else {
      addEntry.mutate({
        name: data.name,
        due_date: data.due_date,
        pay_date: data.pay_date as Date,
        amount: data.amount,
        owner: data.owner,
        category_id: data.category_id,
        origin_id: data.origin_id,
        month_id: monthId,
      });
    }

    closeDialog();
  }

  if (isLoading) return <div>Loading...</div>;

  return (
    <FormProvider {...form}>
      <Form.Root onSubmit={form.handleSubmit(handleSaveEntry)}>
        <Input.Root>
          <Input.Label>Name</Input.Label>
          <Input.Text {...form.register("name")} />
        </Input.Root>

        <Input.Root>
          <Input.Label>Due Date</Input.Label>
          <Input.DatePicker {...form.register("due_date")} />
        </Input.Root>

        {isFixed && (
          <Input.Root>
            <Input.Label>Pay Day</Input.Label>
            <Input.Number {...form.register("pay_day")} />
          </Input.Root>
        )}

        {!isFixed && (
          <Input.Root>
            <Input.Label>Pay Date</Input.Label>
            <Input.DatePicker {...form.register("pay_date")} />
          </Input.Root>
        )}

        <Input.Root>
          <Input.Label>Amount</Input.Label>
          <Input.Number type="money" {...form.register("amount")} />
        </Input.Root>

        <Input.Root>
          <Input.Label>Owner</Input.Label>
          <Input.Text {...form.register("owner")} />
        </Input.Root>

        <Input.Root>
          <Input.Label>Origin</Input.Label>
          <Input.Select {...form.register("origin_id")}>
            {lists?.origins.map((origin) => (
              <Input.SelectItem key={origin.id} value={origin.id.toString()}>
                {origin.name}
              </Input.SelectItem>
            ))}
          </Input.Select>
        </Input.Root>

        <Input.Root>
          <Input.Label>Category</Input.Label>
          <Input.Select {...form.register("category_id")}>
            {lists?.categories.map((category) => (
              <Input.SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </Input.SelectItem>
            ))}
          </Input.Select>
        </Input.Root>

        <Form.Error />

        <div>
          <Button.Root variant="accent" type="submit">
            <Button.Content>Save</Button.Content>
          </Button.Root>
        </div>
      </Form.Root>
    </FormProvider>
  );
}
