
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock } from "lucide-react";
import { Course } from "@/types";
import { useAddEvent } from "@/hooks/use-events";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  type: z.string(),
  courseId: z.string().optional(),
  dueDate: z.date(),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "Invalid time format" }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courses: Course[];
  preselectedCourseId?: string;
  preselectedDate?: Date;
}

const AddEventDialog: React.FC<AddEventDialogProps> = ({ 
  open, 
  onOpenChange, 
  courses,
  preselectedCourseId,
  preselectedDate
}) => {
  const { addEvent, isAdding } = useAddEvent();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "assignment",
      courseId: preselectedCourseId || "",
      dueDate: preselectedDate || new Date(),
      time: format(new Date(), "HH:mm"),
      description: "",
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    try {
      // Combine date and time
      const [hours, minutes] = data.time.split(':').map(Number);
      const dueDate = new Date(data.dueDate);
      dueDate.setHours(hours, minutes);
      
      // Find course details if courseId is provided
      const course = data.courseId ? courses.find(c => c.id === data.courseId) : undefined;
      
      await addEvent({
        title: data.title,
        type: data.type,
        dueDate: dueDate,
        description: data.description,
        course: course ? {
          id: course.id,
          title: course.title,
          code: course.code,
          color: course.color
        } : undefined
      });
      
      toast({
        title: "Event added",
        description: "Your event has been successfully added to the calendar.",
      });
      
      form.reset();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add event. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Initialize the form with preselected data when the dialog opens
  useEffect(() => {
    if (open) {
      if (preselectedCourseId) {
        form.setValue('courseId', preselectedCourseId);
      }
      
      if (preselectedDate) {
        form.setValue('dueDate', preselectedDate);
      }
    }
  }, [open, preselectedCourseId, preselectedDate, form]);
  
  const eventTypes = [
    { value: "assignment", label: "Assignment" },
    { value: "quiz", label: "Quiz" },
    { value: "exam", label: "Exam" },
    { value: "meeting", label: "Meeting" },
    { value: "lecture", label: "Lecture" },
    { value: "lab", label: "Lab" },
    { value: "project", label: "Project" },
    { value: "other", label: "Other" },
  ];
  
  const getColorForEventType = (type: string) => {
    const colors: Record<string, string> = {
      "assignment": "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
      "quiz": "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
      "exam": "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300",
      "meeting": "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300",
      "lecture": "bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300",
      "lab": "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300",
      "project": "bg-pink-100 text-pink-600 dark:bg-pink-900 dark:text-pink-300",
      "other": "bg-gray-100 text-gray-600 dark:bg-gray-900 dark:text-gray-300",
    };
    return colors[type] || colors.other;
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Add New Event</DialogTitle>
          <DialogDescription>
            Create an event for your academic calendar
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter event title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {eventTypes.map((type) => (
                          <SelectItem 
                            key={type.value} 
                            value={type.value}
                            className={getColorForEventType(type.value)}
                          >
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem 
                            key={course.id} 
                            value={course.id}
                            className="flex items-center gap-2"
                          >
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: course.color }}
                              ></div>
                              {course.code} - {course.title}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Associate with a course</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="time" className="pl-10" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter event details" 
                      className="resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isAdding}>
                {isAdding ? "Adding..." : "Add Event"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEventDialog;
