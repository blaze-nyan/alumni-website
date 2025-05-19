// app/events/[eventId]/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { fetchApi } from '@/lib/api/client';
import Image from "next/image";
    import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";

    interface Props {
    params: { eventId: string };
}

async function getEventById(eventId: number) {
    try {
        const response = await fetchApi(`/events/${eventId}`);
        return response;
    } catch (err: any) {
        console.error("Error fetching event:", err.message);
        return null;
    }
}

export default function EventPageWrapper(props: Props) {
    return <EventPage {...props} />;
}

function EventPage({ params }: Props) {
    const eventId = parseInt(params.eventId);
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
        const data = await getEventById(eventId);
        setEvent(data);
        setLoading(false);
        }
        fetchData();
    }, [eventId]);

    if (loading) return <div>Loading...</div>;
    if (!event) return <div className="text-center text-red-500 mt-10">Event not found.</div>;

    return (
        <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
        <p className="text-gray-600 mb-4">
            By {event.author} • {new Date(event.calendar).toLocaleString()}
        </p>
        <p className="mb-6">{event.description}</p>

        <div className="mb-4">
            <strong>Location:</strong> {event.location}
        </div>

        <div className="mb-4">
            <strong>Attendees:</strong>
            <ul className="list-disc ml-6">
            {event.attendees.length > 0 ? (
                event.attendees.map((attendee: string, index: number) => (
                <li key={index}>{attendee}</li>
                ))
            ) : (
                <li>No attendees yet.</li>
            )}
            </ul>
        </div>

        {event.mediaURLs.length > 0 && (
            <div className="mb-4">
            <strong>Media:</strong>
            <div className="flex space-x-4 overflow-x-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400 p-4">
                {event.mediaURLs.map((url: string, index: number) => (
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
