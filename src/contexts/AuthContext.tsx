import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'HR Manager' | 'Recruiter' | 'Department Head' | 'Finance Officer' | 'Employee' | 'System Administrator';

export interface SecuritySettings {
  require2FA: boolean;
  sessionTimeout: number; // minutes
  maxLoginAttempts: number;
  passwordPolicy: {
    minLength: number;
    requireSpecialChars: boolean;
    requireNumbers: boolean;
    noReuse: boolean;
  };
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  module: string;
  timestamp: Date;
  ipAddress: string;
  details: any;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar?: string;
  is2FAEnabled: boolean;
  lastLoginAt: Date;
  ipAddress: string;
  securityLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  permissions: string[];
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, twoFactorCode?: string) => Promise<{ success: boolean; requires2FA?: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
  sessionTimeLeft: number;
  hasPermission: (permission: string) => boolean;
  canAccess: (module: string) => boolean;
  enable2FA: () => Promise<string>; // Returns QR code
  verify2FA: (code: string) => Promise<boolean>;
  auditLogs: AuditLog[];
  addAuditLog: (action: string, module: string, details?: any) => void;
  impersonateUser: (targetUserId: string) => Promise<boolean>;
  isImpersonating: boolean;
  originalUser: User | null;
  stopImpersonation: () => void;
  updateAvatar: (newAvatarUrl: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Enhanced mock users for Horizon Bank with security profiles
const mockUsers: Record<string, { password: string; user: User; loginAttempts: number; lockedUntil?: Date }> = {
  'admin@horizonbankss.com': {
    password: 'HorizonSecure2024!',
    loginAttempts: 0,
    user: {
      id: '1',
      name: 'Sarah Akol',
      email: 'admin@horizonbankss.com',
      role: 'HR Manager',
      department: 'Human Resources',
      avatar: '/placeholder-avatar.png',
      is2FAEnabled: false,
      lastLoginAt: new Date(),
      ipAddress: '192.168.1.100',
      securityLevel: 'CRITICAL',
      permissions: ['recruitment.create', 'recruitment.edit', 'recruitment.view', 'candidates.manage', 'interviews.schedule', 'team.view', 'team.manage', 'leave.approve', 'performance.evaluate', 'training.view', 'training.manage', 'payroll.view', 'payroll.manage', 'compliance.view', 'communications.view', 'users.view', 'reports.view'] // HR Manager has extensive HR permissions but NOT system.admin
    }
  },
  'recruiter@horizonbankss.com': {
    password: 'RecruiterSecure2024!',
    loginAttempts: 0,
    user: {
      id: '2',
      name: 'James Wani',
      email: 'recruiter@horizonbankss.com',
      role: 'Recruiter',
      department: 'Human Resources',
      avatar: '/placeholder-avatar.png',
      is2FAEnabled: false,
      lastLoginAt: new Date(),
      ipAddress: '192.168.1.101',
      securityLevel: 'HIGH',
      permissions: ['recruitment.create', 'recruitment.edit', 'recruitment.view', 'candidates.manage', 'interviews.schedule', 'communications.view']
    }
  },
  'manager@horizonbankss.com': {
    password: 'ManagerSecure2024!',
    loginAttempts: 0,
    user: {
      id: '3',
      name: 'Mary Deng',
      email: 'manager@horizonbankss.com',
      role: 'Department Head',
      department: 'Corporate Banking',
      avatar: '/placeholder-avatar.png',
      is2FAEnabled: false,
      lastLoginAt: new Date(),
      ipAddress: '192.168.1.102',
      securityLevel: 'HIGH',
      permissions: ['team.view', 'team.manage', 'leave.approve', 'performance.evaluate', 'training.view', 'communications.view']
    }
  },
  'finance@horizonbankss.com': {
    password: 'FinanceSecure2024!',
    loginAttempts: 0,
    user: {
      id: '4',
      name: 'Peter Garang',
      email: 'finance@horizonbankss.com',
      role: 'Finance Officer',
      department: 'Finance & Accounting',
      avatar: '/placeholder-avatar.png',
      is2FAEnabled: false,
      lastLoginAt: new Date(),
      ipAddress: '192.168.1.103',
      securityLevel: 'CRITICAL',
      permissions: ['payroll.manage', 'payroll.view', 'taxes.manage', 'reports.financial', 'compliance.financial', 'communications.view']
    }
  },
  'employee@horizonbankss.com': {
    password: 'EmployeeSecure2024!',
    loginAttempts: 0,
    user: {
      id: '5',
      name: 'Grace Ajak',
      email: 'employee@horizonbankss.com',
      role: 'Employee',
      department: 'Personal Banking',
      avatar: '/placeholder-avatar.png',
      is2FAEnabled: false,
      lastLoginAt: new Date(),
      ipAddress: '192.168.1.104',
      securityLevel: 'MEDIUM',
      permissions: ['profile.view', 'password.change', 'performance.view', 'certificates.download', 'courses.view', 'courses.resume', 'courses.complete', 'leave.request', 'payslips.view', 'training.view', 'training.enroll', 'communications.view']
    }
  },
  'sysadmin@horizonbankss.com': {
    password: 'SysAdminSecure2024!',
    loginAttempts: 0,
    user: {
      id: '6',
      name: 'Tech Administrator',
      email: 'sysadmin@horizonbankss.com',
      role: 'System Administrator',
      department: 'Information Technology',
      avatar: '/placeholder-avatar.png',
      is2FAEnabled: false,
      lastLoginAt: new Date(),
      ipAddress: '192.168.1.10',
      securityLevel: 'CRITICAL',
      permissions: ['system.admin', 'users.manage', 'logs.view', 'backup.manage', 'security.configure', 'communications.view']
    }
  }
};

// Enhanced security settings
const securitySettings: SecuritySettings = {
  require2FA: true,
  sessionTimeout: 10, // 10 minutes
  maxLoginAttempts: 3,
  passwordPolicy: {
    minLength: 12,
    requireSpecialChars: true,
    requireNumbers: true,
    noReuse: true
  }
};

// Module access mapping with granular permissions
const moduleAccess: Record<string, string[]> = {
  '/': ['*'], // Dashboard accessible to all
  '/employee-dashboard': ['profile.view', '*'], // Employee dashboard accessible to employees
  '/profile': ['*'], // Profile accessible to all employees
  '/company': ['*'], // Company info accessible to all
  '/recruitment': ['recruitment.view', '*'],
  '/recruitment/create': ['recruitment.create', '*'],
  '/recruitment/edit': ['recruitment.edit', '*'],
  '/employees': ['team.view', 'team.manage', '*'],
  '/employees/edit': ['team.manage', '*'],
  '/payroll': ['payroll.view', 'payroll.manage', '*'],
  '/payroll/process': ['payroll.manage', '*'],
  '/performance': ['performance.view', 'performance.evaluate', '*'],
  '/training': ['training.view', '*'],
  '/training/manage': ['training.manage', '*'],
  '/compliance': ['compliance.view', 'compliance.financial', '*'],
  '/communications': ['communications.view', '*'],
  '/certifications': ['*'], // Banking certifications accessible to all
  '/analytics': ['*'], // Analytics accessible to all
  '/workflows': ['*'], // Workflows accessible to all
  '/admin': ['system.admin'], // ONLY system administrators
  '/audit': ['system.admin'] // ONLY system administrators
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [originalUser, setOriginalUser] = useState<User | null>(null);
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(securitySettings.sessionTimeout * 60);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Session timeout management
  useEffect(() => {
    if (!user) return;

    const timer = setInterval(() => {
      setSessionTimeLeft(prev => {
        if (prev <= 1) {
          logout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [user]);

  // Reset session timer on user activity
  useEffect(() => {
    const resetTimer = () => {
      setSessionTimeLeft(securitySettings.sessionTimeout * 60);
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, resetTimer, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimer, true);
      });
    };
  }, []);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('horizon_hr_user_secure');
    const storedSession = localStorage.getItem('horizon_hr_session');
    
    if (storedUser && storedSession) {
      const sessionData = JSON.parse(storedSession);
      const now = new Date().getTime();
      
      if (now < sessionData.expiresAt) {
        const parsedUser = JSON.parse(storedUser);
        // Convert lastLoginAt string back to Date object
        if (parsedUser.lastLoginAt) {
          parsedUser.lastLoginAt = new Date(parsedUser.lastLoginAt);
        }
        setUser(parsedUser);
        setSessionTimeLeft(Math.floor((sessionData.expiresAt - now) / 1000));
      } else {
        // Session expired
        localStorage.removeItem('horizon_hr_user_secure');
        localStorage.removeItem('horizon_hr_session');
      }
    }
    setIsLoading(false);
  }, []);

  const addAuditLog = (action: string, module: string, details?: any) => {
    const log: AuditLog = {
      id: Date.now().toString(),
      userId: user?.id || 'unknown',
      action,
      module,
      timestamp: new Date(),
      ipAddress: user?.ipAddress || '0.0.0.0',
      details
    };
    
    setAuditLogs(prev => [log, ...prev.slice(0, 99)]); // Keep last 100 logs
    
    // In production, send to backend audit service
    // console.log('AUDIT LOG:', log);
  };

  const login = async (email: string, password: string, twoFactorCode?: string): Promise<{ success: boolean; requires2FA?: boolean; error?: string }> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = mockUsers[email];
    
    if (!mockUser) {
      setIsLoading(false);
      return { success: false, error: 'Invalid credentials' };
    }

    // Check account lockout
    if (mockUser.lockedUntil && new Date() < mockUser.lockedUntil) {
      setIsLoading(false);
      return { success: false, error: 'Account temporarily locked due to multiple failed attempts' };
    }

    // Check password
    if (mockUser.password !== password) {
      mockUser.loginAttempts++;
      
      if (mockUser.loginAttempts >= securitySettings.maxLoginAttempts) {
        mockUser.lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes lockout
      }
      
      setIsLoading(false);
      return { success: false, error: 'Invalid credentials' };
    }

    // Success - reset login attempts
    mockUser.loginAttempts = 0;
    delete mockUser.lockedUntil;

    const userWithUpdatedLogin = {
      ...mockUser.user,
      lastLoginAt: new Date(),
      ipAddress: '192.168.1.' + Math.floor(Math.random() * 255) // Simulate IP
    };

    setUser(userWithUpdatedLogin);
    
    // Create secure session
    const sessionData = {
      expiresAt: Date.now() + (securitySettings.sessionTimeout * 60 * 1000)
    };
    
    localStorage.setItem('horizon_hr_user_secure', JSON.stringify(userWithUpdatedLogin));
    localStorage.setItem('horizon_hr_session', JSON.stringify(sessionData));
    
    addAuditLog('LOGIN_SUCCESS', 'AUTH', { email, timestamp: new Date() });
    
    setIsLoading(false);
    return { success: true };
  };

  const logout = () => {
    if (user) {
      addAuditLog('LOGOUT', 'AUTH', { timestamp: new Date() });
    }
    
    setUser(null);
    setOriginalUser(null);
    setIsImpersonating(false);
    localStorage.removeItem('horizon_hr_user_secure');
    localStorage.removeItem('horizon_hr_session');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes('*') || user.permissions.includes(permission);
  };

  const canAccess = (module: string): boolean => {
    if (!user) return false;
    
    // System Administrator should not have profile access
    if (module === '/profile' && user.role === 'System Administrator') {
      return false;
    }
    
    // These modules should be accessible to all authenticated users
    if (module === '/' || module === '/communications') {
      return true;
    }
    
    // Profile is accessible to all except System Administrator (handled above)
    if (module === '/profile') {
      return true;
    }
    
    const requiredPermissions = moduleAccess[module] || [];
    return requiredPermissions.some(permission => hasPermission(permission));
  };

  const enable2FA = async (): Promise<string> => {
    // Simulate generating QR code
    await new Promise(resolve => setTimeout(resolve, 500));
    addAuditLog('2FA_ENABLED', 'SECURITY', { userId: user?.id });
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  };

  const verify2FA = async (code: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const isValid = code === '123456'; // Simplified for demo
    
    if (isValid && user) {
      const updatedUser = { ...user, is2FAEnabled: true };
      setUser(updatedUser);
      localStorage.setItem('horizon_hr_user_secure', JSON.stringify(updatedUser));
      addAuditLog('2FA_VERIFIED', 'SECURITY', { userId: user.id });
    }
    
    return isValid;
  };

  const impersonateUser = async (targetUserId: string): Promise<boolean> => {
    if (!user || !hasPermission('*')) {
      return false;
    }

    const targetUser = Object.values(mockUsers).find(u => u.user.id === targetUserId)?.user;
    if (!targetUser) {
      return false;
    }

    setOriginalUser(user);
    setUser(targetUser);
    setIsImpersonating(true);
    
    addAuditLog('IMPERSONATION_START', 'ADMIN', { 
      originalUserId: user.id, 
      targetUserId,
      timestamp: new Date() 
    });

    return true;
  };

  const stopImpersonation = () => {
    if (originalUser && isImpersonating) {
      addAuditLog('IMPERSONATION_END', 'ADMIN', { 
        originalUserId: originalUser.id, 
        targetUserId: user?.id,
        timestamp: new Date() 
      });
      
      setUser(originalUser);
      setOriginalUser(null);
      setIsImpersonating(false);
    }
  };

  const updateAvatar = (newAvatarUrl: string) => {
    if (user) {
      const updatedUser = { ...user, avatar: newAvatarUrl };
      setUser(updatedUser);
      localStorage.setItem('horizon_hr_user_secure', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isLoading, 
      sessionTimeLeft,
      hasPermission, 
      canAccess,
      enable2FA,
      verify2FA,
      auditLogs,
      addAuditLog,
      impersonateUser,
      isImpersonating,
      originalUser,
      stopImpersonation,
      updateAvatar
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 