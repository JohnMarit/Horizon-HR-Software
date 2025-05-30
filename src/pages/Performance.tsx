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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { 
  TrendingUpIcon, 
  StarIcon, 
  TargetIcon, 
  SearchIcon, 
  FilterIcon,
  PlusIcon,
  CalendarIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ClockIcon,
  BarChartIcon,
  Users2Icon,
  AwardIcon,
  FileTextIcon,
  EditIcon,
  MoreVerticalIcon,
  TrashIcon,
  PlayIcon,
  UserIcon,
  TimerIcon,
  TrophyIcon
} from "lucide-react";

// Enhanced interfaces
interface PerformanceGoal {
  id: number;
  employeeId: string;
  employeeName: string;
  department: string;
  title: string;
  description: string;
  category: 'Sales Performance' | 'Professional Development' | 'Operational Excellence' | 'Customer Service' | 'Leadership' | 'Compliance';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  targetValue: number;
  currentValue: number;
  unit: string;
  startDate: string;
  deadline: string;
  status: 'Draft' | 'Active' | 'Completed' | 'Cancelled' | 'Overdue';
  progress: number;
  setBy: string;
  createdDate: string;
  keyActions: string[];
  milestones: { date: string; description: string; completed: boolean }[];
  notes?: string;
}

interface PerformanceEvaluation {
  id: number;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  evaluator: string;
  evaluatorId: string;
  period: string;
  type: 'Annual' | 'Mid-Year' | 'Quarterly' | 'Probationary';
  status: 'Draft' | 'In Progress' | 'Pending Review' | 'Completed' | 'Cancelled';
  startDate: string;
  dueDate: string;
  completedDate?: string;
  overallScore?: number;
  categories: {
    [key: string]: {
      score: number;
      weight: number;
      comments: string;
    };
  };
  achievements: string[];
  developmentAreas: string[];
  goals: number[];
  recommendations: string[];
  employeeComments?: string;
  managerComments?: string;
  nextSteps: string[];
}

interface Employee {
  id: string;
  name: string;
  department: string;
  position: string;
  manager: string;
  managerId: string;
}

export default function Performance() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("evaluations");
  const [showSetGoalDialog, setShowSetGoalDialog] = useState(false);
  const [showStartEvaluationDialog, setShowStartEvaluationDialog] = useState(false);
  const [showEvaluationFormDialog, setShowEvaluationFormDialog] = useState(false);
  const [showDeleteGoalDialog, setShowDeleteGoalDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<PerformanceGoal | null>(null);
  const [selectedEvaluation, setSelectedEvaluation] = useState<PerformanceEvaluation | null>(null);
  const [goalToDelete, setGoalToDelete] = useState<PerformanceGoal | null>(null);
  
  const { user, hasPermission, addAuditLog } = useAuth();

  // Employees list
  const employees: Employee[] = [
    { id: "HB001", name: "Sarah Akol", department: "Human Resources", position: "HR Manager", manager: "Mary Deng", managerId: "HB003" },
    { id: "HB002", name: "James Wani", department: "Human Resources", position: "HR Assistant", manager: "Sarah Akol", managerId: "HB001" },
    { id: "HB003", name: "Mary Deng", department: "Corporate Banking", position: "VP Corporate Banking", manager: "CEO", managerId: "CEO01" },
    { id: "HB004", name: "Peter Garang", department: "Finance & Accounting", position: "Senior Accountant", manager: "Mary Deng", managerId: "HB003" },
    { id: "HB005", name: "Grace Ajak", department: "Personal Banking", position: "Customer Relationship Manager", manager: "Mary Deng", managerId: "HB003" },
    { id: "HB006", name: "Michael Jok", department: "Trade Finance", position: "Trade Finance Officer", manager: "Peter Musa", managerId: "HB011" },
    { id: "HB007", name: "Rebecca Akuoc", department: "Risk Management", position: "Risk Analyst", manager: "Mary Deng", managerId: "HB003" },
    { id: "HB008", name: "David Majok", department: "Information Technology", position: "IT Support Specialist", manager: "Sarah Akol", managerId: "HB001" },
    { id: "HB009", name: "Anna Nyong", department: "Corporate Banking", position: "Senior Credit Analyst", manager: "Mary Deng", managerId: "HB003" },
    { id: "HB010", name: "John Kuol", department: "Personal Banking", position: "Personal Banking Officer", manager: "Grace Ajak", managerId: "HB005" }
  ];

  // Goal form state
  const [goalForm, setGoalForm] = useState({
    title: "",
    description: "",
    category: "Sales Performance" as const,
    priority: "Medium" as const,
    targetValue: 0,
    unit: "",
    deadline: "",
    keyActions: "",
    notes: ""
  });

  // Evaluation form state
  const [evaluationForm, setEvaluationForm] = useState({
    period: "",
    type: "Annual" as const,
    dueDate: "",
    categories: {
      "Technical Skills": { weight: 25, description: "Job-specific technical competencies" },
      "Communication": { weight: 20, description: "Verbal and written communication effectiveness" },
      "Teamwork": { weight: 20, description: "Collaboration and team contribution" },
      "Problem Solving": { weight: 15, description: "Analytical thinking and solution development" },
      "Leadership": { weight: 10, description: "Leadership potential and initiative" },
      "Customer Focus": { weight: 10, description: "Customer service orientation" }
    }
  });

  // Enhanced goals data
  const [goals, setGoals] = useState<PerformanceGoal[]>([
    {
      id: 1,
      employeeId: "HB005",
      employeeName: "Grace Ajak",
      department: "Personal Banking",
      title: "Increase Personal Banking Portfolio",
      description: "Grow personal banking client portfolio by 30% through targeted customer acquisition and retention strategies",
      category: "Sales Performance",
      priority: "High",
      targetValue: 30,
      currentValue: 25,
      unit: "% increase",
      startDate: "2025-01-01",
      deadline: "2025-12-31",
      status: "Active",
      progress: 83,
      setBy: "Mary Deng",
      createdDate: "2024-12-15",
      keyActions: [
        "Conduct customer outreach campaigns",
        "Develop new client relationships",
        "Cross-sell banking products",
        "Implement referral program"
      ],
      milestones: [
        { date: "2025-03-31", description: "Q1 Review - 7.5% increase", completed: true },
        { date: "2025-06-30", description: "Q2 Review - 15% increase", completed: true },
        { date: "2025-09-30", description: "Q3 Review - 22.5% increase", completed: false },
        { date: "2025-12-31", description: "Final Target - 30% increase", completed: false }
      ],
      notes: "Employee showing strong progress, exceeding Q2 targets"
    },
    {
      id: 2,
      employeeId: "HB006",
      employeeName: "Michael Jok",
      department: "Trade Finance",
      title: "Advanced Trade Finance Certification",
      description: "Complete ICC Advanced Trade Finance Certification program to enhance expertise",
      category: "Professional Development",
      priority: "Medium",
      targetValue: 1,
      currentValue: 0.7,
      unit: "certification",
      startDate: "2025-01-15",
      deadline: "2025-06-30",
      status: "Active",
      progress: 70,
      setBy: "Sarah Akol",
      createdDate: "2025-01-10",
      keyActions: [
        "Complete online modules",
        "Attend practical workshops",
        "Pass certification exam",
        "Submit practical project"
      ],
      milestones: [
        { date: "2025-02-28", description: "Complete Module 1-3", completed: true },
        { date: "2025-04-15", description: "Attend workshops", completed: true },
        { date: "2025-05-31", description: "Complete practical project", completed: false },
        { date: "2025-06-30", description: "Pass final examination", completed: false }
      ]
    },
    {
      id: 3,
      employeeId: "HB009",
      employeeName: "Anna Nyong",
      department: "Corporate Banking",
      title: "Reduce Credit Processing Time",
      description: "Improve credit application processing efficiency by implementing new workflow",
      category: "Operational Excellence",
      priority: "High",
      targetValue: 24,
      currentValue: 18,
      unit: "hours",
      startDate: "2025-01-01",
      deadline: "2025-03-31",
      status: "Active",
      progress: 75,
      setBy: "Mary Deng",
      createdDate: "2024-12-20",
      keyActions: [
        "Implement new tracking system",
        "Streamline approval process",
        "Train team on new procedures",
        "Monitor and optimize workflow"
      ],
      milestones: [
        { date: "2025-01-31", description: "Implement tracking system", completed: true },
        { date: "2025-02-28", description: "Train team members", completed: true },
        { date: "2025-03-31", description: "Achieve target processing time", completed: false }
      ]
    }
  ]);

  // Enhanced evaluations data
  const [evaluations, setEvaluations] = useState<PerformanceEvaluation[]>([
    {
      id: 1,
      employeeId: "HB005",
      employeeName: "Grace Ajak",
      department: "Personal Banking",
      position: "Customer Relationship Manager",
      evaluator: "Mary Deng",
      evaluatorId: "HB003",
      period: "2024 Annual Review",
      type: "Annual",
      status: "Completed",
      startDate: "2024-12-01",
      dueDate: "2024-12-31",
      completedDate: "2024-12-15",
      overallScore: 8.5,
      categories: {
        "Technical Skills": { score: 9.0, weight: 25, comments: "Excellent product knowledge and banking skills" },
        "Communication": { score: 8.5, weight: 20, comments: "Strong verbal and written communication" },
        "Teamwork": { score: 8.0, weight: 20, comments: "Good collaboration with team members" },
        "Problem Solving": { score: 8.5, weight: 15, comments: "Effective in resolving customer issues" },
        "Leadership": { score: 8.0, weight: 10, comments: "Shows leadership potential" },
        "Customer Focus": { score: 9.0, weight: 10, comments: "Exceptional customer service" }
      },
      achievements: [
        "Exceeded annual sales targets by 25%",
        "Maintained 98% customer satisfaction rating",
        "Completed advanced banking certification",
        "Mentored 2 junior staff members"
      ],
      developmentAreas: [
        "Digital banking product knowledge",
        "Leadership skills development",
        "Advanced financial planning"
      ],
      goals: [1],
      recommendations: [
        "Consider for team lead position",
        "Enroll in leadership development program",
        "Increase responsibility in complex transactions"
      ],
      managerComments: "Grace has shown exceptional performance this year and is ready for increased responsibilities.",
      nextSteps: [
        "Enroll in leadership training",
        "Shadow senior managers",
        "Take on additional team responsibilities"
      ]
    },
    {
      id: 2,
      employeeId: "HB006",
      employeeName: "Michael Jok",
      department: "Trade Finance",
      position: "Trade Finance Officer",
      evaluator: "Peter Musa",
      evaluatorId: "HB011",
      period: "2024 Annual Review",
      type: "Annual",
      status: "Completed",
      startDate: "2024-12-05",
      dueDate: "2024-12-31",
      completedDate: "2024-12-18",
      overallScore: 9.2,
      categories: {
        "Technical Skills": { score: 9.5, weight: 30, comments: "Outstanding trade finance expertise" },
        "Communication": { score: 9.0, weight: 15, comments: "Clear and professional communication" },
        "Teamwork": { score: 9.0, weight: 15, comments: "Excellent team collaboration" },
        "Problem Solving": { score: 9.5, weight: 20, comments: "Exceptional analytical skills" },
        "Leadership": { score: 8.5, weight: 10, comments: "Natural leadership abilities" },
        "Customer Focus": { score: 9.0, weight: 10, comments: "Strong client relationships" }
      },
      achievements: [
        "Processed $50M in trade finance transactions",
        "Zero compliance violations",
        "Mentored 3 junior staff members",
        "Improved processing efficiency by 20%"
      ],
      developmentAreas: [
        "Advanced trade finance instruments",
        "International banking regulations",
        "Digital trade platforms"
      ],
      goals: [2],
      recommendations: [
        "Promote to senior officer level",
        "Lead digital transformation project",
        "Represent bank at industry conferences"
      ],
      managerComments: "Michael is our top performer in trade finance and ready for senior responsibilities.",
      nextSteps: [
        "Complete advanced certification",
        "Lead junior team",
        "Implement new digital processes"
      ]
    },
    {
      id: 3,
      employeeId: "HB009",
      employeeName: "Anna Nyong",
      department: "Corporate Banking",
      position: "Senior Credit Analyst",
      evaluator: "Mary Deng",
      evaluatorId: "HB003",
      period: "2025 Mid-Year Review",
      type: "Mid-Year",
      status: "In Progress",
      startDate: "2025-01-15",
      dueDate: "2025-02-15",
      categories: {
        "Technical Skills": { score: 0, weight: 30, comments: "" },
        "Communication": { score: 0, weight: 15, comments: "" },
        "Teamwork": { score: 0, weight: 15, comments: "" },
        "Problem Solving": { score: 0, weight: 20, comments: "" },
        "Leadership": { score: 0, weight: 10, comments: "" },
        "Customer Focus": { score: 0, weight: 10, comments: "" }
      },
      achievements: [],
      developmentAreas: [],
      goals: [3],
      recommendations: [],
      nextSteps: []
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800";
      case "In Progress": return "bg-blue-100 text-blue-800";
      case "Overdue": return "bg-red-100 text-red-800";
      case "On Track": return "bg-green-100 text-green-800";
      case "Behind Schedule": return "bg-yellow-100 text-yellow-800";
      case "At Risk": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPerformanceRating = (score: number) => {
    if (score >= 9) return { label: "Exceptional", color: "text-green-600" };
    if (score >= 8) return { label: "Exceeds Expectations", color: "text-blue-600" };
    if (score >= 7) return { label: "Meets Expectations", color: "text-yellow-600" };
    if (score >= 6) return { label: "Below Expectations", color: "text-orange-600" };
    return { label: "Needs Improvement", color: "text-red-600" };
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

  // Goal management functions
  const resetGoalForm = () => {
    setGoalForm({
      title: "",
      description: "",
      category: "Sales Performance",
      priority: "Medium",
      targetValue: 0,
      unit: "",
      deadline: "",
      keyActions: "",
      notes: ""
    });
  };

  const resetEvaluationForm = () => {
    setEvaluationForm({
      period: "",
      type: "Annual",
      dueDate: "",
      categories: {
        "Technical Skills": { weight: 25, description: "Job-specific technical competencies" },
        "Communication": { weight: 20, description: "Verbal and written communication effectiveness" },
        "Teamwork": { weight: 20, description: "Collaboration and team contribution" },
        "Problem Solving": { weight: 15, description: "Analytical thinking and solution development" },
        "Leadership": { weight: 10, description: "Leadership potential and initiative" },
        "Customer Focus": { weight: 10, description: "Customer service orientation" }
      }
    });
  };

  const handleSetGoal = () => {
    if (!hasPermission('team.manage') && !hasPermission('*')) {
      addAuditLog('UNAUTHORIZED_ACCESS_ATTEMPT', 'PERFORMANCE', { action: 'set_goal' });
      return;
    }

    if (!selectedEmployee) return;

    const keyActions = goalForm.keyActions.split('\n').filter(action => action.trim());

    const newGoal: PerformanceGoal = {
      id: Math.max(...goals.map(g => g.id)) + 1,
      employeeId: selectedEmployee.id,
      employeeName: selectedEmployee.name,
      department: selectedEmployee.department,
      title: goalForm.title,
      description: goalForm.description,
      category: goalForm.category,
      priority: goalForm.priority,
      targetValue: goalForm.targetValue,
      currentValue: 0,
      unit: goalForm.unit,
      startDate: new Date().toISOString().split('T')[0],
      deadline: goalForm.deadline,
      status: 'Active',
      progress: 0,
      setBy: user?.email || 'System',
      createdDate: new Date().toISOString().split('T')[0],
      keyActions,
      milestones: [],
      notes: goalForm.notes
    };

    setGoals([...goals, newGoal]);
    setShowSetGoalDialog(false);
    resetGoalForm();
    setSelectedEmployee(null);

    addAuditLog('GOAL_SET', 'PERFORMANCE', {
      action: 'goal_set',
      goalId: newGoal.id,
      employeeId: selectedEmployee.id,
      setBy: user?.email
    });
  };

  const handleStartEvaluation = () => {
    if (!hasPermission('performance.evaluate') && !hasPermission('*')) {
      addAuditLog('UNAUTHORIZED_ACCESS_ATTEMPT', 'PERFORMANCE', { action: 'start_evaluation' });
      return;
    }

    if (!selectedEmployee) return;

    const newEvaluation: PerformanceEvaluation = {
      id: Math.max(...evaluations.map(e => e.id)) + 1,
      employeeId: selectedEmployee.id,
      employeeName: selectedEmployee.name,
      department: selectedEmployee.department,
      position: selectedEmployee.position,
      evaluator: user?.email || 'System',
      evaluatorId: user?.id || 'SYS001',
      period: evaluationForm.period,
      type: evaluationForm.type,
      status: 'In Progress',
      startDate: new Date().toISOString().split('T')[0],
      dueDate: evaluationForm.dueDate,
      categories: Object.entries(evaluationForm.categories).reduce((acc, [key, value]) => {
        acc[key] = { score: 0, weight: value.weight, comments: "" };
        return acc;
      }, {} as any),
      achievements: [],
      developmentAreas: [],
      goals: goals.filter(g => g.employeeId === selectedEmployee.id).map(g => g.id),
      recommendations: [],
      nextSteps: []
    };

    setEvaluations([...evaluations, newEvaluation]);
    setShowStartEvaluationDialog(false);
    resetEvaluationForm();
    setSelectedEmployee(null);

    addAuditLog('EVALUATION_STARTED', 'PERFORMANCE', {
      action: 'evaluation_started',
      evaluationId: newEvaluation.id,
      employeeId: selectedEmployee.id,
      evaluator: user?.email
    });
  };

  const handleDeleteGoal = () => {
    if (!hasPermission('team.manage') && !hasPermission('*')) {
      addAuditLog('UNAUTHORIZED_ACCESS_ATTEMPT', 'PERFORMANCE', { action: 'delete_goal' });
      return;
    }

    if (!goalToDelete) return;

    const updatedGoals = goals.filter(goal => goal.id !== goalToDelete.id);
    setGoals(updatedGoals);
    setShowDeleteGoalDialog(false);
    setGoalToDelete(null);

    addAuditLog('GOAL_DELETED', 'PERFORMANCE', {
      action: 'goal_deleted',
      goalId: goalToDelete.id,
      employeeId: goalToDelete.employeeId,
      deletedBy: user?.email
    });
  };

  const openSetGoalDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowSetGoalDialog(true);
  };

  const openStartEvaluationDialog = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowStartEvaluationDialog(true);
  };

  const openDeleteGoalDialog = (goal: PerformanceGoal) => {
    setGoalToDelete(goal);
    setShowDeleteGoalDialog(true);
  };

  const filteredEvaluations = evaluations.filter(evaluation =>
    evaluation.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    evaluation.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGoals = goals.filter(goal =>
    goal.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    goal.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance Management</h1>
          <p className="text-gray-600">Track employee performance and development at Horizon Bank</p>
        </div>
        <div className="flex gap-2">
          {hasPermission('performance.evaluate') && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
              <StarIcon className="mr-2 h-4 w-4" />
              Start Evaluation
            </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {employees.map((employee) => (
                  <DropdownMenuItem 
                    key={employee.id}
                    onClick={() => openStartEvaluationDialog(employee)}
                  >
                    <UserIcon className="mr-2 h-4 w-4" />
                    {employee.name} - {employee.department}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {hasPermission('team.manage') && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
              <TargetIcon className="mr-2 h-4 w-4" />
              Set Goals
            </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {employees.map((employee) => (
                  <DropdownMenuItem 
                    key={employee.id}
                    onClick={() => openSetGoalDialog(employee)}
                  >
                    <UserIcon className="mr-2 h-4 w-4" />
                    {employee.name} - {employee.department}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Performance</p>
                <p className="text-3xl font-bold text-gray-900">8.5</p>
                <p className="text-xs text-gray-500">Team average score</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <TrendingUpIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Reviews</p>
                <p className="text-3xl font-bold text-gray-900">
                  {evaluations.filter(e => e.status === 'Completed').length}
                </p>
                <p className="text-xs text-gray-500">This cycle</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <CheckCircleIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Goals</p>
                <p className="text-3xl font-bold text-gray-900">{goals.length}</p>
                <p className="text-xs text-gray-500">In progress</p>
              </div>
              <div className="p-3 rounded-full bg-amber-100">
                <TargetIcon className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Goal Achievement</p>
                <p className="text-3xl font-bold text-gray-900">76%</p>
                <p className="text-xs text-gray-500">Average progress</p>
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="evaluations">Performance Evaluations</TabsTrigger>
          <TabsTrigger value="goals">Goals & Development</TabsTrigger>
        </TabsList>

        <TabsContent value="evaluations" className="space-y-6">
          {/* Search and Filters */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
                  <Input
                    placeholder="Search evaluations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <FilterIcon className="mr-2 h-4 w-4" />
                    Filter by Period
                  </Button>
                  <Button variant="outline">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Review Cycle
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Evaluations List */}
          <div className="grid gap-6">
            {filteredEvaluations.map((evaluation) => (
              <Card key={evaluation.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {evaluation.employeeName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{evaluation.employeeName}</h3>
                          <p className="text-sm text-gray-600">{evaluation.position} • {evaluation.department}</p>
                          <p className="text-xs text-gray-500">Evaluator: {evaluation.evaluator}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <StarIcon className="h-4 w-4 text-yellow-500" />
                            <span className="font-bold text-lg">{evaluation.overallScore}</span>
                            <span className={`text-sm font-medium ${getPerformanceRating(evaluation.overallScore).color}`}>
                              {getPerformanceRating(evaluation.overallScore).label}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(evaluation.status)}>
                        {evaluation.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Performance Categories */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    {Object.entries(evaluation.categories).map(([category, data]) => (
                      <div key={category} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize text-gray-600">
                            {category.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className="font-medium">{data.score || 'N/A'}</span>
                        </div>
                        <Progress value={(data.score || 0) * 10} className="h-1" />
                      </div>
                    ))}
                  </div>

                  {/* Achievements and Development */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <AwardIcon className="h-4 w-4 text-green-600" />
                        Key Achievements
                      </h4>
                      <ul className="space-y-1">
                        {evaluation.achievements.map((achievement, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <CheckCircleIcon className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <TrendingUpIcon className="h-4 w-4 text-blue-600" />
                        Development Areas
                      </h4>
                      <ul className="space-y-1">
                        {evaluation.developmentAreas.map((area, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <AlertCircleIcon className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                            {area}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex gap-4">
                      <span>Period: {evaluation.period}</span>
                      {evaluation.completedDate && (
                        <span>Completed: {evaluation.completedDate}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <FileTextIcon className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      {hasPermission('performance.evaluate') && evaluation.status === 'In Progress' && (
                        <Button variant="outline" size="sm">
                          <EditIcon className="h-4 w-4 mr-1" />
                          Continue
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          {/* Search and Filters */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
                  <Input
                    placeholder="Search goals..."
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
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Goals Cards */}
          <div className="grid gap-6">
                  {filteredGoals.map((goal) => (
              <Card key={goal.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-blue-100 text-blue-700">
                          {goal.employeeName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                      <div className="space-y-2">
                          <div>
                          <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
                          <p className="text-sm text-gray-600">{goal.employeeName} • {goal.department}</p>
                          <p className="text-xs text-gray-500">Set by: {goal.setBy}</p>
                          </div>
                        <p className="text-sm text-gray-700">{goal.description}</p>
                        </div>
                        </div>
                    <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(goal.status)}>
                          {goal.status}
                        </Badge>
                      <Badge className={getPriorityColor(goal.priority)}>
                        {goal.priority}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{goal.progress}%</p>
                      <p className="text-xs text-gray-500">Progress</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{goal.currentValue}</p>
                      <p className="text-xs text-gray-500">Current</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">{goal.targetValue}</p>
                      <p className="text-xs text-gray-500">Target</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-amber-600">{goal.unit}</p>
                      <p className="text-xs text-gray-500">Unit</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress towards goal</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <Progress value={goal.progress} className="h-3" />
                  </div>

                  {goal.keyActions && goal.keyActions.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <CheckCircleIcon className="h-4 w-4 text-blue-600" />
                        Key Actions
                      </h4>
                      <ul className="space-y-1">
                        {goal.keyActions.slice(0, 3).map((action, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <ClockIcon className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                            {action}
                          </li>
                        ))}
                        {goal.keyActions.length > 3 && (
                          <li className="text-xs text-gray-400">
                            +{goal.keyActions.length - 3} more actions
                          </li>
                        )}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex gap-4">
                      <span>Deadline: {goal.deadline}</span>
                      <span>Category: {goal.category}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <FileTextIcon className="h-4 w-4 mr-1" />
                        Details
                          </Button>
                          {hasPermission('team.manage') && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVerticalIcon className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <EditIcon className="mr-2 h-4 w-4" />
                              Edit Goal
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => openDeleteGoalDialog(goal)}
                            >
                              <TrashIcon className="mr-2 h-4 w-4" />
                              Delete Goal
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                          )}
                        </div>
                  </div>
            </CardContent>
          </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Set Goal Dialog */}
      <Dialog open={showSetGoalDialog} onOpenChange={setShowSetGoalDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Set Performance Goal</DialogTitle>
            <DialogDescription>
              Set a new performance goal for {selectedEmployee?.name} ({selectedEmployee?.department})
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="goal-title">Goal Title *</Label>
              <Input
                id="goal-title"
                value={goalForm.title}
                onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                placeholder="e.g. Increase sales performance by 25%"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal-description">Description *</Label>
              <Textarea
                id="goal-description"
                value={goalForm.description}
                onChange={(e) => setGoalForm({ ...goalForm, description: e.target.value })}
                placeholder="Detailed description of the goal and expected outcomes..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="goal-category">Category *</Label>
                <Select 
                  value={goalForm.category} 
                  onValueChange={(value: any) => setGoalForm({ ...goalForm, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sales Performance">Sales Performance</SelectItem>
                    <SelectItem value="Professional Development">Professional Development</SelectItem>
                    <SelectItem value="Operational Excellence">Operational Excellence</SelectItem>
                    <SelectItem value="Customer Service">Customer Service</SelectItem>
                    <SelectItem value="Leadership">Leadership</SelectItem>
                    <SelectItem value="Compliance">Compliance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal-priority">Priority *</Label>
                <Select 
                  value={goalForm.priority} 
                  onValueChange={(value: any) => setGoalForm({ ...goalForm, priority: value })}
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
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="goal-target">Target Value *</Label>
                <Input
                  id="goal-target"
                  type="number"
                  value={goalForm.targetValue}
                  onChange={(e) => setGoalForm({ ...goalForm, targetValue: parseFloat(e.target.value) || 0 })}
                  placeholder="25"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal-unit">Unit *</Label>
                <Input
                  id="goal-unit"
                  value={goalForm.unit}
                  onChange={(e) => setGoalForm({ ...goalForm, unit: e.target.value })}
                  placeholder="% increase"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="goal-deadline">Deadline *</Label>
                <Input
                  id="goal-deadline"
                  type="date"
                  value={goalForm.deadline}
                  onChange={(e) => setGoalForm({ ...goalForm, deadline: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal-actions">Key Actions</Label>
              <Textarea
                id="goal-actions"
                value={goalForm.keyActions}
                onChange={(e) => setGoalForm({ ...goalForm, keyActions: e.target.value })}
                placeholder="Enter each action on a new line..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal-notes">Additional Notes</Label>
              <Textarea
                id="goal-notes"
                value={goalForm.notes}
                onChange={(e) => setGoalForm({ ...goalForm, notes: e.target.value })}
                placeholder="Any additional context or notes..."
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSetGoalDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSetGoal}
              disabled={!goalForm.title || !goalForm.description || !goalForm.targetValue || !goalForm.unit || !goalForm.deadline}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <TargetIcon className="mr-2 h-4 w-4" />
              Set Goal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Start Evaluation Dialog */}
      <Dialog open={showStartEvaluationDialog} onOpenChange={setShowStartEvaluationDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Start Performance Evaluation</DialogTitle>
            <DialogDescription>
              Start a new performance evaluation for {selectedEmployee?.name} ({selectedEmployee?.department})
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="eval-period">Evaluation Period *</Label>
              <Input
                id="eval-period"
                value={evaluationForm.period}
                onChange={(e) => setEvaluationForm({ ...evaluationForm, period: e.target.value })}
                placeholder="e.g. 2025 Annual Review, Q1 2025"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eval-type">Evaluation Type *</Label>
                <Select 
                  value={evaluationForm.type} 
                  onValueChange={(value: any) => setEvaluationForm({ ...evaluationForm, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Annual">Annual Review</SelectItem>
                    <SelectItem value="Mid-Year">Mid-Year Review</SelectItem>
                    <SelectItem value="Quarterly">Quarterly Review</SelectItem>
                    <SelectItem value="Probationary">Probationary Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="eval-due">Due Date *</Label>
                <Input
                  id="eval-due"
                  type="date"
                  value={evaluationForm.dueDate}
                  onChange={(e) => setEvaluationForm({ ...evaluationForm, dueDate: e.target.value })}
                />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-3">Evaluation Categories</h3>
              <div className="space-y-2 text-sm">
                {Object.entries(evaluationForm.categories).map(([category, data]) => (
                  <div key={category} className="flex justify-between">
                    <span>{category}</span>
                    <span className="text-gray-500">{data.weight}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStartEvaluationDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleStartEvaluation}
              disabled={!evaluationForm.period || !evaluationForm.dueDate}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <PlayIcon className="mr-2 h-4 w-4" />
              Start Evaluation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Goal Confirmation Dialog */}
      <AlertDialog open={showDeleteGoalDialog} onOpenChange={setShowDeleteGoalDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Goal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the goal "{goalToDelete?.title}" for {goalToDelete?.employeeName}? 
              This action cannot be undone and will remove all progress tracking and milestone data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteGoal}
              className="bg-red-600 hover:bg-red-700"
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              Delete Goal
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 