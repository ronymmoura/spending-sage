import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "../../../../api/api";
import { BsBookmarkStarFill } from "react-icons/bs";
import { GoPlus } from "react-icons/go";
import { Box, Button, cn, Input, useDialog } from "@kamalion/ui";
import { formatInTimeZone } from "date-fns-tz";
import { EntryFormDialog } from "../../../../components";
import { FixedEntry } from "../../../../entities/fixed_entry";

export const Route = createFileRoute("/(authenticated)/_app/fixed_entries/")({
  component: FixedEntriesPage,
});

function FixedEntriesPage() {
  const { showDialog } = useDialog();

  const { data: fixedEntries, isLoading } = useQuery({
    queryKey: ["fixedEntries"],
    queryFn: () =>
      api.searchFixedEntries({
        page: 1,
      }),
  });

  function handleAddEntry() {
    showDialog({
      content: <EntryFormDialog isFixed />,
    });
  }

  function handleEditEntry(entry: FixedEntry) {
    showDialog({
      content: <EntryFormDialog isFixed entry={entry} />,
    });
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Box.Root role="section">
        <Box.Content>
          <div className="flex items-center">
            <div className="flex justify-end w-full">
              <Button.Root variant="accent" onClick={handleAddEntry}>
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
                <th className="w-1 whitespace-nowrap p-2 font-semibold">Pay Day</th>
              </tr>
            </thead>

            <tbody>
              {fixedEntries?.items?.map((entry) => (
                <tr
                  key={entry.id}
                  className="transition cursor-pointer hover:bg-accent"
                  onClick={() => handleEditEntry(entry)}
                >
                  <td className="p-2 rounded-l-md">
                    <BsBookmarkStarFill
                      size={24}
                      className={cn(entry.paid_date ? "text-emerald-400" : "text-amber-400")}
                    />
                  </td>
                  <td>
                    <Input.Root>
                      <Input.Number
                        type="money"
                        value={entry.amount}
                        name="amount"
                        displayType="text"
                        className="text-end font-semibold"
                      />
                    </Input.Root>
                  </td>
                  <td className="p-2">{entry.name}</td>
                  <td className="p-2">{entry.owner}</td>
                  <td className="p-2">{entry.category?.name}</td>
                  <td className="p-2">{entry.origin?.name}</td>
                  <td className="p-2 text-end">{formatInTimeZone(entry.due_date, "UTC", "dd/MM/yyyy")}</td>
                  <td className="p-2 text-end rounded-r-md">{entry.pay_day}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box.Content>
      </Box.Root>
    </div>
  );
}
