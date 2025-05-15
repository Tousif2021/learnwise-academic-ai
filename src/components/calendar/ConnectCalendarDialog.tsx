
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface ConnectCalendarDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ConnectCalendarDialog: React.FC<ConnectCalendarDialogProps> = ({ 
  open, 
  onOpenChange 
}) => {
  const [selectedProvider, setSelectedProvider] = useState<string>("google");
  const [isConnecting, setIsConnecting] = useState(false);
  const [url, setUrl] = useState("");
  
  const handleConnect = async () => {
    setIsConnecting(true);
    
    try {
      // In a real app, this would initiate OAuth flow or API connection
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      toast({
        title: "Calendar connected",
        description: `Successfully connected to ${getProviderName(selectedProvider)} Calendar.`,
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "Could not connect to the calendar service. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };
  
  const getProviderName = (provider: string) => {
    switch (provider) {
      case "google": return "Google";
      case "outlook": return "Microsoft Outlook";
      case "apple": return "Apple";
      case "url": return "Custom URL";
      default: return "Calendar";
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Connect Calendar</DialogTitle>
          <DialogDescription>
            Sync your academic schedule with your preferred calendar service
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <RadioGroup
            value={selectedProvider}
            onValueChange={setSelectedProvider}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-2 rounded-md border p-3">
              <RadioGroupItem value="google" id="google" />
              <Label htmlFor="google" className="flex-1 cursor-pointer">
                Google Calendar
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 rounded-md border p-3">
              <RadioGroupItem value="outlook" id="outlook" />
              <Label htmlFor="outlook" className="flex-1 cursor-pointer">
                Microsoft Outlook
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 rounded-md border p-3">
              <RadioGroupItem value="apple" id="apple" />
              <Label htmlFor="apple" className="flex-1 cursor-pointer">
                Apple Calendar
              </Label>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem value="url" id="url" />
                <Label htmlFor="url" className="flex-1 cursor-pointer">
                  Calendar URL (iCal/ICS)
                </Label>
              </div>
              
              {selectedProvider === "url" && (
                <div className="pl-6">
                  <Input
                    type="url"
                    placeholder="https://calendar.example.com/ical/..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
              )}
            </div>
          </RadioGroup>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConnect} disabled={isConnecting}>
            {isConnecting ? "Connecting..." : "Connect Calendar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectCalendarDialog;
