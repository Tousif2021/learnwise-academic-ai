
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center max-w-md px-4">
        <div className="bg-edu-primary/10 text-edu-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl font-bold">404</span>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Page not found</h1>
        <p className="text-muted-foreground mb-6">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="space-x-4">
          <Button asChild>
            <Link to="/">Return to Dashboard</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/courses">View Courses</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
