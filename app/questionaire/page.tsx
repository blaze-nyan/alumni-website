"use client"

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { fetchApi } from "@/lib/api/client";

export default function QuestionairePage() {
  const { user } = useAuth();
  const [questionnaires, setQuestionnaires] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchApi("/questionnaire-public")
      .then((data: any[]) => {
        const filtered = data.filter(q => !q.isDeleted);
        setQuestionnaires(filtered);
      })
      .finally(() => setLoading(false));
  }, []);

  if (!user) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-card rounded-lg shadow p-8 flex flex-col items-center max-w-md w-full">
        <svg width="40" height="40" fill="none" viewBox="0 0 24 24" className="mb-4 text-muted-foreground"><path d="M12 12v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <div className="text-xl font-semibold mb-2 text-center">Please log in to fill out the questionnaire.</div>
      </div>
    </div>
  );
  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-card rounded-lg shadow p-8 flex flex-col items-center max-w-md w-full">
        <svg width="40" height="40" fill="none" viewBox="0 0 24 24" className="mb-4 text-muted-foreground animate-spin"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /></svg>
        <div className="text-xl font-semibold mb-2 text-center">Loading questionnaires...</div>
      </div>
    </div>
  );

  return (

    <div className="container py-8 md:py-12">
      
    <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
        <div>
        <h1 className="text-3xl font-bold mb-2">Surveys and Questionnaires</h1>
        <p className="text-muted-foreground">
            Fill out our surveys and questionnaires to help us understand your needs and improve our services.
        </p>
        </div>
    </div>
      {questionnaires.length === 0 ? (
        <div>No questionnaires available.</div>
      ) : (
        <div className="overflow-x-auto w-full">
          <div className="flex flex-row gap-6 py-2">
            {questionnaires.map(q => (
              <Link
                key={q._id}
                href={`/questionaire/${q._id}`}
                className="min-w-[340px] max-w-[800px] flex-shrink-0 border rounded-lg p-6 shadow hover:shadow-lg transition-all bg-background cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="font-semibold text-xl mb-2 truncate" title={q.name}>{q.name}</div>
                  <div
                    className="text-sm text-muted-foreground mb-3 whitespace-pre-line truncate"
                    title={q.description}
                  >
                    {q.description && q.description.length > 300
                      ? q.description.slice(0, 300) + "..."
                      : q.description}
                  </div>
                </div>
                <div className="flex flex-row justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground">Questions: {q.questions?.length ?? 0}</span>
                  <span className="text-xs text-muted-foreground">Version: {q.version}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
