
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface AppearanceSettingsProps {
  language: string;
  setLanguage: (value: string) => void;
  theme: string;
  setTheme: (value: string) => void;
  onSave: () => void;
}

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({
  language,
  setLanguage,
  theme,
  setTheme,
  onSave,
}) => {
  return (
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
        <Button onClick={onSave}>Save Appearance Settings</Button>
      </CardContent>
    </Card>
  );
};

export default AppearanceSettings;
