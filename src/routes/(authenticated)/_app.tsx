import { createFileRoute, Outlet } from "@tanstack/react-router";
import { UserButton } from "@clerk/clerk-react";
import { GiPointyHat } from "react-icons/gi";
import { Nav } from "../../components";

export const Route = createFileRoute("/(authenticated)/_app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="p-5 space-y-5 text-zinc-300">
      <header className="flex justify-between items-center">
        <div className="flex space-x-3 items-center text-2xl">
          <GiPointyHat size={38} />
          <div>Spending Sage</div>
        </div>
        <div className="flex items-center space-x-3 font-semibold">
          <UserButton />
        </div>
      </header>

      <div className="py-4 flex">
        <Nav />

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
