import { fetchApi } from "./client";

// Types
export interface Story {
  successStoryId?: number;
  id?: string;
  title: string;
  description: string;
  author:
    | {
        id: string;
        firstname: string;
        lastname: string;
        username: string;
        profileImage?: string;
      }
    | string;
  authorId?: number;
  mediaIds?: string[];
  mediaUrls?: string[];
  mediaURLs?: string[];
  likes?: number;
  likeCount?: number;
  comments?: number;
  commentCount?: number;
  approved?: boolean;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Comment {
  storyId: number;
  userId: number;
  username: string;
  text: string;
  createdAt: string;
}

export interface Like {
  userId: number;
  storyId: number;
  createdAt: string;
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
  author: string;
  authorId: number;
  mediaDataArray?: {
    base64data: string;
  }[];
}

// API Functions
export async function getStories(
  page = 1,
  limit = 10
): Promise<StoriesResponse> {
  return fetchApi(`/stories?page=${page}&limit=${limit}`);
}

export async function getFeaturedStories(): Promise<Story[]> {
  return fetchApi("/stories/featured");
}

export async function getStoryById(id: string): Promise<Story> {
  return fetchApi(`/stories/${id}`);
}

export async function createStory(data: CreateStoryData): Promise<Story> {
  return fetchApi("/stories", {
    method: "POST",
    body: JSON.stringify({
      storyData: {
        title: data.title,
        description: data.description,
        author: data.author,
        authorId: data.authorId,
      },
      mediaDataArray: data.mediaDataArray || [],
    }),
  });
}

export async function updateStory(
  id: string,
  data: Partial<CreateStoryData>
): Promise<Story> {
  return fetchApi(`/stories/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteStory(id: string): Promise<{ message: string }> {
  return fetchApi(`/stories/${id}`, {
    method: "DELETE",
  });
}

export async function likeStory(
  storyId: string,
  userId: string
): Promise<{ likes: number; liked: boolean }> {
  return fetchApi(`/stories/${storyId}/like`, {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
}

export async function getLikeCount(
  storyId: string
): Promise<{ likes: number }> {
  return fetchApi(`/stories/${storyId}/likes`);
}

export async function hasUserLikedStory(
  storyId: string,
  userId: string
): Promise<{ liked: boolean }> {
  return fetchApi(`/stories/${storyId}/hasLiked?userId=${userId}`);
}

export async function addComment(
  storyId: string,
  userId: string,
  username: string,
  text: string
): Promise<Comment> {
  return fetchApi(`/stories/${storyId}/comments`, {
    method: "POST",
    body: JSON.stringify({ userId, username, text }),
  });
}

export async function getStoryComments(storyId: string): Promise<Comment[]> {
  return fetchApi(`/stories/${storyId}/comments`);
}

export async function getUserStories(userId: string): Promise<Story[]> {
  return fetchApi(`/users/${userId}/stories`);
}

// Admin functions for story approval
export async function getPendingStories(): Promise<Story[]> {
  return fetchApi("/stories/unapproved");
}

export async function approveStory(
  storyId: string
): Promise<{ message: string }> {
  return fetchApi(`/stories/${storyId}/approve`, {
    method: "POST",
  });
}

export async function rejectStory(
  storyId: string
): Promise<{ message: string }> {
  return fetchApi(`/stories/${storyId}`, {
    method: "DELETE",
  });
}

export async function getAllStoriesForAdmin(): Promise<Story[]> {
  return fetchApi("/stories");
}
