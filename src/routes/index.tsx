import { useSession } from "@clerk/clerk-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { isSignedIn, isLoaded } = useSession();
  const navigate = useNavigate({ from: "/" });

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn) navigate({ to: "/dashboard" });
      else navigate({ to: "/login" });
    }
  }, [isLoaded]);

  return <div>Loading...</div>;
}
