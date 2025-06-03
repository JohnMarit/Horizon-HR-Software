import { 
  UsersIcon, 
  FileTextIcon, 
  DollarSignIcon, 
  BarChartIcon, 
  BookOpenIcon, 
  ShieldCheckIcon, 
  MessageSquareIcon,
  UserIcon,
  SettingsIcon,
  BadgeIcon,
  TrendingUpIcon,
  ZapIcon,
  CalendarIcon,
  BriefcaseIcon,
  StarIcon,
  HeartIcon,
  FolderIcon,
  PieChartIcon,
  AwardIcon
} from "lucide-react";
import Index from "./pages/Index";
import Recruitment from "./pages/Recruitment";
import EmployeeRecords from "./pages/EmployeeRecords";
import Payroll from "./pages/Payroll";
import Performance from "./pages/Performance";
import Training from "./pages/Training";
import Compliance from "./pages/Compliance";
import Communications from "./pages/Communications";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import Certifications from "./pages/Certifications";
import Analytics from "./pages/Analytics";
import Workflows from "./pages/Workflows";
import LeaveManagement from "./pages/LeaveManagement";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import FeedbackSystem360 from "./components/360FeedbackSystem";
import EmployeeEngagement from "./components/EmployeeEngagement";
import LeaveCalendar from "./components/LeaveCalendar";
import DocumentManagement from "./components/DocumentManagement";
import HRAnalyticsDashboard from "./components/HRAnalyticsDashboard";

export const navItems = [
  {
    title: "Employee Dashboard",
    to: "/employee-dashboard",
    icon: <BriefcaseIcon className="h-4 w-4" />,
    page: <EmployeeDashboard />,
  },
  {
    title: "Admin Panel",
    to: "/admin",
    icon: <SettingsIcon className="h-4 w-4" />,
    page: <Admin />,
  },
  {
    title: "Recruitment",
    to: "/recruitment",
    icon: <UsersIcon className="h-4 w-4" />,
    page: <Recruitment />,
  },
  {
    title: "Employee Records",
    to: "/employees",
    icon: <FileTextIcon className="h-4 w-4" />,
    page: <EmployeeRecords />,
  },
  {
    title: "360° Feedback",
    to: "/360-feedback",
    icon: <StarIcon className="h-4 w-4" />,
    page: <FeedbackSystem360 />,
  },
  {
    title: "Employee Engagement",
    to: "/engagement",
    icon: <HeartIcon className="h-4 w-4" />,
    page: <EmployeeEngagement />,
  },
  {
    title: "Leave Management",
    to: "/leave",
    icon: <CalendarIcon className="h-4 w-4" />,
    page: <LeaveManagement />,
  },
  {
    title: "Leave Calendar",
    to: "/leave-calendar",
    icon: <CalendarIcon className="h-4 w-4" />,
    page: <LeaveCalendar />,
  },
  {
    title: "Document Management",
    to: "/documents",
    icon: <FolderIcon className="h-4 w-4" />,
    page: <DocumentManagement />,
  },
  {
    title: "Payroll & Leave",
    to: "/payroll",
    icon: <DollarSignIcon className="h-4 w-4" />,
    page: <Payroll />,
  },
  {
    title: "Performance",
    to: "/performance",
    icon: <BarChartIcon className="h-4 w-4" />,
    page: <Performance />,
  },
  {
    title: "Training",
    to: "/training",
    icon: <BookOpenIcon className="h-4 w-4" />,
    page: <Training />,
  },
  {
    title: "Banking Certifications",
    to: "/certifications",
    icon: <BadgeIcon className="h-4 w-4" />,
    page: <Certifications />,
  },
  {
    title: "Analytics Dashboard",
    to: "/analytics",
    icon: <TrendingUpIcon className="h-4 w-4" />,
    page: <Analytics />,
  },
  {
    title: "HR Analytics",
    to: "/hr-analytics",
    icon: <PieChartIcon className="h-4 w-4" />,
    page: <HRAnalyticsDashboard />,
  },
  {
    title: "Workflow Automation",
    to: "/workflows",
    icon: <ZapIcon className="h-4 w-4" />,
    page: <Workflows />,
  },
  {
    title: "Compliance",
    to: "/compliance",
    icon: <ShieldCheckIcon className="h-4 w-4" />,
    page: <Compliance />,
  },
  {
    title: "Communications",
    to: "/communications",
    icon: <MessageSquareIcon className="h-4 w-4" />,
    page: <Communications />,
  },
  {
    title: "My Profile",
    to: "/profile",
    icon: <UserIcon className="h-4 w-4" />,
    page: <Profile />,
  },
];

// Export a separate root route component
export const rootRoute = {
  to: "/",
  page: <Index />,
};
