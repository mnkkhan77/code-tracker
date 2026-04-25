import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const fromAts = searchParams.get("from") === "ats";

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-5 max-w-md">
        <div className="flex justify-center">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold">Payment Successful!</h1>
        <p className="text-muted-foreground">
          {fromAts
            ? "Your credits have been added to your account. You can now use them to analyze your resume."
            : "Your payment was processed successfully. Your purchase will be activated shortly. You'll see it reflected in your account within a few moments."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button asChild>
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
          {fromAts ? (
            <Button variant="outline" asChild>
              <Link to="/ats-resume-checker">Go to ATS Checker</Link>
            </Button>
          ) : (
            <Button variant="outline" asChild>
              <Link to="/pricing">View Plans</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
