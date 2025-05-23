
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EventType } from "@/types";
import { isSameMonth, isAfter, startOfDay } from "date-fns";

// Mock API functions that use localStorage
const fetchEvents = async (params: any = {}) => {
  await new Promise(resolve => setTimeout(resolve, 100)); // Minimal loading simulation
  
  const storedEvents = JSON.parse(localStorage.getItem('user_events') || '[]');
  let filteredEvents = storedEvents;
  
  // Filter by date if provided
  if (params.date) {
    filteredEvents = filteredEvents.filter((event: EventType) => 
      new Date(event.dueDate).toDateString() === params.date.toDateString()
    );
  }
  
  // Filter by month/year if provided
  if (params.month !== undefined && params.year !== undefined) {
    filteredEvents = filteredEvents.filter((event: EventType) => {
      const eventDate = new Date(event.dueDate);
      return eventDate.getMonth() === params.month && eventDate.getFullYear() === params.year;
    });
  }
  
  // Filter by type if provided
  if (params.type) {
    filteredEvents = filteredEvents.filter((event: EventType) => event.type === params.type);
  }
  
  // Apply limit if provided
  if (params.limit) {
    // Sort by date before limiting
    filteredEvents = filteredEvents
      .sort((a: EventType, b: EventType) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, params.limit);
  }
  
  return filteredEvents;
};

const addEventToApi = async (event: Omit<EventType, "id">) => {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
  
  const newEvent: EventType = {
    ...event,
    id: `event-${Date.now()}`
  };
  
  // Get existing events from localStorage
  const storedEvents = JSON.parse(localStorage.getItem('user_events') || '[]');
  
  // Add new event
  storedEvents.push(newEvent);
  
  // Save back to localStorage
  localStorage.setItem('user_events', JSON.stringify(storedEvents));
  
  return newEvent;
};

// Hooks
export const useEvents = (params: any = {}) => {
  return useQuery({
    queryKey: ['events', params],
    queryFn: () => fetchEvents(params),
  });
};

export const useUpcomingEvents = (limit: number = 5) => {
  return useQuery({
    queryKey: ['upcomingEvents', limit],
    queryFn: async () => {
      const storedEvents = JSON.parse(localStorage.getItem('user_events') || '[]');
      const now = new Date();
      
      // Filter for upcoming events and sort by date
      return storedEvents
        .filter((event: EventType) => isAfter(new Date(event.dueDate), startOfDay(now)))
        .sort((a: EventType, b: EventType) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, limit);
    },
  });
};

export const useAddEvent = () => {
  const [isAdding, setIsAdding] = useState(false);
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: addEventToApi,
    onSuccess: () => {
      // Invalidate all event-related queries
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['upcomingEvents'] });
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
