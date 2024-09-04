// import { SignInButton } from "@clerk/clerk-react";
import { Box } from "@kamalion/ui";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/login/")({
  component: LoginPage,
});

function LoginPage() {
  // return <SignInButton forceRedirectUrl="/dashboard" signUpForceRedirectUrl="/dashboard" />;

  return (
    <div className="flex justify-center items-center h-full">
      <Box.Root role="section">
        <Box.Content>Login</Box.Content>
      </Box.Root>
    </div>
  );
}
