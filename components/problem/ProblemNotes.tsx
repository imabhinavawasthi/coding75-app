"use client";

import React, { useState } from "react";
import { Plus, Trash2, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserNote } from "@/lib/user-states";

interface ProblemNotesProps {
  itemId: string;
  notes: UserNote[];
  isLoggedIn: boolean;
  onSaveNotes: (notes: UserNote[]) => Promise<void>;
}

export const ProblemNotes: React.FC<ProblemNotesProps> = ({
  itemId,
  notes: initialNotes,
  isLoggedIn,
  onSaveNotes,
}) => {
  const [notes, setNotes] = useState<UserNote[]>(initialNotes || []);
  const [newNoteText, setNewNoteText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  React.useEffect(() => {
    setNotes(initialNotes || []);
  }, [initialNotes]);

  if (!isLoggedIn) {
    return (
      <div className="py-12 text-center space-y-3 bg-card border rounded-2xl p-6">
        <FileText size={36} className="mx-auto text-muted-foreground/50" />
        <h3 className="text-sm font-bold text-foreground">Sign In to Save Notes</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Keep your edge-case thoughts, key insights, and complexity formulas attached directly to this problem.
        </p>
      </div>
    );
  }

  const handleAddNote = async () => {
    if (!newNoteText.trim() || isSubmitting) return;

    const newNote: UserNote = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      text: newNoteText.trim(),
      created_at: new Date().toISOString(),
    };

    const updated = [newNote, ...notes];
    setNotes(updated);
    setNewNoteText("");

    setIsSubmitting(true);
    try {
      await onSaveNotes(updated);
    } catch (err) {
      console.error("Failed to add note:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    const updated = notes.filter((n) => n.id !== noteId);
    setNotes(updated);

    try {
      await onSaveNotes(updated);
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Add note box */}
      <div className="p-4 rounded-2xl border bg-card space-y-3 shadow-xs">
        <label className="text-xs font-bold text-foreground flex items-center gap-2">
          <FileText size={14} className="text-primary" />
          <span>Add Study Note</span>
        </label>
        <textarea
          rows={3}
          value={newNoteText}
          onChange={(e) => setNewNoteText(e.target.value)}
          placeholder="Jot down key patterns, edge cases, or intuition for quick revision..."
          className="w-full text-xs p-3 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-y"
        />
        <div className="flex justify-end">
          <Button
            size="sm"
            onClick={handleAddNote}
            disabled={!newNoteText.trim() || isSubmitting}
            className="gap-1.5 text-xs font-bold"
          >
            <Plus size={14} />
            <span>{isSubmitting ? "Saving..." : "Save Note"}</span>
          </Button>
        </div>
      </div>

      {/* Notes List */}
      <div className="space-y-3">
        {notes.length === 0 ? (
          <p className="text-center py-8 text-xs text-muted-foreground italic">
            No notes saved for this problem yet.
          </p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="p-4 rounded-xl border bg-card/60 flex items-start justify-between gap-3 group"
            >
              <div className="space-y-1.5 flex-1 min-w-0">
                <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                  {note.text}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
                  <Calendar size={10} />
                  <span>
                    {new Date(note.created_at).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
              <button
                onClick={() => handleDeleteNote(note.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                title="Delete note"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProblemNotes;
