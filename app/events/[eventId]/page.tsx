// app/events/[eventId]/page.tsx

"use client";

import React, { useState, useEffect, useContext } from "react";
import { fetchApi } from '@/lib/api/client';
import Image from "next/image";
    import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { AuthContext } from "@/components/auth-provider";
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
    const auth = useContext(AuthContext);

    const fetchData = async () => {
        const data = await getEventById(eventId);
        setEvent(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [eventId]);

    const handleRegister = async () => {
        try {
            const res = await fetchApi(`/events/${eventId}/attend`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: auth.user.userId,
                }),
            });

            console.log("Registered successfully:", res);
            await fetchData(); // Refresh event data
        } catch (err: any) {
            console.error("Failed to register:", err.message);
        }
    };

    const handleUnregister = async () => {
        try {
            const res = await fetchApi(`/events/${eventId}/unattend`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: auth.user.userId,
                }),
            });

            console.log("Unregistered successfully:", res);
            await fetchData(); // Refresh event data
        } catch (err: any) {
            console.error("Failed to register:", err.message);
        }
    };

    if (loading)
        return (
            <div className="flex justify-center items-center h-[400px]">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    if (!event) return <div className="text-center text-red-500 mt-10">Event not found.</div>;
    console.log(auth.user)
    const isAttending = auth?.user && event.attendees.includes(auth.user.username);

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

        {event.mediaURLs.length > 0 && (
            <div className="mb-4">
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

        {/* Show Register or Unregister based on attendance */}
        <div className="mb-6">
            {isAttending ? (
            <Button variant="destructive" onClick={handleUnregister}>
                Unregister from this event
            </Button>
            ) : (
            <Button onClick={handleRegister}>Register for this event</Button>
            )}
        </div>

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