
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EventType } from "@/types";

// Simulated event data service
const eventsData: EventType[] = [
  {
    id: "event1",
    title: "Linear Regression Assignment",
    type: "assignment",
    course: {
      id: "course-1",
      title: "Introduction to Computer Science",
      code: "CS101",
      color: "#2563eb",
    },
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    description: "Complete problems 1-5 from Chapter 4"
  },
  {
    id: "event2",
    title: "Midterm Exam",
    type: "exam",
    course: {
      id: "course-2",
      title: "Calculus II",
      code: "MATH201",
      color: "#db2777",
    },
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    description: "Covers Chapters 1-5"
  },
  {
    id: "event3",
    title: "Group Project Meeting",
    type: "meeting",
    course: {
      id: "course-3",
      title: "College Writing",
      code: "ENG102",
      color: "#6d28d9",
    },
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    description: "Discuss progress on the final paper"
  }
];

// Mock API functions
const fetchEvents = async (params: any = {}) => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  
  let filteredEvents = [...eventsData];
  
  // Filter by date if provided
  if (params.date) {
    const filterDate = new Date(params.date);
    filteredEvents = filteredEvents.filter(event => {
      const eventDate = new Date(event.dueDate);
      return (
        eventDate.getFullYear() === filterDate.getFullYear() &&
        eventDate.getMonth() === filterDate.getMonth() &&
        eventDate.getDate() === filterDate.getDate()
      );
    });
  }
  
  // Filter by type if provided
  if (params.type) {
    filteredEvents = filteredEvents.filter(event => event.type === params.type);
  }
  
  // Limit results if specified
  if (params.limit && params.limit > 0) {
    filteredEvents = filteredEvents.slice(0, params.limit);
  }
  
  return filteredEvents;
};

const addEventToApi = async (event: Omit<EventType, "id">) => {
  await new Promise(resolve => setTimeout(resolve, 700)); // Simulate API delay
  
  const newEvent: EventType = {
    ...event,
    id: `event-${Date.now()}`
  };
  
  eventsData.push(newEvent);
  return newEvent;
};

// Hooks
export const useEvents = (params: any = {}) => {
  return useQuery({
    queryKey: ['events', params],
    queryFn: () => fetchEvents(params),
  });
};

export const useAddEvent = () => {
  const [isAdding, setIsAdding] = useState(false);
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: addEventToApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    }
  });
  
  const addEvent = async (eventData: Omit<EventType, "id">) => {
    setIsAdding(true);
    try {
      await mutation.mutateAsync(eventData);
    } finally {
      setIsAdding(false);
    }
  };
  
  return { addEvent, isAdding };
};
