import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// Removed react-beautiful-dnd
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert } from "@/components/ui/alert";
import { fetchApi } from "@/lib/api/client";

type QuestionType = "text" | "number" | "select" | "radio" | "multiselect";
interface Question {
  _id: string;
  label: string;
  type: QuestionType;
  required: boolean;
  options?: string[];
  order: number;
  description?: string;
  placeholder?: string;
}

const QUESTION_TYPES: QuestionType[] = ["text", "number", "select", "radio", "multiselect"];

export default function QuestionnaireBuilder() {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([{
    _id: 'q1',
    label: 'Sample Question',
    type: 'text',
    required: false,
    options: [],
    order: 1,
    description: '',
    placeholder: 'Type your answer here',
  }]);
  const [name, setName] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [preview, setPreview] = useState(false);
  const [questionnaires, setQuestionnaires] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [isNew, setIsNew] = useState(true);
  const [version, setVersion] = useState<number>(1);
  const [isPublic, setIsPublic] = useState(false);
  const [showResponses, setShowResponses] = useState(false);
  const [responses, setResponses] = useState<any[]>([]);
  const [alert, setAlert] = useState<{ type: "success" | "error"; message: string } | null>(null);
  // Column visibility state for responses table
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
    useEffect(() => {
      if (alert) {
        const timeout = setTimeout(() => setAlert(null), 3000);
        return () => clearTimeout(timeout);
      }
    }, [alert]);

    // Show loading spinner while fetching questionnaires on mount
    useEffect(() => {
      setLoading(true);
      fetchApi("/questionnaire")
        .then((data: any[]) => setQuestionnaires(data))
        .finally(() => setLoading(false));
      setSelectedId("");
      setIsNew(true);
    }, []);
  // Fetch responses for selected questionnaire
  useEffect(() => {
    if (showResponses && selectedId) {
      fetchApi(`/questionnaire/${selectedId}/responses`).then((data: any[]) => setResponses(data));
    }
  }, [showResponses, selectedId]);

  // Update visibleColumns when responses change
  useEffect(() => {
    if (showResponses && responses.length > 0) {
      // Collect all unique questionIds
      const questionMap: Record<string, string> = {};
      responses.forEach(resp => {
        resp.answers?.forEach((ans: any) => {
          if (!questionMap[ans.questionId]) {
            questionMap[ans.questionId] = ans.label;
          }
        });
      });
      const allQuestionIds = Object.keys(questionMap);
      // If visibleColumns is empty, show all columns by default
      if (visibleColumns.length === 0) {
        setVisibleColumns(allQuestionIds);
      } else {
        // Remove columns that no longer exist
        setVisibleColumns(cols => cols.filter(c => allQuestionIds.includes(c)));
      }
    }
  }, [responses, showResponses]);

  // Fetch all questionnaires on mount
  useEffect(() => {
    fetchApi("/questionnaire")
      .then((data: any[]) => setQuestionnaires(data));
    // Select new questionnaire by default on mount
    setSelectedId("");
    setIsNew(true);
  }, []);

  // Fetch selected questionnaire
  useEffect(() => {
    if (selectedId && !isNew) {
      setLoading(true);
      fetchApi(`/questionnaire/${selectedId}`)
        .then((data: any) => {
          setName(data.name || "");
          setFormDescription(data.description || "");
          if (data.questions && data.questions.length > 0) {
            setQuestions(data.questions);
          } else {
            setQuestions([{
              _id: 'q1',
              label: 'Sample Question',
              type: 'text',
              required: false,
              options: [],
              order: 1,
              description: '',
              placeholder: 'Type your answer here',
            }]);
          }
          setVersion(data.version || 1);
          setIsPublic(!!data.public);
        })
        .finally(() => setLoading(false));
    } else {
      setName("");
      setFormDescription("");
      setQuestions([{
        _id: 'q1',
        label: 'Sample Question',
        type: 'text',
        required: false,
        options: [],
        order: 1,
        description: '',
        placeholder: 'Type your answer here',
      }]);
  setVersion(1);
  setIsPublic(false);
    }
  }, [selectedId, isNew]);

  // Add new question
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        _id: `q${questions.length + 1}`,
        label: "",
        type: "text",
        required: false,
        options: [],
        order: questions.length + 1,
        description: "",
        placeholder: "",
      },
    ]);
  };

  // Move question up
  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const reordered = [...questions];
    [reordered[idx - 1], reordered[idx]] = [reordered[idx], reordered[idx - 1]];
    reordered.forEach((q, i) => (q.order = i + 1));
    setQuestions(reordered);
  };

  // Move question down
  const moveDown = (idx: number) => {
    if (idx === questions.length - 1) return;
    const reordered = [...questions];
    [reordered[idx], reordered[idx + 1]] = [reordered[idx + 1], reordered[idx]];
    reordered.forEach((q, i) => (q.order = i + 1));
    setQuestions(reordered);
  };

  // Update question
  const updateQuestion = (idx: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    (updated[idx] as any)[field] = value;
    setQuestions(updated);
  };

  // Remove question
  const removeQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  // Save or update schema
  const saveSchema = async () => {
    if (!name.trim()) {
      setAlert({ type: "error", message: "Form name is required. Please enter a name for the questionnaire." });
      return;
    }
    setLoading(true);
    let newVersion = version;
    if (selectedId && !isNew) {
      newVersion = version + 1;
      setVersion(newVersion);
    }
    console.log(formDescription)
    console.log(isPublic)
    const payload = {
      name,
      description: formDescription,
      version: newVersion,
      questions,
      public: isPublic,
    };
    try {
      if (selectedId && !isNew) {
        await fetchApi(`/questionnaire/${selectedId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setAlert({ type: "success", message: "Questionnaire updated! Your changes have been saved." });
      } else {
        await fetchApi("/questionnaire", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        setAlert({ type: "success", message: "Questionnaire created! A new questionnaire has been created." });
        setIsNew(false);
      }
      // Refresh list
      fetchApi("/questionnaire")
        .then((data: any[]) => setQuestionnaires(data));
    } catch (err) {
      setAlert({ type: "error", message: "Failed to save questionnaire." });
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="max-w-[90vw] mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Questionnaire</h2>
      <div className="flex flex-row gap-8">
        {/* Builder Form & Responses */}
        <div className="flex-1">
          <div className="mb-4 flex gap-2">
            <Button variant={showResponses ? "outline" : "default"} onClick={() => setShowResponses(false)}>Builder</Button>
            <Button variant={showResponses ? "default" : "outline"} onClick={() => setShowResponses(true)} disabled={!selectedId}>View Responses</Button>
          </div>
          {!showResponses ? (
            <>
            <label className="block mb-2 font-medium">Select Questionnaire:</label>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex flex-row w-full items-center">
                  <div className="flex-1">
                    <Select value={isNew ? "__new__" : selectedId} onValueChange={id => {
                      if (id === "__new__") {
                        setSelectedId("");
                        setIsNew(true);
                      } else {
                        setSelectedId(id);
                        setIsNew(false);
                      }
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select or create new" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem key="__new__" value="__new__">New Questionnaire</SelectItem>
                        {questionnaires.filter(q => !q.isDeleted).map((q:any) => (
                          <SelectItem key={q._id} value={q._id}>{q.name} (v{q.version})</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {selectedId && !isNew && (
                    <>
                      <Button
                        variant="default"
                        style={{ minWidth: 100 }}
                        className="ml-2"
                        onClick={async () => {
                          setLoading(true);
                          await fetchApi(`/questionnaire/${selectedId}`, {
                            method: "DELETE",
                          });
                          setAlert({ type: "error", message: "Questionnaire deleted! The questionnaire has been deleted." });
                          setSelectedId("");
                          setIsNew(false);
                          fetchApi("/questionnaire").then((data: any[]) => setQuestionnaires(data)).finally(() => setLoading(false));
                        }}
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="flex items-center gap-2"><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /></svg>Deleting...</span>
                        ) : (
                          "Delete"
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        className="ml-2"
                        onClick={() => {
                          const url = `${process.env.NEXT_PUBLIC_APP_URL}/questionaire/${selectedId}`;
                          navigator.clipboard.writeText(url);
                          setAlert({ type: "success", message: "Questionnaire link copied to clipboard!" });
                        }}
                      >
                        Copy Link
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <AnimatePresence>
                {alert && (
                  <motion.div
                    className="w-full mb-4"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert variant={alert.type === "error" ? "destructive" : "default"}>
                      {alert.message}
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>
                <div className="flex items-center justify-between mb-2 w-full">
                <span className="font-medium">Form Name<span className="text-red-500">*</span></span>
                <span className="text-sm text-muted-foreground">Version: {version}</span>
                </div>
              <div className="flex items-center justify-between my-2">
                <div className="flex items-center gap-4 w-full">
                  <Input id="form-name" placeholder="Form Name (required)" value={name} onChange={e => setName(e.target.value)} required style={{ minWidth: 180 }} />
                  <label className="flex items-center gap-2 ml-4">
                    <span className="font-medium">Public</span>
                    <input
                      type="checkbox"
                      checked={isPublic}
                      onChange={e => setIsPublic(e.target.checked)}
                    />
                  </label>
                </div>
              </div>
              <label className="block mt-3 mb-2 font-medium" htmlFor="description">Form Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Form Description"
                value={formDescription}
                onChange={e => setFormDescription(e.target.value)}
                className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm mb-2"
              />
              <label className="block mb-3 font-medium" htmlFor="form-questions">Questions</label>

              <div>
                <AnimatePresence>
                  {questions.map((q, idx) => (
                    <motion.div
                      key={q._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ type: "tween", duration: 0.18, ease: "easeInOut" }}
                      className="mb-4"
                    >
                      <Card className="p-4">
                        <div className="mb-2 flex items-center gap-4">
                          {/* Up/Down arrow buttons */}
                          <div className="flex flex-col gap-0 mr-0">
                            <Button variant="ghost" size="icon" onClick={() => moveUp(idx)} disabled={idx === 0} aria-label="Move up" className="p-1 h-6 w-6">
                              <svg width="16" height="16" fill="none" viewBox="0 0 20 20"><path d="M10 6l-4 4h8l-4-4z" fill="currentColor"/></svg>
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => moveDown(idx)} disabled={idx === questions.length - 1} aria-label="Move down" className="p-1 h-6 w-6">
                              <svg width="16" height="16" fill="none" viewBox="0 0 20 20"><path d="M10 14l4-4H6l4 4z" fill="currentColor"/></svg>
                            </Button>
                          </div>
                          <span className="text-sm text-muted-foreground font-semibold mr-0 ml-0">{q.order}.</span>
                          <Input placeholder="Label" value={q.label} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateQuestion(idx, "label", e.target.value)} className="w-1/3" />
                          <label className="flex items-center gap-1">
                            <Checkbox checked={q.required} onCheckedChange={(checked: boolean) => updateQuestion(idx, "required", checked)} />
                            <span className="text-sm">Required</span>
                          </label>
                        </div>
                        <div className="mb-2 flex gap-4 items-center">
                          <Select value={q.type} onValueChange={(value: string) => updateQuestion(idx, "type", value as QuestionType)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {QUESTION_TYPES.map(opt => (
                                <SelectItem key={opt} value={opt}>
                                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input placeholder="Placeholder" value={q.placeholder || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateQuestion(idx, "placeholder", e.target.value)} className="w-1/3" />
                        </div>
                        <div className={q.type === "select" || q.type === "radio" || q.type === "multiselect" ? "mb-2" : "mb-4"}>
                          <textarea
                            placeholder="Description"
                            value={q.description || ""}
                            onChange={e => updateQuestion(idx, "description", e.target.value)}
                            className="w-full min-h-[60px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                          />
                        </div>
                        {(q.type === "select" || q.type === "radio" || q.type === "multiselect") && (
                          <Input placeholder="Options (comma separated)" value={q.options?.join(",") || ""} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateQuestion(idx, "options", e.target.value.split(","))} className="mb-4" />
                        )}
                        <div className="mt-2 flex justify-end">
                          <Button variant="default" size="sm" onClick={() => removeQuestion(idx)} disabled={questions.length === 1}>Remove</Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              <div className="flex gap-2 mb-4">
                <Button onClick={addQuestion}>Add Question</Button>
                <Button variant="outline" onClick={() => setPreview(!preview)}>{preview ? "Hide Preview" : "Show Preview"}</Button>
                <Button variant="default" onClick={saveSchema} disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2"><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /></svg>Saving...</span>
                  ) : (
                    "Save Questionnaire"
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Responses</h3>
              {/* Column toggles */}
              {responses.length > 0 && (() => {
                // Collect all unique questionIds and their labels
                const questionMap: Record<string, string> = {};
                responses.forEach(resp => {
                  resp.answers?.forEach((ans: any) => {
                    if (!questionMap[ans.questionId]) {
                      questionMap[ans.questionId] = ans.label;
                    }
                  });
                });
                const allQuestionIds = Object.keys(questionMap);
                return (
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="text-sm font-medium mr-2">Show/Hide Columns:</span>
                    {allQuestionIds.map(qid => (
                      <label key={qid} className="flex items-center gap-1 text-xs">
                        <input
                          type="checkbox"
                          checked={visibleColumns.includes(qid)}
                          onChange={e => {
                            setVisibleColumns(cols =>
                              e.target.checked
                                ? [...cols, qid]
                                : cols.filter(c => c !== qid)
                            );
                          }}
                        />
                        {questionMap[qid].length > 18 ? (
                          <span
                            className="max-w-[120px] truncate cursor-pointer"
                            title={questionMap[qid]}
                          >
                            {questionMap[qid].slice(0, 18) + "..."}
                          </span>
                        ) : (
                          <span>{questionMap[qid]}</span>
                        )}
                      </label>
                    ))}
                  </div>
                );
              })()}
              <Button
                variant="outline"
                className="mb-2"
                onClick={() => {
                  // Export to Excel (only visible columns)
                  const questionMap: Record<string, string> = {};
                  responses.forEach(resp => {
                    resp.answers?.forEach((ans: any) => {
                      if (!questionMap[ans.questionId]) {
                        questionMap[ans.questionId] = ans.label;
                      }
                    });
                  });
                  const allQuestionIds = Object.keys(questionMap);
                  const exportColumns = allQuestionIds.filter(qid => visibleColumns.includes(qid));
                  const header = ["#", "User ID", ...exportColumns.map(qid => questionMap[qid])];
                  const rows = responses.map((resp, i) => [
                    i + 1,
                    resp.userId,
                    ...exportColumns.map(qid => {
                      const ansObj = resp.answers?.find((a: any) => a.questionId === qid);
                      return ansObj ? ansObj.answer : "";
                    })
                  ]);
                  const csv = [header, ...rows].map(r => r.map(x => `"${String(x).replace(/"/g, '""')}"`).join(",")).join("\n");
                  const blob = new Blob([csv], { type: "text/csv" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `responses_${name || "questionnaire"}.csv`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
              >Export to Excel</Button>
              {responses.length === 0 ? (
                <div className="text-muted-foreground">No responses found.</div>
              ) : (
                <div className="overflow-x-auto max-h-[60vh]">
                  {(() => {
                    // Collect all unique questionIds and their labels
                    const questionMap: Record<string, string> = {};
                    responses.forEach(resp => {
                      resp.answers?.forEach((ans: any) => {
                        if (!questionMap[ans.questionId]) {
                          questionMap[ans.questionId] = ans.label;
                        }
                      });
                    });
                    const allQuestionIds = Object.keys(questionMap);
                    const shownColumns = allQuestionIds.filter(qid => visibleColumns.includes(qid));
                    return (
                      <table className="min-w-full border text-sm">
                        <thead>
                          <tr>
                            <th className="border px-2 py-1">#</th>
                            <th className="border px-2 py-1">User</th>
                            {shownColumns.map(qid => (
                              <th
                                key={qid}
                                className="border px-2 py-1 max-w-[160px] truncate cursor-pointer"
                                title={questionMap[qid]}
                              >
                                {questionMap[qid].length > 18
                                  ? questionMap[qid].slice(0, 18) + "..."
                                  : questionMap[qid]}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {responses.map((resp, i) => (
                            <tr key={resp._id || i}>
                              <td className="border px-2 py-1 font-semibold">{i + 1}</td>
                              <td className="border px-2 py-1">{resp.displayName}</td>
                              {shownColumns.map(qid => {
                                const ansObj = resp.answers?.find((a: any) => a.questionId === qid);
                                return (
                                  <td key={qid} className="border px-2 py-1">{ansObj ? ansObj.answer : ""}</td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    );
                  })()}
                </div>
              )}
            </div>
          )}
        </div>
        {/* Live Preview */}
        {preview && (
          <div className="flex-1 border-l pl-8">
            <h3 className="text-lg font-semibold mb-2">{name || "Form"} (Live Preview)</h3>
            {formDescription && (
              <div className="mb-6 text-base text-muted-foreground whitespace-pre-line">{formDescription}</div>
            )}
            <form>
              {questions.map(q => (
                <div key={q._id} className="mb-6">
                  <div className="bg-card rounded-lg p-4 shadow-sm">
                    <div className="mb-1 flex items-center gap-2">
                      <span className="block text-base font-medium mb-1 text-muted-foreground">{q.order}.</span>
                      <label className="block text-base font-medium mb-1">{q.label}{q.required && " *"}</label>
                    </div>
                    {q.description && <div className="text-xs text-muted-foreground mb-2">{q.description}</div>}
                    <div>
                      {q.type === "text" && <Input placeholder={q.placeholder} />}
                      {q.type === "number" && <Input type="number" placeholder={q.placeholder} />}
                      {q.type === "select" && (
                        <Select>
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
                              <input type="radio" name={q._id} value={opt} />
                              {opt}
                            </label>
                          ))}
                        </div>
                      )}
                      {q.type === "multiselect" && (
                        <div className="flex flex-col gap-2 mt-2">
                          {q.options?.filter(opt => opt !== "").map(opt => (
                            <label key={opt} className="flex items-center gap-2">
                              <input type="checkbox" name={q._id} value={opt} />
                              {opt}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
