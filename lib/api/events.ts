import { fetchApi } from "./client";

// Types
export interface Event {
  id: string;
  title: string;
  description: string;
  author: {
    id: string;
    firstname: string;
    lastname: string;
    username: string;
    profileImage?: string;
  };
  calendar: {
    date: string;
    location: string;
  };
  attendees: string[];
  mediaIds: string[];
  mediaUrls?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EventsResponse {
  events: Event[];
  page: number;
  pages: number;
  total: number;
  hasMore: boolean;
}

export interface CreateEventData {
  title: string;
  description: string;
  date: string;
  location: string;
  mediaFiles?: {
    type: string;
    data: string;
  }[];
}

// API Functions
export async function getEvents(page = 1, limit = 10): Promise<EventsResponse> {
  return fetchApi<EventsResponse>(`/events?page=${page}&limit=${limit}`);
}

export async function getUpcomingEvents(): Promise<Event[]> {
  return fetchApi<Event[]>("/events/upcoming");
}

export async function getEventById(id: string): Promise<Event> {
  return fetchApi<Event>(`/events/${id}`);
}

export async function createEvent(data: CreateEventData): Promise<Event> {
  return fetchApi<Event>("/events", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateEvent(
  id: string,
  data: Partial<CreateEventData>
): Promise<Event> {
  return fetchApi<Event>(`/events/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteEvent(id: string): Promise<{ message: string }> {
  return fetchApi<{ message: string }>(`/events/${id}`, {
    method: "DELETE",
  });
}

export async function registerForEvent(
  id: string
): Promise<{ registered: boolean; message: string }> {
  return fetchApi<{ registered: boolean; message: string }>(
    `/events/${id}/register`,
    {
      method: "POST",
    }
  );
}

export async function getUserEvents(userId: string): Promise<Event[]> {
  return fetchApi<Event[]>(`/users/${userId}/events`);
}
