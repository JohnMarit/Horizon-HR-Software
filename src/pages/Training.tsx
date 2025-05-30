import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { 
  BookOpenIcon, 
  PlayCircleIcon, 
  AwardIcon, 
  SearchIcon, 
  FilterIcon,
  PlusIcon,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  UsersIcon,
  TrendingUpIcon,
  StarIcon,
  FileTextIcon,
  VideoIcon,
  MoreVerticalIcon,
  EditIcon,
  TrashIcon,
  DownloadIcon,
  GraduationCapIcon,
  EyeIcon,
  UserCheckIcon,
  XCircleIcon
} from "lucide-react";

// Interfaces
interface Course {
  id: number;
  title: string;
  category: 'Compliance & Risk' | 'Banking Products' | 'Soft Skills' | 'Information Security' | 'Operations' | 'Leadership';
  level: 'Foundation' | 'Intermediate' | 'Advanced' | 'Mandatory';
  duration: string;
  format: 'Online' | 'Classroom' | 'Blended';
  instructor: string;
  description: string;
  enrollments: number;
  completions: number;
  rating: number;
  status: 'Active' | 'Draft' | 'Archived';
  prerequisites: string[];
  modules: string[];
  resources: string[];
  deadline?: string;
  createdBy: string;
  createdDate: string;
  hasCertificate: boolean;
  certificateTemplate?: string;
  passingScore: number;
  examId?: number;
}

interface Exam {
  id: number;
  courseId: number;
  title: string;
  objectives: string[];
  duration: number; // in minutes
  totalMarks: number;
  questions: ExamQuestion[];
  createdBy: string;
  createdDate: string;
}

interface ExamQuestion {
  id: number;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay';
  question: string;
  options?: string[]; // for multiple choice
  correctAnswer: string;
  marks: number;
}

interface ExamResult {
  id: number;
  examId: number;
  courseId: number;
  employeeId: string;
  employeeName: string;
  answers: Record<number, string>; // questionId -> answer
  score: number;
  totalMarks: number;
  percentage: number;
  submittedDate: string;
  timeTaken: number; // in minutes
  passed: boolean;
}

interface Enrollment {
  id: number;
  courseId: number;
  employeeId: string;
  employeeName: string;
  department: string;
  enrolledDate: string;
  status: 'Enrolled' | 'In Progress' | 'Completed' | 'Failed' | 'Dropped';
  progress: number;
  score?: number;
  completedDate?: string;
  certificateId?: string;
  certificateIssued?: boolean;
  examResultId?: number;
}

interface Certificate {
  id: string;
  courseId: number;
  courseTitle: string;
  employeeId: string;
  employeeName: string;
  department: string;
  instructor: string;
  completedDate: string;
  issuedDate: string;
  score: number;
  certificateNumber: string;
  validUntil?: string;
  downloadUrl?: string;
}

export default function Training() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("courses");
  const [showCreateCourseDialog, setShowCreateCourseDialog] = useState(false);
  const [showCreateExamDialog, setShowCreateExamDialog] = useState(false);
  const [showTakeExamDialog, setShowTakeExamDialog] = useState(false);
  const [showCertificateDialog, setShowCertificateDialog] = useState(false);
  const [showEditCourseDialog, setShowEditCourseDialog] = useState(false);
  const [showDeleteCourseDialog, setShowDeleteCourseDialog] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [currentExamAnswers, setCurrentExamAnswers] = useState<Record<number, string>>({});
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  
  const { user, hasPermission, addAuditLog } = useAuth();

  // Course form state
  const [courseForm, setCourseForm] = useState({
    title: "",
    category: "Compliance & Risk" as const,
    level: "Foundation" as const,
    duration: "",
    format: "Online" as const,
    instructor: "",
    description: "",
    modules: "",
    resources: "",
    prerequisites: "",
    deadline: "",
    hasCertificate: true,
    passingScore: 80
  });

  // Exam form state
  const [examForm, setExamForm] = useState({
    title: "",
    objectives: "",
    duration: 60,
    questions: [
      {
        type: "multiple-choice" as const,
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        marks: 5
      }
    ]
  });

  // Enhanced courses with resources and exam functionality
  const [courses, setCourses] = useState<Course[]>([
    {
      id: 1,
      title: "Anti-Money Laundering (AML) Compliance",
      category: "Compliance & Risk",
      level: "Mandatory",
      duration: "4 hours",
      format: "Online",
      instructor: "Sarah Akol",
      description: "Essential training on AML regulations, KYC procedures, and suspicious transaction reporting for banking professionals.",
      enrollments: 45,
      completions: 38,
      rating: 4.8,
      status: "Active",
      prerequisites: [],
      modules: [
        "Introduction to AML Laws",
        "Know Your Customer (KYC)",
        "Suspicious Activity Reporting",
        "Record Keeping Requirements"
      ],
      resources: [
        "https://example.com/aml-guide.pdf",
        "https://example.com/kyc-procedures.pdf",
        "https://example.com/suspicious-activity-reporting-video"
      ],
      deadline: "2025-03-31",
      createdBy: "Sarah Akol",
      createdDate: "2024-12-01",
      hasCertificate: true,
      certificateTemplate: "AML Compliance Certificate",
      passingScore: 80,
      examId: 1
    },
    {
      id: 2,
      title: "Trade Finance Fundamentals",
      category: "Banking Products",
      level: "Intermediate",
      duration: "8 hours",
      format: "Blended",
      instructor: "Peter Musa",
      description: "Comprehensive training on trade finance instruments, letters of credit, and international banking procedures.",
      enrollments: 18,
      completions: 12,
      rating: 4.9,
      status: "Active",
      prerequisites: ["Basic Banking Knowledge"],
      modules: [
        "Letters of Credit",
        "Documentary Collections",
        "Bank Guarantees",
        "Trade Finance Risk Management"
      ],
      resources: [
        "https://example.com/trade-finance-manual.pdf",
        "https://example.com/letters-of-credit-tutorial.mp4",
        "https://example.com/trade-finance-case-studies.pdf"
      ],
      deadline: "2025-04-30",
      createdBy: "Sarah Akol",
      createdDate: "2024-11-15",
      hasCertificate: true,
      certificateTemplate: "Trade Finance Professional",
      passingScore: 75,
      examId: 2
    },
    {
      id: 3,
      title: "Customer Service Excellence",
      category: "Soft Skills",
      level: "Foundation",
      duration: "6 hours",
      format: "Classroom",
      instructor: "Grace Ajak",
      description: "Develop exceptional customer service skills tailored for banking environments.",
      enrollments: 32,
      completions: 28,
      rating: 4.7,
      status: "Active",
      prerequisites: [],
      modules: [
        "Banking Customer Psychology",
        "Conflict Resolution",
        "Cross-selling Techniques",
        "Digital Banking Support"
      ],
      resources: [
        "https://example.com/customer-service-handbook.pdf",
        "https://example.com/conflict-resolution-techniques.mp4"
      ],
      deadline: "2025-02-28",
      createdBy: "Sarah Akol",
      createdDate: "2024-10-20",
      hasCertificate: true,
      certificateTemplate: "Customer Service Excellence",
      passingScore: 85,
      examId: 3
    }
  ]);

  // Employee list for enrollment
  const employees = [
    { id: "HB001", name: "Sarah Akol", department: "Human Resources" },
    { id: "HB002", name: "James Wani", department: "Human Resources" },
    { id: "HB003", name: "Mary Deng", department: "Corporate Banking" },
    { id: "HB004", name: "Peter Garang", department: "Finance & Accounting" },
    { id: "HB005", name: "Grace Ajak", department: "Personal Banking" },
    { id: "HB006", name: "Michael Jok", department: "Trade Finance" },
    { id: "HB007", name: "Rebecca Akuoc", department: "Risk Management" },
    { id: "HB008", name: "David Majok", department: "Information Technology" },
    { id: "HB009", name: "Anna Nyong", department: "Corporate Banking" },
    { id: "HB010", name: "John Kuol", department: "Personal Banking" }
  ];

  // Exams with structured questions
  const [exams, setExams] = useState<Exam[]>([
    {
      id: 1,
      courseId: 1,
      title: "AML Compliance Assessment",
      objectives: [
        "Assess understanding of AML regulations and requirements",
        "Evaluate knowledge of KYC procedures",
        "Test ability to identify suspicious activities",
        "Verify comprehension of reporting obligations"
      ],
      duration: 60,
      totalMarks: 100,
      questions: [
        {
          id: 1,
          type: "multiple-choice",
          question: "What is the primary purpose of Anti-Money Laundering (AML) regulations?",
          options: [
            "To increase bank profits",
            "To prevent criminals from disguising illegal funds as legitimate income",
            "To reduce banking operational costs",
            "To simplify banking procedures"
          ],
          correctAnswer: "To prevent criminals from disguising illegal funds as legitimate income",
          marks: 10
        },
        {
          id: 2,
          type: "multiple-choice",
          question: "Which document is required for Customer Due Diligence (CDD)?",
          options: [
            "Bank statement from another institution",
            "Government-issued photo identification",
            "Employment contract",
            "Educational certificates"
          ],
          correctAnswer: "Government-issued photo identification",
          marks: 10
        },
        {
          id: 3,
          type: "true-false",
          question: "Banks must report all transactions above $10,000 to regulatory authorities.",
          options: ["True", "False"],
          correctAnswer: "True",
          marks: 5
    },
    {
      id: 4,
          type: "short-answer",
          question: "List three red flags that might indicate suspicious activity in a customer account.",
          correctAnswer: "Large cash deposits inconsistent with known income, rapid movement of funds, transactions involving high-risk countries",
          marks: 15
        }
      ],
      createdBy: "Sarah Akol",
      createdDate: "2024-12-01"
    }
  ]);

  // Exam results with detailed scoring
  const [examResults, setExamResults] = useState<ExamResult[]>([
    {
      id: 1,
      examId: 1,
      courseId: 1,
      employeeId: "HB005",
      employeeName: "Grace Ajak",
      answers: {
        1: "To prevent criminals from disguising illegal funds as legitimate income",
        2: "Government-issued photo identification", 
        3: "True",
        4: "Large cash deposits, rapid fund movements, high-risk countries"
      },
      score: 92,
      totalMarks: 100,
      percentage: 92,
      submittedDate: "2025-01-15",
      timeTaken: 45,
      passed: true
    }
  ]);

  // Enrollments with exam results integration
  const [enrollments, setEnrollments] = useState<Enrollment[]>([
    {
      id: 1,
      courseId: 1,
      employeeId: "HB005",
      employeeName: "Grace Ajak",
      department: "Personal Banking",
      enrolledDate: "2025-01-10",
      status: "Completed",
      progress: 100,
      score: 92,
      completedDate: "2025-01-15",
      certificateId: "CERT-AML-001",
      certificateIssued: true,
      examResultId: 1
    },
    {
      id: 2,
          courseId: 2,
      employeeId: "HB006",
      employeeName: "Michael Jok",
      department: "Trade Finance",
      enrolledDate: "2025-01-12",
      status: "In Progress",
          progress: 75,
      score: undefined,
      completedDate: undefined
    },
    {
      id: 3,
      courseId: 1,
      employeeId: "HB009",
      employeeName: "Anna Nyong",
      department: "Corporate Banking",
      enrolledDate: "2025-01-15",
          status: "In Progress",
      progress: 65,
      score: undefined,
      completedDate: undefined
    }
  ]);

  // Generated certificates
  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: "CERT-AML-001",
          courseId: 1,
      courseTitle: "Anti-Money Laundering (AML) Compliance",
      employeeId: "HB005",
      employeeName: "Grace Ajak",
      department: "Personal Banking",
      instructor: "Sarah Akol",
          completedDate: "2025-01-15",
      issuedDate: "2025-01-15",
      score: 92,
      certificateNumber: "HB-AML-2025-001",
      validUntil: "2026-01-15",
      downloadUrl: "/certificates/CERT-AML-001.pdf"
    },
    {
      id: "CERT-TF-001",
      courseId: 2,
      courseTitle: "Trade Finance Fundamentals",
      employeeId: "HB006",
      employeeName: "Michael Jok",
      department: "Trade Finance",
      instructor: "Peter Musa",
      completedDate: "2025-01-20",
      issuedDate: "2025-01-20",
      score: 95,
      certificateNumber: "HB-TF-2025-001",
      validUntil: "2027-01-20",
      downloadUrl: "/certificates/CERT-TF-001.pdf"
    },
    {
      id: "CERT-CS-001",
      courseId: 3,
      courseTitle: "Customer Service Excellence",
      employeeId: "HB005",
      employeeName: "Grace Ajak",
      department: "Personal Banking",
      instructor: "Grace Ajak",
      completedDate: "2025-01-10",
      issuedDate: "2025-01-10",
      score: 88,
      certificateNumber: "HB-CS-2025-001",
      downloadUrl: "/certificates/CERT-CS-001.pdf"
    }
  ]);

  // Course management functions
  const resetCourseForm = () => {
    setCourseForm({
      title: "",
      category: "Compliance & Risk",
      level: "Foundation",
      duration: "",
      format: "Online",
      instructor: "",
      description: "",
      modules: "",
      resources: "",
      prerequisites: "",
      deadline: "",
      hasCertificate: true,
      passingScore: 80
    });
  };

  const resetExamForm = () => {
    setExamForm({
      title: "",
      objectives: "",
      duration: 60,
      questions: [
        {
          type: "multiple-choice",
          question: "",
          options: ["", "", "", ""],
          correctAnswer: "",
          marks: 5
        }
      ]
    });
  };

  const generateCertificateId = () => {
    return `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const generateCertificateNumber = (courseTitle: string) => {
    const prefix = courseTitle.split(' ').map(word => word[0]).join('').toUpperCase();
    const year = new Date().getFullYear();
    const number = certificates.length + 1;
    return `HB-${prefix}-${year}-${number.toString().padStart(3, '0')}`;
  };

  const handleCreateCourse = () => {
    if (!hasPermission('training.manage') && !hasPermission('*')) {
      addAuditLog('UNAUTHORIZED_ACCESS_ATTEMPT', 'TRAINING', { action: 'create_course' });
      return;
    }

    const modules = courseForm.modules.split('\n').filter(m => m.trim());
    const prerequisites = courseForm.prerequisites.split(',').map(p => p.trim()).filter(p => p);
    const resources = courseForm.resources.split('\n').filter(r => r.trim());

    const newCourse: Course = {
      id: Math.max(...courses.map(c => c.id)) + 1,
      title: courseForm.title,
      category: courseForm.category,
      level: courseForm.level,
      duration: courseForm.duration,
      format: courseForm.format,
      instructor: courseForm.instructor,
      description: courseForm.description,
      enrollments: 0,
      completions: 0,
      rating: 0,
      status: 'Active',
      prerequisites,
      modules,
      resources,
      deadline: courseForm.deadline || undefined,
      createdBy: user?.email || 'System',
      createdDate: new Date().toISOString().split('T')[0],
      hasCertificate: courseForm.hasCertificate,
      certificateTemplate: courseForm.hasCertificate ? `${courseForm.title} Certificate` : undefined,
      passingScore: courseForm.passingScore,
      examId: courseForm.hasCertificate ? Math.max(...exams.map(e => e.id), 0) + 1 : undefined
    };

    setCourses([...courses, newCourse]);
    setShowCreateCourseDialog(false);
    resetCourseForm();

    addAuditLog('COURSE_CREATED', 'TRAINING', {
      action: 'course_created',
      courseId: newCourse.id,
      courseTitle: newCourse.title,
      createdBy: user?.email
    });
  };

  const handleEditCourse = () => {
    if (!hasPermission('training.manage') && !hasPermission('*')) {
      addAuditLog('UNAUTHORIZED_ACCESS_ATTEMPT', 'TRAINING', { action: 'edit_course' });
      return;
    }

    if (!selectedCourse) return;

    const modules = courseForm.modules.split('\n').filter(m => m.trim());
    const prerequisites = courseForm.prerequisites.split(',').map(p => p.trim()).filter(p => p);
    const resources = courseForm.resources.split('\n').filter(r => r.trim());

    const updatedCourse: Course = {
      ...selectedCourse,
      title: courseForm.title,
      category: courseForm.category,
      level: courseForm.level,
      duration: courseForm.duration,
      format: courseForm.format,
      instructor: courseForm.instructor,
      description: courseForm.description,
      prerequisites,
      modules,
      resources,
      deadline: courseForm.deadline || undefined,
      hasCertificate: courseForm.hasCertificate,
      certificateTemplate: courseForm.hasCertificate ? `${courseForm.title} Certificate` : undefined,
      passingScore: courseForm.passingScore
    };

    const updatedCourses = courses.map(course => 
      course.id === selectedCourse.id ? updatedCourse : course
    );
    
    setCourses(updatedCourses);
    setShowEditCourseDialog(false);
    resetCourseForm();
    setSelectedCourse(null);

    addAuditLog('COURSE_UPDATED', 'TRAINING', {
      action: 'course_updated',
      courseId: selectedCourse.id,
      courseTitle: updatedCourse.title,
      updatedBy: user?.email
    });
  };

  const handleDeleteCourse = () => {
    if (!hasPermission('training.manage') && !hasPermission('*')) {
      addAuditLog('UNAUTHORIZED_ACCESS_ATTEMPT', 'TRAINING', { action: 'delete_course' });
      return;
    }

    if (!courseToDelete) return;

    // Check if course has active enrollments
    const activeEnrollments = enrollments.filter(e => 
      e.courseId === courseToDelete.id && 
      (e.status === 'Enrolled' || e.status === 'In Progress')
    );

    if (activeEnrollments.length > 0) {
      alert(`Cannot delete course. There are ${activeEnrollments.length} active enrollments.`);
      return;
    }

    const updatedCourses = courses.filter(course => course.id !== courseToDelete.id);
    setCourses(updatedCourses);

    // Also remove related exams
    const updatedExams = exams.filter(exam => exam.courseId !== courseToDelete.id);
    setExams(updatedExams);

    setShowDeleteCourseDialog(false);
    setCourseToDelete(null);

    addAuditLog('COURSE_DELETED', 'TRAINING', {
      action: 'course_deleted',
      courseId: courseToDelete.id,
      courseTitle: courseToDelete.title,
      deletedBy: user?.email
    });
  };

  const openEditCourseDialog = (course: Course) => {
    setSelectedCourse(course);
    setCourseForm({
      title: course.title,
      category: course.category as "Compliance & Risk",
      level: course.level as "Foundation",
      duration: course.duration,
      format: course.format as "Online",
      instructor: course.instructor,
      description: course.description,
      modules: course.modules.join('\n'),
      resources: course.resources.join('\n'),
      prerequisites: course.prerequisites.join(', '),
      deadline: course.deadline || '',
      hasCertificate: course.hasCertificate,
      passingScore: course.passingScore
    });
    setShowEditCourseDialog(true);
  };

  const openDeleteCourseDialog = (course: Course) => {
    setCourseToDelete(course);
    setShowDeleteCourseDialog(true);
  };

  const handleCreateExam = () => {
    if (!hasPermission('training.manage') && !hasPermission('*')) {
      addAuditLog('UNAUTHORIZED_ACCESS_ATTEMPT', 'TRAINING', { action: 'create_exam' });
      return;
    }

    if (!selectedCourse) return;

    const objectives = examForm.objectives.split('\n').filter(o => o.trim());
    const totalMarks = examForm.questions.reduce((sum, q) => sum + q.marks, 0);

    const questionsWithIds = examForm.questions.map((q, index) => ({
      ...q,
      id: index + 1
    }));

    const newExam: Exam = {
      id: Math.max(...exams.map(e => e.id), 0) + 1,
      courseId: selectedCourse.id,
      title: examForm.title,
      objectives,
      duration: examForm.duration,
      totalMarks,
      questions: questionsWithIds,
      createdBy: user?.email || 'System',
      createdDate: new Date().toISOString().split('T')[0]
    };

    setExams([...exams, newExam]);
    
    // Update course with exam ID
    const updatedCourses = courses.map(c => 
      c.id === selectedCourse.id ? { ...c, examId: newExam.id } : c
    );
    setCourses(updatedCourses);
    
    setShowCreateExamDialog(false);
    resetExamForm();
    setSelectedCourse(null);

    addAuditLog('EXAM_CREATED', 'TRAINING', {
      action: 'exam_created',
      examId: newExam.id,
      courseId: selectedCourse.id,
      createdBy: user?.email
    });
  };

  const handleEmployeeSelfEnroll = (courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    // Find employee with improved matching
    let employee = employees.find(e => e.name.toLowerCase().includes(user?.email?.split('@')[0] || ''));
    
    // If not found, try alternative matching for HR users
    if (!employee) {
      const userEmail = user?.email?.toLowerCase() || '';
      
      // Direct email-to-name mapping for HR users
      if (userEmail.includes('sarah') || userEmail.includes('hr')) {
        employee = employees.find(e => e.name.toLowerCase().includes('sarah'));
      } else if (userEmail.includes('james')) {
        employee = employees.find(e => e.name.toLowerCase().includes('james'));
      }
      
      // Create a temporary employee record if still not found
      if (!employee) {
        employee = {
          id: user?.id || 'USR' + Date.now(),
          name: user?.email?.split('@')[0] || 'User',
          department: (hasPermission('*') || hasPermission('training.manage') || hasPermission('communications.manage')) 
            ? 'Human Resources' 
            : 'General Staff'
        };
      }
    }

    // Check if already enrolled
    const existingEnrollment = enrollments.find(e => 
      e.courseId === courseId && e.employeeId === employee.id
    );

    if (existingEnrollment) {
      alert('You are already enrolled in this course.');
      return;
    }

    const newEnrollment: Enrollment = {
      id: Math.max(...enrollments.map(e => e.id)) + 1,
      courseId,
      employeeId: employee.id,
      employeeName: employee.name,
      department: employee.department,
      enrolledDate: new Date().toISOString().split('T')[0],
      status: 'Enrolled',
      progress: 0
    };

    setEnrollments([...enrollments, newEnrollment]);
    
    // Update course enrollment count
    const updatedCourses = courses.map(c => {
      if (c.id === courseId) {
        return { ...c, enrollments: c.enrollments + 1 };
      }
      return c;
    });
    setCourses(updatedCourses);

    addAuditLog('EMPLOYEE_SELF_ENROLLED', 'TRAINING', {
      action: 'employee_self_enrolled',
      courseId,
      employeeId: employee.id,
      employeeName: employee.name,
      department: employee.department,
      enrolledBy: user?.email
    });

    alert(`Successfully enrolled in "${course.title}"! You can now access the course materials and take the exam when ready.`);
  };

  const handleTakeExam = (courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    const exam = exams.find(e => e.id === course?.examId);
    
    if (!exam) {
      alert('No exam available for this course.');
      return;
    }

    setSelectedExam(exam);
    setCurrentExamAnswers({});
    setShowTakeExamDialog(true);
  };

  const handleSubmitExam = () => {
    if (!selectedExam || !user) return;

    // Find employee with improved matching (same logic as enrollment)
    let employee = employees.find(e => e.name.toLowerCase().includes(user.email?.split('@')[0] || ''));
    
    // If not found, try alternative matching for HR users
    if (!employee) {
      const userEmail = user.email?.toLowerCase() || '';
      
      // Direct email-to-name mapping for HR users
      if (userEmail.includes('sarah') || userEmail.includes('hr')) {
        employee = employees.find(e => e.name.toLowerCase().includes('sarah'));
      } else if (userEmail.includes('james')) {
        employee = employees.find(e => e.name.toLowerCase().includes('james'));
      }
      
      // Find from enrollments if still not found
      if (!employee) {
        const enrollment = enrollments.find(e => 
          e.courseId === selectedExam.courseId && 
          (e.employeeName.toLowerCase().includes(user.email?.split('@')[0] || '') ||
           e.employeeId === user.id)
        );
        if (enrollment) {
          employee = {
            id: enrollment.employeeId,
            name: enrollment.employeeName,
            department: enrollment.department
          };
        }
      }
    }

    if (!employee) {
      alert('Unable to find your employee record. Please contact HR.');
      return;
    }

    // Calculate score
    let score = 0;
    selectedExam.questions.forEach(question => {
      const userAnswer = currentExamAnswers[question.id];
      if (userAnswer === question.correctAnswer) {
        score += question.marks;
      } else if (question.type === 'short-answer' && userAnswer && question.correctAnswer) {
        // Simple scoring for short answers - could be enhanced with NLP
        const similarity = userAnswer.toLowerCase().includes(question.correctAnswer.toLowerCase().split(' ')[0]);
        if (similarity) score += Math.floor(question.marks * 0.7); // Partial credit
      }
    });

    const percentage = Math.round((score / selectedExam.totalMarks) * 100);
    const course = courses.find(c => c.id === selectedExam.courseId);
    const passed = percentage >= (course?.passingScore || 80);

    const newExamResult: ExamResult = {
      id: Math.max(...examResults.map(r => r.id), 0) + 1,
      examId: selectedExam.id,
      courseId: selectedExam.courseId,
      employeeId: employee.id,
      employeeName: employee.name,
      answers: currentExamAnswers,
      score,
      totalMarks: selectedExam.totalMarks,
      percentage,
      submittedDate: new Date().toISOString().split('T')[0],
      timeTaken: selectedExam.duration, // Simplified - could track actual time
      passed
    };

    setExamResults([...examResults, newExamResult]);

    // Update enrollment with exam result
    const updatedEnrollments = enrollments.map(enrollment => {
      if (enrollment.courseId === selectedExam.courseId && enrollment.employeeId === employee.id) {
        return {
          ...enrollment,
          status: passed ? 'Completed' as const : 'Failed' as const,
          progress: 100,
          score: percentage,
          completedDate: new Date().toISOString().split('T')[0],
          examResultId: newExamResult.id
        };
      }
      return enrollment;
    });

    setEnrollments(updatedEnrollments);

    // Auto-generate certificate if passed
    if (passed && course?.hasCertificate) {
      const certificateId = generateCertificateId();
      const certificateNumber = generateCertificateNumber(course.title);
      
      const newCertificate: Certificate = {
        id: certificateId,
        courseId: course.id,
        courseTitle: course.title,
        employeeId: employee.id,
        employeeName: employee.name,
        department: employee.department,
        instructor: course.instructor,
        completedDate: new Date().toISOString().split('T')[0],
        issuedDate: new Date().toISOString().split('T')[0],
        score: percentage,
        certificateNumber,
        validUntil: course.category === 'Compliance & Risk' ? 
          new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined,
        downloadUrl: `/certificates/${certificateId}.pdf`
      };

      setCertificates([...certificates, newCertificate]);
      
      // Update enrollment with certificate
      const finalEnrollments = updatedEnrollments.map(e => 
        e.id === updatedEnrollments.find(en => en.courseId === selectedExam.courseId && en.employeeId === employee.id)?.id
          ? { ...e, certificateId, certificateIssued: true }
          : e
      );
      setEnrollments(finalEnrollments);

      // Update course completion count
      const updatedCourses = courses.map(c => {
        if (c.id === course.id) {
          return { ...c, completions: c.completions + 1 };
        }
        return c;
      });
      setCourses(updatedCourses);
    }

    setShowTakeExamDialog(false);
    setSelectedExam(null);
    setCurrentExamAnswers({});

    addAuditLog('EXAM_COMPLETED', 'TRAINING', {
      action: 'exam_completed',
      examId: selectedExam.id,
      employeeId: employee.id,
      score: percentage,
      passed,
      certificateGenerated: passed && course?.hasCertificate
    });

    alert(`Exam completed! Your score: ${percentage}% (${passed ? 'PASSED' : 'FAILED'})`);
  };

  const addExamQuestion = () => {
    setExamForm({
      ...examForm,
      questions: [
        ...examForm.questions,
        {
          type: "multiple-choice",
          question: "",
          options: ["", "", "", ""],
          correctAnswer: "",
          marks: 5
        }
      ]
    });
  };

  const updateExamQuestion = (index: number, field: string, value: any) => {
    const updatedQuestions = [...examForm.questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setExamForm({ ...examForm, questions: updatedQuestions });
  };

  const removeExamQuestion = (index: number) => {
    const updatedQuestions = examForm.questions.filter((_, i) => i !== index);
    setExamForm({ ...examForm, questions: updatedQuestions });
  };

  // Utility functions
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Mandatory": return "bg-red-100 text-red-800";
      case "Foundation": return "bg-blue-100 text-blue-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "Online": return <VideoIcon className="h-4 w-4" />;
      case "Classroom": return <UsersIcon className="h-4 w-4" />;
      case "Blended": return <BookOpenIcon className="h-4 w-4" />;
      default: return <FileTextIcon className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Enrolled": return "bg-gray-100 text-gray-800";
      case "Failed": return "bg-red-100 text-red-800";
      case "Dropped": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Filter functions
  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEnrollments = enrollments.filter(enrollment =>
    enrollment.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    enrollment.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCertificates = certificates.filter(certificate =>
    certificate.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    certificate.courseTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate statistics
  const totalEnrollments = enrollments.length;
  const totalCompletions = enrollments.filter(e => e.status === 'Completed').length;
  const completionRate = totalEnrollments > 0 ? Math.round((totalCompletions / totalEnrollments) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Training & Development</h1>
          <p className="text-gray-600">Create courses, manage learning, and issue certificates at Horizon Bank</p>
        </div>
        <div className="flex gap-2">
          {(hasPermission('training.manage') || hasPermission('*')) && (
            <Button 
              onClick={() => setShowCreateCourseDialog(true)}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Course
            </Button>
          )}
          <Button 
            variant="outline"
            onClick={() => setActiveTab("certificates")}
          >
            <AwardIcon className="mr-2 h-4 w-4" />
            View Certificates
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Courses</p>
                <p className="text-3xl font-bold text-gray-900">{courses.filter(c => c.status === 'Active').length}</p>
                <p className="text-xs text-gray-500">Banking focused</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <BookOpenIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Enrollments</p>
                <p className="text-3xl font-bold text-gray-900">{totalEnrollments}</p>
                <p className="text-xs text-gray-500">This quarter</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <UsersIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-3xl font-bold text-gray-900">{completionRate}%</p>
                <p className="text-xs text-gray-500">Average across courses</p>
              </div>
              <div className="p-3 rounded-full bg-amber-100">
                <TrendingUpIcon className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Certificates Issued</p>
                <p className="text-3xl font-bold text-gray-900">{certificates.length}</p>
                <p className="text-xs text-gray-500">Auto-generated</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <AwardIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="courses">Course Catalog</TabsTrigger>
          <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          {/* Search and Filters */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
                  <Input
                    placeholder="Search courses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <FilterIcon className="mr-2 h-4 w-4" />
                    Filter by Category
                  </Button>
                  <Button variant="outline">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Filter by Level
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getFormatIcon(course.format)}
                        <Badge className={getLevelColor(course.level)}>
                          {course.level}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                      <Badge variant="outline">{course.category}</Badge>
                        {course.hasCertificate && (
                          <AwardIcon className="h-4 w-4 text-purple-600" />
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{course.title}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <ClockIcon className="h-4 w-4" />
                        {course.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <UsersIcon className="h-4 w-4" />
                        {course.enrollments} enrolled
                      </div>
                      <div className="flex items-center gap-1">
                        <StarIcon className="h-4 w-4 text-yellow-500" />
                        {course.rating || 'New'}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-2">Course Modules:</p>
                      <ul className="space-y-1">
                        {course.modules.slice(0, 3).map((module, index) => (
                          <li key={index} className="text-xs text-gray-500 flex items-center gap-2">
                            <CheckCircleIcon className="h-3 w-3 text-green-500" />
                            {module}
                          </li>
                        ))}
                        {course.modules.length > 3 && (
                          <li className="text-xs text-gray-400">
                            +{course.modules.length - 3} more modules
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Completion Rate</span>
                        <span className="font-medium">
                          {course.enrollments > 0 ? Math.round((course.completions / course.enrollments) * 100) : 0}%
                        </span>
                      </div>
                      <Progress 
                        value={course.enrollments > 0 ? (course.completions / course.enrollments) * 100 : 0} 
                        className="h-2" 
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleEmployeeSelfEnroll(course.id)}
                      >
                        <UserCheckIcon className="h-4 w-4 mr-1" />
                        Enroll Now
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileTextIcon className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                      {(hasPermission('training.manage') || hasPermission('*')) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVerticalIcon className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedCourse(course);
                                setShowCreateExamDialog(true);
                              }}
                            >
                              <PlusIcon className="mr-2 h-4 w-4" />
                              Create Exam
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => openEditCourseDialog(course)}>
                              <EditIcon className="mr-2 h-4 w-4" />
                              Edit Course
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => openDeleteCourseDialog(course)}
                            >
                              <TrashIcon className="mr-2 h-4 w-4" />
                              Delete Course
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>

                    {course.resources && course.resources.length > 0 && (
                      <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
                        <strong>Resources:</strong>
                        <ul className="mt-1 space-y-1">
                          {course.resources.slice(0, 2).map((resource, index) => (
                            <li key={index}>
                              <a href={resource} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                {resource.split('/').pop() || resource}
                              </a>
                            </li>
                          ))}
                          {course.resources.length > 2 && (
                            <li className="text-gray-400">+{course.resources.length - 2} more resources</li>
                          )}
                        </ul>
                      </div>
                    )}

                    {course.deadline && (
                      <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                        <strong>Deadline:</strong> {course.deadline}
                      </div>
                    )}

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Created by: {course.createdBy}</span>
                      <span>Passing Score: {course.passingScore}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="enrollments" className="space-y-6">
          {/* Search */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
                  <Input
                    placeholder="Search enrollments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <FilterIcon className="mr-2 h-4 w-4" />
                    Filter by Status
                  </Button>
                  <Button variant="outline">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Filter by Course
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enrollment Cards */}
          <div className="grid gap-6">
            {filteredEnrollments.map((enrollment) => {
              const course = courses.find(c => c.id === enrollment.courseId);
              const exam = exams.find(e => e.id === course?.examId);
              const examResult = examResults.find(r => r.id === enrollment.examResultId);
              
              return (
                <Card key={enrollment.id} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                            {enrollment.employeeName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                          <h3 className="text-lg font-semibold text-gray-900">{enrollment.employeeName}</h3>
                          <p className="text-sm text-gray-600">{course?.title}</p>
                          <p className="text-xs text-gray-500">{enrollment.department} • {enrollment.employeeId}</p>
                      </div>
                    </div>
                      <Badge className={getStatusColor(enrollment.status)}>
                        {enrollment.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{enrollment.progress}%</p>
                        <p className="text-xs text-gray-500">Progress</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{enrollment.score || 'N/A'}</p>
                        <p className="text-xs text-gray-500">Score</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">{enrollment.completedDate || 'N/A'}</p>
                        <p className="text-xs text-gray-500">Completed</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-amber-600">
                          {enrollment.certificateIssued ? '✓' : '✗'}
                        </p>
                        <p className="text-xs text-gray-500">Certificate</p>
                    </div>
                  </div>

                    {enrollment.status === 'In Progress' && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span>Course Progress</span>
                          <span>{enrollment.progress}%</span>
                        </div>
                        <Progress value={enrollment.progress} className="h-2" />
                      </div>
                    )}

                    {examResult && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <h4 className="font-medium text-sm text-gray-900 mb-2">Exam Results</h4>
                        <div className="grid grid-cols-3 gap-4 text-xs">
                    <div>
                            <span className="text-gray-600">Score:</span>
                            <span className="font-medium ml-1">{examResult.score}/{examResult.totalMarks}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Percentage:</span>
                            <span className="font-medium ml-1">{examResult.percentage}%</span>
                        </div>
                          <div>
                            <span className="text-gray-600">Time Taken:</span>
                            <span className="font-medium ml-1">{examResult.timeTaken}m</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      {enrollment.status === 'Enrolled' && exam && (
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleTakeExam(course?.id || 0)}
                        >
                          <PlayCircleIcon className="h-4 w-4 mr-1" />
                          Take Exam
                        </Button>
                      )}
                      {enrollment.certificateId && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const cert = certificates.find(c => c.id === enrollment.certificateId);
                            if (cert) setSelectedCertificate(cert);
                          }}
                        >
                          <AwardIcon className="h-4 w-4 mr-1" />
                          View Certificate
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <EyeIcon className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="certificates" className="space-y-6">
          {/* Search */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
                  <Input
                    placeholder="Search certificates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <FilterIcon className="mr-2 h-4 w-4" />
                    Filter by Course
                  </Button>
                  <Button variant="outline">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Filter by Date
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Certificate Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {filteredCertificates.map((certificate) => (
              <Card key={certificate.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-purple-100">
                        <AwardIcon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{certificate.courseTitle}</h3>
                        <p className="text-sm text-gray-600">{certificate.employeeName}</p>
                        <p className="text-xs text-gray-500">{certificate.department}</p>
                          </div>
                        </div>
                    <Badge className="bg-green-100 text-green-800">
                      Issued
                    </Badge>
                    </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Certificate Number:</span>
                      <span className="font-medium">{certificate.certificateNumber}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Score:</span>
                      <span className="font-medium text-green-600">{certificate.score}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Completed:</span>
                      <span className="font-medium">{certificate.completedDate}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Issued:</span>
                      <span className="font-medium">{certificate.issuedDate}</span>
                    </div>
                    {certificate.validUntil && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Valid Until:</span>
                        <span className="font-medium">{certificate.validUntil}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Instructor:</span>
                      <span className="font-medium">{certificate.instructor}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {
                        setSelectedCertificate(certificate);
                        setShowCertificateDialog(true);
                      }}
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View Certificate
                    </Button>
                    <Button variant="outline" size="sm">
                      <DownloadIcon className="h-4 w-4 mr-1" />
                      Download PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Analytics Dashboard */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Course Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {courses.slice(0, 3).map((course) => (
                    <div key={course.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="truncate">{course.title}</span>
                        <span>{course.enrollments > 0 ? Math.round((course.completions / course.enrollments) * 100) : 0}%</span>
                      </div>
                      <Progress 
                        value={course.enrollments > 0 ? (course.completions / course.enrollments) * 100 : 0} 
                        className="h-2" 
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Certificate Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Compliance & Risk</span>
                    <span className="font-medium">
                      {certificates.filter(c => courses.find(course => course.id === c.courseId)?.category === 'Compliance & Risk').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Banking Products</span>
                    <span className="font-medium">
                      {certificates.filter(c => courses.find(course => course.id === c.courseId)?.category === 'Banking Products').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Soft Skills</span>
                    <span className="font-medium">
                      {certificates.filter(c => courses.find(course => course.id === c.courseId)?.category === 'Soft Skills').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Department Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {['Human Resources', 'Trade Finance', 'Personal Banking'].map((dept) => {
                    const deptEnrollments = enrollments.filter(e => e.department === dept);
                    const deptCompletions = deptEnrollments.filter(e => e.status === 'Completed');
                    const rate = deptEnrollments.length > 0 ? Math.round((deptCompletions.length / deptEnrollments.length) * 100) : 0;
                    
                    return (
                      <div key={dept} className="flex justify-between">
                        <span className="text-sm">{dept}</span>
                        <span className="font-medium">{rate}%</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Course Dialog */}
      <Dialog open={showCreateCourseDialog} onOpenChange={setShowCreateCourseDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Course</DialogTitle>
            <DialogDescription>
              Create a comprehensive training course with automatic certificate generation.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course-title">Course Title *</Label>
                <Input
                  id="course-title"
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  placeholder="e.g. Advanced Risk Management"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course-category">Category *</Label>
                <Select 
                  value={courseForm.category} 
                  onValueChange={(value: any) => setCourseForm({ ...courseForm, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Compliance & Risk">Compliance & Risk</SelectItem>
                    <SelectItem value="Banking Products">Banking Products</SelectItem>
                    <SelectItem value="Soft Skills">Soft Skills</SelectItem>
                    <SelectItem value="Information Security">Information Security</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Leadership">Leadership</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course-level">Level *</Label>
                <Select 
                  value={courseForm.level} 
                  onValueChange={(value: any) => setCourseForm({ ...courseForm, level: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Foundation">Foundation</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    <SelectItem value="Mandatory">Mandatory</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="course-format">Format *</Label>
                <Select 
                  value={courseForm.format} 
                  onValueChange={(value: any) => setCourseForm({ ...courseForm, format: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Classroom">Classroom</SelectItem>
                    <SelectItem value="Blended">Blended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="course-duration">Duration *</Label>
                <Input
                  id="course-duration"
                  value={courseForm.duration}
                  onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                  placeholder="e.g. 6 hours, 2 days"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course-instructor">Instructor *</Label>
                <Input
                  id="course-instructor"
                  value={courseForm.instructor}
                  onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
                  placeholder="Instructor name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="course-deadline">Deadline (Optional)</Label>
                <Input
                  id="course-deadline"
                  type="date"
                  value={courseForm.deadline}
                  onChange={(e) => setCourseForm({ ...courseForm, deadline: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="course-description">Course Description *</Label>
              <Textarea
                id="course-description"
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                placeholder="Detailed course description and learning objectives..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="course-modules">Course Modules *</Label>
              <Textarea
                id="course-modules"
                value={courseForm.modules}
                onChange={(e) => setCourseForm({ ...courseForm, modules: e.target.value })}
                placeholder="Enter each module on a new line..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="course-resources">Course Resources</Label>
              <Textarea
                id="course-resources"
                value={courseForm.resources}
                onChange={(e) => setCourseForm({ ...courseForm, resources: e.target.value })}
                placeholder="Enter course resources (one per line)..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="course-prerequisites">Prerequisites (Optional)</Label>
              <Input
                id="course-prerequisites"
                value={courseForm.prerequisites}
                onChange={(e) => setCourseForm({ ...courseForm, prerequisites: e.target.value })}
                placeholder="Comma-separated prerequisites..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="has-certificate"
                    checked={courseForm.hasCertificate}
                    onChange={(e) => setCourseForm({ ...courseForm, hasCertificate: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="has-certificate">Enable Certificate Generation</Label>
                </div>
                <p className="text-xs text-gray-500">
                  Certificates will be automatically generated upon successful completion
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="passing-score">Passing Score (%)</Label>
                <Input
                  id="passing-score"
                  type="number"
                  min="0"
                  max="100"
                  value={courseForm.passingScore}
                  onChange={(e) => setCourseForm({ ...courseForm, passingScore: parseInt(e.target.value) || 80 })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateCourseDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateCourse}
              disabled={!courseForm.title || !courseForm.description || !courseForm.instructor || !courseForm.duration}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Exam Dialog */}
      <Dialog open={showCreateExamDialog} onOpenChange={setShowCreateExamDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Examination</DialogTitle>
            <DialogDescription>
              Create a structured examination for {selectedCourse?.title}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="exam-title">Exam Title *</Label>
                <Input
                  id="exam-title"
                  value={examForm.title}
                  onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
                  placeholder="e.g. AML Compliance Assessment"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exam-duration">Duration (minutes) *</Label>
                <Input
                  id="exam-duration"
                  type="number"
                  min="1"
                  value={examForm.duration}
                  onChange={(e) => setExamForm({ ...examForm, duration: parseInt(e.target.value) || 60 })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="exam-objectives">Learning Objectives *</Label>
              <Textarea
                id="exam-objectives"
                value={examForm.objectives}
                onChange={(e) => setExamForm({ ...examForm, objectives: e.target.value })}
                placeholder="Enter each objective on a new line..."
                rows={4}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Exam Questions</h3>
                <Button onClick={addExamQuestion} variant="outline" size="sm">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Add Question
                </Button>
              </div>

              {examForm.questions.map((question, index) => (
                <Card key={index} className="border-2">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <Label>Question Type</Label>
                          <Select 
                            value={question.type} 
                            onValueChange={(value) => updateExamQuestion(index, 'type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                              <SelectItem value="true-false">True/False</SelectItem>
                              <SelectItem value="short-answer">Short Answer</SelectItem>
                              <SelectItem value="essay">Essay</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="w-24">
                          <Label>Marks</Label>
                          <Input
                            type="number"
                            min="1"
                            value={question.marks}
                            onChange={(e) => updateExamQuestion(index, 'marks', parseInt(e.target.value) || 5)}
                          />
                        </div>
                        <Button 
                          onClick={() => removeExamQuestion(index)} 
                          variant="outline" 
                          size="sm"
                          className="text-red-600"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>

                      <div>
                        <Label>Question *</Label>
                        <Textarea
                          value={question.question}
                          onChange={(e) => updateExamQuestion(index, 'question', e.target.value)}
                          placeholder="Enter your question..."
                          rows={2}
                        />
                      </div>

                      {((question.type as string) === 'multiple-choice' || (question.type as string) === 'true-false') && (
                        <div className="space-y-2">
                          <Label>Options</Label>
                          {(question.type as string) === 'true-false' ? (
                            <div className="space-y-2">
                              {['True', 'False'].map((option, optIndex) => (
                                <div key={optIndex} className="flex items-center gap-2">
                                  <Input value={option} disabled />
                                  <input
                                    type="radio"
                                    name={`question-${index}-correct`}
                                    checked={question.correctAnswer === option}
                                    onChange={() => updateExamQuestion(index, 'correctAnswer', option)}
                                  />
                                  <Label>Correct</Label>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {question.options?.map((option, optIndex) => (
                                <div key={optIndex} className="flex items-center gap-2">
                                  <Input
                                    value={option}
                                    onChange={(e) => {
                                      const newOptions = [...(question.options || [])];
                                      newOptions[optIndex] = e.target.value;
                                      updateExamQuestion(index, 'options', newOptions);
                                    }}
                                    placeholder={`Option ${optIndex + 1}`}
                                  />
                                  <input
                                    type="radio"
                                    name={`question-${index}-correct`}
                                    checked={question.correctAnswer === option}
                                    onChange={() => updateExamQuestion(index, 'correctAnswer', option)}
                                  />
                                  <Label>Correct</Label>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {((question.type as string) === 'short-answer' || (question.type as string) === 'essay') && (
                        <div>
                          <Label>Model Answer *</Label>
                          <Textarea
                            value={question.correctAnswer}
                            onChange={(e) => updateExamQuestion(index, 'correctAnswer', e.target.value)}
                            placeholder="Enter the expected/model answer..."
                            rows={3}
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateExamDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateExam}
              disabled={!examForm.title || !examForm.objectives || examForm.questions.length === 0}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Exam
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Take Exam Dialog */}
      <Dialog open={showTakeExamDialog} onOpenChange={setShowTakeExamDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Take Exam: {selectedExam?.title}</DialogTitle>
            <DialogDescription>
              Duration: {selectedExam?.duration} minutes | Total Marks: {selectedExam?.totalMarks}
            </DialogDescription>
          </DialogHeader>
          
          {selectedExam && (
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Learning Objectives:</h3>
                <ul className="space-y-1">
                  {selectedExam.objectives.map((objective, index) => (
                    <li key={index} className="text-blue-800 text-sm flex items-start gap-2">
                      <CheckCircleIcon className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                {selectedExam.questions.map((question, index) => (
                  <Card key={question.id} className="border-2">
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-lg">
                            Question {index + 1}
                          </h3>
                          <Badge variant="outline">{question.marks} marks</Badge>
                        </div>
                        
                        <p className="text-gray-900">{question.question}</p>

                        {question.type === 'multiple-choice' && (
                          <div className="space-y-2">
                            {question.options?.map((option, optIndex) => (
                              <div key={optIndex} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`question-${question.id}`}
                                  value={option}
                                  checked={currentExamAnswers[question.id] === option}
                                  onChange={(e) => setCurrentExamAnswers({
                                    ...currentExamAnswers,
                                    [question.id]: e.target.value
                                  })}
                                />
                                <Label className="cursor-pointer">{option}</Label>
                              </div>
                            ))}
                          </div>
                        )}

                        {question.type === 'true-false' && (
                          <div className="space-y-2">
                            {['True', 'False'].map((option) => (
                              <div key={option} className="flex items-center gap-2">
                                <input
                                  type="radio"
                                  name={`question-${question.id}`}
                                  value={option}
                                  checked={currentExamAnswers[question.id] === option}
                                  onChange={(e) => setCurrentExamAnswers({
                                    ...currentExamAnswers,
                                    [question.id]: e.target.value
                                  })}
                                />
                                <Label className="cursor-pointer">{option}</Label>
                              </div>
                            ))}
                          </div>
                        )}

                        {(question.type === 'short-answer' || question.type === 'essay') && (
                          <Textarea
                            value={currentExamAnswers[question.id] || ''}
                            onChange={(e) => setCurrentExamAnswers({
                              ...currentExamAnswers,
                              [question.id]: e.target.value
                            })}
                            placeholder="Enter your answer..."
                            rows={question.type === 'essay' ? 6 : 3}
                          />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTakeExamDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitExam}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircleIcon className="mr-2 h-4 w-4" />
              Submit Exam
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Certificate View Dialog */}
      <Dialog open={showCertificateDialog} onOpenChange={setShowCertificateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Certificate Preview</DialogTitle>
            <DialogDescription>
              Auto-generated certificate for course completion.
            </DialogDescription>
          </DialogHeader>
          
          {selectedCertificate && (
            <div className="space-y-6">
              {/* Certificate Design */}
              <div className="border-4 border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-lg">
                <div className="text-center space-y-4">
                  <div className="text-purple-600">
                    <GraduationCapIcon className="h-16 w-16 mx-auto mb-4" />
                  </div>
                  
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Certificate of Completion
                  </h1>
                  
                  <div className="text-lg text-gray-700 mb-6">
                    This is to certify that
                  </div>
                  
                  <div className="text-2xl font-bold text-purple-600 mb-4">
                    {selectedCertificate.employeeName}
                  </div>
                  
                  <div className="text-lg text-gray-700 mb-6">
                    has successfully completed the course
                  </div>
                  
                  <div className="text-xl font-semibold text-gray-900 mb-6">
                    {selectedCertificate.courseTitle}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
                    <div>
                      <strong>Score:</strong> {selectedCertificate.score}%
                    </div>
                    <div>
                      <strong>Completed:</strong> {selectedCertificate.completedDate}
                    </div>
                    <div>
                      <strong>Instructor:</strong> {selectedCertificate.instructor}
                    </div>
                    <div>
                      <strong>Certificate #:</strong> {selectedCertificate.certificateNumber}
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    Issued by Horizon Bank Training Department
                  </div>
                  
                  {selectedCertificate.validUntil && (
                    <div className="text-xs text-gray-400">
                      Valid until: {selectedCertificate.validUntil}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCertificateDialog(false)}>
              Close
            </Button>
            <Button>
              <DownloadIcon className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Course Dialog */}
      <Dialog open={showEditCourseDialog} onOpenChange={setShowEditCourseDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>
              Update course information and settings.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-course-title">Course Title *</Label>
                <Input
                  id="edit-course-title"
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  placeholder="e.g. Advanced Risk Management"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-course-category">Category *</Label>
                <Select 
                  value={courseForm.category} 
                  onValueChange={(value: any) => setCourseForm({ ...courseForm, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Compliance & Risk">Compliance & Risk</SelectItem>
                    <SelectItem value="Banking Products">Banking Products</SelectItem>
                    <SelectItem value="Soft Skills">Soft Skills</SelectItem>
                    <SelectItem value="Information Security">Information Security</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Leadership">Leadership</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-course-level">Level *</Label>
                <Select 
                  value={courseForm.level} 
                  onValueChange={(value: any) => setCourseForm({ ...courseForm, level: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Foundation">Foundation</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    <SelectItem value="Mandatory">Mandatory</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-course-format">Format *</Label>
                <Select 
                  value={courseForm.format} 
                  onValueChange={(value: any) => setCourseForm({ ...courseForm, format: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Classroom">Classroom</SelectItem>
                    <SelectItem value="Blended">Blended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-course-duration">Duration *</Label>
                <Input
                  id="edit-course-duration"
                  value={courseForm.duration}
                  onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                  placeholder="e.g. 6 hours, 2 days"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-course-instructor">Instructor *</Label>
                <Input
                  id="edit-course-instructor"
                  value={courseForm.instructor}
                  onChange={(e) => setCourseForm({ ...courseForm, instructor: e.target.value })}
                  placeholder="Instructor name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-course-deadline">Deadline (Optional)</Label>
                <Input
                  id="edit-course-deadline"
                  type="date"
                  value={courseForm.deadline}
                  onChange={(e) => setCourseForm({ ...courseForm, deadline: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-course-description">Course Description *</Label>
              <Textarea
                id="edit-course-description"
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                placeholder="Detailed course description and learning objectives..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-course-modules">Course Modules *</Label>
              <Textarea
                id="edit-course-modules"
                value={courseForm.modules}
                onChange={(e) => setCourseForm({ ...courseForm, modules: e.target.value })}
                placeholder="Enter each module on a new line..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-course-resources">Course Resources</Label>
              <Textarea
                id="edit-course-resources"
                value={courseForm.resources}
                onChange={(e) => setCourseForm({ ...courseForm, resources: e.target.value })}
                placeholder="Enter course resources (one per line)..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-course-prerequisites">Prerequisites (Optional)</Label>
              <Input
                id="edit-course-prerequisites"
                value={courseForm.prerequisites}
                onChange={(e) => setCourseForm({ ...courseForm, prerequisites: e.target.value })}
                placeholder="Comma-separated prerequisites..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-has-certificate"
                    checked={courseForm.hasCertificate}
                    onChange={(e) => setCourseForm({ ...courseForm, hasCertificate: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="edit-has-certificate">Enable Certificate Generation</Label>
                </div>
                <p className="text-xs text-gray-500">
                  Certificates will be automatically generated upon successful completion
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-passing-score">Passing Score (%)</Label>
                <Input
                  id="edit-passing-score"
                  type="number"
                  min="0"
                  max="100"
                  value={courseForm.passingScore}
                  onChange={(e) => setCourseForm({ ...courseForm, passingScore: parseInt(e.target.value) || 80 })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditCourseDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleEditCourse}
              disabled={!courseForm.title || !courseForm.description || !courseForm.instructor || !courseForm.duration}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <EditIcon className="mr-2 h-4 w-4" />
              Update Course
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Course Confirmation Dialog */}
      <AlertDialog open={showDeleteCourseDialog} onOpenChange={setShowDeleteCourseDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{courseToDelete?.title}"? This action cannot be undone.
              <br /><br />
              <strong>This will also delete:</strong>
              <ul className="list-disc list-inside mt-2 text-sm">
                <li>All associated exams and questions</li>
                <li>Course materials and resources</li>
                <li>Historical enrollment data</li>
              </ul>
              <br />
              {courseToDelete && enrollments.filter(e => 
                e.courseId === courseToDelete.id && 
                (e.status === 'Enrolled' || e.status === 'In Progress')
              ).length > 0 && (
                <div className="bg-red-50 border border-red-200 p-3 rounded">
                  <strong className="text-red-800">Warning:</strong> This course has active enrollments. 
                  Deletion will be prevented to protect student progress.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCourse}
              className="bg-red-600 hover:bg-red-700"
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              Delete Course
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 