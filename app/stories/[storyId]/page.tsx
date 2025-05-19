"use client"; // Needed for client-side interactivity

import React, { useState } from "react";
import { fetchApi } from '@/lib/api/client';
import Image from 'next/image';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";  // Adjust if your dialog export differs

interface Props {
    params: { storyId: string };
}

async function getStoryById(storyId: number) {
    try {
        const response = await fetchApi(`/stories/${storyId}`);
        return response;
    } catch (err: any) {
        console.error("Error fetching story:", err.message);
        return null;
    }
}

export default function StoryPageWrapper(props: Props) {
    return <StoryPage {...props} />;
    }

function StoryPage({ params }: Props) {
    const storyId = parseInt(params.storyId);
    const [story, setStory] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    React.useEffect(() => {
        async function fetchData() {
        const data = await getStoryById(storyId);
        setStory(data);
        setLoading(false);
        }
        fetchData();
    }, [storyId]);

    if (loading) return <div>Loading...</div>;
    if (!story) return <div className="text-center text-red-500 mt-10">Story not found.</div>;

    return (
        <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2">{story.title}</h1>
        <p className="text-gray-600 mb-4">By {story.author}</p>
        <p className="mb-6">{story.description}</p>

        {story.mediaURLs.length > 0 && (
        <div className="mb-4">
            <strong>Media:</strong>
            <div className="flex space-x-4 overflow-x-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400 p-4">
            {story.mediaURLs.map((url: string, index: number) => (
                <div
                key={index}
                className="relative flex-shrink-0 w-80 h-80 overflow-hidden rounded-md cursor-pointer"
                onClick={() => setSelectedImage(url)}
                >
                <Image
                    src={url}
                    alt={`Event media ${index + 1}`}
                    fill
                    style={{
                    objectFit: "cover",
                    transition: "transform 0.3s ease",
                    }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index === 0}
                    className="hover:scale-105"
                />
                </div>
            ))}
            </div>
        </div>
        )}


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
