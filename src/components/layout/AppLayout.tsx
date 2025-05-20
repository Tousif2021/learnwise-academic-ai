
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { fetchCurrentUser } from "@/services/mockData";
import { User } from "@/types";
import { Book, Calendar, Monitor, Settings, User as UserIcon } from "lucide-react";
import ThemeToggle from "@/components/theme/ThemeToggle";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();

  useEffect(() => {
    const loadUser = async () => {
      const userData = await fetchCurrentUser();
      setUser(userData);
    };
    
    loadUser();
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        {/* Sidebar */}
        <Sidebar className="border-r border-border">
          <div className="p-4 flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-edu-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">AMS</span>
            </div>
            <h1 className="text-lg font-bold">EduGenius</h1>
          </div>
          
          <SidebarContent className="px-2">
            <div className="space-y-1 py-2">
              <SidebarLink 
                to="/" 
                icon={<Monitor size={18} />} 
                label="Dashboard" 
                active={location.pathname === '/'} 
              />
              <SidebarLink 
                to="/courses" 
                icon={<Book size={18} />} 
                label="Courses" 
                active={location.pathname === '/courses' || location.pathname.startsWith('/courses/')} 
              />
              <SidebarLink 
                to="/calendar" 
                icon={<Calendar size={18} />} 
                label="Calendar" 
                active={location.pathname === '/calendar'} 
              />
              <SidebarLink 
                to="/profile" 
                icon={<UserIcon size={18} />} 
                label="Profile" 
                active={location.pathname === '/profile'} 
              />
              <SidebarLink 
                to="/settings" 
                icon={<Settings size={18} />} 
                label="Settings" 
                active={location.pathname === '/settings'} 
              />
            </div>
            
            <div className="absolute bottom-4 left-0 right-0 px-4">
              {user && (
                <div className="flex items-center gap-3 p-2 rounded-md hover:bg-muted transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL} alt={user.displayName} />
                    <AvatarFallback>{user.displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{user.displayName}</span>
                    <span className="text-xs text-muted-foreground">{user.email}</span>
                  </div>
                </div>
              )}
            </div>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          <header className="h-14 border-b border-border flex items-center px-4 md:px-6 justify-between">
            <SidebarTrigger />
            <div className="font-medium">
              {user?.institution?.name || "Academic Management System"}
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link 
                to="/settings" 
                className="bg-edu-secondary/10 text-edu-secondary hover:bg-edu-secondary/20 rounded-full p-1.5 transition-colors"
              >
                <Settings size={18} />
              </Link>
            </div>
          </header>

          <div className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, active }) => {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors ${
        active ? 'bg-muted' : ''
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
};

export default AppLayout;
