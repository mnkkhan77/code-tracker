import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { CreditCard, Crown, Star, Zap } from "lucide-react";
import { useState } from "react";

interface CreditPurchaseModalProps {
  open: boolean;
  onClose: () => void;
  onPurchase: (packageType: "small" | "medium" | "large") => Promise<boolean>;
}

export function CreditPurchaseModal({
  open,
  onClose,
  onPurchase,
}: CreditPurchaseModalProps) {
  const [purchasing, setPurchasing] = useState<string | null>(null);

  const packages = [
    {
      id: "small" as const,
      name: "Starter",
      credits: 10,
      price: 5,
      icon: Zap,
      popular: false,
      description: "Perfect for trying out the service",
    },
    {
      id: "medium" as const,
      name: "Professional",
      credits: 20,
      price: 10,
      icon: Star,
      popular: true,
      description: "Most popular choice for job seekers",
    },
    {
      id: "large" as const,
      name: "Premium",
      credits: 35,
      price: 20,
      icon: Crown,
      popular: false,
      description: "Best value for multiple resumes",
    },
  ];

  const handlePurchase = async (packageType: "small" | "medium" | "large") => {
    setPurchasing(packageType);
    try {
      const success = await onPurchase(packageType);
      if (success) {
        onClose();
      }
    } finally {
      setPurchasing(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl rounded-md max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Choose Your Credit Package
          </DialogTitle>
          <DialogDescription className="text-center">
            Purchase credits to analyze your resumes with our ATS compatibility
            checker.
          </DialogDescription>
        </DialogHeader>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 pt-4 overflow-y-auto px-2 -mx-2">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex"
            >
              <Card
                className={`relative w-full flex flex-col ${pkg.popular ? "ring-2 ring-primary" : ""}`}
              >
                {pkg.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary px-3 py-1 text-sm font-semibold">
                    Most Popular
                  </Badge>
                )}

                <CardContent className="p-6 text-center flex flex-col flex-grow space-y-6">
                  <div className="flex-grow space-y-2">
                    <div className="flex justify-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                        <pkg.icon className="w-8 h-8 text-primary" />
                      </div>
                    </div>

                    <div className="min-h-[6rem]">
                      <h3 className="text-lg font-bold">{pkg.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {pkg.description}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="text-4xl font-bold">{pkg.credits}</div>
                      <div className="text-base text-muted-foreground">
                        Credits
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <div className="text-3xl font-bold text-primary">
                        ${pkg.price}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ${(pkg.price / pkg.credits).toFixed(2)} per credit
                      </div>
                    </div>

                    <Button
                      onClick={() => handlePurchase(pkg.id)}
                      disabled={purchasing !== null}
                      className="w-full"
                      variant={pkg.popular ? "default" : "outline"}
                    >
                      {purchasing === pkg.id ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Processing...</span>
                        </div>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Purchase
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            Secure payment processing • Cancel anytime • 30-day money-back
            guarantee
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
