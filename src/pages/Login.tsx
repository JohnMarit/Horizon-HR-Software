import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { 
  EyeIcon, 
  EyeOffIcon, 
  LockIcon, 
  MailIcon, 
  AlertCircleIcon, 
  ShieldCheckIcon,
  KeyIcon,
  InfoIcon
} from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!email || !password) {
      setError('Please fill in all required fields');
      return;
    }

    // Password policy validation
    if (password.length < 12) {
      setError('Password must be at least 12 characters long');
      return;
    }

    const result = await login(email, password);

    if (result.success) {
      // Login successful, user will be redirected
      return;
    }

    setError(result.error || 'Login failed');
    setLoginAttempts(prev => prev + 1);
  };

  const demoUsers = [
    { 
      email: 'admin@horizonbankss.com', 
      role: 'HR Manager', 
      password: 'HorizonSecure2024!',
      securityLevel: 'CRITICAL'
    },
    { 
      email: 'employee@horizonbankss.com', 
      role: 'Employee', 
      password: 'EmployeeSecure2024!',
      securityLevel: 'MEDIUM'
    },
    { 
      email: 'sysadmin@horizonbankss.com', 
      role: 'System Administrator', 
      password: 'SysAdminSecure2024!',
      securityLevel: 'CRITICAL'
    },
  ];

  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg p-3">
                <img 
                  src="/src/img/horizon-logo.png" 
                  alt="Horizon Bank Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Horizon Bank</h1>
                <p className="text-xl text-amber-600 font-medium">South Sudan</p>
                <p className="text-lg text-gray-600">Secure HR Management System</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Enterprise-Grade Security
            </h2>
            <div className="space-y-4 text-gray-600">
              <div className="flex items-center gap-3">
                <ShieldCheckIcon className="w-5 h-5 text-amber-600" />
                <span>Two-Factor Authentication (2FA) protection</span>
              </div>
              <div className="flex items-center gap-3">
                <KeyIcon className="w-5 h-5 text-amber-600" />
                <span>Role-based access control with audit logging</span>
              </div>
              <div className="flex items-center gap-3">
                <LockIcon className="w-5 h-5 text-amber-600" />
                <span>Session timeout and activity monitoring</span>
              </div>
              <div className="flex items-center gap-3">
                <AlertCircleIcon className="w-5 h-5 text-amber-600" />
                <span>Account lockout protection</span>
              </div>
            </div>

            <div className="mt-8 p-4 bg-amber-50 rounded-lg border-l-4 border-amber-600">
              <h3 className="font-semibold text-amber-900 mb-2">Security Notice</h3>
              <p className="text-sm text-amber-800">
                This system implements enterprise-grade security measures including audit logging, 
                session management, and multi-factor authentication for high-privilege accounts.
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full max-w-md mx-auto space-y-6">
          <Card className="border-0 shadow-2xl">
            <CardHeader className="space-y-2 text-center pb-6">
              <div className="lg:hidden flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg p-2">
                  <img 
                    src="/src/img/horizon-logo.png" 
                    alt="Horizon Bank Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-left">
                  <span className="text-2xl font-bold text-gray-900 block">Horizon Bank</span>
                  <span className="text-sm text-amber-600">Secure HR System</span>
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Secure Login
              </CardTitle>
              <CardDescription className="text-gray-600">
                Sign in to access your HR dashboard
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircleIcon className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {loginAttempts >= 2 && (
                <Alert>
                  <InfoIcon className="h-4 w-4" />
                  <AlertDescription>
                    Account will be temporarily locked after 3 failed attempts for security.
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email address *
                  </label>
                  <div className="relative">
                    <MailIcon className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12"
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password *
                  </label>
                  <div className="relative">
                    <LockIcon className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 h-12"
                      disabled={isLoading}
                      required
                      minLength={12}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Minimum 12 characters with special characters and numbers
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    'Signing in...'
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Demo Users */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold text-gray-900">Demo Access</CardTitle>
              <CardDescription>
                Click on any role to auto-fill credentials for testing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {demoUsers.map((user) => (
                <div
                  key={user.email}
                  onClick={() => {
                    setEmail(user.email);
                    setPassword(user.password);
                    setError('');
                  }}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-amber-50 cursor-pointer transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900 text-sm">{user.role}</p>
                    </div>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="outline" className={`text-xs ${getSecurityLevelColor(user.securityLevel)}`}>
                      {user.securityLevel}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Separator />

          {/* Security Information */}
          <div className="text-center text-sm text-gray-500 space-y-2">
            <div className="flex items-center justify-center gap-2">
              <ShieldCheckIcon className="h-4 w-4" />
              <span>Protected by enterprise-grade security</span>
            </div>
            <p>© 2025 Horizon Bank South Sudan. All rights reserved.</p>
            <div className="flex items-center justify-center gap-4 text-xs">
              <span>Kokora Road, Nimra Talata, Juba</span>
              <span>•</span>
              <span>+211 920 961 800</span>
            </div>
            <div className="text-xs">
              <span>info@horizonbankss.com • </span>
              <span>Mon-Fri: 8:30-17:00, Sat: 9:00-12:00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 