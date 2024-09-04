import { z } from "zod";
import { MonthEntry } from "../entities/month_entry";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input, useDialog } from "@kamalion/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/api";

const formSchema = z.object({
  date: z.date(),
});

type FormData = z.infer<typeof formSchema>;

type Props = { monthId?: number; entry?: MonthEntry };

export function PayEntryFormDialog({ monthId, entry }: Props) {
  const queryClient = useQueryClient();
  const { closeDialog } = useDialog();

  const form = useForm<FormData>({ resolver: zodResolver(formSchema) });

  const payEntry = useMutation({
    mutationFn: api.payEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["entries", monthId] });
    },
  });

  function handlePay(data: FormData) {
    payEntry.mutate({ id: entry.id, monthId: entry.month_id, date: data.date });

    closeDialog();
  }

  return (
    <FormProvider {...form}>
      <Form.Root onSubmit={form.handleSubmit(handlePay)}>
        <Input.Root>
          <Input.Label>Date</Input.Label>
          <Input.DatePicker {...form.register("date")} />
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
