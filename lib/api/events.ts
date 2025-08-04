import { fetchApi } from "./client";

// Types
export interface Event {
  eventId: string;
  title: string;
  description: string;
  author: string;
  calendar: string; // Changed to string to align with API
  location: string;
  attendees: string[];
  comments: string[];
  createdAt: string;
  mediaURLs: string[];
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