import { Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { navItems } from "@/nav-items";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { 
  MenuIcon, 
  SearchIcon, 
  SettingsIcon, 
  HelpCircleIcon, 
  LogOutIcon,
  UserIcon,
  ChevronDownIcon,
  PhoneIcon,
  MapPinIcon,
  ShieldCheckIcon,
  AlertTriangleIcon,
  UserCheckIcon,
  ClockIcon,
  KeyIcon
} from "lucide-react";
import { useState, useEffect } from "react";

export function Layout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSessionWarning, setShowSessionWarning] = useState(false);
  const { 
    user, 
    logout, 
    canAccess, 
    sessionTimeLeft, 
    isImpersonating, 
    originalUser, 
    stopImpersonation,
    addAuditLog 
  } = useAuth();

  // Session timeout warning
  useEffect(() => {
    if (sessionTimeLeft <= 120 && sessionTimeLeft > 0) { // 2 minutes warning
      setShowSessionWarning(true);
    } else {
      setShowSessionWarning(false);
    }
  }, [sessionTimeLeft]);

  // Filter navigation items based on user permissions
  const filteredNavItems = navItems.filter(item => canAccess(item.to));

  const handleLogout = () => {
    addAuditLog('LOGOUT_INITIATED', 'AUTH', { source: 'manual' });
    logout();
  };

  const handleStopImpersonation = () => {
    stopImpersonation();
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'text-red-600 bg-red-50';
      case 'HIGH': return 'text-orange-600 bg-orange-50';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="bg-white shadow-md"
        >
          <MenuIcon className="h-5 w-5" />
        </Button>
      </div>

      {/* Impersonation Banner */}
      {isImpersonating && originalUser && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500 text-white px-4 py-2">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              <UserCheckIcon className="h-4 w-4" />
              <span className="text-sm font-medium">
                Impersonating {user?.name} ({user?.role}) as {originalUser.name}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleStopImpersonation}
              className="text-white hover:bg-amber-600"
            >
              Stop Impersonation
            </Button>
          </div>
        </div>
      )}

      {/* Session Warning */}
      {showSessionWarning && (
        <div className={`fixed ${isImpersonating ? 'top-10' : 'top-0'} left-0 right-0 z-40 bg-red-500 text-white px-4 py-2`}>
          <div className="flex items-center justify-center gap-2 max-w-7xl mx-auto">
            <ClockIcon className="h-4 w-4" />
            <span className="text-sm font-medium">
              Session expires in {formatTime(sessionTimeLeft)}. Please save your work.
            </span>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className={cn(
            "flex h-16 items-center justify-between px-6 border-b border-gray-100",
            isImpersonating ? "mt-10" : ""
          )}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">HB</span>
              </div>
              <div>
                <span className="font-bold text-gray-900 text-sm">Horizon Bank</span>
                <p className="text-xs text-gray-500">Secure HR System</p>
              </div>
            </div>
          </div>

          {/* Security Status */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ShieldCheckIcon className="h-4 w-4 text-green-600" />
                <span className="text-xs font-medium text-gray-700">Security Status</span>
              </div>
              <Badge variant="outline" className={`text-xs ${getSecurityLevelColor(user?.securityLevel || 'LOW')}`}>
                {user?.securityLevel}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Session</span>
                <span className={cn(
                  "font-mono",
                  sessionTimeLeft <= 120 ? "text-red-600" : "text-green-600"
                )}>
                  {formatTime(sessionTimeLeft)}
                </span>
              </div>
              <Progress 
                value={(sessionTimeLeft / 600) * 100} 
                className="h-1"
              />
              {user?.is2FAEnabled && (
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <KeyIcon className="h-3 w-3" />
                  <span>2FA Active</span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-4 py-4">
            <nav className="space-y-1">
              {filteredNavItems.map((item) => (
                <Button
                  key={item.to}
                  asChild
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 h-11 rounded-lg font-medium transition-all duration-200",
                    location.pathname === item.to 
                      ? "bg-blue-50 text-blue-700 hover:bg-blue-100" 
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <Link to={item.to} onClick={() => setIsSidebarOpen(false)}>
                    <span className={cn(
                      "transition-colors",
                      location.pathname === item.to ? "text-blue-600" : "text-gray-500"
                    )}>
                      {item.icon}
                    </span>
                    {item.title}
                  </Link>
                </Button>
              ))}
            </nav>
          </ScrollArea>

          {/* Bank Info */}
          <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
            <div className="text-xs text-gray-600 space-y-1">
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-3 w-3" />
                <span>Kokora Road, Nimra Talata, Juba</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneIcon className="h-3 w-3" />
                <span>+211 920 961 800</span>
              </div>
            </div>
          </div>

          {/* User profile */}
          <div className="p-4 border-t border-gray-100">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {user?.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {user?.role}
                      </Badge>
                      {user?.is2FAEnabled && (
                        <ShieldCheckIcon className="h-3 w-3 text-green-600" />
                      )}
                    </div>
                  </div>
                  <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {user?.role !== 'System Administrator' && (
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Profile & Security</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  <span>Secure Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className={cn(
          "h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-8",
          isImpersonating && "mt-10",
          showSessionWarning && !isImpersonating && "mt-10",
          showSessionWarning && isImpersonating && "mt-20"
        )}>
          <div className="flex items-center gap-4 flex-1">
            <div className="hidden lg:block">
              <h1 className="text-xl font-semibold text-gray-900">
                {filteredNavItems.find(item => item.to === location.pathname)?.title || 'Dashboard'}
              </h1>
              <p className="text-xs text-gray-500">Horizon Bank South Sudan • Secure Access</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
              <span>Welcome back,</span>
              <span className="font-medium text-gray-900">{user?.name?.split(' ')[0]}</span>
              {user?.securityLevel === 'CRITICAL' && (
                <AlertTriangleIcon className="h-4 w-4 text-red-500" />
              )}
            </div>
            
            {/* Session timeout indicator */}
            <div className="hidden md:flex items-center gap-1 text-xs text-gray-500">
              <ClockIcon className="h-3 w-3" />
              <span>{formatTime(sessionTimeLeft)}</span>
            </div>

            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
              <SearchIcon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
              <HelpCircleIcon className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                  <SettingsIcon className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {user?.role !== 'System Administrator' && (
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Profile & Security</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  <span>System Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  <span>Secure Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
} 