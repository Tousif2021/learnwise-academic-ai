
import React, { useState } from "react";
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, FileText, HelpCircle, TrendingUp, Calendar, Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const enhancedCourseSchema = z.object({
  code: z.string().min(1, "Course code is required"),
  title: z.string().min(1, "Course title is required"),
  description: z.string().optional(),
  semester: z.enum(["fall", "spring", "summer", "winter"]),
  year: z.number().min(2020).max(2030),
  institution: z.string().min(1, "Institution is required"),
  instructorName: z.string().optional(),
  instructorEmail: z.string().email().optional().or(z.literal("")),
  color: z.string().optional(),
  aiTools: z.array(z.enum(["summarizer", "flashcards", "quiz_maker"])).min(1, "Select at least one AI tool"),
  enableGradePredictor: z.boolean(),
  enableNoteTaking: z.boolean().default(true),
});

type EnhancedCourseFormData = z.infer<typeof enhancedCourseSchema>;

interface EnhancedCourseCreationFormProps {
  onSuccess?: (courseData: any) => void;
  onCancel?: () => void;
}

const EnhancedCourseCreationForm: React.FC<EnhancedCourseCreationFormProps> = ({ onSuccess, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);

  const form = useForm<EnhancedCourseFormData>({
    resolver: zodResolver(enhancedCourseSchema),
    defaultValues: {
      code: "",
      title: "",
      description: "",
      semester: "fall",
      year: new Date().getFullYear(),
      institution: "",
      instructorName: "",
      instructorEmail: "",
      color: "#2563eb",
      aiTools: [],
      enableGradePredictor: false,
      enableNoteTaking: true,
    }
  });

  const onSubmit = async (data: EnhancedCourseFormData) => {
    setIsSubmitting(true);
    
    try {
      // Create course with enhanced data
      const courseData = {
        ...data,
        id: `course-${Date.now()}`,
        instructor: data.instructorName ? {
          name: data.instructorName,
          email: data.instructorEmail || "",
        } : null,
        settings: {
          aiTools: data.aiTools,
          enableGradePredictor: data.enableGradePredictor,
          enableNoteTaking: data.enableNoteTaking,
        },
        createdAt: new Date(),
        enrolled: 1,
        progress: 0,
      };

      // Store in localStorage for now
      const existingCourses = JSON.parse(localStorage.getItem('user_courses') || '[]');
      existingCourses.push(courseData);
      localStorage.setItem('user_courses', JSON.stringify(existingCourses));

      toast({
        title: "Course created successfully",
        description: `${data.title} has been added to your courses`,
      });

      if (onSuccess) {
        onSuccess(courseData);
      }

      form.reset();
    } catch (error) {
      console.error("Error creating course:", error);
      toast({
        title: "Error creating course",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = [
    currentYear - 2,
    currentYear - 1,
    currentYear,
    currentYear + 1,
    currentYear + 2
  ];

  const aiToolOptions = [
    { id: "summarizer", label: "AI Summarizer", icon: FileText, description: "Generate summaries from course materials" },
    { id: "flashcards", label: "Flashcard Maker", icon: Brain, description: "Create study flashcards automatically" },
    { id: "quiz_maker", label: "Quiz Maker", icon: HelpCircle, description: "Generate practice quizzes" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Create New Course</h2>
        <p className="text-muted-foreground">Add a new course with customized AI tools and features</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Course Information */}
          <Card>
            <CardHeader>
              <CardTitle>Course Details</CardTitle>
              <CardDescription>Basic information about your course</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Code *</FormLabel>
                      <FormControl>
                        <Input placeholder="CS101" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="Introduction to Computer Science" {...field} />
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
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Course description and objectives" 
                        className="min-h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="semester"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Semester *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select semester" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="fall">Fall</SelectItem>
                          <SelectItem value="spring">Spring</SelectItem>
                          <SelectItem value="summer">Summer</SelectItem>
                          <SelectItem value="winter">Winter</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year *</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))} 
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {yearOptions.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
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
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Color</FormLabel>
                      <FormControl>
                        <div className="flex gap-2 items-center">
                          <Input
                            type="color"
                            className="w-12 h-10 cursor-pointer"
                            {...field}
                          />
                          <Input
                            type="text"
                            placeholder="#2563eb"
                            value={field.value || ""}
                            onChange={field.onChange}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institution *</FormLabel>
                    <FormControl>
                      <Input placeholder="University Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Instructor Information */}
          <Card>
            <CardHeader>
              <CardTitle>Instructor Information</CardTitle>
              <CardDescription>Optional instructor details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="instructorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instructor Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Dr. Jane Smith" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="instructorEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instructor Email</FormLabel>
                      <FormControl>
                        <Input placeholder="instructor@university.edu" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* AI Tools Selection */}
          <Card>
            <CardHeader>
              <CardTitle>AI Tools Selection</CardTitle>
              <CardDescription>Choose which AI tools you want available for this course</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="aiTools"
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {aiToolOptions.map((tool) => (
                        <FormField
                          key={tool.id}
                          control={form.control}
                          name="aiTools"
                          render={({ field }) => {
                            const Icon = tool.icon;
                            return (
                              <FormItem
                                key={tool.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(tool.id as any)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, tool.id])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== tool.id
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <div className="flex items-center gap-2">
                                    <Icon size={16} />
                                    <FormLabel className="font-medium">
                                      {tool.label}
                                    </FormLabel>
                                  </div>
                                  <FormDescription className="text-sm">
                                    {tool.description}
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Course Features */}
          <Card>
            <CardHeader>
              <CardTitle>Course Features</CardTitle>
              <CardDescription>Enable additional features for this course</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="enableGradePredictor"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <TrendingUp size={16} />
                        <FormLabel className="text-base font-medium">
                          Grade Predictor
                        </FormLabel>
                      </div>
                      <FormDescription>
                        Enable AI-powered grade prediction based on your performance
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="enableNoteTaking"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <FileText size={16} />
                        <FormLabel className="text-base font-medium">
                          Note Taking
                        </FormLabel>
                      </div>
                      <FormDescription>
                        Enable note-taking functionality for this course
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating Course..." : "Create Course"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default EnhancedCourseCreationForm;
