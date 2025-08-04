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
            await fetchApi(`/events/${eventId}/attend`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: auth.user.userId }),
            });
            await fetchData();
        } catch (err: any) {
            console.error("Failed to register:", err.message);
        }
    };

    const handleUnregister = async () => {
        try {
            await fetchApi(`/events/${eventId}/unattend`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: auth.user.userId }),
            });
            await fetchData();
        } catch (err: any) {
            console.error("Failed to unregister:", err.message);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[400px]">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!event) {
        return (
            <div className="text-center text-red-500 mt-10">
                Event not found.
            </div>
        );
    }

    const isAttending = auth?.user && event.attendees.includes(auth.user.username);

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-extrabold mb-2">{event.title}</h1>
                <p className="text-gray-500 text-sm">
                    By <span className="font-semibold">Admin</span> •{" "}
                    {new Date(event.calendar).toLocaleString()}
                </p>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-700">{event.description}</p>

            {/* Location */}
            <div className="text-gray-600">
                <span className="font-semibold">Location:</span> {event.location}
            </div>

            {/* Media Gallery */}
            {event.mediaURLs.length > 0 && (
                <div className="space-y-2">
                    <h2 className="text-lg font-semibold">Media</h2>
                    <div className="flex overflow-x-auto gap-4 scrollbar-thin scrollbar-thumb-gray-400 py-2">
                        {event.mediaURLs.map((url: string, index: number) => (
                            <div
                                key={index}
                                className="relative flex-shrink-0 w-72 h-72 rounded-lg overflow-hidden shadow hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
                                onClick={() => setSelectedImage(url)}
                            >
                                <Image
                                    src={url}
                                    alt={`Event media ${index + 1}`}
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

            {/* Attendees */}
            <div>
                <h2 className="text-lg font-semibold mb-1">Attendees</h2>
                <ul className="list-disc ml-6 text-gray-700">
                    {event.attendees.length > 0 ? (
                        event.attendees.map((attendee: string, index: number) => (
                            <li key={index}>{attendee}</li>
                        ))
                    ) : (
                        <li>No attendees yet.</li>
                    )}
                </ul>
            </div>

            {/* Register / Unregister Button */}
            <div>
                {isAttending ? (
                    <Button variant="destructive" onClick={handleUnregister}>
                        Unregister from this event
                    </Button>
                ) : (
                    <Button onClick={handleRegister}>Register for this event</Button>
                )}
            </div>

            {/* Image Dialog */}
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
