import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "../../../../api/api";
import { useState } from "react";
import { Box, Button, Input, useDialog } from "@kamalion/ui";
import { GoChevronLeft, GoChevronRight, GoPlus } from "react-icons/go";
import { LuFolderOpen } from "react-icons/lu";
import { formatInTimeZone } from "date-fns-tz";
import { BsBookmarkFill, BsBookmarkCheckFill } from "react-icons/bs";

import { EntryFormDialog, MonthFormDialog, PayEntryFormDialog } from "../../../../components";
import { MonthEntry } from "../../../../entities/month_entry";

export const Route = createFileRoute("/(authenticated)/_app/months/")({
  component: MonthsPage,
});

function MonthsPage() {
  const { showDialog } = useDialog();
  const [monthPage, setMonthPage] = useState(1);

  const { data: months, isLoading } = useQuery({
    queryKey: ["months", monthPage],
    queryFn: () => api.listMonths(monthPage),
  });

  const { data: entries, isLoading: isLoadingEntries } = useQuery({
    queryKey: ["entries", months],
    queryFn: () =>
      api.searchMonthEntries({
        month_id: months?.items[0].id as number,
        page: 1,
      }),
  });

  const totalMonthPages = months ? Math.ceil(months.total / months.limit) : 0;

  function handleAddMonth() {
    showDialog({
      content: <MonthFormDialog />,
    });
  }

  function handleAddEntry(monthId: number) {
    showDialog({
      content: <EntryFormDialog monthId={monthId} />,
    });
  }

  function handleEditEntry(entry: MonthEntry) {
    showDialog({
      content: <EntryFormDialog monthId={entry.month_id} entry={entry} />,
    });
  }

  function handlePayEntry(entry: MonthEntry) {
    showDialog({
      content: <PayEntryFormDialog monthId={entry.month_id} entry={entry} />,
    });
  }

  if (isLoading || isLoadingEntries || !months) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between">
        <div>
          <Button.Root variant="success" onClick={handleAddMonth}>
            <Button.Icon>
              <GoPlus />
            </Button.Icon>
            <Button.Content>Add Month</Button.Content>
          </Button.Root>
        </div>
      </div>

      {months?.items.length === 0 && (
        <Box.Root role="section">
          <Box.Content>
            <div className="flex flex-col flex-1 items-center justify-center py-40 space-y-5">
              <LuFolderOpen size={100} />
              <div className="text-4xl font-extralight">Nothing found</div>
            </div>
          </Box.Content>
        </Box.Root>
      )}

      {months?.items.map((month) => (
        <>
          <Box.Root role="section">
            <Box.Content>
              <div className="flex h-full">
                <div key={month.id} className="p-2 flex items-center space-x-3 w-full">
                  <div>
                    <Button.Root
                      size="icon"
                      variant="accent"
                      onClick={() => setMonthPage((old) => ++old)}
                      disabled={totalMonthPages === monthPage}
                    >
                      <Button.Icon>
                        <GoChevronLeft />
                      </Button.Icon>
                    </Button.Root>
                  </div>

                  <div className="flex-1 flex space-x-5">
                    <div>
                      <div className="text-muted text-xs">MONTH</div>
                      <div className="font-bold text-2xl">{formatInTimeZone(month.date, "UTC", "MMM yyyy")}</div>
                    </div>

                    <div>
                      <div className="text-muted text-xs">TOTAL</div>
                      <div className="font-bold text-2xl">
                        <Input.Root>
                          <Input.Number
                            type="money"
                            name="total"
                            displayType="text"
                            prefix="R$ "
                            value={entries!.items?.reduce((sum, current) => (sum += current.amount), 0)}
                          />
                        </Input.Root>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Button.Root
                      size="icon"
                      variant="accent"
                      onClick={() => setMonthPage((old) => --old)}
                      disabled={monthPage === 1}
                    >
                      <Button.Icon>
                        <GoChevronRight />
                      </Button.Icon>
                    </Button.Root>
                  </div>
                </div>
              </div>
            </Box.Content>
          </Box.Root>

          <Box.Root role="section">
            <Box.Content className="space-y-3">
              <div className="flex items-center">
                <div className="flex justify-end w-full">
                  <Button.Root variant="accent" onClick={() => handleAddEntry(months.items[0].id!)}>
                    <Button.Icon>
                      <GoPlus />
                    </Button.Icon>
                    <Button.Content>Add Entry</Button.Content>
                  </Button.Root>
                </div>
              </div>

              <table className="table-auto w-full text-sm">
                <thead>
                  <tr className="text-left uppercase">
                    <th className="w-1 p-2" />
                    <th className="w-1 text-right">Amount</th>
                    <th className="p-2 font-semibold color-white">Name</th>
                    <th className="w-1 p-2 font-semibold">Owner</th>
                    <th className="w-1 p-2 font-semibold">Category</th>
                    <th className="w-1 p-2 font-semibold">Origin</th>
                    <th className="w-1 whitespace-nowrap p-2 font-semibold">Due Date</th>
                    <th className="w-1 whitespace-nowrap p-2 font-semibold">Pay Date/Day</th>
                    <th className="w-1 whitespace-nowrap p-2 font-semibold">Paid Date</th>
                    <th className="w-1" />
                  </tr>
                </thead>

                <tbody>
                  {entries?.items?.map((entry) => (
                    <tr key={entry.id} className="transition hover:bg-accent">
                      <td className="p-2 rounded-l-md">
                        {entry.paid_date && <BsBookmarkCheckFill size={24} className={"text-emerald-400"} />}
                        {!entry.paid_date && <BsBookmarkFill size={24} className={"text-cyan-400"} />}
                      </td>
                      <td className="">
                        <Input.Root>
                          <Input.Number
                            type="money"
                            value={entry.amount}
                            name="amount"
                            displayType="text"
                            className="text-end font-semibold "
                          />
                        </Input.Root>
                      </td>
                      <td className="p-2">{entry.name}</td>
                      <td className="p-2">{entry.owner}</td>
                      <td className="p-2">{entry.category?.name}</td>
                      <td className="p-2">{entry.origin?.name}</td>
                      <td className="p-2">{formatInTimeZone(entry.due_date, "UTC", "dd/MM/yyyy")}</td>
                      <td className="p-2">{formatInTimeZone(entry.pay_date, "UTC", "dd/MM/yyyy")}</td>
                      <td className="p-2">
                        {entry.paid_date && formatInTimeZone(entry.paid_date, "UTC", "dd/MM/yyyy")}
                      </td>
                      <td className="p-2 rounded-r-md flex space-x-3">
                        <Button.Root variant="default" size="sm" onClick={() => handleEditEntry(entry)}>
                          <Button.Content>Edit</Button.Content>
                        </Button.Root>

                        <Button.Root variant="success" size="sm" onClick={() => handlePayEntry(entry)}>
                          <Button.Content>Pay</Button.Content>
                        </Button.Root>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box.Content>
          </Box.Root>
        </>
      ))}
    </div>
  );
}
