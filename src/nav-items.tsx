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
  BriefcaseIcon
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
    title: "Leave Management",
    to: "/leave",
    icon: <CalendarIcon className="h-4 w-4" />,
    page: <LeaveManagement />,
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
