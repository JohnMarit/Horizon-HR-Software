// Update this page (the content is just a fallback if you fail to update the page)

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { 
  UsersIcon, 
  CalendarIcon, 
  FileTextIcon, 
  BellIcon, 
  TrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
  PlusIcon,
  ArrowUpIcon,
  ShieldIcon,
  CreditCardIcon,
  DollarSignIcon,
  StarIcon
} from "lucide-react";

export default function Index() {
  const { user, hasPermission } = useAuth();

  // Role-specific stats tailored for Horizon Bank
  const getStatsForRole = () => {
    switch (user?.role) {
      case 'HR Manager':
        return [
          { title: "Total Staff", value: "285", change: "+18%", trend: "up", description: "Bank employees", icon: <UsersIcon className="h-5 w-5" />, color: "bg-blue-500" },
          { title: "Open Positions", value: "12", change: "+50%", trend: "up", description: "Banking roles", icon: <FileTextIcon className="h-5 w-5" />, color: "bg-green-500" },
          { title: "Leave Requests", value: "8", change: "-20%", trend: "down", description: "Pending approval", icon: <CalendarIcon className="h-5 w-5" />, color: "bg-amber-500" },
          { title: "Training Programs", value: "6", change: "+100%", trend: "up", description: "Active courses", icon: <StarIcon className="h-5 w-5" />, color: "bg-purple-500" }
        ];
      case 'Recruiter':
        return [
          { title: "Banking Jobs", value: "12", change: "+50%", trend: "up", description: "Open positions", icon: <CreditCardIcon className="h-5 w-5" />, color: "bg-green-500" },
          { title: "Applications", value: "67", change: "+35%", trend: "up", description: "This month", icon: <UsersIcon className="h-5 w-5" />, color: "bg-blue-500" },
          { title: "Interviews", value: "15", change: "+66%", trend: "up", description: "Scheduled", icon: <CalendarIcon className="h-5 w-5" />, color: "bg-amber-500" },
          { title: "Hires", value: "8", change: "+60%", trend: "up", description: "This quarter", icon: <CheckCircleIcon className="h-5 w-5" />, color: "bg-purple-500" }
        ];
      case 'Department Head':
        return [
          { title: "Team Size", value: "42", change: "+16%", trend: "up", description: "Department staff", icon: <UsersIcon className="h-5 w-5" />, color: "bg-blue-500" },
          { title: "Leave Requests", value: "4", change: "0%", trend: "neutral", description: "To approve", icon: <CalendarIcon className="h-5 w-5" />, color: "bg-amber-500" },
          { title: "Performance", value: "92%", change: "+8%", trend: "up", description: "Team average", icon: <TrendingUpIcon className="h-5 w-5" />, color: "bg-green-500" },
          { title: "Client Satisfaction", value: "96%", change: "+4%", trend: "up", description: "Department score", icon: <StarIcon className="h-5 w-5" />, color: "bg-purple-500" }
        ];
      case 'Finance Officer':
        return [
          { title: "Monthly Payroll", value: "$2.8M", change: "+12%", trend: "up", description: "Total processed", icon: <DollarSignIcon className="h-5 w-5" />, color: "bg-green-500" },
          { title: "Pending Payments", value: "6", change: "-50%", trend: "down", description: "To process", icon: <ClockIcon className="h-5 w-5" />, color: "bg-amber-500" },
          { title: "Compliance Score", value: "99.2%", change: "+1.2%", trend: "up", description: "Regulatory", icon: <ShieldIcon className="h-5 w-5" />, color: "bg-blue-500" },
          { title: "Budget Variance", value: "2.1%", change: "-0.5%", trend: "down", description: "Under budget", icon: <TrendingUpIcon className="h-5 w-5" />, color: "bg-purple-500" }
        ];
      case 'Employee':
        return [
          { title: "Leave Balance", value: "22", change: "0%", trend: "neutral", description: "Days remaining", icon: <CalendarIcon className="h-5 w-5" />, color: "bg-blue-500" },
          { title: "Training Progress", value: "75%", change: "+25%", trend: "up", description: "Banking skills", icon: <StarIcon className="h-5 w-5" />, color: "bg-green-500" },
          { title: "Goals Progress", value: "88%", change: "+18%", trend: "up", description: "Annual targets", icon: <TrendingUpIcon className="h-5 w-5" />, color: "bg-amber-500" },
          { title: "Client Interactions", value: "156", change: "+24%", trend: "up", description: "This month", icon: <UsersIcon className="h-5 w-5" />, color: "bg-purple-500" }
        ];
      default:
        return [];
    }
  };

  const stats = getStatsForRole();

  // Role-specific activities for Horizon Bank operations
  const getActivitiesForRole = () => {
    switch (user?.role) {
      case 'HR Manager':
        return [
          { id: 1, title: "New relationship manager onboarding completed", time: "1 hour ago", type: "employee", status: "completed" },
          { id: 2, title: "Banking compliance training updated", time: "3 hours ago", type: "training", status: "completed" },
          { id: 3, title: "Performance review cycle initiated", time: "1 day ago", type: "performance", status: "in-progress" },
          { id: 4, title: "Recruitment drive for trade finance team", time: "2 days ago", type: "recruitment", status: "pending" }
        ];
      case 'Recruiter':
        return [
          { id: 1, title: "Interview with Corporate Banking candidate", time: "30 mins ago", type: "interview", status: "completed" },
          { id: 2, title: "New application for Credit Analyst position", time: "2 hours ago", type: "application", status: "pending" },
          { id: 3, title: "Trade Finance Officer job posting published", time: "4 hours ago", type: "job", status: "completed" },
          { id: 4, title: "Banking experience verification completed", time: "1 day ago", type: "verification", status: "completed" }
        ];
      case 'Department Head':
        return [
          { id: 1, title: "Client relationship review meeting", time: "1 hour ago", type: "meeting", status: "completed" },
          { id: 2, title: "Team member promotion approved", time: "4 hours ago", type: "promotion", status: "completed" },
          { id: 3, title: "Monthly department targets achieved", time: "1 day ago", type: "achievement", status: "completed" },
          { id: 4, title: "New client acquisition strategy meeting", time: "2 days ago", type: "strategy", status: "pending" }
        ];
      case 'Finance Officer':
        return [
          { id: 1, title: "Monthly payroll processing completed", time: "2 hours ago", type: "payroll", status: "completed" },
          { id: 2, title: "Central Bank compliance report submitted", time: "5 hours ago", type: "compliance", status: "completed" },
          { id: 3, title: "Department budget review meeting", time: "1 day ago", type: "budget", status: "completed" },
          { id: 4, title: "Banking license renewal documentation", time: "3 days ago", type: "documentation", status: "in-progress" }
        ];
      case 'Employee':
        return [
          { id: 1, title: "Customer service excellence training completed", time: "45 mins ago", type: "training", status: "completed" },
          { id: 2, title: "Annual leave request submitted", time: "3 hours ago", type: "leave", status: "pending" },
          { id: 3, title: "Client satisfaction feedback received", time: "1 day ago", type: "feedback", status: "completed" },
          { id: 4, title: "Banking product knowledge update", time: "2 days ago", type: "knowledge", status: "completed" }
        ];
      default:
        return [];
    }
  };

  const recentActivities = getActivitiesForRole();

  // Banking-focused quick actions
  const getQuickActionsForRole = () => {
    const actions = [];
    
    if (hasPermission('*') || hasPermission('recruitment')) {
      actions.push({ title: "Post Banking Role", icon: <CreditCardIcon className="h-5 w-5" />, href: "/recruitment" });
    }
    if (hasPermission('*') || hasPermission('team_management')) {
      actions.push({ title: "Add Staff Member", icon: <UsersIcon className="h-5 w-5" />, href: "/employees" });
    }
    if (hasPermission('payroll')) {
      actions.push({ title: "Process Payroll", icon: <DollarSignIcon className="h-5 w-5" />, href: "/payroll" });
    }
    if (hasPermission('leave_request')) {
      actions.push({ title: "Request Leave", icon: <CalendarIcon className="h-5 w-5" />, href: "/payroll" });
    }
    if (hasPermission('*')) {
      actions.push({ title: "Banking Reports", icon: <TrendingUpIcon className="h-5 w-5" />, href: "/compliance" });
    }

    return actions.slice(0, 4);
  };

  const quickActions = getQuickActionsForRole();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Horizon Bank specific departments
  const bankDepartments = [
    { name: "Personal Banking", current: 85, total: 95, percentage: 89 },
    { name: "Corporate Banking", current: 42, total: 45, percentage: 93 },
    { name: "Trade Finance", current: 18, total: 20, percentage: 90 },
    { name: "Finance & Accounting", current: 25, total: 28, percentage: 89 },
    { name: "Operations", current: 35, total: 40, percentage: 88 },
    { name: "Human Resources", current: 12, total: 15, percentage: 80 }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          {getGreeting()}, {user?.name.split(' ')[0]}!
        </h1>
        <div className="flex items-center gap-2">
          <p className="text-lg text-gray-600">
            Welcome to your Horizon Bank {user?.role} dashboard.
          </p>
          <Badge variant="outline" className="text-sm bg-blue-50 text-blue-700 border-blue-200">
            {user?.department}
          </Badge>
        </div>
      </div>

      {/* Horizon Bank Values Banner */}
      <Card className="border-0 shadow-md bg-gradient-to-r from-blue-50 to-blue-100">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                <ShieldIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-blue-900">Integrity</h3>
              <p className="text-sm text-blue-700">Conduct consistent with our business</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircleIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-blue-900">Prudence</h3>
              <p className="text-sm text-blue-700">Good judgment in all we do</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                <StarIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-blue-900">Excellence</h3>
              <p className="text-sm text-blue-700">Redefining standards</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
                <UsersIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-blue-900">Collaboration</h3>
              <p className="text-sm text-blue-700">Recognizing each other's strengths</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <Badge 
                      variant={stat.trend === "up" ? "default" : stat.trend === "down" ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {stat.change}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color} text-white`}>
                  {stat.icon}
                </div>
              </div>
              {stat.trend === "up" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-green-600"></div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            <CardDescription>Banking operations at your fingertips</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => (
              <Button
                key={action.title}
                variant="ghost"
                className="w-full justify-start h-12 px-4 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                asChild
              >
                <a href={action.href}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gray-100">
                      {action.icon}
                    </div>
                    <span className="font-medium">{action.title}</span>
                  </div>
                </a>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-0 shadow-md">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Recent Banking Activity</CardTitle>
                <CardDescription>Your latest banking operations and updates</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                View all
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0 mt-1">
                    {activity.status === "completed" && (
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                    )}
                    {activity.status === "pending" && (
                      <ClockIcon className="h-5 w-5 text-amber-500" />
                    )}
                    {activity.status === "in-progress" && (
                      <div className="h-5 w-5 rounded-full bg-blue-500 animate-pulse" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Overview for Horizon Bank */}
      {(user?.role === 'HR Manager' || user?.role === 'Department Head') && (
        <Card className="border-0 shadow-md">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Horizon Bank Departments</CardTitle>
            <CardDescription>Current staffing levels across all banking divisions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {bankDepartments.map((dept) => (
                <div key={dept.name} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{dept.name}</span>
                    <span className="text-sm text-gray-500">{dept.current}/{dept.total}</span>
                  </div>
                  <Progress value={dept.percentage} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{dept.percentage}% capacity</span>
                    <span className="text-green-600">✓ Operational</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Floating Action Button */}
      {(hasPermission('*') || hasPermission('recruitment')) && (
        <div className="fixed bottom-6 right-6">
          <Button
            size="lg"
            className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <PlusIcon className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  );
}
