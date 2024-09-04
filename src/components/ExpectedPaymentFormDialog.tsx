import { Button, Form, Input, useDialog } from "@kamalion/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { api } from "../api/api";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MonthlyExpectedPayment } from "../entities/monthly_expected_payment";

const formSchema = z.object({
  name: z.string().min(1, "Required"),
  amount: z.coerce.number(),
  day: z.coerce.number(),
});

type FormData = z.infer<typeof formSchema>;

export function ExpectedPaymentFormDialog() {
  const { closeDialog } = useDialog();

  const queryClient = useQueryClient();

  const add = useMutation({
    mutationFn: async (ep: MonthlyExpectedPayment) => {
      console.log({ ep });
      await api.createMonthlyExpectedPayment(ep);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expectedPayments"] });
      closeDialog();
    },
  });

  const form = useForm<FormData>({ resolver: zodResolver(formSchema) });

  function handleSave(data: FormData) {
    console.log({ data });
    add.mutate({
      name: data.name,
      day: data.day,
      amount: data.amount,
    });
  }

  return (
    <FormProvider {...form}>
      <Form.Root onSubmit={form.handleSubmit(handleSave)}>
        <Input.Root>
          <Input.Label>Name</Input.Label>
          <Input.Text {...form.register("name")} />
        </Input.Root>

        <Input.Root>
          <Input.Label>Day</Input.Label>
          <Input.Number {...form.register("day")} />
        </Input.Root>

        <Input.Root>
          <Input.Label>Amount</Input.Label>
          <Input.Number type="money" {...form.register("amount")} />
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
