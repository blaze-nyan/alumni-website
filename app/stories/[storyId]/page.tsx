"use client";

import React, { useState, useEffect } from "react";
import { fetchApi } from "@/lib/api/client";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { Heart, MessageCircle } from "lucide-react";


interface Props {
    params: { storyId: string };
}

async function getStoryById(storyId: number) {
    try {
        return await fetchApi(`/stories/${storyId}`);
    } catch (err: any) {
        console.error("Error fetching story:", err.message);
        return null;
    }
}

async function getLikeStatus(storyId: number, userId: string) {
    try {
        const res = await fetchApi(`/stories/${storyId}/hasLiked?userId=${userId}`);
        return res.hasLiked;
    } catch (err) {
        console.error("Error fetching like status:", err);
        return false;
    }
}

async function getComments(storyId: number) {
    try {
        return await fetchApi(`/stories/${storyId}/comments`);
    } catch (err) {
        console.error("Error fetching comments:", err);
        return [];
    }
}

export default function StoryPageWrapper(props: Props) {
    return <StoryPage {...props} />;
}

function StoryPage({ params }: Props) {
    const storyId = parseInt(params.storyId);
    const [story, setStory] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState<any[]>([]);
    const [hasLiked, setHasLiked] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [storyId, user]);

    const fetchData = async () => {
        if (!user) return; // safety check

        setLoading(true);
        const data = await getStoryById(storyId);
        const likeStatus = await getLikeStatus(storyId, user.userId);
        const storyComments = await getComments(storyId);
        setStory(data);
        setHasLiked(likeStatus);
        setComments(storyComments);
        setLoading(false);
    };


    const handleLike = async () => {
        try {
        await fetchApi(`/stories/${storyId}/like`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.userId }),
        });
        await fetchData();
        } catch (err) {
        console.error("Like failed", err);
        }
    };

    const handleComment = async () => {
        if (!commentText.trim()) return;
        try {
        await fetchApi(`/stories/${storyId}/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            userId: user.userId,
            username: user.username,
            text: commentText.trim(),
            }),
        });
        setCommentText("");
        await fetchData();
        } catch (err) {
        console.error("Comment failed", err);
        }
    };
    if (loading)
        return (
            <div className="flex justify-center items-center h-[400px]">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    if (!story)
        return (
        <div className="text-center text-red-500 mt-10">Story not found.</div>
        );

    return (
        <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2">{story.title}</h1>
        <p className="text-gray-600 mb-4">By {story.author}</p>

        {story.mediaURLs.length > 0 && (
            <div className="mb-4">
            <div className="flex space-x-4 overflow-x-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400 p-4">
                {story.mediaURLs.map((url: string, index: number) => (
                <div
                    key={index}
                    className="relative flex-shrink-0 w-80 h-80 overflow-hidden rounded-md cursor-pointer"
                    onClick={() => setSelectedImage(url)}
                >
                    <Image
                    src={url}
                    alt={`Story media ${index + 1}`}
                    fill
                    style={{ objectFit: "cover", transition: "transform 0.3s ease" }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index === 0}
                    className="hover:scale-105"
                    />
                </div>
                ))}
            </div>
            </div>
        )}

        <p className="mb-6">{story.description}</p>
        {/* Likes and Comment input side by side */}
        <div className="mb-4 flex items-center space-x-6">
            {/* Like button with icon */}
            <Button
                onClick={handleLike}
                variant="ghost"
                className="flex items-center space-x-2 text-gray-600 hover:bg-primary transition-colors duration-200"
            >
                <Heart
                    fill={hasLiked ? "red" : "none"}
                    stroke="currentColor"
                    className="w-8 h-8"
                />
                <span className="text-lg font-medium">{story.likeCount ?? 0}</span>
            </Button>

            {/* Comment input and button in a row */}
            <div className="flex items-center space-x-2 flex-grow">
                <Input
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="text-lg"
                />
                <Button
                    onClick={handleComment}
                    variant="ghost"
                    className="p-3 text-gray-600 hover:bg-primary transition-colors duration-200"
                >
                    <MessageCircle className="w-8 h-8" />
                </Button>
            </div>
        </div>

        {/* Comments */}
        <div>
            <h2 className="text-lg font-semibold mb-2">Comments:</h2>
            {comments.length === 0 ? (
            <p className="text-gray-500">No comments yet.</p>
            ) : (
            <ul className="space-y-2">
                {comments.map((comment: any, index: number) => (
                <li key={index} className="bg-gray-100 p-2 rounded">
                    <span className="font-semibold">{comment.username}:</span>{" "}
                    <span>{comment.text}</span>
                </li>
                ))}
            </ul>
            )}
        </div>

        {/* Image preview dialog */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
            <DialogContent className="max-w-4xl max-h-[90vh] p-3">
            <DialogHeader className="p-3">
                <DialogTitle>Image Preview</DialogTitle>
                <DialogClose className="absolute right-2 top-2" />
            </DialogHeader>
            <div className="relative w-full h-[80vh]">
                {selectedImage && (
                <Image
                    src={selectedImage}
                    alt="Selected media"
                    fill
                    style={{ objectFit: "contain" }}
                />
                )}
            </div>
            </DialogContent>
        </Dialog>
        </div>
    );
}
