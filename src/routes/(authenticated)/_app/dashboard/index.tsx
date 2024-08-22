import { useQuery } from "@tanstack/react-query";
import { api } from "../../../../api/api";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(authenticated)/_app/dashboard/")({
  component: DashboardPage,
});

function DashboardPage() {
  const { data: user } = useQuery({ queryKey: ["user"], queryFn: api.getUser });

  return (
    <div className="space-y-5">
      <h1 className="text-4xl">Hi there, {user?.full_name}!</h1>

      <div className="bg-slate-100 bg-opacity-5 border border-slate-500 shadow-lg rounded-lg p-5">Dashboard</div>
    </div>
  );
}
