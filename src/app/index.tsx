import { Redirect } from "expo-router";

import Loader from "@/components/ui/Loader";
import { useAuth } from "@/providers/AuthProvider";

export default function Index() {
  const { isLoading, isAuthenticated, hasOnboarded, user } = useAuth();

  if (isLoading) {
    return <Loader color="black" />;
  }

  if (isAuthenticated) {
    return (
      <Redirect
        href={user?.role === "DRIVER" ? "/(driver)/home" : "/(client)/home"}
      />
    );
  }

  return (
    <Redirect href={hasOnboarded ? "/(auth)/login" : "/(onboarding)/role"} />
  );
}
