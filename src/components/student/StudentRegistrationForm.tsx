
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { studentSchema, StudentFormData, registerStudent } from "@/services/studentService";
import { toast } from "@/hooks/use-toast";

interface StudentRegistrationFormProps {
  userId: string;
  onSuccess?: (studentId: string) => void;
}

const StudentRegistrationForm: React.FC<StudentRegistrationFormProps> = ({ 
  userId,
  onSuccess 
}) => {
  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      institution: "",
      student_id: "",
      user_id: userId,
    }
  });
  
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  
  const onSubmit = async (data: StudentFormData) => {
    setIsSubmitting(true);
    
    try {
      const result = await registerStudent(data);
      
      if (result.success) {
        toast({
          title: "Registration successful",
          description: "Your student profile has been created",
        });
        
        if (onSuccess && result.data) {
          onSuccess(result.data.id);
        }
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
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  placeholder="john.doe@university.edu" 
                  type="email"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="student_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Student ID (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="S12345678" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="institution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Institution (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="University Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="academic_level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Academic Level (Optional)</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your academic level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="undergraduate">Undergraduate</SelectItem>
                  <SelectItem value="graduate">Graduate</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Registering..." : "Register as Student"}
        </Button>
      </form>
    </Form>
  );
};

export default StudentRegistrationForm;
