// src/pages/Landing
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { ArrowRight, Brain } from "lucide-react";
import { Link } from "react-router-dom";

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow flex items-center justify-center">
        <motion.section
          className="py-20 px-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
              <div className="inline-flex items-center space-x-2 bg-accent/50 text-accent-foreground px-4 py-2 rounded-full text-sm font-medium border border-accent">
                <Brain className="w-5 h-5" />
                <span>Smart Learning System</span>
              </div>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 text-foreground">
              Master Coding
              <br />
              <span className="text-primary">One Problem</span> at a Time
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Track your coding journey, get smart reminders, and build
              consistent problem-solving habits with our intelligent learning
              system.
            </p>

            <motion.div
              className="flex justify-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Button
                size="lg"
                className="text-lg px-8 py-6 rounded-full font-semibold"
                asChild
              >
                {isAuthenticated ? (
                  <Link to="/dashboard">
                    Continue Learning <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                ) : (
                  <Link to="/login">
                    Get Started for Free <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                )}
              </Button>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
