
import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchCourses } from "@/services/mockData";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { CalendarPlus, CalendarClock, Link } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventList from "@/components/calendar/EventList";
import AddEventDialog from "@/components/calendar/AddEventDialog";
import ConnectCalendarDialog from "@/components/calendar/ConnectCalendarDialog";

const CalendarPage: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isConnectCalendarOpen, setIsConnectCalendarOpen] = useState(false);

  const { data: courses, isLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses
  });

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Calendar Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <CalendarClock className="h-5 w-5 text-edu-primary" />
                    Calendar
                  </CardTitle>
                  <div className="space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsConnectCalendarOpen(true)}
                      className="flex items-center gap-2"
                    >
                      <Link className="h-4 w-4" />
                      Sync Calendar
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={() => setIsAddEventOpen(true)}
                      className="flex items-center gap-2"
                    >
                      <CalendarPlus className="h-4 w-4" />
                      Add Event
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  Manage your schedule and academic events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-white dark:bg-slate-950 rounded-lg p-4 shadow-sm">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border bg-background"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Events for {date ? date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Selected Date'}</CardTitle>
              </CardHeader>
              <CardContent>
                <EventList date={date} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="assignments">Assignments</TabsTrigger>
                    <TabsTrigger value="exams">Exams</TabsTrigger>
                    <TabsTrigger value="meetings">Meetings</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all">
                    <EventList limit={5} />
                  </TabsContent>
                  <TabsContent value="assignments">
                    <EventList eventType="assignment" limit={5} />
                  </TabsContent>
                  <TabsContent value="exams">
                    <EventList eventType="exam" limit={5} />
                  </TabsContent>
                  <TabsContent value="meetings">
                    <EventList eventType="meeting" limit={5} />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AddEventDialog 
        open={isAddEventOpen} 
        onOpenChange={setIsAddEventOpen}
        courses={courses || []}
      />

      <ConnectCalendarDialog
        open={isConnectCalendarOpen}
        onOpenChange={setIsConnectCalendarOpen}
      />
    </AppLayout>
  );
};

export default CalendarPage;
