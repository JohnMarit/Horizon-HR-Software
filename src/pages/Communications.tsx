import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { 
  PlusIcon, 
  MessageSquareIcon, 
  BellIcon, 
  FileTextIcon,
  SearchIcon,
  FilterIcon,
  EditIcon,
  TrashIcon,
  MoreVerticalIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  HeartIcon,
  SmileIcon,
  SendIcon,
  StickyNoteIcon,
  CalendarIcon,
  UsersIcon,
  EyeIcon,
  MessageCircleIcon,
  PinIcon,
  ShareIcon,
  BookmarkIcon,
  AlertCircleIcon
} from "lucide-react";

// Enhanced interfaces
interface Communication {
  id: number;
  title: string;
  content: string;
  type: 'Announcement' | 'Policy Update' | 'News' | 'Event' | 'Urgent' | 'General';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  author: string;
  authorId: string;
  department: string;
  targetAudience: string[];
  date: string;
  expiryDate?: string;
  status: 'Draft' | 'Published' | 'Archived';
  isPinned: boolean;
  attachments: string[];
  reactions: { [key: string]: Reaction[] };
  comments: Comment[];
  views: number;
  tags: string[];
  notes?: string;
}

interface Reaction {
  id: number;
  userId: string;
  userName: string;
  type: 'like' | 'dislike' | 'heart' | 'laugh';
  timestamp: string;
}

interface Comment {
  id: number;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
  isPrivate: boolean;
  parentId?: number;
  replies?: Comment[];
}

interface Feedback {
  id: number;
  subject: string;
  message: string;
  category: 'General' | 'Policy' | 'Workplace' | 'Management' | 'IT Support' | 'HR' | 'Suggestion';
  priority: 'Low' | 'Medium' | 'High';
  userId: string;
  userName: string;
  department: string;
  submittedDate: string;
  status: 'Open' | 'In Review' | 'Resolved' | 'Closed';
  assignedTo?: string;
  response?: string;
  responseDate?: string;
  isAnonymous: boolean;
}

interface Note {
  id: number;
  title: string;
  content: string;
  category: 'Meeting' | 'Reminder' | 'Task' | 'Information' | 'Follow-up';
  author: string;
  authorId: string;
  createdDate: string;
  updatedDate: string;
  isPrivate: boolean;
  sharedWith: string[];
  tags: string[];
  color: string;
}

export default function Communications() {
  const [activeTab, setActiveTab] = useState("announcements");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateCommunicationDialog, setShowCreateCommunicationDialog] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [showCreateNoteDialog, setShowCreateNoteDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCommunication, setSelectedCommunication] = useState<Communication | null>(null);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [newComment, setNewComment] = useState("");
  
  // Add edit dialog states
  const [showEditCommunicationDialog, setShowEditCommunicationDialog] = useState(false);
  const [showEditFeedbackDialog, setShowEditFeedbackDialog] = useState(false);
  const [showEditNoteDialog, setShowEditNoteDialog] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  
  const { user, hasPermission, addAuditLog } = useAuth();

  // Communication form state
  const [communicationForm, setCommunicationForm] = useState({
    title: "",
    content: "",
    type: "Announcement" as const,
    priority: "Medium" as const,
    targetAudience: "",
    expiryDate: "",
    isPinned: false,
    tags: "",
    notes: ""
  });

  // Feedback form state
  const [feedbackForm, setFeedbackForm] = useState({
    subject: "",
    message: "",
    category: "General" as const,
    priority: "Medium" as const,
    isAnonymous: false
  });

  // Note form state
  const [noteForm, setNoteForm] = useState({
    title: "",
    content: "",
    category: "Information" as const,
    isPrivate: true,
    sharedWith: "",
    tags: "",
    color: "#3B82F6"
  });

  // Enhanced communications data
  const [communications, setCommunications] = useState<Communication[]>([
    {
      id: 1,
      title: "New Office Opening in Juba - Grand Celebration!",
      content: "We are thrilled to announce the grand opening of our new branch office in Juba, South Sudan! This expansion marks a significant milestone in Horizon Bank's growth and our commitment to serving the South Sudanese community. The new office will offer comprehensive banking services including personal banking, business accounts, loans, and international transfers. Join us for the ribbon-cutting ceremony on March 15th, 2025.",
      type: "News",
      priority: "High",
      author: "Sarah Akol",
      authorId: "HB001",
      department: "Human Resources",
      targetAudience: ["All Staff", "Management", "Juba Branch"],
      date: "2025-01-20",
      expiryDate: "2025-03-20",
      status: "Published",
      isPinned: true,
      attachments: ["juba-office-photos.pdf", "opening-ceremony-details.pdf"],
      reactions: {
        like: [
          { id: 1, userId: "HB003", userName: "Mary Deng", type: "like", timestamp: "2025-01-20T10:30:00Z" },
          { id: 2, userId: "HB005", userName: "Grace Ajak", type: "like", timestamp: "2025-01-20T11:15:00Z" }
        ],
        heart: [
          { id: 3, userId: "HB006", userName: "Michael Jok", type: "heart", timestamp: "2025-01-20T12:00:00Z" }
        ]
      },
      comments: [
        {
          id: 1,
          userId: "HB003",
          userName: "Mary Deng",
          content: "Congratulations on this achievement! This will greatly improve our service delivery in the region.",
          timestamp: "2025-01-20T10:35:00Z",
          isPrivate: false
    },
    {
      id: 2,
          userId: "HB005",
          userName: "Grace Ajak",
          content: "Excited to see our expansion! Will there be opportunities for staff transfers to the new branch?",
          timestamp: "2025-01-20T11:20:00Z",
          isPrivate: false
        }
      ],
      views: 45,
      tags: ["Expansion", "Juba", "Branch Opening", "Milestone"],
      notes: "Follow up with facilities team for ceremony preparations. Coordinate with marketing for press release."
    },
    {
      id: 2,
      title: "Updated Employee Leave Policy - Effective February 2025",
      content: "Important updates to our employee leave policy are now in effect. Key changes include: increased annual leave allocation (25 days), new parental leave provisions (16 weeks), enhanced sick leave benefits, and streamlined application process through our HR portal. All employees are required to review and acknowledge these changes by January 31st, 2025. Training sessions will be conducted next week.",
      type: "Policy Update",
      priority: "Critical",
      author: "Sarah Akol",
      authorId: "HB001",
      department: "Human Resources",
      targetAudience: ["All Staff"],
      date: "2025-01-18",
      status: "Published",
      isPinned: true,
      attachments: ["leave-policy-2025.pdf", "comparison-chart.xlsx"],
      reactions: {
        like: [
          { id: 4, userId: "HB007", userName: "Rebecca Akuoc", type: "like", timestamp: "2025-01-18T14:20:00Z" },
          { id: 5, userId: "HB009", userName: "Anna Nyong", type: "like", timestamp: "2025-01-18T15:10:00Z" }
        ]
      },
      comments: [
        {
          id: 3,
          userId: "HB007",
          userName: "Rebecca Akuoc",
          content: "These are excellent improvements! The increased parental leave is particularly welcome.",
          timestamp: "2025-01-18T14:25:00Z",
          isPrivate: false
        }
      ],
      views: 87,
      tags: ["Policy", "Leave", "Benefits", "HR"],
      notes: "Schedule department meetings to discuss implementation. Track acknowledgment completion rates."
    }
  ]);

  // Enhanced feedback data
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([
    {
      id: 1,
      subject: "Suggestion for Remote Work Policy",
      message: "I believe implementing a hybrid work arrangement would improve work-life balance and productivity. Many modern banks offer flexible working options, and this could help us attract and retain top talent.",
      category: "Policy",
      priority: "Medium",
      userId: "HB005",
      userName: "Grace Ajak",
      department: "Personal Banking",
      submittedDate: "2025-01-19",
      status: "In Review",
      assignedTo: "Sarah Akol",
      isAnonymous: false
    },
    {
      id: 2,
      subject: "IT Support Response Time",
      message: "The IT support team has been very responsive lately. The new ticketing system is working well and issues are resolved quickly. Great improvement!",
      category: "IT Support",
      priority: "Low",
      userId: "HB009",
      userName: "Anna Nyong",
      department: "Corporate Banking",
      submittedDate: "2025-01-17",
      status: "Resolved",
      assignedTo: "David Majok",
      response: "Thank you for the positive feedback! We're glad the new system is working well.",
      responseDate: "2025-01-18",
      isAnonymous: false
    }
  ]);

  // Notes data
  const [notes, setNotes] = useState<Note[]>([
    {
      id: 1,
      title: "Q1 Planning Meeting Notes",
      content: "Key discussion points: Budget allocation for new initiatives, staff training programs, digital transformation roadmap, customer satisfaction improvement strategies.",
      category: "Meeting",
      author: "Mary Deng",
      authorId: "HB003",
      createdDate: "2025-01-20",
      updatedDate: "2025-01-20",
      isPrivate: false,
      sharedWith: ["Management Team", "Department Heads"],
      tags: ["Q1", "Planning", "Strategy"],
      color: "#10B981"
    },
    {
      id: 2,
      title: "Employee Birthday Reminders",
      content: "January birthdays: Grace Ajak (25th), Michael Jok (28th). February birthdays: Rebecca Akuoc (5th), Anna Nyong (18th). Prepare celebration arrangements and birthday cards.",
      category: "Reminder",
      author: "Sarah Akol",
      authorId: "HB001",
      createdDate: "2025-01-15",
      updatedDate: "2025-01-20",
      isPrivate: false,
      sharedWith: ["HR Team"],
      tags: ["Birthdays", "Celebrations", "Employee Relations"],
      color: "#F59E0B"
    }
  ]);

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Published": return "bg-green-100 text-green-800";
      case "Draft": return "bg-gray-100 text-gray-800";
      case "Archived": return "bg-gray-100 text-gray-600";
      case "Open": return "bg-blue-100 text-blue-800";
      case "In Review": return "bg-yellow-100 text-yellow-800";
      case "Resolved": return "bg-green-100 text-green-800";
      case "Closed": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "bg-red-100 text-red-800";
      case "High": return "bg-orange-100 text-orange-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Urgent": return "bg-red-100 text-red-800";
      case "Policy Update": return "bg-blue-100 text-blue-800";
      case "News": return "bg-green-100 text-green-800";
      case "Event": return "bg-purple-100 text-purple-800";
      case "Announcement": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Communication management functions
  const resetCommunicationForm = () => {
    setCommunicationForm({
      title: "",
      content: "",
      type: "Announcement",
      priority: "Medium",
      targetAudience: "",
      expiryDate: "",
      isPinned: false,
      tags: "",
      notes: ""
    });
  };

  const resetFeedbackForm = () => {
    setFeedbackForm({
      subject: "",
      message: "",
      category: "General",
      priority: "Medium",
      isAnonymous: false
    });
  };

  const resetNoteForm = () => {
    setNoteForm({
      title: "",
      content: "",
      category: "Information",
      isPrivate: true,
      sharedWith: "",
      tags: "",
      color: "#3B82F6"
    });
  };

  const handleCreateCommunication = () => {
    if (!hasPermission('communications.manage') && !hasPermission('*')) {
      addAuditLog('UNAUTHORIZED_ACCESS_ATTEMPT', 'COMMUNICATIONS', { action: 'create_communication' });
      return;
    }

    const targetAudience = communicationForm.targetAudience.split(',').map(a => a.trim()).filter(a => a);
    const tags = communicationForm.tags.split(',').map(t => t.trim()).filter(t => t);

    const newCommunication: Communication = {
      id: Math.max(...communications.map(c => c.id)) + 1,
      title: communicationForm.title,
      content: communicationForm.content,
      type: communicationForm.type,
      priority: communicationForm.priority,
      author: user?.email || 'System',
      authorId: user?.id || 'SYS001',
      department: user?.department || 'Administration',
      targetAudience,
      date: new Date().toISOString().split('T')[0],
      expiryDate: communicationForm.expiryDate || undefined,
      status: 'Published',
      isPinned: communicationForm.isPinned,
      attachments: [],
      reactions: {},
      comments: [],
      views: 0,
      tags,
      notes: communicationForm.notes
    };

    setCommunications([newCommunication, ...communications]);
    setShowCreateCommunicationDialog(false);
    resetCommunicationForm();

    addAuditLog('COMMUNICATION_CREATED', 'COMMUNICATIONS', {
      action: 'communication_created',
      communicationId: newCommunication.id,
      title: newCommunication.title,
      createdBy: user?.email
    });
  };

  const handleSubmitFeedback = () => {
    const newFeedback: Feedback = {
      id: Math.max(...feedbacks.map(f => f.id)) + 1,
      subject: feedbackForm.subject,
      message: feedbackForm.message,
      category: feedbackForm.category,
      priority: feedbackForm.priority,
      userId: feedbackForm.isAnonymous ? 'ANONYMOUS' : (user?.id || 'USR001'),
      userName: feedbackForm.isAnonymous ? 'Anonymous User' : (user?.email || 'Unknown'),
      department: feedbackForm.isAnonymous ? 'N/A' : (user?.department || 'Unknown'),
      submittedDate: new Date().toISOString().split('T')[0],
      status: 'Open',
      isAnonymous: feedbackForm.isAnonymous
    };

    setFeedbacks([newFeedback, ...feedbacks]);
    setShowFeedbackDialog(false);
    resetFeedbackForm();

    addAuditLog('FEEDBACK_SUBMITTED', 'COMMUNICATIONS', {
      action: 'feedback_submitted',
      feedbackId: newFeedback.id,
      category: newFeedback.category,
      isAnonymous: newFeedback.isAnonymous
    });
  };

  const handleCreateNote = () => {
    const sharedWith = noteForm.sharedWith.split(',').map(s => s.trim()).filter(s => s);
    const tags = noteForm.tags.split(',').map(t => t.trim()).filter(t => t);

    const newNote: Note = {
      id: Math.max(...notes.map(n => n.id)) + 1,
      title: noteForm.title,
      content: noteForm.content,
      category: noteForm.category,
      author: user?.email || 'System',
      authorId: user?.id || 'USR001',
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0],
      isPrivate: noteForm.isPrivate,
      sharedWith,
      tags,
      color: noteForm.color
    };

    setNotes([newNote, ...notes]);
    setShowCreateNoteDialog(false);
    resetNoteForm();

    addAuditLog('NOTE_CREATED', 'COMMUNICATIONS', {
      action: 'note_created',
      noteId: newNote.id,
      title: newNote.title,
      createdBy: user?.email
    });
  };

  const handleReaction = (communicationId: number, reactionType: 'like' | 'dislike' | 'heart' | 'laugh') => {
    const updatedCommunications = communications.map(comm => {
      if (comm.id === communicationId) {
        const userId = user?.id || 'USR001';
        const userName = user?.email || 'Unknown';
        
        // Remove existing reaction from this user
        Object.keys(comm.reactions).forEach(key => {
          comm.reactions[key] = comm.reactions[key].filter(r => r.userId !== userId);
        });

        // Add new reaction
        if (!comm.reactions[reactionType]) {
          comm.reactions[reactionType] = [];
        }
        
        comm.reactions[reactionType].push({
          id: Date.now(),
          userId,
          userName,
          type: reactionType,
          timestamp: new Date().toISOString()
        });
      }
      return comm;
    });

    setCommunications(updatedCommunications);
  };

  const handleAddComment = (communicationId: number) => {
    if (!newComment.trim()) return;

    const updatedCommunications = communications.map(comm => {
      if (comm.id === communicationId) {
        const newCommentObj: Comment = {
          id: Math.max(...comm.comments.map(c => c.id), 0) + 1,
          userId: user?.id || 'USR001',
          userName: user?.email || 'Unknown',
          content: newComment.trim(),
          timestamp: new Date().toISOString(),
          isPrivate: false
        };
        
        comm.comments.push(newCommentObj);
      }
      return comm;
    });

    setCommunications(updatedCommunications);
    setNewComment("");
  };

  // Edit handler functions
  const handleEditCommunication = (communication: Communication) => {
    setSelectedCommunication(communication);
    setCommunicationForm({
      title: communication.title,
      content: communication.content,
      type: communication.type as "Announcement",
      priority: communication.priority as "Medium",
      targetAudience: communication.targetAudience.join(', '),
      expiryDate: communication.expiryDate || '',
      isPinned: communication.isPinned,
      tags: communication.tags.join(', '),
      notes: communication.notes || ''
    });
    setShowEditCommunicationDialog(true);
  };

  const handleUpdateCommunication = () => {
    if (!selectedCommunication || (!hasPermission('communications.manage') && !hasPermission('*'))) {
      return;
    }

    const targetAudience = communicationForm.targetAudience.split(',').map(a => a.trim()).filter(a => a);
    const tags = communicationForm.tags.split(',').map(t => t.trim()).filter(t => t);

    const updatedCommunications = communications.map(comm => {
      if (comm.id === selectedCommunication.id) {
        return {
          ...comm,
          title: communicationForm.title,
          content: communicationForm.content,
          type: communicationForm.type,
          priority: communicationForm.priority,
          targetAudience,
          expiryDate: communicationForm.expiryDate || undefined,
          isPinned: communicationForm.isPinned,
          tags,
          notes: communicationForm.notes
        };
      }
      return comm;
    });

    setCommunications(updatedCommunications);
    setShowEditCommunicationDialog(false);
    setSelectedCommunication(null);
    resetCommunicationForm();

    addAuditLog('COMMUNICATION_UPDATED', 'COMMUNICATIONS', {
      action: 'communication_updated',
      communicationId: selectedCommunication.id,
      title: communicationForm.title,
      updatedBy: user?.email
    });
  };

  const handleEditFeedback = (feedback: Feedback) => {
    // Check if user owns this feedback or has admin permissions
    const isOwner = feedback.userId === user?.id || feedback.userName === user?.email;
    const hasAdminAccess = hasPermission('*');
    
    if (!isOwner && !hasAdminAccess) {
      addAuditLog('UNAUTHORIZED_ACCESS_ATTEMPT', 'COMMUNICATIONS', { 
        action: 'edit_feedback_attempt', 
        feedbackId: feedback.id,
        reason: 'not_owner' 
      });
      return;
    }

    setSelectedFeedback(feedback);
    setFeedbackForm({
      subject: feedback.subject,
      message: feedback.message,
      category: feedback.category as "General",
      priority: feedback.priority as "Medium",
      isAnonymous: feedback.isAnonymous
    });
    setShowEditFeedbackDialog(true);
  };

  const handleUpdateFeedback = () => {
    if (!selectedFeedback) return;

    // Check if user owns this feedback or has admin permissions  
    const isOwner = selectedFeedback.userId === user?.id || selectedFeedback.userName === user?.email;
    const hasAdminAccess = hasPermission('*');
    
    if (!isOwner && !hasAdminAccess) {
      addAuditLog('UNAUTHORIZED_ACCESS_ATTEMPT', 'COMMUNICATIONS', { 
        action: 'update_feedback_attempt', 
        feedbackId: selectedFeedback.id,
        reason: 'not_owner' 
      });
      return;
    }

    const updatedFeedbacks = feedbacks.map(fb => {
      if (fb.id === selectedFeedback.id) {
        return {
          ...fb,
          subject: feedbackForm.subject,
          message: feedbackForm.message,
          category: feedbackForm.category,
          priority: feedbackForm.priority,
          isAnonymous: feedbackForm.isAnonymous
        };
      }
      return fb;
    });

    setFeedbacks(updatedFeedbacks);
    setShowEditFeedbackDialog(false);
    setSelectedFeedback(null);
    resetFeedbackForm();

    addAuditLog('FEEDBACK_UPDATED', 'COMMUNICATIONS', {
      action: 'feedback_updated',
      feedbackId: selectedFeedback.id,
      updatedBy: user?.email
    });
  };

  const handleEditNote = (note: Note) => {
    // Check if user owns this note
    const isOwner = note.authorId === user?.id || note.author === user?.email;
    
    if (!isOwner) {
      addAuditLog('UNAUTHORIZED_ACCESS_ATTEMPT', 'COMMUNICATIONS', { 
        action: 'edit_note_attempt', 
        noteId: note.id,
        reason: 'not_owner' 
      });
      return;
    }

    setSelectedNote(note);
    setNoteForm({
      title: note.title,
      content: note.content,
      category: note.category as "Information",
      isPrivate: note.isPrivate,
      sharedWith: note.sharedWith.join(', '),
      tags: note.tags.join(', '),
      color: note.color
    });
    setShowEditNoteDialog(true);
  };

  const handleUpdateNote = () => {
    if (!selectedNote) return;

    // Check if user owns this note
    const isOwner = selectedNote.authorId === user?.id || selectedNote.author === user?.email;
    
    if (!isOwner) {
      addAuditLog('UNAUTHORIZED_ACCESS_ATTEMPT', 'COMMUNICATIONS', { 
        action: 'update_note_attempt', 
        noteId: selectedNote.id,
        reason: 'not_owner' 
      });
      return;
    }

    const sharedWith = noteForm.sharedWith.split(',').map(s => s.trim()).filter(s => s);
    const tags = noteForm.tags.split(',').map(t => t.trim()).filter(t => t);

    const updatedNotes = notes.map(note => {
      if (note.id === selectedNote.id) {
        return {
          ...note,
          title: noteForm.title,
          content: noteForm.content,
          category: noteForm.category,
          isPrivate: noteForm.isPrivate,
          sharedWith,
          tags,
          color: noteForm.color,
          updatedDate: new Date().toISOString().split('T')[0]
        };
      }
      return note;
    });

    setNotes(updatedNotes);
    setShowEditNoteDialog(false);
    setSelectedNote(null);
    resetNoteForm();

    addAuditLog('NOTE_UPDATED', 'COMMUNICATIONS', {
      action: 'note_updated',
      noteId: selectedNote.id,
      title: noteForm.title,
      updatedBy: user?.email
    });
  };

  // Filter functions
  const filteredCommunications = communications.filter(comm =>
    comm.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comm.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comm.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFeedbacks = feedbacks.filter(feedback =>
    feedback.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    feedback.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Internal Communications</h1>
          <p className="text-gray-600">Share updates, collect feedback, and collaborate at Horizon Bank</p>
        </div>
        <div className="flex gap-2">
          {(hasPermission('communications.manage') || hasPermission('*')) && (
            <Button 
              onClick={() => setShowCreateCommunicationDialog(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
          <PlusIcon className="mr-2 h-4 w-4" />
              Create Communication
            </Button>
          )}
          <Button 
            variant="outline"
            onClick={() => setShowFeedbackDialog(true)}
          >
            <MessageSquareIcon className="mr-2 h-4 w-4" />
            Submit Feedback
          </Button>
          <Button 
            variant="outline"
            onClick={() => setShowCreateNoteDialog(true)}
          >
            <StickyNoteIcon className="mr-2 h-4 w-4" />
            Add Note
        </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Communications</p>
                <p className="text-3xl font-bold text-gray-900">{communications.filter(c => c.status === 'Published').length}</p>
                <p className="text-xs text-gray-500">Currently published</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <BellIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-3xl font-bold text-gray-900">{communications.reduce((acc, c) => acc + c.views, 0)}</p>
                <p className="text-xs text-gray-500">Across all posts</p>
                  </div>
              <div className="p-3 rounded-full bg-green-100">
                <EyeIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Feedback</p>
                <p className="text-3xl font-bold text-gray-900">{feedbacks.filter(f => f.status === 'Open' || f.status === 'In Review').length}</p>
                <p className="text-xs text-gray-500">Awaiting response</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-100">
                <MessageSquareIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Notes</p>
                <p className="text-3xl font-bold text-gray-900">{notes.length}</p>
                <p className="text-xs text-gray-500">Team notes</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <StickyNoteIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="announcements">Communications</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="notifications">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="announcements" className="space-y-6">
          {/* Search and Filters */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
                  <Input
                    placeholder="Search communications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <FilterIcon className="mr-2 h-4 w-4" />
                    Filter by Type
                  </Button>
                  <Button variant="outline">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Filter by Date
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Communications List */}
          <div className="grid gap-6">
            {filteredCommunications.map((communication) => (
              <Card key={communication.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {communication.author.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          {communication.isPinned && (
                            <PinIcon className="h-4 w-4 text-amber-500" />
                          )}
                          <h3 className="text-lg font-semibold text-gray-900">{communication.title}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{communication.author}</span>
                          <span>•</span>
                          <span>{communication.department}</span>
                          <span>•</span>
                          <span>{communication.date}</span>
                          <span>•</span>
                          <span>{communication.views} views</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getTypeColor(communication.type)}>
                            {communication.type}
                          </Badge>
                          <Badge className={getPriorityColor(communication.priority)}>
                            {communication.priority}
                          </Badge>
                          <Badge className={getStatusColor(communication.status)}>
                            {communication.status}
                  </Badge>
                </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {(hasPermission('communications.manage') || hasPermission('*')) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVerticalIcon className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => handleEditCommunication(communication)}
                            >
                              <EditIcon className="mr-2 h-4 w-4" />
                              Edit Communication
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => {
                                setItemToDelete(communication);
                                setShowDeleteDialog(true);
                              }}
                            >
                              <TrashIcon className="mr-2 h-4 w-4" />
                              Delete Communication
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed">{communication.content}</p>
                  </div>

                  {communication.targetAudience && communication.targetAudience.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <UsersIcon className="h-4 w-4 text-blue-600" />
                        Target Audience
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {communication.targetAudience.map((audience, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {audience}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {communication.tags && communication.tags.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {communication.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Reactions */}
                  <div className="mb-4">
                    <div className="flex items-center gap-4 mb-2">
                      <button
                        onClick={() => handleReaction(communication.id, 'like')}
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <ThumbsUpIcon className="h-4 w-4" />
                        <span>{communication.reactions.like?.length || 0}</span>
                      </button>
                      <button
                        onClick={() => handleReaction(communication.id, 'heart')}
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <HeartIcon className="h-4 w-4" />
                        <span>{communication.reactions.heart?.length || 0}</span>
                      </button>
                      <button
                        onClick={() => handleReaction(communication.id, 'laugh')}
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-yellow-600 transition-colors"
                      >
                        <SmileIcon className="h-4 w-4" />
                        <span>{communication.reactions.laugh?.length || 0}</span>
                      </button>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MessageCircleIcon className="h-4 w-4" />
                        <span>{communication.comments.length} comments</span>
                      </div>
                    </div>
                  </div>

                  {/* Comments */}
                  {communication.comments.length > 0 && (
                    <div className="mb-4 space-y-3">
                      <Separator />
                      {communication.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-gray-100 text-gray-700 text-xs">
                              {comment.userName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm text-gray-900">{comment.userName}</span>
                                <span className="text-xs text-gray-500">{new Date(comment.timestamp).toLocaleDateString()}</span>
                              </div>
                              <p className="text-sm text-gray-700">{comment.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment */}
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                        {user?.email?.split(' ').map(n => n[0]).join('') || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex gap-2">
                      <Input
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment(communication.id)}
                        className="flex-1"
                      />
                      <Button 
                        size="sm"
                        onClick={() => handleAddComment(communication.id)}
                        disabled={!newComment.trim()}
                      >
                        <SendIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {communication.notes && (hasPermission('communications.manage') || hasPermission('*')) && (
                    <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                      <h4 className="font-medium text-yellow-900 mb-1 flex items-center gap-2">
                        <StickyNoteIcon className="h-4 w-4" />
                        Internal Notes
                      </h4>
                      <p className="text-sm text-yellow-800">{communication.notes}</p>
                    </div>
                  )}
              </CardContent>
            </Card>
          ))}
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          {/* Search Feedback */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
                <Input
                  placeholder="Search feedback..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                </div>
            </CardContent>
          </Card>

          {/* Feedback List */}
          <div className="grid gap-6">
            {filteredFeedbacks.map((feedback) => (
              <Card key={feedback.id} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-purple-100 text-purple-700">
                          {feedback.isAnonymous ? 'A' : feedback.userName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2 flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{feedback.subject}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{feedback.isAnonymous ? 'Anonymous User' : feedback.userName}</span>
                          {!feedback.isAnonymous && (
                            <>
                              <span>•</span>
                              <span>{feedback.department}</span>
                            </>
                          )}
                          <span>•</span>
                          <span>{feedback.submittedDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{feedback.category}</Badge>
                          <Badge className={getPriorityColor(feedback.priority)}>
                            {feedback.priority}
                          </Badge>
                          <Badge className={getStatusColor(feedback.status)}>
                            {feedback.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {(() => {
                      const isOwner = feedback.userId === user?.id || feedback.userName === user?.email;
                      const hasAdminAccess = hasPermission('*');
                      const canEdit = isOwner || hasAdminAccess;
                      const canManage = hasPermission('communications.manage') || hasPermission('*');
                      
                      return (canEdit || canManage) ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVerticalIcon className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {canEdit && (
                              <DropdownMenuItem
                                onClick={() => handleEditFeedback(feedback)}
                              >
                                <EditIcon className="mr-2 h-4 w-4" />
                                Edit Feedback
                              </DropdownMenuItem>
                            )}
                            {canManage && (
                              <DropdownMenuItem>
                                <AlertCircleIcon className="mr-2 h-4 w-4" />
                                Change Status
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : null;
                    })()}
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed">{feedback.message}</p>
                  </div>

                  {feedback.response && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-2">Response from {feedback.assignedTo}</h4>
                      <p className="text-sm text-blue-800">{feedback.response}</p>
                      <p className="text-xs text-blue-600 mt-2">Responded on {feedback.responseDate}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notes" className="space-y-6">
          {/* Search Notes */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
                <Input
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  />
                </div>
            </CardContent>
          </Card>

          {/* Notes Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map((note) => (
              <Card key={note.id} className="border-0 shadow-md hover:shadow-lg transition-shadow" style={{ borderLeft: `4px solid ${note.color}` }}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-full" style={{ backgroundColor: `${note.color}15` }}>
                        <StickyNoteIcon className="h-4 w-4" style={{ color: note.color }} />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {note.category}
                      </Badge>
                    </div>
                    {(() => {
                      const isOwner = note.authorId === user?.id || note.author === user?.email;
                      
                      return isOwner ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVerticalIcon className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => handleEditNote(note)}
                            >
                              <EditIcon className="mr-2 h-4 w-4" />
                              Edit Note
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => {
                                setItemToDelete(note);
                                setShowDeleteDialog(true);
                              }}
                            >
                              <TrashIcon className="mr-2 h-4 w-4" />
                              Delete Note
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : null;
                    })()}
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2">{note.title}</h3>
                  <p className="text-sm text-gray-700 mb-4 line-clamp-3">{note.content}</p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>By {note.author}</span>
                      <span>•</span>
                      <span>{note.createdDate}</span>
                    </div>

                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {note.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                        {note.tags.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{note.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {!note.isPrivate && note.sharedWith.length > 0 && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <UsersIcon className="h-3 w-3" />
                        <span>Shared with {note.sharedWith.length} group(s)</span>
                      </div>
                    )}
              </div>
            </CardContent>
          </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Manage your communication and notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Email Notifications</label>
                    <p className="text-sm text-gray-600">
                      Receive notifications via email for new communications
                    </p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Push Notifications</label>
                    <p className="text-sm text-gray-600">
                      Receive real-time notifications on your device
                    </p>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Digest Frequency</label>
                    <p className="text-sm text-gray-600">
                      Choose how often to receive communication summaries
                    </p>
                  </div>
                  <Select defaultValue="weekly">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Communication Dialog */}
      <Dialog open={showCreateCommunicationDialog} onOpenChange={setShowCreateCommunicationDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Communication</DialogTitle>
            <DialogDescription>
              Share important updates, announcements, or information with your team.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="comm-title">Title *</Label>
                <Input
                  id="comm-title"
                  value={communicationForm.title}
                  onChange={(e) => setCommunicationForm({ ...communicationForm, title: e.target.value })}
                  placeholder="e.g. Important Policy Update"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="comm-type">Type *</Label>
                <Select 
                  value={communicationForm.type} 
                  onValueChange={(value: any) => setCommunicationForm({ ...communicationForm, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Announcement">Announcement</SelectItem>
                    <SelectItem value="Policy Update">Policy Update</SelectItem>
                    <SelectItem value="News">News</SelectItem>
                    <SelectItem value="Event">Event</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="comm-priority">Priority *</Label>
                <Select 
                  value={communicationForm.priority} 
                  onValueChange={(value: any) => setCommunicationForm({ ...communicationForm, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="comm-expiry">Expiry Date (Optional)</Label>
                <Input
                  id="comm-expiry"
                  type="date"
                  value={communicationForm.expiryDate}
                  onChange={(e) => setCommunicationForm({ ...communicationForm, expiryDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comm-content">Content *</Label>
              <Textarea
                id="comm-content"
                value={communicationForm.content}
                onChange={(e) => setCommunicationForm({ ...communicationForm, content: e.target.value })}
                placeholder="Enter your communication content here..."
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comm-audience">Target Audience</Label>
              <Input
                id="comm-audience"
                value={communicationForm.targetAudience}
                onChange={(e) => setCommunicationForm({ ...communicationForm, targetAudience: e.target.value })}
                placeholder="e.g. All Staff, Management, HR Team (comma-separated)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comm-tags">Tags</Label>
              <Input
                id="comm-tags"
                value={communicationForm.tags}
                onChange={(e) => setCommunicationForm({ ...communicationForm, tags: e.target.value })}
                placeholder="e.g. Policy, Update, Important (comma-separated)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comm-notes">Internal Notes (HR Only)</Label>
              <Textarea
                id="comm-notes"
                value={communicationForm.notes}
                onChange={(e) => setCommunicationForm({ ...communicationForm, notes: e.target.value })}
                placeholder="Internal notes for HR team..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="pin-communication"
                checked={communicationForm.isPinned}
                onChange={(e) => setCommunicationForm({ ...communicationForm, isPinned: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="pin-communication">Pin this communication to the top</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateCommunicationDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateCommunication}
              disabled={!communicationForm.title || !communicationForm.content}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Communication
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submit Feedback Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submit Feedback</DialogTitle>
            <DialogDescription>
              Share your thoughts, suggestions, or concerns with the team.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="feedback-subject">Subject *</Label>
                <Input
                  id="feedback-subject"
                  value={feedbackForm.subject}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, subject: e.target.value })}
                  placeholder="Brief subject of your feedback"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="feedback-category">Category *</Label>
                <Select 
                  value={feedbackForm.category} 
                  onValueChange={(value: any) => setFeedbackForm({ ...feedbackForm, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Policy">Policy</SelectItem>
                    <SelectItem value="Workplace">Workplace</SelectItem>
                    <SelectItem value="Management">Management</SelectItem>
                    <SelectItem value="IT Support">IT Support</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Suggestion">Suggestion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback-priority">Priority</Label>
              <Select 
                value={feedbackForm.priority} 
                onValueChange={(value: any) => setFeedbackForm({ ...feedbackForm, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback-message">Message *</Label>
              <Textarea
                id="feedback-message"
                value={feedbackForm.message}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                placeholder="Provide detailed feedback..."
                rows={6}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="anonymous-feedback"
                checked={feedbackForm.isAnonymous}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, isAnonymous: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="anonymous-feedback">Submit feedback anonymously</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFeedbackDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitFeedback}
              disabled={!feedbackForm.subject || !feedbackForm.message}
              className="bg-green-600 hover:bg-green-700"
            >
              <SendIcon className="mr-2 h-4 w-4" />
              Submit Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Note Dialog */}
      <Dialog open={showCreateNoteDialog} onOpenChange={setShowCreateNoteDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Note</DialogTitle>
            <DialogDescription>
              Create a note to save important information or reminders.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="note-title">Title *</Label>
                <Input
                  id="note-title"
                  value={noteForm.title}
                  onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                  placeholder="Note title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="note-category">Category *</Label>
                <Select 
                  value={noteForm.category} 
                  onValueChange={(value: any) => setNoteForm({ ...noteForm, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Meeting">Meeting</SelectItem>
                    <SelectItem value="Reminder">Reminder</SelectItem>
                    <SelectItem value="Task">Task</SelectItem>
                    <SelectItem value="Information">Information</SelectItem>
                    <SelectItem value="Follow-up">Follow-up</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note-content">Content *</Label>
              <Textarea
                id="note-content"
                value={noteForm.content}
                onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                placeholder="Note content..."
                rows={5}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="note-color">Color</Label>
                <Select 
                  value={noteForm.color} 
                  onValueChange={(value: any) => setNoteForm({ ...noteForm, color: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="#3B82F6">Blue</SelectItem>
                    <SelectItem value="#10B981">Green</SelectItem>
                    <SelectItem value="#F59E0B">Yellow</SelectItem>
                    <SelectItem value="#EF4444">Red</SelectItem>
                    <SelectItem value="#8B5CF6">Purple</SelectItem>
                    <SelectItem value="#06B6D4">Cyan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="note-tags">Tags</Label>
                <Input
                  id="note-tags"
                  value={noteForm.tags}
                  onChange={(e) => setNoteForm({ ...noteForm, tags: e.target.value })}
                  placeholder="e.g. Important, Meeting, Follow-up"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="note-shared">Share With (if not private)</Label>
              <Input
                id="note-shared"
                value={noteForm.sharedWith}
                onChange={(e) => setNoteForm({ ...noteForm, sharedWith: e.target.value })}
                placeholder="e.g. HR Team, Management, All Staff"
                disabled={noteForm.isPrivate}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="private-note"
                checked={noteForm.isPrivate}
                onChange={(e) => setNoteForm({ ...noteForm, isPrivate: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="private-note">Keep this note private (only visible to you)</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateNoteDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateNote}
              disabled={!noteForm.title || !noteForm.content}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <StickyNoteIcon className="mr-2 h-4 w-4" />
              Create Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Communication Dialog */}
      <Dialog open={showEditCommunicationDialog} onOpenChange={setShowEditCommunicationDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Communication</DialogTitle>
            <DialogDescription>
              Update your communication details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-comm-title">Title *</Label>
                <Input
                  id="edit-comm-title"
                  value={communicationForm.title}
                  onChange={(e) => setCommunicationForm({ ...communicationForm, title: e.target.value })}
                  placeholder="e.g. Important Policy Update"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-comm-type">Type *</Label>
                <Select 
                  value={communicationForm.type} 
                  onValueChange={(value: any) => setCommunicationForm({ ...communicationForm, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Announcement">Announcement</SelectItem>
                    <SelectItem value="Policy Update">Policy Update</SelectItem>
                    <SelectItem value="News">News</SelectItem>
                    <SelectItem value="Event">Event</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-comm-priority">Priority *</Label>
                <Select 
                  value={communicationForm.priority} 
                  onValueChange={(value: any) => setCommunicationForm({ ...communicationForm, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-comm-expiry">Expiry Date (Optional)</Label>
                <Input
                  id="edit-comm-expiry"
                  type="date"
                  value={communicationForm.expiryDate}
                  onChange={(e) => setCommunicationForm({ ...communicationForm, expiryDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-comm-content">Content *</Label>
              <Textarea
                id="edit-comm-content"
                value={communicationForm.content}
                onChange={(e) => setCommunicationForm({ ...communicationForm, content: e.target.value })}
                placeholder="Enter your communication content here..."
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-comm-audience">Target Audience</Label>
              <Input
                id="edit-comm-audience"
                value={communicationForm.targetAudience}
                onChange={(e) => setCommunicationForm({ ...communicationForm, targetAudience: e.target.value })}
                placeholder="e.g. All Staff, Management, HR Team (comma-separated)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-comm-tags">Tags</Label>
              <Input
                id="edit-comm-tags"
                value={communicationForm.tags}
                onChange={(e) => setCommunicationForm({ ...communicationForm, tags: e.target.value })}
                placeholder="e.g. Policy, Update, Important (comma-separated)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-comm-notes">Internal Notes (HR Only)</Label>
              <Textarea
                id="edit-comm-notes"
                value={communicationForm.notes}
                onChange={(e) => setCommunicationForm({ ...communicationForm, notes: e.target.value })}
                placeholder="Internal notes for HR team..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-pin-communication"
                checked={communicationForm.isPinned}
                onChange={(e) => setCommunicationForm({ ...communicationForm, isPinned: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="edit-pin-communication">Pin this communication to the top</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditCommunicationDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateCommunication}
              disabled={!communicationForm.title || !communicationForm.content}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <EditIcon className="mr-2 h-4 w-4" />
              Update Communication
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Feedback Dialog */}
      <Dialog open={showEditFeedbackDialog} onOpenChange={setShowEditFeedbackDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Feedback</DialogTitle>
            <DialogDescription>
              Update your feedback details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-feedback-subject">Subject *</Label>
                <Input
                  id="edit-feedback-subject"
                  value={feedbackForm.subject}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, subject: e.target.value })}
                  placeholder="Brief subject of your feedback"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-feedback-category">Category *</Label>
                <Select 
                  value={feedbackForm.category} 
                  onValueChange={(value: any) => setFeedbackForm({ ...feedbackForm, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Policy">Policy</SelectItem>
                    <SelectItem value="Workplace">Workplace</SelectItem>
                    <SelectItem value="Management">Management</SelectItem>
                    <SelectItem value="IT Support">IT Support</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Suggestion">Suggestion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-feedback-priority">Priority</Label>
              <Select 
                value={feedbackForm.priority} 
                onValueChange={(value: any) => setFeedbackForm({ ...feedbackForm, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-feedback-message">Message *</Label>
              <Textarea
                id="edit-feedback-message"
                value={feedbackForm.message}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                placeholder="Provide detailed feedback..."
                rows={6}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-anonymous-feedback"
                checked={feedbackForm.isAnonymous}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, isAnonymous: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="edit-anonymous-feedback">Submit feedback anonymously</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditFeedbackDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateFeedback}
              disabled={!feedbackForm.subject || !feedbackForm.message}
              className="bg-green-600 hover:bg-green-700"
            >
              <EditIcon className="mr-2 h-4 w-4" />
              Update Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Note Dialog */}
      <Dialog open={showEditNoteDialog} onOpenChange={setShowEditNoteDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
            <DialogDescription>
              Update your note details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-note-title">Title *</Label>
                <Input
                  id="edit-note-title"
                  value={noteForm.title}
                  onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                  placeholder="Note title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-note-category">Category *</Label>
                <Select 
                  value={noteForm.category} 
                  onValueChange={(value: any) => setNoteForm({ ...noteForm, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Meeting">Meeting</SelectItem>
                    <SelectItem value="Reminder">Reminder</SelectItem>
                    <SelectItem value="Task">Task</SelectItem>
                    <SelectItem value="Information">Information</SelectItem>
                    <SelectItem value="Follow-up">Follow-up</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-note-content">Content *</Label>
              <Textarea
                id="edit-note-content"
                value={noteForm.content}
                onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                placeholder="Note content..."
                rows={5}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-note-color">Color</Label>
                <Select 
                  value={noteForm.color} 
                  onValueChange={(value: any) => setNoteForm({ ...noteForm, color: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="#3B82F6">Blue</SelectItem>
                    <SelectItem value="#10B981">Green</SelectItem>
                    <SelectItem value="#F59E0B">Yellow</SelectItem>
                    <SelectItem value="#EF4444">Red</SelectItem>
                    <SelectItem value="#8B5CF6">Purple</SelectItem>
                    <SelectItem value="#06B6D4">Cyan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-note-tags">Tags</Label>
                <Input
                  id="edit-note-tags"
                  value={noteForm.tags}
                  onChange={(e) => setNoteForm({ ...noteForm, tags: e.target.value })}
                  placeholder="e.g. Important, Meeting, Follow-up"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-note-shared">Share With (if not private)</Label>
              <Input
                id="edit-note-shared"
                value={noteForm.sharedWith}
                onChange={(e) => setNoteForm({ ...noteForm, sharedWith: e.target.value })}
                placeholder="e.g. HR Team, Management, All Staff"
                disabled={noteForm.isPrivate}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-private-note"
                checked={noteForm.isPrivate}
                onChange={(e) => setNoteForm({ ...noteForm, isPrivate: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="edit-private-note">Keep this note private (only visible to you)</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditNoteDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateNote}
              disabled={!noteForm.title || !noteForm.content}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <EditIcon className="mr-2 h-4 w-4" />
              Update Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 