
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AppLayout from "@/components/layout/AppLayout";
import { fetchCurrentUser } from "@/services/mockData";
import { User } from "@/types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Mail, User as UserIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const profileSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: "",
      email: "",
    },
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setIsLoading(true);
        const userData = await fetchCurrentUser();
        setUser(userData);
        
        form.reset({
          displayName: userData.displayName,
          email: userData.email,
        });
      } catch (error) {
        console.error("Error loading user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [form]);

  const onSubmit = (data: ProfileFormValues) => {
    console.log("Form submitted with data:", data);
    
    // In a real app, this would update the user profile via an API call
    toast({
      title: "Profile updated",
      description: "Your profile changes have been saved successfully.",
    });

    // For the mock app, we'll update our local state
    if (user) {
      setUser({
        ...user,
        displayName: data.displayName,
        email: data.email,
      });
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-3xl mx-auto p-6">
          <div className="h-48 bg-muted animate-pulse rounded-xl mb-6" />
          <div className="h-64 bg-muted animate-pulse rounded-xl" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-8 p-6 bg-card border rounded-xl">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={user?.photoURL} alt={user?.displayName} />
            <AvatarFallback>{user?.displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold">{user?.displayName}</h1>
          <p className="text-muted-foreground">{user?.email}</p>
          <div className="mt-2 text-sm text-muted-foreground">
            {user?.institution?.name}
          </div>
        </div>

        {/* Profile Form */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ring-offset-background">
                          <div className="px-3 text-muted-foreground">
                            <UserIcon size={16} />
                          </div>
                          <Input
                            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            placeholder="Your name"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ring-offset-background">
                          <div className="px-3 text-muted-foreground">
                            <Mail size={16} />
                          </div>
                          <Input
                            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            placeholder="Your email"
                            type="email"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Profile;
