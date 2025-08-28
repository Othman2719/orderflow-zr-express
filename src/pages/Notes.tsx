import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit2, Trash2, StickyNote, CheckSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Note {
  id: string;
  content: string;
  type: "note" | "todo";
  isCompleted?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mock notes data
const mockNotes: Note[] = [
  {
    id: "1",
    content: "Follow up with client about order #ORD-001",
    type: "todo",
    isCompleted: false,
    createdAt: "2024-01-20T10:30:00Z",
    updatedAt: "2024-01-20T10:30:00Z"
  },
  {
    id: "2",
    content: "Update product prices for Q2 2024\n- Premium Headphones: 2990 DA\n- Wireless Earbuds: 1990 DA\n- Smart Watch: 4500 DA",
    type: "note",
    createdAt: "2024-01-19T14:15:00Z",
    updatedAt: "2024-01-19T14:15:00Z"
  },
  {
    id: "3",
    content: "Contact supplier for new stock delivery",
    type: "todo",
    isCompleted: true,
    createdAt: "2024-01-18T09:00:00Z",
    updatedAt: "2024-01-19T16:45:00Z"
  },
  {
    id: "4",
    content: "Marketing strategy notes:\n\n1. Focus on social media advertising\n2. Target age group 25-40\n3. Emphasize quality and warranty\n4. Use customer testimonials\n5. Create urgency with limited-time offers",
    type: "note",
    createdAt: "2024-01-17T11:20:00Z",
    updatedAt: "2024-01-17T11:20:00Z"
  }
];

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [activeTab, setActiveTab] = useState<"note" | "todo">("note");
  const [formData, setFormData] = useState({
    content: "",
    type: "note" as "note" | "todo"
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.content.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content",
        variant: "destructive"
      });
      return;
    }

    if (editingNote) {
      // Update existing note
      setNotes(prev => prev.map(note => 
        note.id === editingNote.id 
          ? {
              ...note,
              content: formData.content,
              type: formData.type,
              updatedAt: new Date().toISOString()
            }
          : note
      ));
      toast({
        title: "Success",
        description: "Note updated successfully"
      });
    } else {
      // Create new note
      const newNote: Note = {
        id: Date.now().toString(),
        content: formData.content,
        type: formData.type,
        isCompleted: formData.type === "todo" ? false : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setNotes(prev => [newNote, ...prev]);
      toast({
        title: "Success",
        description: `${formData.type === "note" ? "Note" : "Todo"} created successfully`
      });
    }

    // Reset form
    setFormData({ content: "", type: activeTab });
    setIsFormOpen(false);
    setEditingNote(null);
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setFormData({
      content: note.content,
      type: note.type
    });
    setActiveTab(note.type);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    toast({
      title: "Success",
      description: "Item deleted successfully"
    });
  };

  const toggleComplete = (id: string) => {
    setNotes(prev => prev.map(note => 
      note.id === id && note.type === "todo"
        ? { 
            ...note, 
            isCompleted: !note.isCompleted,
            updatedAt: new Date().toISOString()
          }
        : note
    ));
  };

  const resetForm = () => {
    setFormData({ content: "", type: activeTab });
    setIsFormOpen(false);
    setEditingNote(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const filteredNotes = notes.filter(note => note.type === activeTab);
  const completedTodos = notes.filter(note => note.type === "todo" && note.isCompleted).length;
  const totalTodos = notes.filter(note => note.type === "todo").length;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Notes & Tasks</h1>
            <p className="text-muted-foreground">Manage your notes and to-do items</p>
          </div>
          <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add {activeTab === "note" ? "Note" : "Task"}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <StickyNote className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Notes</p>
                  <p className="text-2xl font-bold">{notes.filter(n => n.type === "note").length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <CheckSquare className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed Tasks</p>
                  <p className="text-2xl font-bold">{completedTodos}/{totalTodos}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <CheckSquare className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Tasks</p>
                  <p className="text-2xl font-bold">{totalTodos - completedTodos}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add/Edit Form */}
        {isFormOpen && (
          <Card>
            <CardHeader>
              <CardTitle>{editingNote ? "Edit Item" : "Create New Item"}</CardTitle>
              <CardDescription>
                {editingNote ? "Update your note or task" : "Add a new note or task to stay organized"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Tabs value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as "note" | "todo" }))}>
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="note">Note</TabsTrigger>
                      <TabsTrigger value="todo">Task</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content *</Label>
                  <Textarea
                    id="content"
                    placeholder={formData.type === "note" ? "Enter your note..." : "Enter your task..."}
                    className="min-h-[120px]"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">
                    {editingNote ? "Update" : "Create"} {formData.type === "note" ? "Note" : "Task"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Notes/Tasks List */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "note" | "todo")}>
          <TabsList>
            <TabsTrigger value="note">Notes ({notes.filter(n => n.type === "note").length})</TabsTrigger>
            <TabsTrigger value="todo">Tasks ({totalTodos})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="note" className="space-y-4">
            {filteredNotes.map((note) => (
              <Card key={note.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <StickyNote className="h-4 w-4 text-primary" />
                        <Badge variant="secondary">Note</Badge>
                      </div>
                      <CardDescription className="text-xs">
                        Created: {formatDate(note.createdAt)}
                        {note.updatedAt !== note.createdAt && ` • Updated: ${formatDate(note.updatedAt)}`}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="whitespace-pre-wrap text-sm text-foreground bg-muted/50 p-3 rounded-lg">
                      {note.content}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(note)}
                        className="flex items-center gap-1"
                      >
                        <Edit2 className="h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(note.id)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="todo" className="space-y-4">
            {filteredNotes.map((note) => (
              <Card key={note.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Checkbox
                          checked={note.isCompleted || false}
                          onCheckedChange={() => toggleComplete(note.id)}
                        />
                        <CheckSquare className="h-4 w-4 text-primary" />
                        <Badge variant={note.isCompleted ? "default" : "secondary"}>
                          {note.isCompleted ? "Completed" : "Pending"}
                        </Badge>
                      </div>
                      <CardDescription className="text-xs">
                        Created: {formatDate(note.createdAt)}
                        {note.updatedAt !== note.createdAt && ` • Updated: ${formatDate(note.updatedAt)}`}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className={`whitespace-pre-wrap text-sm bg-muted/50 p-3 rounded-lg ${
                      note.isCompleted ? "line-through text-muted-foreground" : "text-foreground"
                    }`}>
                      {note.content}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleComplete(note.id)}
                        className="flex items-center gap-1"
                      >
                        <CheckSquare className="h-3 w-3" />
                        {note.isCompleted ? "Mark Pending" : "Mark Complete"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(note)}
                        className="flex items-center gap-1"
                      >
                        <Edit2 className="h-3 w-3" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(note.id)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* Empty State */}
        {filteredNotes.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              {activeTab === "note" ? (
                <StickyNote className="h-12 w-12 text-muted-foreground mb-4" />
              ) : (
                <CheckSquare className="h-12 w-12 text-muted-foreground mb-4" />
              )}
              <h3 className="text-lg font-semibold mb-2">No {activeTab === "note" ? "Notes" : "Tasks"}</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create your first {activeTab === "note" ? "note" : "task"} to get started.
              </p>
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create First {activeTab === "note" ? "Note" : "Task"}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}