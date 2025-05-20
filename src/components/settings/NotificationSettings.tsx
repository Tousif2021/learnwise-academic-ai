
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface NotificationSettingsProps {
  emailNotifications: boolean;
  setEmailNotifications: (value: boolean) => void;
  pushNotifications: boolean;
  setPushNotifications: (value: boolean) => void;
  reminderNotifications: boolean;
  setReminderNotifications: (value: boolean) => void;
  onSave: () => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  emailNotifications,
  setEmailNotifications,
  pushNotifications,
  setPushNotifications,
  reminderNotifications,
  setReminderNotifications,
  onSave,
}) => {
  return (
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
        <Button onClick={onSave}>Save Notification Settings</Button>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
