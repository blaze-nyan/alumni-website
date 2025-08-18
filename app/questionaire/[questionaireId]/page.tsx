"use client"

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { fetchApi } from "@/lib/api/client";
import QuestionnaireFiller from "@/components/questionnaire-filler";

export default function QuestionaireFillerPage() {
  const { questionaireId } = useParams();
  const { user } = useAuth();
  const [questionnaire, setQuestionnaire] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (questionaireId) {
      setLoading(true);
      fetchApi(`/questionnaire/${questionaireId}`)
        .then((data: any) => setQuestionnaire(data))
        .finally(() => setLoading(false));
    }
  }, [questionaireId]);

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
        <div className="text-xl font-semibold mb-2 text-center">Loading questionnaire...</div>
      </div>
    </div>
  );
  if (!questionnaire || !questionnaire.public) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-card rounded-lg shadow p-8 flex flex-col items-center max-w-md w-full">
        <svg width="40" height="40" fill="none" viewBox="0 0 24 24" className="mb-4 text-muted-foreground"><path d="M12 12v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <div className="text-xl font-semibold mb-2 text-center">Questionnaire not found.</div>
      </div>
    </div>
  );

  return (
    <div className="container py-8 md:py-12">
      <QuestionnaireFiller questionnaire={questionnaire} userId={user.userId} />
    </div>
  );
}
