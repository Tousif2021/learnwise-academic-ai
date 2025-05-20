import React, { useState, useEffect } from "react";
import { format, isSameDay, addMonths, subMonths, isToday } from "date-fns";
import AppLayout from "@/components/layout/AppLayout";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { fetchCourses } from "@/services/mockData";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { CalendarPlus, CalendarClock, Link, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventList from "@/components/calendar/EventList";
import AddEventDialog from "@/components/calendar/AddEventDialog";
import ConnectCalendarDialog from "@/components/calendar/ConnectCalendarDialog";
import { useEvents } from "@/hooks/use-events";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

const CalendarPage: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [viewDate, setViewDate] = useState<Date>(new Date());
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isConnectCalendarOpen, setIsConnectCalendarOpen] = useState(false);
  const [calendarView, setCalendarView] = useState<"month" | "day">("month");

  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses
  });

  const { data: monthEvents } = useEvents({ 
    month: viewDate.getMonth(),
    year: viewDate.getFullYear()
  });

  // Function to handle day selection
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      setCalendarView("day");
    }
  };

  // Navigation functions
  const goToPreviousMonth = () => setViewDate(prevDate => subMonths(prevDate, 1));
  const goToNextMonth = () => setViewDate(prevDate => addMonths(prevDate, 1));
  const goToToday = () => {
    setViewDate(new Date());
    setDate(new Date());
  };

  // When navigating calendar months, keep selected date in sync if it's in view
  useEffect(() => {
    // Optional logic to keep selection in sync when navigating months
  }, [viewDate]);

  // Find events for the currently selected date
  const eventsOnDate = monthEvents?.filter((event) => 
    event.dueDate && isSameDay(new Date(event.dueDate), date)
  ) || [];

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Calendar Column */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-border/40 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <CalendarClock className="h-5 w-5 text-primary" />
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
              <CardContent className="pb-2">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={goToPreviousMonth}
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <h3 className="text-lg font-medium">
                      {format(viewDate, 'MMMM yyyy')}
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={goToNextMonth}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToToday}
                    className={isToday(viewDate) ? "border-primary text-primary" : ""}
                  >
                    Today
                  </Button>
                </div>
                <div className={`bg-card rounded-lg p-4 border border-border/30 shadow-sm transition-all ${calendarView === "day" ? "opacity-50" : ""}`}>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateSelect}
                    month={viewDate}
                    className="rounded-md w-full"
                    modifiers={{
                      hasEvent: monthEvents?.map(e => new Date(e.dueDate)) || [],
                    }}
                    modifiersStyles={{
                      hasEvent: { 
                        fontWeight: "bold",
                        position: "relative",
                      }
                    }}
                    styles={{
                      day_hasEvent: {
                        fontWeight: "bold",
                        position: "relative",
                      }
                    }}
                  />
                </div>
                
                {calendarView === "day" && (
                  <div className="mt-4 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCalendarView("month")}
                    >
                      Back to Month View
                    </Button>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0">
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="h-3 w-3 rounded-full bg-accent p-0" />
                    <span>Event</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="h-3 w-3 rounded-full border-primary bg-primary/20 p-0" />
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="h-3 w-3 rounded-full bg-accent/50 border border-accent-foreground/20 p-0" />
                    <span>Today</span>
                  </div>
                </div>
              </CardFooter>
            </Card>

            <Card className="border border-border/40 shadow-sm">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>
                    Events for {format(date, 'EEEE, MMMM d, yyyy')}
                  </CardTitle>
                  {eventsOnDate.length > 0 && (
                    <Badge>
                      {eventsOnDate.length} {eventsOnDate.length === 1 ? 'event' : 'events'}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {calendarView === "day" ? (
                  <div className="space-y-2">
                    {eventsOnDate.length > 0 ? (
                      <div className="space-y-4">
                        {eventsOnDate.map((event, i) => (
                          <div key={event.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted transition-colors">
                            <div className="bg-primary/10 rounded-full p-2 mt-1">
                              <Clock className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <h3 className="font-medium">{event.title}</h3>
                                <Badge variant="outline" className={`text-xs ${
                                  event.type === 'assignment' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' :
                                  event.type === 'exam' ? 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300' : 
                                  'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300'
                                }`}>
                                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                                </Badge>
                              </div>
                              {event.description && (
                                <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                              )}
                              <div className="flex items-center gap-3 mt-2">
                                {event.course && (
                                  <div 
                                    className="text-xs px-2 py-1 rounded-full" 
                                    style={{ 
                                      backgroundColor: `${event.course.color}20`, 
                                      color: event.course.color
                                    }}
                                  >
                                    {event.course.code}
                                  </div>
                                )}
                                <div className="text-xs text-muted-foreground flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {format(new Date(event.dueDate), 'h:mm a')}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-muted-foreground">
                        <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-20" />
                        <p>No events scheduled for this day</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-4"
                          onClick={() => setIsAddEventOpen(true)}
                        >
                          Add an event
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <EventList date={date} />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border border-border/40 shadow-sm">
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
              <CardFooter className="flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary"
                  onClick={() => {
                    toast({
                      title: "View all events",
                      description: "This feature would show all upcoming events in a list view."
                    });
                  }}
                >
                  View all events
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="border border-border/40 shadow-sm">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant="outline" 
                    className="h-auto flex flex-col items-center p-4 hover:bg-primary/5"
                    onClick={() => setIsAddEventOpen(true)}
                  >
                    <CalendarPlus className="h-6 w-6 mb-2 text-primary" />
                    <span className="text-sm">New Event</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-auto flex flex-col items-center p-4 hover:bg-primary/5"
                    onClick={() => setIsConnectCalendarOpen(true)}
                  >
                    <Link className="h-6 w-6 mb-2 text-primary" />
                    <span className="text-sm">Connect</span>
                  </Button>
                </div>
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
