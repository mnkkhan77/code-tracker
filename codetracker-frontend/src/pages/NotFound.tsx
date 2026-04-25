import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Home, MoveLeft } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function NotFound() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 max-w-md"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="text-[8rem] font-black leading-none tracking-tight text-primary/20 select-none"
        >
          404
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Page not found</h1>
          <p className="text-muted-foreground text-sm">
            The page at{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">
              {location.pathname}
            </code>{" "}
            doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <MoveLeft className="w-4 h-4 mr-2" />
            Go back
          </Button>
          <Button asChild>
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Go home
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
