
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Globe, Shield, Settings2 } from "lucide-react";
import NotificationSettings from "./NotificationSettings";
import AppearanceSettings from "./AppearanceSettings";
import SecuritySettings from "./SecuritySettings";
import AccountSettings from "./AccountSettings";

interface SettingsTabsProps {
  // Notification settings
  emailNotifications: boolean;
  setEmailNotifications: (value: boolean) => void;
  pushNotifications: boolean;
  setPushNotifications: (value: boolean) => void;
  reminderNotifications: boolean;
  setReminderNotifications: (value: boolean) => void;
  handleSaveNotificationSettings: () => void;
  
  // Appearance settings
  language: string;
  setLanguage: (value: string) => void;
  theme: string;
  setTheme: (value: string) => void;
  handleSaveRegionalSettings: () => void;
  
  // Security settings
  twoFactorEnabled: boolean;
  setTwoFactorEnabled: (value: boolean) => void;
  handleSaveSecuritySettings: () => void;
  
  // Account settings
  logoutDialogOpen: boolean;
  setLogoutDialogOpen: (open: boolean) => void;
  handleLogout: () => void;
}

const SettingsTabs: React.FC<SettingsTabsProps> = ({
  // Notification settings
  emailNotifications,
  setEmailNotifications,
  pushNotifications,
  setPushNotifications,
  reminderNotifications,
  setReminderNotifications,
  handleSaveNotificationSettings,
  
  // Appearance settings
  language,
  setLanguage,
  theme,
  setTheme,
  handleSaveRegionalSettings,
  
  // Security settings
  twoFactorEnabled,
  setTwoFactorEnabled,
  handleSaveSecuritySettings,
  
  // Account settings
  logoutDialogOpen,
  setLogoutDialogOpen,
  handleLogout,
}) => {
  return (
    <Tabs defaultValue="notifications" className="space-y-4">
      <TabsList className="grid grid-cols-4 md:w-full md:max-w-lg">
        <TabsTrigger value="notifications" className="flex items-center gap-2">
          <Bell size={16} />
          <span className="hidden sm:inline">Notifications</span>
        </TabsTrigger>
        <TabsTrigger value="appearance" className="flex items-center gap-2">
          <Globe size={16} />
          <span className="hidden sm:inline">Appearance</span>
        </TabsTrigger>
        <TabsTrigger value="security" className="flex items-center gap-2">
          <Shield size={16} />
          <span className="hidden sm:inline">Security</span>
        </TabsTrigger>
        <TabsTrigger value="account" className="flex items-center gap-2">
          <Settings2 size={16} />
          <span className="hidden sm:inline">Account</span>
        </TabsTrigger>
      </TabsList>

      {/* Notifications Tab */}
      <TabsContent value="notifications">
        <NotificationSettings 
          emailNotifications={emailNotifications}
          setEmailNotifications={setEmailNotifications}
          pushNotifications={pushNotifications}
          setPushNotifications={setPushNotifications}
          reminderNotifications={reminderNotifications}
          setReminderNotifications={setReminderNotifications}
          onSave={handleSaveNotificationSettings}
        />
      </TabsContent>

      {/* Appearance Tab */}
      <TabsContent value="appearance">
        <AppearanceSettings 
          language={language}
          setLanguage={setLanguage}
          theme={theme}
          setTheme={setTheme}
          onSave={handleSaveRegionalSettings}
        />
      </TabsContent>

      {/* Security Tab */}
      <TabsContent value="security">
        <SecuritySettings 
          twoFactorEnabled={twoFactorEnabled}
          setTwoFactorEnabled={setTwoFactorEnabled}
          onSave={handleSaveSecuritySettings}
        />
      </TabsContent>

      {/* Account Tab */}
      <TabsContent value="account">
        <AccountSettings 
          logoutDialogOpen={logoutDialogOpen}
          setLogoutDialogOpen={setLogoutDialogOpen}
          onLogout={handleLogout}
        />
      </TabsContent>
    </Tabs>
  );
};

export default SettingsTabs;
