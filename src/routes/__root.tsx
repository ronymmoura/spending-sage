import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: Root,
});

function Root() {
  return (
    <div className="bg-aurora h-screen bg-cover text-white">
      <div className="backdrop-blur-3xl bg-slate-900 bg-opacity-70 h-screen">
        <Outlet />
      </div>
    </div>
  );
}
