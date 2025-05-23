
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Save, X, StickyNote } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  courseId: string;
}

interface CourseNotesProps {
  courseId: string;
}

const CourseNotes: React.FC<CourseNotesProps> = ({ courseId }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [newNote, setNewNote] = useState({ title: "", content: "" });

  useEffect(() => {
    loadNotes();
  }, [courseId]);

  const loadNotes = () => {
    const storedNotes = JSON.parse(localStorage.getItem(`course_notes_${courseId}`) || '[]');
    setNotes(storedNotes);
  };

  const saveNotesToStorage = (updatedNotes: Note[]) => {
    localStorage.setItem(`course_notes_${courseId}`, JSON.stringify(updatedNotes));
    setNotes(updatedNotes);
  };

  const handleCreateNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both title and content",
        variant: "destructive",
      });
      return;
    }

    const note: Note = {
      id: `note-${Date.now()}`,
      title: newNote.title,
      content: newNote.content,
      createdAt: new Date(),
      updatedAt: new Date(),
      courseId,
    };

    const updatedNotes = [...notes, note];
    saveNotesToStorage(updatedNotes);

    setNewNote({ title: "", content: "" });
    setIsCreating(false);

    toast({
      title: "Note created",
      description: "Your note has been saved successfully",
    });
  };

  const handleUpdateNote = (noteId: string, updatedTitle: string, updatedContent: string) => {
    if (!updatedTitle.trim() || !updatedContent.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both title and content",
        variant: "destructive",
      });
      return;
    }

    const updatedNotes = notes.map(note =>
      note.id === noteId
        ? { ...note, title: updatedTitle, content: updatedContent, updatedAt: new Date() }
        : note
    );

    saveNotesToStorage(updatedNotes);
    setEditingNoteId(null);

    toast({
      title: "Note updated",
      description: "Your note has been updated successfully",
    });
  };

  const handleDeleteNote = (noteId: string) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    saveNotesToStorage(updatedNotes);

    toast({
      title: "Note deleted",
      description: "Your note has been deleted",
    });
  };

  const NoteCard = ({ note }: { note: Note }) => {
    const [editTitle, setEditTitle] = useState(note.title);
    const [editContent, setEditContent] = useState(note.content);
    const isEditing = editingNoteId === note.id;

    return (
      <Card className="mb-4">
        <CardHeader className="pb-3">
          {isEditing ? (
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="font-medium"
              placeholder="Note title"
            />
          ) : (
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{note.title}</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setEditTitle(note.title);
                    setEditContent(note.content);
                    setEditingNoteId(note.id);
                  }}
                >
                  <Edit size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteNote(note.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          )}
          <div className="flex gap-2 text-sm text-muted-foreground">
            <Badge variant="outline">
              Created: {format(new Date(note.createdAt), "MMM dd, yyyy")}
            </Badge>
            {note.updatedAt !== note.createdAt && (
              <Badge variant="outline">
                Updated: {format(new Date(note.updatedAt), "MMM dd, yyyy")}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                placeholder="Note content"
                className="min-h-32"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleUpdateNote(note.id, editTitle, editContent)}
                >
                  <Save size={16} className="mr-1" />
                  Save
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingNoteId(null)}
                >
                  <X size={16} className="mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="whitespace-pre-wrap">{note.content}</p>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <StickyNote size={20} />
            Course Notes
          </h3>
          <p className="text-sm text-muted-foreground">
            Keep track of your thoughts and key points
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} disabled={isCreating}>
          <Plus size={16} className="mr-1" />
          New Note
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Note</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Note title"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            />
            <Textarea
              placeholder="Write your note here..."
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
              className="min-h-32"
            />
            <div className="flex gap-2">
              <Button onClick={handleCreateNote}>
                <Save size={16} className="mr-1" />
                Save Note
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsCreating(false);
                  setNewNote({ title: "", content: "" });
                }}
              >
                <X size={16} className="mr-1" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {notes.length === 0 && !isCreating ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12">
            <StickyNote size={48} className="text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No notes yet</h3>
            <p className="text-muted-foreground mb-4 text-center">
              Start taking notes to keep track of important information from this course
            </p>
            <Button onClick={() => setIsCreating(true)}>
              <Plus size={16} className="mr-1" />
              Create Your First Note
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {notes
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
        </div>
      )}
    </div>
  );
};

export default CourseNotes;
