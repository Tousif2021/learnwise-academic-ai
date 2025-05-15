
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Settings2, Bell, Globe, Shield, LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const SettingsPage = () => {
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [reminderNotifications, setReminderNotifications] = useState(false);
  const [language, setLanguage] = useState("english");
  const [theme, setTheme] = useState("system");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleSaveNotificationSettings = () => {
    // In a real app, this would save to backend
    toast({
      title: "Notification settings updated",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleSaveRegionalSettings = () => {
    // In a real app, this would save to backend
    toast({
      title: "Regional settings updated",
      description: "Your language and regional preferences have been saved.",
    });
  };
  
  const handleSaveSecuritySettings = () => {
    // In a real app, this would save to backend
    toast({
      title: "Security settings updated",
      description: "Your security preferences have been saved.",
    });
  };

  const handleLogout = () => {
    // In a real app, this would handle logout logic
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    setLogoutDialogOpen(false);
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences and settings</p>
        </div>

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
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how you want to be notified about events, assignments, and other activities.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications about course updates and events via email.
                      </p>
                    </div>
                    <Switch 
                      id="email-notifications" 
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications directly in your browser.
                      </p>
                    </div>
                    <Switch 
                      id="push-notifications" 
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="reminder-notifications">Reminder Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Get reminded about upcoming deadlines and events.
                      </p>
                    </div>
                    <Switch 
                      id="reminder-notifications" 
                      checked={reminderNotifications}
                      onCheckedChange={setReminderNotifications}
                    />
                  </div>
                </div>
                <Button onClick={handleSaveNotificationSettings}>Save Notification Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize the look and feel of your application.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <ToggleGroup 
                      type="single" 
                      value={language}
                      onValueChange={(value) => {
                        if (value) setLanguage(value);
                      }}
                      className="justify-start"
                    >
                      <ToggleGroupItem value="english">English</ToggleGroupItem>
                      <ToggleGroupItem value="spanish">Spanish</ToggleGroupItem>
                      <ToggleGroupItem value="french">French</ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <ToggleGroup 
                      type="single" 
                      value={theme}
                      onValueChange={(value) => {
                        if (value) setTheme(value);
                      }}
                      className="justify-start"
                    >
                      <ToggleGroupItem value="light">Light</ToggleGroupItem>
                      <ToggleGroupItem value="dark">Dark</ToggleGroupItem>
                      <ToggleGroupItem value="system">System</ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                </div>
                <Button onClick={handleSaveRegionalSettings}>Save Appearance Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security preferences.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account.
                      </p>
                    </div>
                    <Switch 
                      id="two-factor" 
                      checked={twoFactorEnabled}
                      onCheckedChange={setTwoFactorEnabled}
                    />
                  </div>
                </div>
                <Button onClick={handleSaveSecuritySettings}>Save Security Settings</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account and related settings.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto"
                  asChild
                >
                  <a href="/profile">
                    Edit Profile
                  </a>
                </Button>

                <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full sm:w-auto">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Confirm Logout</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to logout from your account?
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setLogoutDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={handleLogout}>
                        Yes, Logout
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
