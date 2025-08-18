"use client"

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { fetchApi } from "@/lib/api/client";

type QuestionType = "text" | "number" | "select" | "radio" | "multiselect";
interface Question {
  _id: string;
  label: string;
  description?: string
  placeholder?: string;
  type: QuestionType;
  required: boolean;
  options?: string[];
}
interface QuestionnaireSchema {
  _id: string;
  name: string;
  description: string;
  isDeleted?: boolean;
  version: number;
  questions: Question[];
}

interface Props {
  questionnaire?: QuestionnaireSchema;
  questionnaireId?: string;
  userId: string;
}

export default function QuestionnaireFiller({ questionnaire, questionnaireId, userId }: Props) {
  const [schema, setSchema] = useState<QuestionnaireSchema | null>(questionnaire || null);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!questionnaire && questionnaireId) {
      setLoading(true);
      fetchApi(`/questionnaire/${questionnaireId}`)
        .then((data: QuestionnaireSchema) => setSchema(data))
        .catch(() => setError("Failed to load questionnaire."))
        .finally(() => setLoading(false));
    }
  }, [questionnaire, questionnaireId]);

  if (loading || !schema) return <div>Loading...</div>;
  if (loading || !schema) return <div>Loading...</div>;
  if (submitted) {
    return (
      <div className="w-full p-8 flex flex-col items-center justify-center min-h-[300px]">
        <h2 className="text-2xl font-bold mb-4">Thank you for submitting!</h2>
        <div className="text-base text-muted-foreground mb-4">Your responses have been recorded.</div>
      </div>
    );
  }

  const handleChange = (qid: string, value: string | string[]) => {
    setAnswers({ ...answers, [qid]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required
    for (const q of schema.questions) {
      if (q.required && (!answers[q._id] || (Array.isArray(answers[q._id]) && answers[q._id].length === 0))) {
        setError(`Please fill: ${q.label}`);
        return;
      }
    }
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        userId,
        answers: schema.questions.map(q => {
          let answer = answers[q._id];
          if (!answer || (Array.isArray(answer) && answer.length === 0)) {
            answer = q.required ? "" : "N/A";
          }
          return {
            questionId: q._id,
            answer: Array.isArray(answer)
              ? (answer as string[]).join(",")
              : answer
          };
        })
      };
      await fetchApi(`/questionnaire/${schema._id}/submit`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      toast({ title: "Submitted!" });
      setSubmitted(true);
    } catch {
      setError("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
  <div className="w-full p-4">
      <h2 className="text-2xl font-bold mb-2">{schema.name}</h2>
      {schema.description && (
        <div className="mb-6 text-base text-muted-foreground whitespace-pre-line">{schema.description}</div>
      )}
      <form onSubmit={handleSubmit}>
        {schema.questions.map((q, idx) => (
          <Card key={q._id} className="mb-4 p-4">
            <div className="mb-2 flex items-center gap-4">
              <span className="text-sm text-muted-foreground font-semibold mr-0 ml-0">{idx + 1}.</span>
              <label className="block text-base font-medium mb-1">{q.label}{q.required && " *"}</label>
            </div>
            {q.description && <div className="text-xs text-muted-foreground mb-2">{q.description}</div>}
            <div>
              {q.type === "text" && (
                <Input
                  placeholder={q.placeholder}
                  value={answers[q._id] || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(q._id, e.target.value)}
                  disabled={submitting}
                />
              )}
              {q.type === "number" && (
                <Input
                  type="number"
                  placeholder={q.placeholder}
                  value={answers[q._id] || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(q._id, e.target.value)}
                  disabled={submitting}
                />
              )}
              {q.type === "select" && (
                <Select
                  value={Array.isArray(answers[q._id]) ? "" : (answers[q._id] as string | undefined) || ""}
                  onValueChange={value => handleChange(q._id, value)}
                  disabled={submitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={q.placeholder || "Select Option"} />
                  </SelectTrigger>
                  <SelectContent>
                    {q.options?.filter(opt => opt !== "").map(opt => (
                      <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {q.type === "radio" && (
                <div className="flex gap-4 mt-2">
                  {q.options?.filter(opt => opt !== "").map(opt => (
                    <label key={opt} className="flex items-center gap-1">
                      <input
                        type="radio"
                        name={q._id}
                        value={opt}
                        checked={answers[q._id] === opt}
                        onChange={() => handleChange(q._id, opt)}
                        disabled={submitting}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}
              {q.type === "multiselect" && (
                <div className="flex flex-col gap-2 mt-2">
                  {q.options?.filter(opt => opt !== "").map(opt => (
                    <label key={opt} className="flex items-center gap-2">
                      <Checkbox
                        checked={Array.isArray(answers[q._id]) ? answers[q._id].includes(opt) : false}
                        onCheckedChange={checked => {
                          const prev: string[] = Array.isArray(answers[q._id])
                            ? answers[q._id] as string[]
                            : typeof answers[q._id] === "string" && answers[q._id]
                              ? [answers[q._id] as string]
                              : [];
                          if (checked) {
                            handleChange(q._id, [...prev, opt]);
                          } else {
                            handleChange(q._id, prev.filter((v: string) => v !== opt));
                          }
                        }}
                        disabled={submitting}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </Card>
        ))}
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <Button type="submit" variant="default" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
}
