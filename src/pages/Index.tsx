// Update this page (the content is just a fallback if you fail to update the page)

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { 
  UsersIcon, 
  CalendarIcon, 
  FileTextIcon, 
  TrendingUpIcon,
  BriefcaseIcon,
  ArrowRightIcon,
  ShieldIcon,
  CreditCardIcon,
  DollarSignIcon
} from "lucide-react";

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    // Redirect users to their most relevant page based on role
    switch (user.role) {
      case 'Employee':
        navigate('/employee-dashboard');
        break;
      case 'HR Manager':
        navigate('/employees');
        break;
      case 'Recruiter':
        navigate('/recruitment');
        break;
      case 'Department Head':
        navigate('/employees');
        break;
      case 'Finance Officer':
        navigate('/payroll');
        break;
      case 'System Administrator':
        navigate('/admin');
        break;
      default:
        navigate('/profile');
        break;
    }
  }, [user, navigate]);

  // Show nothing while redirecting
  return null;
}
