
import React from "react";
import { Card } from "@/components/ui/card";
import { User } from "@/types";

interface WelcomeCardProps {
  user: User | null;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ user }) => {
  if (!user) return null;
  
  // Get part of day for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  
  // Get relevant user info for display
  const userInfo = () => {
    if (user.academicDetails) {
      return `${user.academicDetails.major} student at ${user.institution?.name || "your institution"}`;
    }
    return user.institution?.name || "Welcome back";
  };

  return (
    <Card className="border-0 bg-gradient-to-r from-edu-primary to-edu-accent text-white p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-1">
            {getGreeting()}, {user.displayName.split(" ")[0]}!
          </h1>
          <p className="text-white/80">{userInfo()}</p>
        </div>
        
        <div className="hidden md:block">
          <span className="text-sm bg-white/20 rounded-full px-3 py-1">
            {new Date().toLocaleDateString(undefined, { 
              weekday: 'long',
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default WelcomeCard;
