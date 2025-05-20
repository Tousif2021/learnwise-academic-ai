
import React, { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, signOutUser } from "@/services/authService";
import { getUserPreferences, saveUserPreferences, UserPreferences } from "@/services/userPreferencesService";
import SettingsHeader from "@/components/settings/SettingsHeader";
import SettingsTabs from "@/components/settings/SettingsTabs";

const SettingsPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [reminderNotifications, setReminderNotifications] = useState(false);
  const [language, setLanguage] = useState("english");
  const [theme, setTheme] = useState("system");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        const userResult = await getCurrentUser();
        
        if (userResult.success && userResult.data) {
          setUserId(userResult.data.id);
          
          // Load user preferences
          const preferencesResult = await getUserPreferences(userResult.data.id);
          
          if (preferencesResult.success && preferencesResult.data) {
            const prefs = preferencesResult.data;
            setEmailNotifications(prefs.notifications?.email ?? true);
            setPushNotifications(prefs.notifications?.push ?? true);
            setReminderNotifications(prefs.notifications?.reminder ?? false);
            setLanguage(prefs.language || "english");
            setTheme(prefs.theme || "system");
          }
        } else {
          // Not logged in or error
          navigate('/login');
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        toast({
          title: "Error loading settings",
          description: "Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserData();
  }, [navigate, toast]);

  const handleSaveNotificationSettings = async () => {
    if (!userId) return;
    
    try {
      const preferences: UserPreferences = {
        user_id: userId,
        theme: theme as UserPreferences["theme"],
        notifications: {
          email: emailNotifications,
          push: pushNotifications,
          reminder: reminderNotifications
        },
        language: language as UserPreferences["language"]
      };
      
      const result = await saveUserPreferences(preferences);
      
      if (result.success) {
        toast({
          title: "Notification settings updated",
          description: "Your notification preferences have been saved.",
        });
      } else {
        toast({
          title: "Error saving settings",
          description: result.error || "Please try again later.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error saving notification settings:", error);
      toast({
        title: "Error saving settings",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };

  const handleSaveRegionalSettings = async () => {
    if (!userId) return;
    
    try {
      const preferences: UserPreferences = {
        user_id: userId,
        theme: theme as UserPreferences["theme"],
        notifications: {
          email: emailNotifications,
          push: pushNotifications,
          reminder: reminderNotifications
        },
        language: language as UserPreferences["language"]
      };
      
      const result = await saveUserPreferences(preferences);
      
      if (result.success) {
        toast({
          title: "Regional settings updated",
          description: "Your language and regional preferences have been saved.",
        });
      } else {
        toast({
          title: "Error saving settings",
          description: result.error || "Please try again later.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error saving regional settings:", error);
      toast({
        title: "Error saving settings",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };
  
  const handleSaveSecuritySettings = () => {
    // In a real app, this would save to backend
    toast({
      title: "Security settings updated",
      description: "Your security preferences have been saved.",
    });
  };

  const handleLogout = async () => {
    try {
      const result = await signOutUser();
      
      if (result.success) {
        toast({
          title: "Logged out",
          description: "You have been successfully logged out.",
        });
        navigate('/login');
      } else {
        toast({
          title: "Logout failed",
          description: result.error || "Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error during logout:", error);
      toast({
        title: "Logout failed",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    }
    setLogoutDialogOpen(false);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto p-6">
          <div className="h-48 bg-muted animate-pulse rounded-xl mb-6" />
          <div className="h-64 bg-muted animate-pulse rounded-xl" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <SettingsHeader 
          title="Settings" 
          description="Manage your account preferences and settings" 
        />

        <SettingsTabs 
          // Notification settings
          emailNotifications={emailNotifications}
          setEmailNotifications={setEmailNotifications}
          pushNotifications={pushNotifications}
          setPushNotifications={setPushNotifications}
          reminderNotifications={reminderNotifications}
          setReminderNotifications={setReminderNotifications}
          handleSaveNotificationSettings={handleSaveNotificationSettings}
          
          // Appearance settings
          language={language}
          setLanguage={setLanguage}
          theme={theme}
          setTheme={setTheme}
          handleSaveRegionalSettings={handleSaveRegionalSettings}
          
          // Security settings
          twoFactorEnabled={twoFactorEnabled}
          setTwoFactorEnabled={setTwoFactorEnabled}
          handleSaveSecuritySettings={handleSaveSecuritySettings}
          
          // Account settings
          logoutDialogOpen={logoutDialogOpen}
          setLogoutDialogOpen={setLogoutDialogOpen}
          handleLogout={handleLogout}
        />
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
