import { SignInButton } from "@clerk/clerk-react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login/")({
  component: LoginPage,
});

function LoginPage() {
  return <SignInButton forceRedirectUrl="/dashboard" signUpForceRedirectUrl="/dashboard" />;
}
