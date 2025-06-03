import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AvatarUpload } from "@/components/ui/avatar-upload";
import { useAuth } from "@/contexts/AuthContext";
import { 
  CalendarIcon,
  MapPinIcon,
  BookOpenIcon,
  TrendingUpIcon,
  AwardIcon,
  UserIcon,
  ShieldIcon,
  DownloadIcon,
  PlayIcon,
  CheckCircleIcon,
  ClockIcon,
  TargetIcon,
  StarIcon,
  KeyIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  UsersIcon
} from "lucide-react";

// Enhanced interfaces for profile data
interface EmployeeProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  employeeId: string;
  manager: string;
  joinDate: string;
  birthDate: string;
  address: string;
  emergencyContact: string;
  nationalId: string;
  education: string;
  bankingRole: string;
  location: string;
  status: string;
  avatar?: string;
}

interface Course {
  id: string;
  title: string;
  category: string;
  progress: number;
  status: 'not-started' | 'in-progress' | 'completed';
  totalLessons: number;
  completedLessons: number;
  points: number;
  deadline?: string;
  certificateAvailable: boolean;
}

interface Certificate {
  id: string;
  name: string;
  issueDate: string;
  expiryDate?: string;
  status: 'active' | 'expired';
  category: string;
  downloadUrl: string;
}

interface PerformanceMetric {
  category: string;
  score: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
}

interface TeamMember {
  id: string;
  name: string;
  position: string;
  department: string;
  avatar?: string;
  courses: Course[];
  totalPoints: number;
  completedCourses: number;
}

export default function Profile() {
  const { user, hasPermission, updateAvatar } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Early return with loading state if user is not available
  if (!user) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600">Loading your profile information...</p>
          </div>
        </div>
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // System Administrators should not have profile access
  if (user.role === 'System Administrator') {
    return (
      <div className="space-y-6">
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldIcon className="h-8 w-8 text-amber-600" />
            </div>
            <h2 className="text-xl font-bold text-amber-800 mb-2">Profile Access Restricted</h2>
            <p className="text-amber-700 mb-4">
              System Administrators do not have personal profiles. Your role is focused on system administration and user management.
            </p>
            <p className="text-sm text-amber-600">
              To manage user accounts, please visit the Admin Panel.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get current employee profile based on logged-in user
  const getCurrentEmployeeProfile = (): EmployeeProfile => {
    const userEmail = user?.email?.toLowerCase() || '';
    
    // Check for known users
    if (userEmail.includes('sarah') || userEmail.includes('hr') || userEmail.includes('admin')) {
      return {
        id: "HB001",
        name: "Sarah Akol",
        email: "admin@horizonbankss.com",
        phone: "+211 123 456 789",
        department: "Human Resources",
        position: "HR Manager",
        employeeId: "HB001",
        manager: "CEO",
        joinDate: "2021-03-15",
        birthDate: "1985-05-20",
        address: "Block 15, Juba City, South Sudan",
        emergencyContact: "+211 987 654 321",
        nationalId: "SS123456789",
        education: "MBA Human Resources",
        bankingRole: "Management",
        location: "Juba, South Sudan",
        status: "Active",
        avatar: "/placeholder-avatar.png"
      };
    }
    
    if (userEmail.includes('james') || userEmail.includes('recruiter')) {
      return {
        id: "HB002",
        name: "James Wani",
        email: "recruiter@horizonbankss.com",
        phone: "+211 987 654 321",
        department: "Human Resources",
        position: "Senior Recruiter",
        employeeId: "HB002",
        manager: "Sarah Akol",
        joinDate: "2022-01-20",
        birthDate: "1988-08-12",
        address: "Block 12, Juba City, South Sudan",
        emergencyContact: "+211 456 789 123",
        nationalId: "SS987654321",
        education: "Bachelor's Psychology",
        bankingRole: "Support",
        location: "Juba, South Sudan",
        status: "Active",
        avatar: "/placeholder-avatar.png"
      };
    }

    if (userEmail.includes('grace') || userEmail.includes('employee')) {
      return {
        id: "HB003",
        name: "Grace Ajak",
        email: "employee@horizonbankss.com",
        phone: "+211 555 123 456",
        department: "Personal Banking",
        position: "Customer Service Officer",
        employeeId: "HB003",
        manager: "Mary Deng",
        joinDate: "2023-03-10",
        birthDate: "1992-11-15",
        address: "Block 8, Juba City, South Sudan",
        emergencyContact: "+211 555 987 654",
        nationalId: "SS456789123",
        education: "Bachelor's Business Administration",
        bankingRole: "Operations",
        location: "Juba, South Sudan",
        status: "Active",
        avatar: "/placeholder-avatar.png"
      };
    }

    // Default profile for other users
    const userName = user?.name || user?.email?.split('@')[0] || 'Employee';
    return {
      id: user?.id || "EMP001",
      name: userName,
      email: user?.email || "employee@horizonbankss.com",
      phone: "+211 XXX XXX XXX",
      department: user?.department || "Banking Operations",
      position: "Bank Officer",
      employeeId: user?.id || "EMP001",
      manager: "Department Head",
      joinDate: "2024-01-01",
      birthDate: "1990-01-01",
      address: "Juba City, South Sudan",
      emergencyContact: "+211 XXX XXX XXX",
      nationalId: "SS" + Math.floor(Math.random() * 1000000000).toString(),
      education: "Bachelor's Degree",
      bankingRole: "Operations",
      location: "Juba, South Sudan",
      status: "Active"
    };
  };

  const employeeProfile = getCurrentEmployeeProfile();

  // Sample data for courses
  const courses: Course[] = [
    {
      id: "1",
      title: "Banking Fundamentals for South Sudan",
      category: "Core Banking",
      progress: 85,
      status: "in-progress",
      totalLessons: 12,
      completedLessons: 10,
      points: 150,
      deadline: "2025-02-15",
      certificateAvailable: false
    },
    {
      id: "2",
      title: "Customer Service Excellence",
      category: "Soft Skills",
      progress: 100,
      status: "completed",
      totalLessons: 8,
      completedLessons: 8,
      points: 120,
      certificateAvailable: true
    },
    {
      id: "3",
      title: "Digital Banking Technologies",
      category: "Technology",
      progress: 0,
      status: "not-started",
      totalLessons: 15,
      completedLessons: 0,
      points: 200,
      deadline: "2025-03-30",
      certificateAvailable: false
    },
    {
      id: "4",
      title: "Risk Management in Banking",
      category: "Risk & Compliance",
      progress: 45,
      status: "in-progress",
      totalLessons: 10,
      completedLessons: 4,
      points: 180,
      deadline: "2025-02-28",
      certificateAvailable: false
    }
  ];

  // Sample certificates
  const certificates: Certificate[] = [
    {
      id: "1",
      name: "Customer Service Excellence Certificate",
      issueDate: "2024-12-15",
      status: "active",
      category: "Professional Development",
      downloadUrl: "#"
    },
    {
      id: "2",
      name: "Banking Operations Certification",
      issueDate: "2024-10-20",
      expiryDate: "2026-10-20",
      status: "active",
      category: "Core Banking",
      downloadUrl: "#"
    }
  ];

  // Sample performance metrics
  const performanceMetrics: PerformanceMetric[] = [
    { category: "Customer Satisfaction", score: 92, target: 90, trend: "up" },
    { category: "Task Completion Rate", score: 88, target: 85, trend: "up" },
    { category: "Quality Score", score: 85, target: 90, trend: "stable" },
    { category: "Training Completion", score: 95, target: 80, trend: "up" }
  ];

  // Sample team members data - fellow employees' course progress
  const teamMembers: TeamMember[] = [
    {
      id: "tm1",
      name: "John Makuei",
      position: "Loan Officer",
      department: "Personal Banking",
      avatar: "/placeholder-avatar.png",
      totalPoints: 420,
      completedCourses: 3,
      courses: [
        {
          id: "tm1-1",
          title: "Banking Fundamentals for South Sudan",
          category: "Core Banking",
          progress: 100,
          status: "completed",
          totalLessons: 12,
          completedLessons: 12,
          points: 150,
          certificateAvailable: true
        },
        {
          id: "tm1-2",
          title: "Customer Service Excellence",
          category: "Soft Skills",
          progress: 100,
          status: "completed",
          totalLessons: 8,
          completedLessons: 8,
          points: 120,
          certificateAvailable: true
        },
        {
          id: "tm1-3",
          title: "Digital Banking Technologies",
          category: "Technology",
          progress: 75,
          status: "in-progress",
          totalLessons: 15,
          completedLessons: 11,
          points: 200,
          deadline: "2025-03-30",
          certificateAvailable: false
        }
      ]
    },
    {
      id: "tm2",
      name: "Mary Akech",
      position: "Customer Relations Officer",
      department: "Personal Banking",
      avatar: "/placeholder-avatar.png",
      totalPoints: 270,
      completedCourses: 2,
      courses: [
        {
          id: "tm2-1",
          title: "Customer Service Excellence",
          category: "Soft Skills",
          progress: 100,
          status: "completed",
          totalLessons: 8,
          completedLessons: 8,
          points: 120,
          certificateAvailable: true
        },
        {
          id: "tm2-2",
          title: "Risk Management in Banking",
          category: "Risk & Compliance",
          progress: 60,
          status: "in-progress",
          totalLessons: 10,
          completedLessons: 6,
          points: 180,
          deadline: "2025-02-28",
          certificateAvailable: false
        },
        {
          id: "tm2-3",
          title: "Digital Banking Technologies",
          category: "Technology",
          progress: 0,
          status: "not-started",
          totalLessons: 15,
          completedLessons: 0,
          points: 200,
          deadline: "2025-03-30",
          certificateAvailable: false
        }
      ]
    },
    {
      id: "tm3",
      name: "Peter Dau",
      position: "Teller",
      department: "Personal Banking",
      avatar: "/placeholder-avatar.png",
      totalPoints: 590,
      completedCourses: 4,
      courses: [
        {
          id: "tm3-1",
          title: "Banking Fundamentals for South Sudan",
          category: "Core Banking",
          progress: 100,
          status: "completed",
          totalLessons: 12,
          completedLessons: 12,
          points: 150,
          certificateAvailable: true
        },
        {
          id: "tm3-2",
          title: "Customer Service Excellence",
          category: "Soft Skills",
          progress: 100,
          status: "completed",
          totalLessons: 8,
          completedLessons: 8,
          points: 120,
          certificateAvailable: true
        },
        {
          id: "tm3-3",
          title: "Digital Banking Technologies",
          category: "Technology",
          progress: 100,
          status: "completed",
          totalLessons: 15,
          completedLessons: 15,
          points: 200,
          certificateAvailable: true
        },
        {
          id: "tm3-4",
          title: "Risk Management in Banking",
          category: "Risk & Compliance",
          progress: 100,
          status: "completed",
          totalLessons: 10,
          completedLessons: 10,
          points: 180,
          certificateAvailable: true
        }
      ]
    }
  ];

  // Calculate years of service
  const calculateYearsOfService = (joinDate: string) => {
    const join = new Date(joinDate);
    const now = new Date();
    const years = now.getFullYear() - join.getFullYear();
    const months = now.getMonth() - join.getMonth();
    
    if (months < 0 || (months === 0 && now.getDate() < join.getDate())) {
      return Math.max(0, years - 1);
    }
    return years;
  };

  // Handle course actions
  const handleCourseAction = (courseId: string, action: 'resume' | 'start' | 'complete') => {
    // In a real app, this would call an API
    alert(`${action === 'resume' ? 'Resuming' : action === 'start' ? 'Starting' : 'Completing'} course...`);
  };

  // Handle certificate download
  const handleCertificateDownload = (certificate: Certificate) => {
    // In a real app, this would trigger a file download
    alert(`Downloading certificate: ${certificate.name}`);
  };

  // Handle password change
  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }
    // In a real app, this would call an API
    alert("Password changed successfully!");
    setShowPasswordDialog(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600">Manage your learning, view performance, and access your information</p>
        </div>
      </div>

      {/* Profile Header Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <AvatarUpload
              currentAvatar={employeeProfile.avatar}
              userId={user.id}
              userName={employeeProfile.name}
              onAvatarUpdate={updateAvatar}
            />
            
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{employeeProfile.name}</h2>
                <p className="text-lg text-gray-600">{employeeProfile.position}</p>
                <p className="text-sm text-gray-500">{employeeProfile.department} • Employee ID: {employeeProfile.employeeId}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{calculateYearsOfService(employeeProfile.joinDate)} years of service</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPinIcon className="h-4 w-4" />
                  <span>{employeeProfile.location}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Badge className="bg-green-100 text-green-800">{employeeProfile.status}</Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-blue-600">
                  {courses.filter(c => c.status === 'completed').length * 150}
                </div>
                <div className="text-xs text-gray-500">Learning Points</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(performanceMetrics.reduce((acc, metric) => acc + metric.score, 0) / performanceMetrics.length)}%
                </div>
                <div className="text-xs text-gray-500">Avg Performance</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="relative">
          <TabsList className="inline-flex h-12 items-center justify-start gap-1 rounded-md bg-muted p-1 text-muted-foreground w-full overflow-x-auto scrollbar-hide">
            <TabsTrigger value="overview" className="flex items-center gap-2 min-w-fit px-3 py-2 text-sm whitespace-nowrap">
              <TargetIcon className="h-4 w-4 flex-shrink-0" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="learning" className="flex items-center gap-2 min-w-fit px-3 py-2 text-sm whitespace-nowrap">
              <BookOpenIcon className="h-4 w-4 flex-shrink-0" />
              <span className="hidden sm:inline">My Learning</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2 min-w-fit px-3 py-2 text-sm whitespace-nowrap">
              <UsersIcon className="h-4 w-4 flex-shrink-0" />
              <span className="hidden sm:inline">Team Learning</span>
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2 min-w-fit px-3 py-2 text-sm whitespace-nowrap">
              <TrendingUpIcon className="h-4 w-4 flex-shrink-0" />
              <span className="hidden sm:inline">Performance</span>
            </TabsTrigger>
            <TabsTrigger value="certificates" className="flex items-center gap-2 min-w-fit px-3 py-2 text-sm whitespace-nowrap">
              <AwardIcon className="h-4 w-4 flex-shrink-0" />
              <span className="hidden sm:inline">Certificates</span>
            </TabsTrigger>
            <TabsTrigger value="personal" className="flex items-center gap-2 min-w-fit px-3 py-2 text-sm whitespace-nowrap">
              <UserIcon className="h-4 w-4 flex-shrink-0" />
              <span className="hidden sm:inline">Personal Info</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2 min-w-fit px-3 py-2 text-sm whitespace-nowrap">
              <ShieldIcon className="h-4 w-4 flex-shrink-0" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
          </TabsList>
          
          {/* Mobile: Add swipe indicator */}
          <div className="flex sm:hidden justify-center mt-2">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <span>Swipe</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Courses</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {courses.filter(c => c.status === 'in-progress').length}
                    </p>
                  </div>
                  <BookOpenIcon className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed Courses</p>
                    <p className="text-3xl font-bold text-green-600">
                      {courses.filter(c => c.status === 'completed').length}
                    </p>
                  </div>
                  <CheckCircleIcon className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Certificates Earned</p>
                    <p className="text-3xl font-bold text-purple-600">{certificates.length}</p>
                  </div>
                  <AwardIcon className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Upcoming Deadlines</p>
                    <p className="text-3xl font-bold text-orange-600">
                      {courses.filter(c => c.deadline && new Date(c.deadline) > new Date()).length}
                    </p>
                  </div>
                  <ClockIcon className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Team Members</p>
                    <p className="text-3xl font-bold text-purple-600">{teamMembers.length}</p>
                  </div>
                  <UsersIcon className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Team Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Team Learning Overview</CardTitle>
              <CardDescription>Your department's learning progress at a glance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {teamMembers.reduce((acc, member) => acc + member.completedCourses, 0)}
                  </div>
                  <div className="text-sm text-green-700">Total Completed Courses</div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {teamMembers.reduce((acc, member) => acc + member.totalPoints, 0)}
                  </div>
                  <div className="text-sm text-blue-700">Total Team Points</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(teamMembers.reduce((acc, member) => acc + member.totalPoints, 0) / teamMembers.length)}
                  </div>
                  <div className="text-sm text-purple-700">Average Points</div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <Button variant="outline" onClick={() => setActiveTab('team')}>
                  <UsersIcon className="h-4 w-4 mr-2" />
                  View Team Learning Progress
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>My Recent Activity</CardTitle>
              <CardDescription>Your personal learning progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-medium">Completed "Customer Service Excellence" course</p>
                    <p className="text-sm text-gray-600">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                  <PlayIcon className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="font-medium">Resumed "Banking Fundamentals for South Sudan"</p>
                    <p className="text-sm text-gray-600">1 week ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Learning Tab */}
        <TabsContent value="learning" className="space-y-6">
          <div className="grid gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{course.title}</h3>
                        <Badge variant="outline">{course.category}</Badge>
                        {course.status === 'completed' && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircleIcon className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>{course.completedLessons}/{course.totalLessons} lessons completed</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>⭐ {course.points} points</span>
                          {course.deadline && (
                            <span>📅 Due: {new Date(course.deadline).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {course.status === 'not-started' && (
                        <Button onClick={() => handleCourseAction(course.id, 'start')}>
                          <PlayIcon className="h-4 w-4 mr-2" />
                          Start Course
                        </Button>
                      )}
                      {course.status === 'in-progress' && (
                        <>
                          <Button onClick={() => handleCourseAction(course.id, 'resume')}>
                            <PlayIcon className="h-4 w-4 mr-2" />
                            Resume
                          </Button>
                          {course.progress >= 80 && (
                            <Button 
                              variant="outline" 
                              onClick={() => handleCourseAction(course.id, 'complete')}
                            >
                              <CheckCircleIcon className="h-4 w-4 mr-2" />
                              Complete
                            </Button>
                          )}
                        </>
                      )}
                      {course.status === 'completed' && course.certificateAvailable && (
                        <Button variant="outline">
                          <DownloadIcon className="h-4 w-4 mr-2" />
                          Certificate
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Team Learning Tab */}
        <TabsContent value="team" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Learning Progress</CardTitle>
              <CardDescription>See what courses your colleagues are taking and their progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {teamMembers.map((member) => (
                  <Card key={member.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="bg-green-100 text-green-700">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold">{member.name}</h3>
                          <p className="text-sm text-gray-600">{member.position} • {member.department}</p>
                          
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-2">
                              <div className="text-sm font-medium text-blue-600">{member.totalPoints} points</div>
                              <Badge variant="outline">{member.completedCourses} completed</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-medium text-gray-900">Current Courses</h4>
                        {member.courses.map((course) => (
                          <div key={course.id} className="border rounded-lg p-4 bg-gray-50">
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="font-medium">{course.title}</h5>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{course.category}</Badge>
                                {course.status === 'completed' && (
                                  <Badge className="bg-green-100 text-green-800">
                                    <CheckCircleIcon className="h-3 w-3 mr-1" />
                                    Completed
                                  </Badge>
                                )}
                                {course.status === 'in-progress' && (
                                  <Badge className="bg-blue-100 text-blue-800">
                                    In Progress
                                  </Badge>
                                )}
                                {course.status === 'not-started' && (
                                  <Badge className="bg-gray-100 text-gray-800">
                                    Not Started
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm text-gray-600">
                                <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                                <span>{course.progress}%</span>
                              </div>
                              <Progress value={course.progress} className="h-2" />
                              <div className="flex items-center justify-between text-sm text-gray-600">
                                <span>⭐ {course.points} points</span>
                                {course.deadline && course.status !== 'completed' && (
                                  <span>📅 Due: {new Date(course.deadline).toLocaleDateString()}</span>
                                )}
                                {course.status === 'completed' && course.certificateAvailable && (
                                  <span>🏆 Certificate Available</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Team Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Leaderboard</CardTitle>
              <CardDescription>Top performers in your department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamMembers
                  .sort((a, b) => b.totalPoints - a.totalPoints)
                  .map((member, index) => (
                    <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{member.name}</h4>
                          <p className="text-sm text-gray-600">{member.position}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">{member.totalPoints}</div>
                        <div className="text-sm text-gray-600">points</div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          {hasPermission('performance.view') ? (
            <>
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <ShieldIcon className="h-5 w-5 text-blue-600" />
                    <p className="text-sm text-blue-800">
                      <strong>Privacy Notice:</strong> Performance data is private. You can only view your own performance metrics. 
                      To see colleagues' learning progress, visit the "Team Learning" tab.
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid gap-6 md:grid-cols-2">
                {performanceMetrics.map((metric, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">{metric.category}</h3>
                        <div className="flex items-center gap-1">
                          {metric.trend === 'up' && <TrendingUpIcon className="h-4 w-4 text-green-600" />}
                          {metric.trend === 'down' && <TrendingUpIcon className="h-4 w-4 text-red-600 rotate-180" />}
                          {metric.trend === 'stable' && <div className="h-4 w-4 bg-gray-400 rounded-full" />}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Current: {metric.score}%</span>
                          <span>Target: {metric.target}%</span>
                        </div>
                        <Progress value={metric.score} className="h-3" />
                        <div className="text-xs text-gray-600">
                          {metric.score >= metric.target ? 
                            "🎯 Target achieved!" : 
                            `${metric.target - metric.score}% to target`
                          }
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Performance Summary</CardTitle>
                  <CardDescription>Your overall performance metrics and trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {Math.round(performanceMetrics.reduce((acc, metric) => acc + metric.score, 0) / performanceMetrics.length)}%
                    </div>
                    <p className="text-gray-600">Overall Performance Score</p>
                    <div className="flex justify-center items-center gap-2 mt-4">
                      <StarIcon className="h-5 w-5 text-yellow-500 fill-current" />
                      <StarIcon className="h-5 w-5 text-yellow-500 fill-current" />
                      <StarIcon className="h-5 w-5 text-yellow-500 fill-current" />
                      <StarIcon className="h-5 w-5 text-yellow-500 fill-current" />
                      <StarIcon className="h-5 w-5 text-gray-300" />
                      <span className="text-sm text-gray-600 ml-2">Excellent Performance</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <TrendingUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">You don't have permission to view performance data.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Certificates Tab */}
        <TabsContent value="certificates" className="space-y-6">
          {hasPermission('certificates.download') ? (
            <div className="grid gap-6">
              {certificates.map((certificate) => (
                <Card key={certificate.id} className="border-l-4 border-l-purple-500">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{certificate.name}</h3>
                          <Badge 
                            className={certificate.status === 'active' ? 
                              'bg-green-100 text-green-800' : 
                              'bg-red-100 text-red-800'
                            }
                          >
                            {certificate.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>📅 Issued: {new Date(certificate.issueDate).toLocaleDateString()}</p>
                          {certificate.expiryDate && (
                            <p>⏰ Expires: {new Date(certificate.expiryDate).toLocaleDateString()}</p>
                          )}
                          <p>📂 Category: {certificate.category}</p>
                        </div>
                      </div>
                      
                      <Button 
                        onClick={() => handleCertificateDownload(certificate)}
                        disabled={certificate.status === 'expired'}
                      >
                        <DownloadIcon className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {certificates.length === 0 && (
                <Card>
                  <CardContent className="p-8 text-center">
                    <AwardIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No certificates earned yet. Complete courses to earn certificates!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <AwardIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">You don't have permission to download certificates.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Personal Info Tab */}
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your personal and employment details (view only)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Full Name</Label>
                    <p className="mt-1 text-sm text-gray-900">{employeeProfile.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Email</Label>
                    <p className="mt-1 text-sm text-gray-900">{employeeProfile.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Phone</Label>
                    <p className="mt-1 text-sm text-gray-900">{employeeProfile.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Address</Label>
                    <p className="mt-1 text-sm text-gray-900">{employeeProfile.address}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Emergency Contact</Label>
                    <p className="mt-1 text-sm text-gray-900">{employeeProfile.emergencyContact}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Employee ID</Label>
                    <p className="mt-1 text-sm text-gray-900">{employeeProfile.employeeId}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Department</Label>
                    <p className="mt-1 text-sm text-gray-900">{employeeProfile.department}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Position</Label>
                    <p className="mt-1 text-sm text-gray-900">{employeeProfile.position}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Manager</Label>
                    <p className="mt-1 text-sm text-gray-900">{employeeProfile.manager}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Join Date</Label>
                    <p className="mt-1 text-sm text-gray-900">{new Date(employeeProfile.joinDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your password and security preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {hasPermission('password.change') && (
                  <div>
                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                      <div>
                        <h3 className="font-medium">Password</h3>
                        <p className="text-sm text-gray-600">Change your account password</p>
                      </div>
                      <Button onClick={() => setShowPasswordDialog(true)}>
                        <KeyIcon className="h-4 w-4 mr-2" />
                        Change Password
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <p className="text-sm text-gray-600">
                        {user.is2FAEnabled ? 'Enabled' : 'Not enabled'}
                      </p>
                    </div>
                    <Badge className={user.is2FAEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {user.is2FAEnabled ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Last Login</h3>
                      <p className="text-sm text-gray-600">
                        {user.lastLoginAt instanceof Date ? 
                          `${user.lastLoginAt.toLocaleDateString()} at ${user.lastLoginAt.toLocaleTimeString()}` :
                          `${new Date(user.lastLoginAt).toLocaleDateString()} at ${new Date(user.lastLoginAt).toLocaleTimeString()}`
                        }
                      </p>
                    </div>
                    <Badge variant="outline">
                      IP: {user.ipAddress}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Password Change Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Enter your current password and choose a new secure password.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>
            
            <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
              <p className="font-medium mb-1">Password Requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>At least 8 characters long</li>
                <li>Contains uppercase and lowercase letters</li>
                <li>Contains at least one number</li>
                <li>Contains at least one special character</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handlePasswordChange}>
              <LockIcon className="h-4 w-4 mr-2" />
              Change Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 