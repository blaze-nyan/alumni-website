// app/stories/[storyId]/page.tsx

export const dynamic = "force-dynamic"; // disables caching for dev/debug
import { fetchApi } from '@/lib/api/client';

interface Props {
    params: { storyId: string };
}

async function getStoryById(storyId: number) {
    try {
        const response = await fetchApi(`/stories/${storyId}`); // adjust API route
        return response;
    } catch (err: any) {
        console.error("Error fetching story:", err.message);
        return null;
    }
}

export default async function StoryPage({ params }: Props) {
    const storyId = parseInt(params.storyId);
    const story = await getStoryById(storyId);

    if (!story) {
        return <div className="text-center text-red-500 mt-10">Story not found.</div>;
    }

    return (
        <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-2">{story.title}</h1>
        <p className="text-gray-600 mb-4">By {story.author}</p>
        <p className="mb-6">{story.description}</p>

        {story.mediaIDs.length > 0 && (
            <div className="mb-4">
            <strong>Media:</strong>
            <ul className="list-disc ml-6">
                {story.mediaIDs.map((id: string, index: number) => (
                <li key={index}>{id}</li> // replace with actual image or media rendering if needed
                ))}
            </ul>
            </div>
        )}
        </div>
    );
    }
