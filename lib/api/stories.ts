import { fetchApi } from "./client";

// Types
export interface Story {
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
  mediaIds: string[];
  mediaUrls?: string[];
  likes: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
}

export interface StoriesResponse {
  stories: Story[];
  page: number;
  pages: number;
  total: number;
  hasMore: boolean;
}

export interface CreateStoryData {
  title: string;
  description: string;
  mediaFiles?: {
    type: string;
    data: string;
  }[];
}

// API Functions
export async function getStories(
  page = 1,
  limit = 10
): Promise<StoriesResponse> {
  return fetchApi<StoriesResponse>(`/stories?page=${page}&limit=${limit}`);
}

export async function getFeaturedStories(): Promise<Story[]> {
  return fetchApi<Story[]>("/stories/featured");
}

export async function getStoryById(id: string): Promise<Story> {
  return fetchApi<Story>(`/stories/${id}`);
}

export async function createStory(data: CreateStoryData): Promise<Story> {
  return fetchApi<Story>("/stories", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateStory(
  id: string,
  data: Partial<CreateStoryData>
): Promise<Story> {
  return fetchApi<Story>(`/stories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteStory(id: string): Promise<{ message: string }> {
  return fetchApi<{ message: string }>(`/stories/${id}`, {
    method: "DELETE",
  });
}

export async function likeStory(
  id: string
): Promise<{ likes: number; liked: boolean }> {
  return fetchApi<{ likes: number; liked: boolean }>(`/stories/${id}/like`, {
    method: "POST",
  });
}

export async function addComment(
  storyId: string,
  content: string
): Promise<any> {
  return fetchApi<any>(`/stories/${storyId}/comments`, {
    method: "POST",
    body: JSON.stringify({ content }),
  });
}

export async function getUserStories(userId: string): Promise<Story[]> {
  return fetchApi<Story[]>(`/users/${userId}/stories`);
}
