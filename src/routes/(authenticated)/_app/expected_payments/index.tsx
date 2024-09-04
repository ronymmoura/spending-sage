import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { GoPlus } from "react-icons/go";
import { Box, Button, Input, useDialog } from "@kamalion/ui";
import { api } from "../../../../api/api";
import { MonthlyExpectedPayment } from "../../../../entities/monthly_expected_payment";
import { ExpectedPaymentFormDialog } from "../../../../components";

export const Route = createFileRoute("/(authenticated)/_app/expected_payments/")({
  component: ExpectedPaymentsPage,
});

function ExpectedPaymentsPage() {
  const { showDialog } = useDialog();

  const { data: expectedPayments, isLoading } = useQuery({
    queryKey: ["expectedPayments"],
    queryFn: api.listMonthlyExpectedPayments,
  });

  function handleAdd() {
    showDialog({
      content: <ExpectedPaymentFormDialog />,
    });
  }

  function handleEdit(ep: MonthlyExpectedPayment) {}

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center">
        <div className="flex w-full">
          <Button.Root variant="accent" onClick={handleAdd}>
            <Button.Icon>
              <GoPlus />
            </Button.Icon>
            <Button.Content>Add Expected Payment</Button.Content>
          </Button.Root>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5">
        {expectedPayments?.items?.map((entry) => (
          <div key={entry.id} className=" transition cursor-pointer hover:bg-accent" onClick={() => handleEdit(entry)}>
            <div>
              <Input.Root>
                <Input.Label>Amount</Input.Label>
                <Input.Number type="money" value={entry.amount} name="amount" displayType="text" />
              </Input.Root>
            </div>
            <div className="">
              <div>Name</div>
              <div>{entry.name}</div>
            </div>
            <div className="">Day {entry.day}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
