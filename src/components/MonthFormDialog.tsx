import z from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input, useDialog } from "@kamalion/ui";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "../api/api";

const formSchema = z.object({
  month: z.date(),
});

type FormData = z.infer<typeof formSchema>;

export function MonthFormDialog() {
  const { closeDialog } = useDialog();

  const queryClient = useQueryClient();

  const addMonth = useMutation({
    mutationFn: api.createMonth,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["months"] });
      closeDialog();
    },
  });

  const form = useForm<FormData>({ resolver: zodResolver(formSchema) });

  function handleSaveMonth(data: FormData) {
    addMonth.mutate({
      date: data.month,
    });
  }

  return (
    <FormProvider {...form}>
      <Form.Root onSubmit={form.handleSubmit(handleSaveMonth)}>
        <Input.Root>
          <Input.Label>Select a month</Input.Label>
          <Input.DatePicker {...form.register("month")} />
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
