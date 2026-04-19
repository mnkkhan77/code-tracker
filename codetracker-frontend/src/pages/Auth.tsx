// src/pages/admin/Auth
import { AuthCard } from "@/components/auth/AuthCard";
import { useAuth } from "@/hooks/use-auth";
import { Suspense, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";

function SignIn() {
  const { loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(searchParams.get("redirect") || "/");
    }
  }, [loading, isAuthenticated, searchParams, navigate]);

  return (
    <div className="flex h-screen items-center justify-center">
      <AuthCard />
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignIn />
    </Suspense>
  );
}
