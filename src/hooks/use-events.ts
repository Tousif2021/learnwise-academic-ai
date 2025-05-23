
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { EventType } from "@/types";
import { isSameMonth } from "date-fns";

// Empty events data - users need to create their own events
const eventsData: EventType[] = [];

// Mock API functions
const fetchEvents = async (params: any = {}) => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  
  // Return empty array - users need to add their own events
  return [];
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
