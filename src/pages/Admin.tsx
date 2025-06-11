import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { 
  UsersIcon, 
  PlusIcon, 
  EditIcon, 
  TrashIcon, 
  ShieldIcon,
  KeyIcon,
  EyeIcon,
  EyeOffIcon,
  SearchIcon,
  FilterIcon,
  UserCheckIcon,
  MailIcon,
  PhoneIcon,
  Building2Icon,
  CalendarIcon,
  ShieldCheckIcon,
  AlertTriangleIcon,
  CheckIcon,
  XIcon
} from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'System Administrator' | 'HR Manager' | 'Employee';
  department: string;
  phone: string;
  joinDate: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  lastLogin: string;
  is2FAEnabled: boolean;
  permissions: string[];
  securityLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  avatar?: string;
  hasTemporaryPassword?: boolean;
  passwordExpiresAt?: Date;
  generatedPassword?: string; // For demo purposes only
}

interface NewUserForm {
  name: string;
  email: string;
  role: string;
  department: string;
  phone: string;
  permissions: string[];
  securityLevel: string;
  is2FARequired: boolean;
}

export default function Admin() {
  const { user, hasPermission, addAuditLog } = useAuth();
  const [activeTab, setActiveTab] = useState("users");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Check if user has admin permissions
  if (!user || !hasPermission('system.admin')) {
    return (
      <div className="space-y-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <ShieldIcon className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-red-800 mb-2">Admin Panel Access Restricted</h2>
            <p className="text-red-600 mb-4">
              The Admin Panel is exclusively available to System Administrators only.
            </p>
            <div className="text-sm text-red-500 bg-red-100 p-3 rounded-lg">
              <p className="font-medium mb-1">Access Requirements:</p>
              <p>• Role: System Administrator</p>
              <p>• Permission: system.admin</p>
              <p>• Current Role: {user?.role || 'Not authenticated'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Initial form state
  const [newUserForm, setNewUserForm] = useState<NewUserForm>({
    name: "",
    email: "",
    role: "",
    department: "",
    phone: "",
    permissions: [],
    securityLevel: "MEDIUM",
    is2FARequired: false
  });

  // Sample admin users data (in production this would come from API) - Updated to 3 roles only
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([
    {
      id: "1",
      name: "Sarah Akol",
      email: "admin@horizonbankss.com",
      role: "HR Manager",
      department: "Human Resources",
      phone: "+211 123 456 789",
      joinDate: "2021-03-15",
      status: "Active",
      lastLogin: "2025-01-20 14:30:00",
      is2FAEnabled: false,
      permissions: [
        // Consolidated permissions from all HR-related roles
        "recruitment.create", "recruitment.edit", "recruitment.view", "candidates.manage", "interviews.schedule",
        "team.view", "team.manage", "leave.approve", "performance.evaluate", "training.view", "training.manage",
        "payroll.view", "payroll.manage", "finance.approve", "taxes.manage", "reports.financial", "compliance.financial",
        "goals.manage", "compliance.view", "communications.view", "users.view", "reports.view", "compliance.manage"
      ],
      securityLevel: "CRITICAL",
      avatar: "/placeholder-avatar.png"
    },
    {
      id: "3",
      name: "Grace Ajak",
      email: "employee@horizonbankss.com",
      role: "Employee",
      department: "Personal Banking",
      phone: "+211 555 888 999",
      joinDate: "2020-06-10",
      status: "Active",
      lastLogin: "2025-01-19 16:45:00",
      is2FAEnabled: false,
      permissions: ["profile.view", "password.change", "performance.view", "certificates.download", "courses.view", "courses.resume", "courses.complete", "leave.request", "payslips.view", "training.view", "training.enroll", "communications.view"],
      securityLevel: "MEDIUM"
    },
    {
      id: "4",
      name: "Tech Administrator",
      email: "sysadmin@horizonbankss.com",
      role: "System Administrator",
      department: "Information Technology",
      phone: "+211 444 777 555",
      joinDate: "2021-09-05",
      status: "Active",
      lastLogin: "2025-01-20 09:20:00",
      is2FAEnabled: true,
      permissions: ["system.admin", "users.manage", "logs.view", "backup.manage", "security.configure", "communications.view"],
      securityLevel: "CRITICAL"
    }
  ]);

  // Permission templates based on roles - Updated to 3 roles only
  const rolePermissions = {
    "HR Manager": [
      // Consolidated permissions from HR Manager, Department Head, Recruiter, and Finance Officer
      "recruitment.create", "recruitment.edit", "recruitment.view", "candidates.manage", "interviews.schedule",
      "team.view", "team.manage", "leave.approve", "performance.evaluate", "training.view", "training.manage",
      "payroll.view", "payroll.manage", "finance.approve", "taxes.manage", "reports.financial", "compliance.financial",
      "goals.manage", "compliance.view", "communications.view", "users.view", "reports.view", "compliance.manage"
    ],
    "Employee": ["profile.view", "password.change", "performance.view", "certificates.download", "courses.view", "courses.resume", "courses.complete", "leave.request", "payslips.view", "training.view", "training.enroll", "communications.view"],
    "System Administrator": ["system.admin", "users.manage", "logs.view", "backup.manage", "security.configure", "communications.view"]
  };

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Inactive": return "bg-gray-100 text-gray-800";
      case "Suspended": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case "CRITICAL": return "bg-red-100 text-red-800";
      case "HIGH": return "bg-orange-100 text-orange-800";
      case "MEDIUM": return "bg-yellow-100 text-yellow-800";
      case "LOW": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const validateEmail = (email: string) => {
    return email.includes('@horizonbankss.com');
  };

  // Password generation function
  const generateSecurePassword = (): string => {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;
    
    let password = '';
    
    // Ensure at least one character from each category
    password += uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
    password += lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
    password += numberChars[Math.floor(Math.random() * numberChars.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];
    
    // Fill the rest randomly to make it 12 characters total
    for (let i = 4; i < 12; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  };

  // Simulate email sending
  const sendPasswordEmail = async (email: string, password: string, name: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In production, this would integrate with your email service
    console.log(`
=== EMAIL SIMULATION ===
To: ${email}
Subject: Your Horizon Bank HR System Account

Dear ${name},

Your account has been created in the Horizon Bank HR System.

Login Details:
Email: ${email}
Temporary Password: ${password}

Important:
- This is a temporary password that expires in 24 hours
- Please log in and change your password immediately
- For security reasons, this password cannot be recovered

Login URL: http://localhost:8084/login

Best regards,
Horizon Bank IT Department
========================
    `);
    
    return true; // Simulate successful email sending
  };

  // Event handlers
  const handleCreateUser = async () => {
    if (!validateEmail(newUserForm.email)) {
      alert('Email must be a valid Horizon Bank email (@horizonbankss.com)');
      return;
    }

    // Check if email already exists
    const emailExists = adminUsers.some(user => user.email === newUserForm.email);
    if (emailExists) {
      alert('An account with this email already exists');
      return;
    }

    // Generate secure password
    const generatedPassword = generateSecurePassword();
    const passwordExpirationTime = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours from now

    const newUser: AdminUser = {
      id: Date.now().toString(),
      name: newUserForm.name,
      email: newUserForm.email,
      role: newUserForm.role as AdminUser['role'],
      department: newUserForm.department,
      phone: newUserForm.phone,
      joinDate: new Date().toISOString().split('T')[0],
      status: "Active",
      lastLogin: "Never",
      is2FAEnabled: newUserForm.is2FARequired,
      permissions: rolePermissions[newUserForm.role as keyof typeof rolePermissions] || [],
      securityLevel: newUserForm.securityLevel as AdminUser['securityLevel'],
      hasTemporaryPassword: true,
      passwordExpiresAt: passwordExpirationTime,
      generatedPassword: generatedPassword // For demo purposes only - remove in production
    };

    try {
      // Send password via email
      const emailSent = await sendPasswordEmail(newUser.email, generatedPassword, newUser.name);
      
      if (emailSent) {
        setAdminUsers([...adminUsers, newUser]);
        setShowCreateDialog(false);
        setNewUserForm({
          name: "",
          email: "",
          role: "",
          department: "",
          phone: "",
          permissions: [],
          securityLevel: "MEDIUM",
          is2FARequired: false
        });

        if (addAuditLog) {
          addAuditLog('USER_CREATED', 'ADMIN', {
            action: 'user_created',
            targetUserId: newUser.id,
            targetUserEmail: newUser.email,
            targetUserRole: newUser.role,
            createdBy: user?.email,
            temporaryPassword: true,
            passwordExpiresAt: passwordExpirationTime
          });
        }

        alert(`✅ User ${newUser.name} created successfully!\n\n🔐 A secure password has been generated and sent to ${newUser.email}\n\n⏰ The user has 24 hours to log in and change their password.\n\n📧 Check the browser console to see the simulated email.`);
      } else {
        alert('Failed to send password email. Please try again.');
      }
    } catch (error) {
      alert('Error creating user account. Please try again.');
      console.error('User creation error:', error);
    }
  };

  const handleEditUser = (userToEdit: AdminUser) => {
    setSelectedUser(userToEdit);
    setShowEditDialog(true);
  };

  const handleUpdateUser = () => {
    if (!selectedUser) return;

    setAdminUsers(adminUsers.map(u => 
      u.id === selectedUser.id ? selectedUser : u
    ));
    setShowEditDialog(false);
    setSelectedUser(null);

    if (addAuditLog) {
      addAuditLog('USER_UPDATED', 'ADMIN', {
        action: 'user_updated',
        targetUserId: selectedUser.id,
        targetUserEmail: selectedUser.email,
        updatedBy: user?.email
      });
    }

    alert('User updated successfully!');
  };

  const handleDeleteUser = (userToDelete: AdminUser) => {
    setSelectedUser(userToDelete);
    setShowDeleteDialog(true);
  };

  const confirmDeleteUser = () => {
    if (!selectedUser) return;

    setAdminUsers(adminUsers.filter(u => u.id !== selectedUser.id));
    setShowDeleteDialog(false);

    if (addAuditLog) {
      addAuditLog('USER_DELETED', 'ADMIN', {
        action: 'user_deleted',
        targetUserId: selectedUser.id,
        targetUserEmail: selectedUser.email,
        deletedBy: user?.email
      });
    }

    alert(`User ${selectedUser.name} deleted successfully!`);
    setSelectedUser(null);
  };

  const handleRoleChange = (role: string) => {
    setNewUserForm({
      ...newUserForm,
      role,
      permissions: rolePermissions[role as keyof typeof rolePermissions] || []
    });
  };

  // Filter users based on search and filters
  const filteredUsers = adminUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || !roleFilter || user.role === roleFilter;
    const matchesStatus = statusFilter === "all" || !statusFilter || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">Manage system users and accounts (excluding employees)</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowCreateDialog(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Create New Account
          </Button>
        </div>
      </div>

      {/* Admin Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Admin Users</p>
                <p className="text-3xl font-bold text-gray-900">{adminUsers.length}</p>
                <p className="text-xs text-gray-500">Excluding employees</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <UsersIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-3xl font-bold text-gray-900">
                  {adminUsers.filter(u => u.status === 'Active').length}
                </p>
                <p className="text-xs text-gray-500">Currently active</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <UserCheckIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">2FA Enabled</p>
                <p className="text-3xl font-bold text-gray-900">
                  {adminUsers.filter(u => u.is2FAEnabled).length}
                </p>
                <p className="text-xs text-gray-500">Security enhanced</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <ShieldCheckIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Critical Access</p>
                <p className="text-3xl font-bold text-gray-900">
                  {adminUsers.filter(u => u.securityLevel === 'CRITICAL').length}
                </p>
                <p className="text-xs text-gray-500">High security users</p>
              </div>
              <div className="p-3 rounded-full bg-red-100">
                <AlertTriangleIcon className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="HR Manager">HR Manager</SelectItem>
                  <SelectItem value="Employee">Employee</SelectItem>
                  <SelectItem value="System Administrator">System Administrator</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">System Users</CardTitle>
          <CardDescription>Manage all administrative accounts and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((adminUser) => (
              <Card key={adminUser.id} className="border">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <Avatar className="h-12 w-12 shrink-0">
                        <AvatarImage src={adminUser.avatar} />
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {adminUser.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 space-y-2 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-gray-900 truncate">{adminUser.name}</h3>
                          <Badge className={getStatusColor(adminUser.status)}>
                            {adminUser.status}
                          </Badge>
                          <Badge className={getSecurityLevelColor(adminUser.securityLevel)}>
                            {adminUser.securityLevel}
                          </Badge>
                          {adminUser.is2FAEnabled && (
                            <ShieldCheckIcon className="h-4 w-4 text-green-600 shrink-0" />
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2 min-w-0">
                            <MailIcon className="h-4 w-4 shrink-0" />
                            <span className="truncate">{adminUser.email}</span>
                          </div>
                          <div className="flex items-center gap-2 min-w-0">
                            <Building2Icon className="h-4 w-4 shrink-0" />
                            <span className="truncate">{adminUser.role} • {adminUser.department}</span>
                          </div>
                          <div className="flex items-center gap-2 min-w-0">
                            <CalendarIcon className="h-4 w-4 shrink-0" />
                            <span className="truncate">Last login: {adminUser.lastLogin}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs text-gray-500 shrink-0">Permissions:</span>
                          <div className="flex gap-1 flex-wrap min-w-0">
                            {adminUser.permissions.slice(0, 3).map((permission, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {permission === '*' ? 'Full Access' : permission}
                              </Badge>
                            ))}
                            {adminUser.permissions.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{adminUser.permissions.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 shrink-0 lg:flex-col lg:w-auto">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditUser(adminUser)}
                        className="flex-1 lg:flex-none lg:w-full min-w-[80px]"
                      >
                        <EditIcon className="h-4 w-4 lg:mr-2" />
                        <span className="hidden lg:inline">Edit</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteUser(adminUser)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1 lg:flex-none lg:w-full min-w-[80px]"
                      >
                        <TrashIcon className="h-4 w-4 lg:mr-2" />
                        <span className="hidden lg:inline">Delete</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Admin Account</DialogTitle>
            <DialogDescription>
              Create a new administrative account with proper permissions and credentials
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({...newUserForm, name: e.target.value})}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUserForm.email}
                  onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})}
                  placeholder="user@horizonbankss.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={newUserForm.role} onValueChange={handleRoleChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HR Manager">HR Manager</SelectItem>
                    <SelectItem value="Employee">Employee</SelectItem>
                    <SelectItem value="System Administrator">System Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input
                  id="department"
                  value={newUserForm.department}
                  onChange={(e) => setNewUserForm({...newUserForm, department: e.target.value})}
                  placeholder="Enter department"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={newUserForm.phone}
                onChange={(e) => setNewUserForm({...newUserForm, phone: e.target.value})}
                placeholder="+211 XXX XXX XXX"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="securityLevel">Security Level</Label>
                <Select 
                  value={newUserForm.securityLevel} 
                  onValueChange={(value) => setNewUserForm({...newUserForm, securityLevel: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select security level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="CRITICAL">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Security Options</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="2fa"
                    checked={newUserForm.is2FARequired}
                    onCheckedChange={(checked) => setNewUserForm({...newUserForm, is2FARequired: checked})}
                  />
                  <Label htmlFor="2fa">Require 2FA</Label>
                </div>
              </div>
            </div>

            {newUserForm.permissions.length > 0 && (
              <div className="space-y-2">
                <Label>Assigned Permissions</Label>
                <div className="flex gap-1 flex-wrap">
                  {newUserForm.permissions.map((permission, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {permission === '*' ? 'Full System Access' : permission}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Alert>
              <AlertTriangleIcon className="h-4 w-4" />
              <AlertDescription className="text-xs">
                A secure 12-character password will be automatically generated and sent to the user's email.
                Email must be a valid Horizon Bank domain (@horizonbankss.com).
                The user will have 24 hours to log in and change their password.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateUser}>
              Create Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit User Account</DialogTitle>
            <DialogDescription>
              Update user information and permissions
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editName">Full Name</Label>
                  <Input
                    id="editName"
                    value={selectedUser.name}
                    onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editEmail">Email Address</Label>
                  <Input
                    id="editEmail"
                    value={selectedUser.email}
                    onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editRole">Role</Label>
                  <Select 
                    value={selectedUser.role} 
                    onValueChange={(value: AdminUser['role']) => setSelectedUser({
                      ...selectedUser, 
                      role: value,
                      permissions: rolePermissions[value] || []
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HR Manager">HR Manager</SelectItem>
                      <SelectItem value="Employee">Employee</SelectItem>
                      <SelectItem value="System Administrator">System Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editStatus">Status</Label>
                  <Select 
                    value={selectedUser.status} 
                    onValueChange={(value: AdminUser['status']) => setSelectedUser({...selectedUser, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editDepartment">Department</Label>
                  <Input
                    id="editDepartment"
                    value={selectedUser.department}
                    onChange={(e) => setSelectedUser({...selectedUser, department: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editPhone">Phone Number</Label>
                  <Input
                    id="editPhone"
                    value={selectedUser.phone}
                    onChange={(e) => setSelectedUser({...selectedUser, phone: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editSecurityLevel">Security Level</Label>
                  <Select 
                    value={selectedUser.securityLevel} 
                    onValueChange={(value: AdminUser['securityLevel']) => setSelectedUser({...selectedUser, securityLevel: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="CRITICAL">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Security Options</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="edit2fa"
                      checked={selectedUser.is2FAEnabled}
                      onCheckedChange={(checked) => setSelectedUser({...selectedUser, is2FAEnabled: checked})}
                    />
                    <Label htmlFor="edit2fa">2FA Enabled</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Current Permissions</Label>
                <div className="flex gap-1 flex-wrap">
                  {selectedUser.permissions.map((permission, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {permission === '*' ? 'Full System Access' : permission}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateUser}>
              Update Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedUser.avatar} />
                  <AvatarFallback className="bg-red-100 text-red-700">
                    {selectedUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium text-red-900">{selectedUser.name}</h4>
                  <p className="text-sm text-red-700">{selectedUser.email}</p>
                  <p className="text-xs text-red-600">{selectedUser.role} • {selectedUser.department}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteUser}>
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 