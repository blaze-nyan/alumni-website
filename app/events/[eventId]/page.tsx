// app/events/[eventId]/page.tsx

import { fetchApi } from '@/lib/api/client';
import React from 'react';


async function getEventById(eventId: number) {
    try {
        const response = await fetchApi(`/events/${eventId}`);
        return response;
    } catch (err: any) {
        console.error("Error fetching story:", err.message);
        return null;
    }
}
interface Props {
    params: { eventId: string };
}

export default async function EventPage({ params }: Props) {
    const eventId = parseInt(params.eventId);
    const event = await getEventById(eventId);

    if (!event) {
        return <div className="text-center text-red-500 mt-10">Event not found.</div>;
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
        <p className="text-gray-600 mb-4">By {event.author} • {new Date(event.calendar).toLocaleString()}</p>
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

        {event.mediaIDs.length > 0 && (
            <div className="mb-4">
            <strong>Media:</strong>
            <ul className="list-disc ml-6">
                {event.mediaIDs.map((id: string, index: number) => (
                <li key={index}>{id}</li> // You can replace with actual media rendering later
                ))}
            </ul>
            </div>
        )}
        </div>
    );
    }
