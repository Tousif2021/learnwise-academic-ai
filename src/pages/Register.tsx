
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Key, User, Book } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { registrationSchema, RegistrationFormData, registerUser } from "@/services/authService";
import StudentRegistrationForm from "@/components/student/StudentRegistrationForm";

const Register = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredUserId, setRegisteredUserId] = useState<string | null>(null);
  const [registrationStep, setRegistrationStep] = useState<'account' | 'profile'>('account');

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegistrationFormData) => {
    setIsSubmitting(true);

    try {
      const result = await registerUser(data);

      if (result.success && result.data?.user) {
        toast({
          title: "Account created successfully",
          description: "Please complete your student profile",
        });
        
        setRegisteredUserId(result.data.user.id);
        setRegistrationStep('profile');
      } else {
        toast({
          title: "Registration failed",
          description: result.error || "Unknown error occurred",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStudentRegistrationSuccess = () => {
    toast({
      title: "Registration complete",
      description: "Your account and student profile are now set up",
    });
    navigate('/courses');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">EduGenius</h1>
          <p className="text-muted-foreground">Academic Management System</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create an Account</CardTitle>
            <CardDescription>
              Register for EduGenius academic management system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs 
              value={registrationStep} 
              onValueChange={(value) => setRegistrationStep(value as 'account' | 'profile')}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="account" disabled={registrationStep === 'profile'}>
                  <User className="mr-2 h-4 w-4" />
                  Account
                </TabsTrigger>
                <TabsTrigger value="profile" disabled={!registeredUserId}>
                  <Book className="mr-2 h-4 w-4" />
                  Student Profile
                </TabsTrigger>
              </TabsList>

              <TabsContent value="account">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                                placeholder="your.email@example.com"
                                type="email"
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
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ring-offset-background">
                              <div className="px-3 text-muted-foreground">
                                <Key size={16} />
                              </div>
                              <Input
                                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                placeholder="********"
                                type="password"
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
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <div className="flex items-center border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ring-offset-background">
                              <div className="px-3 text-muted-foreground">
                                <Key size={16} />
                              </div>
                              <Input
                                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                placeholder="********"
                                type="password"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Creating Account..." : "Create Account"}
                    </Button>

                    <div className="text-center text-sm">
                      <span className="text-muted-foreground">Already have an account? </span>
                      <Button
                        variant="link"
                        className="p-0"
                        onClick={() => navigate('/login')}
                      >
                        Login here
                      </Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="profile">
                {registeredUserId && (
                  <StudentRegistrationForm 
                    userId={registeredUserId} 
                    onSuccess={handleStudentRegistrationSuccess}
                  />
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
