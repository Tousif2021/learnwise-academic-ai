
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface AccountSettingsProps {
  logoutDialogOpen: boolean;
  setLogoutDialogOpen: (open: boolean) => void;
  onLogout: () => void;
}

const AccountSettings: React.FC<AccountSettingsProps> = ({
  logoutDialogOpen,
  setLogoutDialogOpen,
  onLogout,
}) => {
  return (
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
              <Button variant="destructive" onClick={onLogout}>
                Yes, Logout
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default AccountSettings;
