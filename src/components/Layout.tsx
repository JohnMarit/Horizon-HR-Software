import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { navItems } from '@/nav-items';
import { 
  MenuIcon, 
  LogOutIcon, 
  UserIcon, 
  SettingsIcon, 
  BellIcon,
  ShieldIcon,
  ClockIcon,
  WifiIcon,
  WifiOffIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  RefreshCwIcon,
  XIcon,
  MailIcon,
  AlertCircleIcon,
  InfoIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

// Notification interface
interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export function Layout() {
  const { user, logout, sessionTimeLeft, isImpersonating, originalUser, stopImpersonation, canAccess } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  // Enhanced notification system - accessible to all users
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "Welcome to Horizon Bank HR",
      message: "Your account has been successfully set up. Explore the features available to you.",
      type: "success",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      read: false
    },
    {
      id: 2,
      title: "System Maintenance Scheduled",
      message: "Routine system maintenance is scheduled for tonight at 11:00 PM. Expect brief downtime.",
      type: "info",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      read: false,
      actionUrl: "/communications"
    },
    {
      id: 3,
      title: "Profile Update Recommended",
      message: "Please review and update your profile information to ensure accuracy.",
      type: "warning",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      read: true,
      actionUrl: "/profile"
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Notification management functions - available to all users
  const markAsRead = (notificationId: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const deleteNotification = (notificationId: number) => {
    setNotifications(prev => 
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircleIcon className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertTriangleIcon className="h-4 w-4 text-yellow-600" />;
      case 'error': return <AlertCircleIcon className="h-4 w-4 text-red-600" />;
      default: return <InfoIcon className="h-4 w-4 text-blue-600" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getTimeColor = (seconds: number) => {
    if (seconds < 300) return 'text-red-600'; // Less than 5 minutes
    if (seconds < 600) return 'text-yellow-600'; // Less than 10 minutes
    return 'text-green-600';
  };

  const filteredNavItems = navItems.filter(item => canAccess(item.to));

  const currentPageTitle = navItems.find(item => item.to === location.pathname)?.title || 'Dashboard';

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 antialiased">
      {/* Impersonation Banner */}
      {isImpersonating && originalUser && (
        <div className="bg-amber-600 text-white px-4 py-3 shadow-md border-b border-amber-700">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
              <AlertTriangleIcon className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm font-medium">
                Impersonating {user.name} as {originalUser.name}
              </span>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="border-amber-200 text-amber-100 hover:bg-amber-700 hover:border-amber-600 min-h-[36px]"
              onClick={stopImpersonation}
            >
              Stop Impersonation
            </Button>
          </div>
        </div>
      )}

      {/* Offline Banner */}
      {!isOnline && (
        <div className="bg-red-600 text-white px-4 py-3 shadow-md">
          <div className="flex items-center justify-center gap-3 max-w-7xl mx-auto">
            <WifiOffIcon className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-medium">
              You are currently offline. Some features may not be available.
            </span>
          </div>
        </div>
      )}

      {/* Session Warning */}
      {sessionTimeLeft < 300 && sessionTimeLeft > 0 && (
        <div className="bg-yellow-600 text-white px-4 py-3 shadow-md">
          <div className="flex items-center justify-center gap-3 max-w-7xl mx-auto">
            <ClockIcon className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-medium">
              Session expires in {formatTime(sessionTimeLeft)}. Please save your work.
            </span>
          </div>
        </div>
      )}

      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:bg-white lg:border-r lg:shadow-sm">
          {/* Logo */}
          <div className="flex items-center gap-4 p-6 border-b bg-gradient-to-r from-slate-800 to-slate-900">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg p-2">
              <img 
                src="/src/img/horizon-logo.png" 
                alt="Horizon Bank Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="font-bold text-white text-base">Horizon Bank</h1>
              <p className="text-xs text-slate-100">HR Management System</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto bg-white">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group min-h-[48px]",
                    isActive
                      ? "bg-amber-50 text-amber-800 border border-amber-200 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm"
                  )}
                >
                  <span className={cn(
                    "flex-shrink-0 transition-transform group-hover:scale-110",
                    isActive ? "text-amber-600" : "text-gray-400"
                  )}>
                    {item.icon}
                  </span>
                  <span className="truncate flex-1">{item.title}</span>
                  {item.title === "Communications" && unreadCount > 0 && (
                    <Badge variant="destructive" className="ml-auto text-xs min-w-[20px] h-5 animate-pulse">
                      {unreadCount}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t bg-gray-50/50">
            <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-white shadow-sm border">
              <Avatar className="h-10 w-10 ring-2 ring-amber-100">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-amber-100 text-amber-700 font-semibold">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.role}</p>
              </div>
            </div>
            
            {/* Session Info */}
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white border">
                <span className="text-gray-500 font-medium">Session</span>
                <span className={`font-semibold ${getTimeColor(sessionTimeLeft)}`}>
                  {formatTime(sessionTimeLeft)}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white border">
                <span className="text-gray-500 font-medium">Status</span>
                <div className="flex items-center gap-2">
                  {isOnline ? (
                    <>
                      <WifiIcon className="h-3 w-3 text-green-600" />
                      <span className="text-green-600 font-medium">Online</span>
                    </>
                  ) : (
                    <>
                      <WifiOffIcon className="h-3 w-3 text-red-600" />
                      <span className="text-red-600 font-medium">Offline</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white border">
                <span className="text-gray-500 font-medium">Security</span>
                <Badge variant="outline" className={cn(
                  "text-xs font-medium",
                  user.securityLevel === 'CRITICAL' ? 'border-red-200 text-red-700 bg-red-50' :
                  user.securityLevel === 'HIGH' ? 'border-orange-200 text-orange-700 bg-orange-50' :
                  user.securityLevel === 'MEDIUM' ? 'border-yellow-200 text-yellow-700 bg-yellow-50' :
                  'border-green-200 text-green-700 bg-green-50'
                )}>
                  {user.securityLevel}
                </Badge>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Mobile Header */}
          <header className="lg:hidden bg-white border-b px-4 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon-sm" className="lg:hidden">
                      <MenuIcon className="h-5 w-5" />
                      <span className="sr-only">Open navigation menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 p-0 bg-white border-r shadow-xl">
                    {/* Mobile Logo */}
                    <div className="flex items-center gap-4 p-6 pr-8 border-b bg-gradient-to-r from-slate-800 to-slate-900">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center p-2">
                        <img 
                          src="/src/img/horizon-logo.png" 
                          alt="Horizon Bank Logo" 
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h1 className="font-bold text-white text-base">Horizon Bank</h1>
                        <p className="text-xs text-slate-100">HR Management</p>
                      </div>
                    </div>

                    {/* Mobile Navigation */}
                    <nav className="p-4 space-y-2 flex-1 overflow-y-auto bg-white">
                      {filteredNavItems.map((item) => {
                        const isActive = location.pathname === item.to;
                        return (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                              "flex items-center gap-4 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 min-h-[48px]",
                              isActive
                                ? "bg-amber-50 text-amber-800 border border-amber-200"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                          >
                            <span className="flex-shrink-0">{item.icon}</span>
                            <span className="flex-1">{item.title}</span>
                            {item.title === "Communications" && unreadCount > 0 && (
                              <Badge variant="destructive" className="text-xs min-w-[20px] h-5">
                                {unreadCount}
                              </Badge>
                            )}
                          </Link>
                        );
                      })}
                    </nav>

                    {/* Mobile User Section */}
                    <div className="p-4 border-t bg-gray-50/50">
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-white shadow-sm border">
                        <Avatar className="h-10 w-10 ring-2 ring-amber-100">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-amber-100 text-amber-700 font-semibold">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.role}</p>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
                <div>
                  <h1 className="font-bold text-gray-900 text-lg">{currentPageTitle}</h1>
                  <p className="text-xs text-gray-500">Horizon Bank HR</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Mobile session indicator */}
                <Badge variant="outline" className={cn(
                  "text-xs font-medium hidden sm:flex",
                  getTimeColor(sessionTimeLeft)
                )}>
                  {formatTime(sessionTimeLeft)}
                </Badge>
                
                {/* Mobile user menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-xs bg-amber-100 text-amber-700">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="sr-only">Open user menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-64 bg-white border border-gray-200 shadow-xl rounded-xl p-0 z-50"
                    sideOffset={8}
                  >
                    <DropdownMenuLabel className="p-4 bg-gray-50 rounded-t-xl border-b">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 ring-2 ring-amber-100">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-amber-100 text-amber-700 font-semibold">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500">{user.role}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <div className="py-2">
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                          <UserIcon className="h-4 w-4" />
                          <span className="font-medium">My Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                        <SettingsIcon className="h-4 w-4" />
                        <span className="font-medium">Settings</span>
                      </DropdownMenuItem>
                    </div>
                    <div className="border-t border-gray-100">
                      <DropdownMenuItem 
                        onClick={logout} 
                        className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors rounded-b-xl"
                      >
                        <LogOutIcon className="h-4 w-4" />
                        <span className="font-medium">Sign Out</span>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Desktop Header */}
          <header className="hidden lg:flex bg-white border-b px-8 py-6 shadow-sm">
            <div className="flex items-center justify-between w-full">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-1">{currentPageTitle}</h1>
                <p className="text-gray-600">
                  Welcome back, {user.name.split(' ')[0]}! 
                  {user.department && ` • ${user.department}`}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Notifications - Available to all users */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                      <BellIcon className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <Badge variant="destructive" className="absolute -top-1 -right-1 text-xs min-w-[20px] h-5 animate-pulse">
                          {unreadCount}
                        </Badge>
                      )}
                      <span className="sr-only">View notifications</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-96 bg-white border border-gray-200 shadow-xl rounded-xl p-0 z-50"
                    sideOffset={8}
                  >
                    <DropdownMenuLabel className="p-4 bg-gray-50 rounded-t-xl border-b">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                        <div className="flex gap-2">
                          {unreadCount > 0 && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={markAllAsRead}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              Mark all read
                            </Button>
                          )}
                          {notifications.length > 0 && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={clearAllNotifications}
                              className="text-xs text-red-600 hover:text-red-800"
                            >
                              Clear all
                            </Button>
                          )}
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                          <BellIcon className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                          <p className="font-medium">No notifications</p>
                          <p className="text-sm">You're all caught up!</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div 
                            key={notification.id}
                            className={cn(
                              "p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors",
                              !notification.read && "bg-blue-50"
                            )}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 mt-1">
                                {getNotificationIcon(notification.type)}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1">
                                    <h4 className={cn(
                                      "text-sm font-medium text-gray-900",
                                      !notification.read && "font-semibold"
                                    )}>
                                      {notification.title}
                                    </h4>
                                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                      {notification.message}
                                    </p>
                                    <div className="flex items-center gap-3 mt-2">
                                      <span className="text-xs text-gray-400">
                                        {formatTimeAgo(notification.timestamp)}
                                      </span>
                                      {!notification.read && (
                                        <Badge variant="secondary" className="text-xs">
                                          New
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex gap-1">
                                    {!notification.read && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => markAsRead(notification.id)}
                                        className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800"
                                      >
                                        <CheckCircleIcon className="h-3 w-3" />
                                      </Button>
                                    )}
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => deleteNotification(notification.id)}
                                      className="h-6 w-6 p-0 text-red-600 hover:text-red-800"
                                    >
                                      <XIcon className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                                {notification.actionUrl && (
                                  <div className="mt-3">
                                    <Link 
                                      to={notification.actionUrl} 
                                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                      View Details →
                                    </Link>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    {notifications.length > 0 && (
                      <div className="p-3 bg-gray-50 rounded-b-xl border-t">
                        <Link 
                          to="/communications" 
                          className="text-xs text-center text-blue-600 hover:text-blue-800 font-medium block"
                        >
                          View all communications →
                        </Link>
                      </div>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-3 p-3 h-auto hover:bg-gray-50 transition-colors">
                      <Avatar className="h-10 w-10 ring-2 ring-amber-100">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-amber-100 text-amber-700 font-semibold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.role}</p>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-72 bg-white border border-gray-200 shadow-xl rounded-xl p-0 z-50"
                    sideOffset={8}
                  >
                    <DropdownMenuLabel className="p-6 bg-gray-50 rounded-t-xl border-b">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 ring-2 ring-amber-100">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-amber-100 text-amber-700 font-semibold">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.role}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <div className="py-2">
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                          <UserIcon className="h-5 w-5" />
                          <span className="font-medium">My Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                        <SettingsIcon className="h-5 w-5" />
                        <span className="font-medium">Settings</span>
                      </DropdownMenuItem>
                    </div>
                    <div className="border-t border-gray-100">
                      <DropdownMenuItem 
                        onClick={logout} 
                        className="flex items-center gap-3 px-6 py-3 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors rounded-b-xl"
                      >
                        <LogOutIcon className="h-5 w-5" />
                        <span className="font-medium">Sign Out</span>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto bg-gray-50">
            <div className="container-enhanced py-6 lg:py-8 animate-fade-in">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 