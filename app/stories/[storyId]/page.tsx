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
        if (user) fetchData();
    }, [storyId, user]);

    const fetchData = async () => {
        if (!user) return;
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[400px]">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!story) {
        return (
            <div className="text-center text-red-500 mt-10">Story not found.</div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
            <div>
                <h1 className="text-4xl font-bold mb-2">{story.title}</h1>
                <p className="text-gray-500 text-sm">By {story.author}</p>
            </div>

            {/* Media Gallery */}
            {story.mediaURLs.length > 0 && (
                <div className="space-y-2">
                    <h2 className="text-lg font-semibold">Media</h2>
                    <div className="flex overflow-x-auto gap-4 scrollbar-thin scrollbar-thumb-gray-400 py-2">
                        {story.mediaURLs.map((url: string, index: number) => (
                            <div
                                key={index}
                                className="relative flex-shrink-0 w-72 h-72 rounded-lg overflow-hidden shadow hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
                                onClick={() => setSelectedImage(url)}
                            >
                                <Image
                                    src={url}
                                    alt={`Story media ${index + 1}`}
                                    fill
                                    style={{ objectFit: "cover" }}
                                    className="rounded-lg"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    priority={index === 0}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <p className="text-lg text-gray-700">{story.description}</p>

            {/* Likes and Comment Input */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                <Button
                    onClick={handleLike}
                    variant="ghost"
                    className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                    <Heart
                        fill={hasLiked ? "red" : "none"}
                        stroke="currentColor"
                        className="w-7 h-7"
                    />
                    <span className="text-base font-medium">{story.likeCount ?? 0}</span>
                </Button>

                <div className="flex items-center gap-2 w-full">
                    <Input
                        placeholder="Add a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="text-base flex-grow"
                    />
                    <Button
                        onClick={handleComment}
                        variant="ghost"
                        className="p-2 hover:bg-primary hover:text-white"
                    >
                        <MessageCircle className="w-6 h-6" />
                    </Button>
                </div>
            </div>

            {/* Comments Section */}
            <div>
                <h2 className="text-lg font-semibold mb-2">Comments</h2>
                {comments.length === 0 ? (
                    <p className="text-gray-500">No comments yet.</p>
                ) : (
                    <ul className="space-y-3">
                        {comments.map((comment: any, index: number) => (
                            <li
                                key={index}
                                className="bg-gray-100 px-4 py-2 rounded-md shadow-sm"
                            >
                                <p className="text-sm text-gray-700">
                                    <span className="font-semibold">{comment.username}</span>:{" "}
                                    {comment.text}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Image Preview Dialog */}
            <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
                <DialogContent className="max-w-5xl p-0 overflow-hidden">
                    <DialogHeader className="p-4 border-b">
                        <DialogTitle className="text-lg">Image Preview</DialogTitle>
                        <DialogClose className="absolute right-4 top-4" />
                    </DialogHeader>
                    <div className="relative w-full h-[75vh] bg-black">
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
