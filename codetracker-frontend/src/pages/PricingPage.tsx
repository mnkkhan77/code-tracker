import { createCheckoutSession, ProductType } from "@/api/paymentsAPI";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { CheckCircle2, Loader2, Sparkles, Star, Zap } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Plan {
  id: ProductType;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  badge?: string;
  icon: React.ElementType;
  highlight: boolean;
}

const plans: Plan[] = [
  {
    id: "RESUME_ANALYSIS",
    name: "Resume Analysis",
    price: "$4.99",
    period: "one-time",
    description: "AI-powered review of your resume with actionable feedback.",
    features: [
      "ATS compatibility score",
      "Keyword gap analysis",
      "Section-by-section feedback",
      "Improvement suggestions",
    ],
    icon: Star,
    highlight: false,
  },
  {
    id: "SUBSCRIPTION",
    name: "Premium Plan",
    price: "$9.99",
    period: "/ month",
    description: "Unlock all features and supercharge your coding prep.",
    features: [
      "Unlimited problem tracking",
      "Spaced repetition reminders",
      "Advanced progress analytics",
      "Priority support",
      "All future features",
    ],
    badge: "Most Popular",
    icon: Sparkles,
    highlight: true,
  },
  {
    id: "CREDITS",
    name: "Credits Pack",
    price: "$14.99",
    period: "one-time",
    description: "100 platform credits to use across AI features.",
    features: [
      "100 platform credits",
      "Use on AI hints & explanations",
      "Resume analyses (20 credits each)",
      "Credits never expire",
    ],
    icon: Zap,
    highlight: false,
  },
];

export default function PricingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<ProductType | null>(null);

  const handleBuy = async (productType: ProductType) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setLoading(productType);
    try {
      const { sessionUrl } = await createCheckoutSession(productType);
      window.location.href = sessionUrl;
    } catch {
      toast.error("Failed to start checkout. Please try again.");
      setLoading(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Simple, Transparent Pricing</h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Choose the plan that fits your needs. No hidden fees.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const isLoading = loading === plan.id;

          return (
            <Card
              key={plan.id}
              className={`relative flex flex-col transition-shadow hover:shadow-lg ${
                plan.highlight ? "border-primary shadow-md" : ""
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="px-3 py-0.5 text-xs">{plan.badge}</Badge>
                </div>
              )}

              <CardHeader className="pb-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${
                  plan.highlight ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
              </CardHeader>

              <CardContent className="flex-1">
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.highlight ? "default" : "outline"}
                  onClick={() => handleBuy(plan.id)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Redirecting…
                    </>
                  ) : (
                    "Get Started"
                  )}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Payments are securely processed by{" "}
        <span className="font-medium text-foreground">Stripe</span>. You will be redirected to
        Stripe's hosted checkout page.
      </p>
    </div>
  );
}
