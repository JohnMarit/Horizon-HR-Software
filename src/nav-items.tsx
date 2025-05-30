import { 
  HomeIcon, 
  UsersIcon, 
  FileTextIcon, 
  DollarSignIcon, 
  BarChartIcon, 
  BookOpenIcon, 
  ShieldCheckIcon, 
  MessageSquareIcon,
  BuildingIcon,
  UserIcon,
  SettingsIcon
} from "lucide-react";
import Index from "./pages/Index";
import Recruitment from "./pages/Recruitment";
import EmployeeRecords from "./pages/EmployeeRecords";
import Payroll from "./pages/Payroll";
import Performance from "./pages/Performance";
import Training from "./pages/Training";
import Compliance from "./pages/Compliance";
import Communications from "./pages/Communications";
import CompanyInfo from "./pages/CompanyInfo";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";

export const navItems = [
  {
    title: "Dashboard",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Admin Panel",
    to: "/admin",
    icon: <SettingsIcon className="h-4 w-4" />,
    page: <Admin />,
  },
  {
    title: "Company Info",
    to: "/company",
    icon: <BuildingIcon className="h-4 w-4" />,
    page: <CompanyInfo />,
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
