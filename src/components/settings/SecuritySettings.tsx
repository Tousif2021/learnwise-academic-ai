
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface SecuritySettingsProps {
  twoFactorEnabled: boolean;
  setTwoFactorEnabled: (value: boolean) => void;
  onSave: () => void;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({
  twoFactorEnabled,
  setTwoFactorEnabled,
  onSave,
}) => {
  return (
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
        <Button onClick={onSave}>Save Security Settings</Button>
      </CardContent>
    </Card>
  );
};

export default SecuritySettings;
