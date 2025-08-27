import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Code } from "lucide-react";
import { Link } from "react-router-dom";
import { UserNav } from "./UserNav";

export function PublicNavbar() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <nav className="bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                  <Code className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-semibold tracking-tight text-foreground">
                  CodeTracker
                </span>
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/problems"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Problems
              </Link>
              <Link
                to="/about"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                About
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <ThemeToggleButton />
              {isAuthenticated ? (
                <UserNav />
              ) : (
                <Button
                  asChild
                  variant="default"
                  className="rounded-full font-semibold"
                >
                  <Link to="/login">Login</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
