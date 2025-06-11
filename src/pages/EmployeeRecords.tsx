import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { 
  PlusIcon, 
  SearchIcon, 
  FilterIcon, 
  MoreVerticalIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  CreditCardIcon,
  DollarSignIcon,
  ShieldIcon,
  EditIcon,
  TrashIcon,
  EyeIcon,
  UserIcon,
  CalendarIcon,
  BriefcaseIcon,
  LogOutIcon
} from "lucide-react";
import ExitManagement from "@/components/ExitManagement";
import { Checkbox } from "@/components/ui/checkbox";

// Employee interface
interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  status: string;
  joinDate: string;
  avatar?: string;
  location: string;
  bankingRole: string;
  salary?: string;
  emergencyContact?: string;
  address?: string;
  nationalId?: string;
  birthDate?: string;
  education?: string;
  manager?: string;
}

// Comprehensive Employee interface matching Payroll.tsx
interface ComprehensiveEmployee {
  id: string;
  // Personal Information
  personalInfo: {
    firstName: string;
    lastName: string;
    fullName: string;
    gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
    nationality: string;
    dateOfBirth: string;
    maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed' | 'Other';
    religion?: string;
  };
  // Identity Documents
  identityInfo: {
    nationalId?: string;
    passportNumber?: string;
    workPermitNumber?: string;
    immigrationStatus: 'National' | 'Work Permit' | 'Resident' | 'Temporary Visa' | 'Other';
    workPermitExpiry?: string;
    visaExpiry?: string;
  };
  // Employment Details
  employmentInfo: {
    employeeId: string;
    contractType: 'Permanent' | 'Temporary' | 'Probationary' | 'Contract' | 'Internship';
    jobTitle: string;
    jobDescription: string;
    department: string;
    directSupervisor?: string;
    workLocation: string;
    employmentStartDate: string;
    probationEndDate?: string;
    contractEndDate?: string;
    terminationDate?: string;
    terminationReason?: string;
    employmentStatus: 'Active' | 'On Leave' | 'Suspended' | 'Terminated' | 'Resigned';
  };
  // Compensation & Benefits
  compensationInfo: {
    salaryStructure: {
      baseSalary: number;
      currency: string;
      payFrequency: 'Monthly' | 'Bi-weekly' | 'Weekly';
      allowances: {
        transport: number;
        medical: number;
        housing: number;
        meal: number;
        communication: number;
        other: number;
      };
    };
    benefits: {
      medicalInsurance: boolean;
      lifeInsurance: boolean;
      pensionScheme: boolean;
      annualLeave: number;
      sickLeave: number;
      maternityLeave: number;
      paternityLeave: number;
    };
    taxInfo: {
      taxId?: string;
      taxExemptions: number;
      socialSecurityNumber?: string;
    };
  };
  // Banking & Payment
  bankingInfo: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    bankBranch?: string;
    swiftCode?: string;
    paymentMethod: 'Bank Transfer' | 'Cash' | 'Check' | 'Mobile Money';
    mobileMoneyNumber?: string;
  };
  // Contact Information
  contactInfo: {
    personalEmail?: string;
    workEmail: string;
    personalPhone: string;
    workPhone?: string;
    address: {
      street: string;
      city: string;
      state: string;
      postalCode?: string;
      country: string;
    };
    emergencyContacts: EmergencyContact[];
  };
  // System Info
  systemInfo: {
    createdBy: string;
    createdDate: string;
    lastUpdatedBy?: string;
    lastUpdatedDate?: string;
    profileCompletionPercentage: number;
  };
}

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  address?: string;
  isPrimary: boolean;
}

export default function EmployeeRecords() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [exitingEmployee, setExitingEmployee] = useState<Employee | null>(null);
  const [activeTab, setActiveTab] = useState("basic");
  
  const { user, hasPermission, addAuditLog } = useAuth();

  // Employee form state
  const [employeeForm, setEmployeeForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    status: "Active",
    location: "Juba, South Sudan",
    bankingRole: "",
    salary: "",
    emergencyContact: "",
    address: "",
    nationalId: "",
    birthDate: "",
    education: "",
    manager: ""
  });

  // Comprehensive Employee Form State
  const [employeeFormStep, setEmployeeFormStep] = useState(1);
  const [comprehensiveEmployeeForm, setComprehensiveEmployeeForm] = useState<Partial<ComprehensiveEmployee>>({
    personalInfo: {
      firstName: '',
      lastName: '',
      fullName: '',
      gender: 'Male',
      nationality: '',
      dateOfBirth: '',
      maritalStatus: 'Single',
      religion: ''
    },
    identityInfo: {
      nationalId: '',
      passportNumber: '',
      workPermitNumber: '',
      immigrationStatus: 'National',
      workPermitExpiry: '',
      visaExpiry: ''
    },
    employmentInfo: {
      employeeId: '',
      contractType: 'Permanent',
      jobTitle: '',
      jobDescription: '',
      department: '',
      directSupervisor: '',
      workLocation: '',
      employmentStartDate: '',
      probationEndDate: '',
      contractEndDate: '',
      terminationDate: '',
      terminationReason: '',
      employmentStatus: 'Active'
    },
    compensationInfo: {
      salaryStructure: {
        baseSalary: 0,
        currency: 'USD',
        payFrequency: 'Monthly',
        allowances: {
          transport: 0,
          medical: 0,
          housing: 0,
          meal: 0,
          communication: 0,
          other: 0
        }
      },
      benefits: {
        medicalInsurance: false,
        lifeInsurance: false,
        pensionScheme: false,
        annualLeave: 21,
        sickLeave: 10,
        maternityLeave: 90,
        paternityLeave: 10
      },
      taxInfo: {
        taxId: '',
        taxExemptions: 0,
        socialSecurityNumber: ''
      }
    },
    bankingInfo: {
      bankName: '',
      accountNumber: '',
      accountName: '',
      bankBranch: '',
      swiftCode: '',
      paymentMethod: 'Bank Transfer',
      mobileMoneyNumber: ''
    },
    contactInfo: {
      personalEmail: '',
      workEmail: '',
      personalPhone: '',
      workPhone: '',
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
      },
      emergencyContacts: []
    },
    systemInfo: {
      createdBy: user?.name || '',
      createdDate: new Date().toISOString(),
      lastUpdatedBy: '',
      lastUpdatedDate: '',
      profileCompletionPercentage: 0
    }
  });

  // Enhanced employee data with additional fields
  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: 1,
      name: "Sarah Akol",
      email: "sarah.akol@horizonbankss.com",
      phone: "+211 123 456 789",
      department: "Human Resources",
      position: "HR Manager",
      status: "Active",
      joinDate: "2021-03-15",
      avatar: "/placeholder-avatar.png",
      location: "Juba, South Sudan",
      bankingRole: "Management",
      salary: "$4,500",
      emergencyContact: "+211 987 654 321",
      address: "Block 15, Juba City, South Sudan",
      nationalId: "SS123456789",
      birthDate: "1985-05-20",
      education: "MBA Human Resources",
      manager: "CEO"
    },
    {
      id: 2,
      name: "James Wani",
      email: "james.wani@horizonbankss.com",
      phone: "+211 987 654 321",
      department: "Human Resources",
      position: "Senior Recruiter",
      status: "Active",
      joinDate: "2022-01-20",
      avatar: "/placeholder-avatar.png",
      location: "Juba, South Sudan",
      bankingRole: "Support",
      salary: "$3,200",
      emergencyContact: "+211 456 789 123",
      address: "Block 12, Juba City, South Sudan",
      nationalId: "SS987654321",
      birthDate: "1988-08-12",
      education: "Bachelor's Psychology",
      manager: "Sarah Akol"
    },
    {
      id: 3,
      name: "Mary Deng",
      email: "mary.deng@horizonbankss.com",
      phone: "+211 456 789 123",
      department: "Corporate Banking",
      position: "Department Head - Corporate Banking",
      status: "Active",
      joinDate: "2020-08-10",
      avatar: "/placeholder-avatar.png",
      location: "Juba, South Sudan",
      bankingRole: "Leadership",
      salary: "$5,200",
      emergencyContact: "+211 234 567 890",
      address: "Block 8, Juba City, South Sudan",
      nationalId: "SS456789123",
      birthDate: "1982-11-05",
      education: "Master's Finance",
      manager: "CEO"
    },
    {
      id: 4,
      name: "Peter Garang",
      email: "peter.garang@horizonbankss.com",
      phone: "+211 234 567 890",
      department: "Finance & Accounting",
      position: "Finance Officer",
      status: "Active",
      joinDate: "2021-11-05",
      avatar: "/placeholder-avatar.png",
      location: "Juba, South Sudan",
      bankingRole: "Operations",
      salary: "$3,800",
      emergencyContact: "+211 345 678 901",
      address: "Block 20, Juba City, South Sudan",
      nationalId: "SS234567890",
      birthDate: "1987-02-18",
      education: "Bachelor's Accounting",
      manager: "Finance Director"
    },
    {
      id: 5,
      name: "Grace Ajak",
      email: "grace.ajak@horizonbankss.com",
      phone: "+211 345 678 901",
      department: "Personal Banking",
      position: "Customer Relationship Manager",
      status: "Active",
      joinDate: "2022-04-12",
      avatar: "/placeholder-avatar.png",
      location: "Juba, South Sudan",
      bankingRole: "Customer Service",
      salary: "$2,800",
      emergencyContact: "+211 567 890 123",
      address: "Block 5, Juba City, South Sudan",
      nationalId: "SS345678901",
      birthDate: "1990-07-22",
      education: "Bachelor's Business Administration",
      manager: "Personal Banking Head"
    },
    {
      id: 6,
      name: "Michael Jok",
      email: "michael.jok@horizonbankss.com",
      phone: "+211 567 890 123",
      department: "Trade Finance",
      position: "Trade Finance Officer",
      status: "Active",
      joinDate: "2023-02-28",
      avatar: "/placeholder-avatar.png",
      location: "Juba, South Sudan",
      bankingRole: "Specialist",
      salary: "$3,500",
      emergencyContact: "+211 678 901 234",
      address: "Block 3, Juba City, South Sudan",
      nationalId: "SS567890123",
      birthDate: "1989-12-10",
      education: "Bachelor's Economics",
      manager: "Trade Finance Head"
    },
    {
      id: 7,
      name: "Rebecca Akuoc",
      email: "rebecca.akuoc@horizonbankss.com",
      phone: "+211 678 901 234",
      department: "Risk Management",
      position: "Risk Assessment Manager",
      status: "Active",
      joinDate: "2021-09-15",
      avatar: "/placeholder-avatar.png",
      location: "Juba, South Sudan",
      bankingRole: "Risk & Compliance",
      salary: "$4,200",
      emergencyContact: "+211 789 012 345",
      address: "Block 18, Juba City, South Sudan",
      nationalId: "SS678901234",
      birthDate: "1984-03-28",
      education: "Master's Risk Management",
      manager: "Risk Director"
    },
    {
      id: 8,
      name: "David Majok",
      email: "david.majok@horizonbankss.com",
      phone: "+211 789 012 345",
      department: "Information Technology",
      position: "IT Systems Manager",
      status: "On Leave",
      joinDate: "2020-12-01",
      avatar: "/placeholder-avatar.png",
      location: "Juba, South Sudan",
      bankingRole: "Technology",
      salary: "$4,800",
      emergencyContact: "+211 890 123 456",
      address: "Block 22, Juba City, South Sudan",
      nationalId: "SS789012345",
      birthDate: "1983-09-14",
      education: "Master's Computer Science",
      manager: "IT Director"
    },
    {
      id: 9,
      name: "Anna Nyong",
      email: "anna.nyong@horizonbankss.com",
      phone: "+211 890 123 456",
      department: "Corporate Banking",
      position: "Senior Credit Analyst",
      status: "Active",
      joinDate: "2022-07-08",
      avatar: "/placeholder-avatar.png",
      location: "Juba, South Sudan",
      bankingRole: "Credit Analysis",
      salary: "$3,600",
      emergencyContact: "+211 901 234 567",
      address: "Block 7, Juba City, South Sudan",
      nationalId: "SS890123456",
      birthDate: "1986-01-30",
      education: "Bachelor's Finance",
      manager: "Mary Deng"
    },
    {
      id: 10,
      name: "John Kuol",
      email: "john.kuol@horizonbankss.com",
      phone: "+211 901 234 567",
      department: "Personal Banking",
      position: "Branch Operations Supervisor",
      status: "Active",
      joinDate: "2021-05-20",
      avatar: "/placeholder-avatar.png",
      location: "Wau, South Sudan",
      bankingRole: "Branch Operations",
      salary: "$3,000",
      emergencyContact: "+211 123 456 789",
      address: "Central Wau, South Sudan",
      nationalId: "SS901234567",
      birthDate: "1988-06-15",
      education: "Bachelor's Banking & Finance",
      manager: "Personal Banking Head"
    }
  ]);

  // Employee management functions
  const resetForm = () => {
    setEmployeeForm({
      name: "",
      email: "",
      phone: "",
      department: "",
      position: "",
      status: "Active",
      location: "Juba, South Sudan",
      bankingRole: "",
      salary: "",
      emergencyContact: "",
      address: "",
      nationalId: "",
      birthDate: "",
      education: "",
      manager: ""
    });
    setActiveTab("basic");
  };

  const handleAddEmployee = () => {
    if (!hasPermission('team.manage') && !hasPermission('*')) {
      addAuditLog('UNAUTHORIZED_ACCESS_ATTEMPT', 'EMPLOYEE_MANAGEMENT', { action: 'add_employee' });
      return;
    }
    
    resetForm();
    setShowAddDialog(true);
    addAuditLog('EMPLOYEE_ADD_DIALOG_OPENED', 'EMPLOYEE_MANAGEMENT', { action: 'add_employee_form_opened' });
  };

  const handleEditEmployee = (employee: Employee) => {
    if (!hasPermission('team.manage') && !hasPermission('*')) {
      addAuditLog('UNAUTHORIZED_ACCESS_ATTEMPT', 'EMPLOYEE_MANAGEMENT', { action: 'edit_employee', employeeId: employee.id });
      return;
    }

    setEditingEmployee(employee);
    setEmployeeForm({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      department: employee.department,
      position: employee.position,
      status: employee.status,
      location: employee.location,
      bankingRole: employee.bankingRole,
      salary: employee.salary || "",
      emergencyContact: employee.emergencyContact || "",
      address: employee.address || "",
      nationalId: employee.nationalId || "",
      birthDate: employee.birthDate || "",
      education: employee.education || "",
      manager: employee.manager || ""
    });
    setShowEditDialog(true);
    addAuditLog('EMPLOYEE_EDIT_DIALOG_OPENED', 'EMPLOYEE_MANAGEMENT', { action: 'edit_employee_form_opened', employeeId: employee.id });
  };

  const handleDeleteEmployee = (employeeId: number) => {
    if (!hasPermission('team.manage') && !hasPermission('*')) {
      addAuditLog('UNAUTHORIZED_ACCESS_ATTEMPT', 'EMPLOYEE_MANAGEMENT', { action: 'delete_employee', employeeId });
      return;
    }

    const employeeToDelete = employees.find(emp => emp.id === employeeId);
    setEmployees(employees.filter(emp => emp.id !== employeeId));
    addAuditLog('EMPLOYEE_DELETED', 'EMPLOYEE_MANAGEMENT', { 
      action: 'employee_deleted', 
      employeeId, 
      employeeName: employeeToDelete?.name,
      deletedBy: user?.email 
    });
  };

  const handleSaveEmployee = () => {
    if (editingEmployee) {
      // Update existing employee
      const updatedEmployees = employees.map(emp => 
        emp.id === editingEmployee.id 
          ? { 
              ...emp, 
              ...employeeForm,
              joinDate: emp.joinDate // Keep original join date
            }
          : emp
      );
      setEmployees(updatedEmployees);
      addAuditLog('EMPLOYEE_UPDATED', 'EMPLOYEE_MANAGEMENT', { 
        action: 'employee_updated', 
        employeeId: editingEmployee.id, 
        employeeName: employeeForm.name,
        updatedBy: user?.email 
      });
      setShowEditDialog(false);
      setEditingEmployee(null);
    } else {
      // Create new employee
      const newEmployee: Employee = {
        id: Math.max(...employees.map(e => e.id)) + 1,
        ...employeeForm,
        joinDate: new Date().toISOString().split('T')[0],
        avatar: "/placeholder-avatar.png"
      };
      setEmployees([...employees, newEmployee]);
      addAuditLog('EMPLOYEE_CREATED', 'EMPLOYEE_MANAGEMENT', { 
        action: 'employee_created', 
        employeeId: newEmployee.id, 
        employeeName: employeeForm.name,
        createdBy: user?.email 
      });
      setShowAddDialog(false);
    }
    resetForm();
  };

  const handleToggleEmployeeStatus = (employeeId: number) => {
    if (!hasPermission('team.manage') && !hasPermission('*')) {
      addAuditLog('UNAUTHORIZED_ACCESS_ATTEMPT', 'EMPLOYEE_MANAGEMENT', { action: 'toggle_employee_status', employeeId });
      return;
    }

    const updatedEmployees = employees.map(emp => {
      if (emp.id === employeeId) {
        const newStatus = emp.status === 'Active' ? 'Inactive' : 'Active';
        addAuditLog('EMPLOYEE_STATUS_CHANGED', 'EMPLOYEE_MANAGEMENT', { 
          action: 'employee_status_changed', 
          employeeId, 
          oldStatus: emp.status,
          newStatus,
          changedBy: user?.email 
        });
        return { ...emp, status: newStatus };
      }
      return emp;
    });
    setEmployees(updatedEmployees);
  };

  const handleExitManagement = (employee: Employee) => {
    if (!hasPermission('team.manage') && !hasPermission('*')) {
      addAuditLog('UNAUTHORIZED_ACCESS_ATTEMPT', 'EMPLOYEE_MANAGEMENT', { action: 'exit_management', employeeId: employee.id });
      return;
    }

    setExitingEmployee(employee);
    setShowExitDialog(true);
    addAuditLog('EMPLOYEE_EXIT_MANAGEMENT_DIALOG_OPENED', 'EMPLOYEE_MANAGEMENT', { action: 'exit_management_form_opened', employeeId: employee.id });
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    employee.bankingRole.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getBankingRoleIcon = (role: string) => {
    switch (role) {
      case "Management":
      case "Leadership":
        return <ShieldIcon className="h-4 w-4" />;
      case "Customer Service":
      case "Branch Operations":
        return <MailIcon className="h-4 w-4" />;
      case "Credit Analysis":
      case "Operations":
        return <CreditCardIcon className="h-4 w-4" />;
      case "Risk & Compliance":
        return <ShieldIcon className="h-4 w-4" />;
      default:
        return <DollarSignIcon className="h-4 w-4" />;
    }
  };

  const EmployeeCard = ({ employee }: { employee: Employee }) => (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={employee.avatar} />
            <AvatarFallback className="bg-blue-100 text-blue-700 text-lg">
              {employee.name.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{employee.name}</h3>
                <p className="text-sm text-gray-600">{employee.position}</p>
                <p className="text-xs text-gray-500">{employee.department}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={employee.status === "Active" ? "default" : "secondary"}>
                  {employee.status}
                </Badge>
                {(hasPermission('team.manage') || hasPermission('*')) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVerticalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="end" 
                      className="w-48 z-[100] border border-gray-200 bg-white shadow-lg rounded-md p-1 animate-none"
                      side="bottom"
                      sideOffset={4}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditEmployee(employee);
                        }}
                      >
                        <EditIcon className="mr-2 h-4 w-4" />
                        Edit Employee
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleEmployeeStatus(employee.id);
                        }}
                      >
                        {employee.status === 'Active' ? (
                          <>
                            <UserIcon className="mr-2 h-4 w-4" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <UserIcon className="mr-2 h-4 w-4" />
                            Activate
                          </>
                        )}
                      </DropdownMenuItem>
                      {(user?.role === 'HR Manager' || hasPermission('*')) && (
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleExitManagement(employee);
                          }}
                        >
                          <LogOutIcon className="mr-2 h-4 w-4" />
                          Exit Management
                        </DropdownMenuItem>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem 
                            onSelect={(e) => e.preventDefault()}
                            className="text-red-600 focus:text-red-600"
                          >
                            <TrashIcon className="mr-2 h-4 w-4" />
                            Delete Employee
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Employee Record</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {employee.name}'s employee record? This action cannot be undone and will remove all associated data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => {}}>
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteEmployee(employee.id);
                              }}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {getBankingRoleIcon(employee.bankingRole)}
              <Badge variant="outline" className="text-xs">
                {employee.bankingRole}
              </Badge>
              {employee.salary && (
                <Badge variant="outline" className="text-xs text-green-700 bg-green-50">
                  {employee.salary}
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <MailIcon className="h-4 w-4" />
                <span className="truncate">{employee.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4" />
                <span>{employee.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4" />
                <span>{employee.location}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <CalendarIcon className="h-4 w-4" />
                <span>Joined {employee.joinDate}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <EyeIcon className="mr-2 h-4 w-4" />
            View Profile
          </Button>
          {(hasPermission('team.manage') || hasPermission('*')) && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                handleEditEmployee(employee);
              }}
            >
              <EditIcon className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  // Department statistics for Horizon Bank
  const departmentStats = [
    { name: "Personal Banking", count: 85, color: "bg-blue-500" },
    { name: "Corporate Banking", count: 42, color: "bg-green-500" },
    { name: "Trade Finance", count: 18, color: "bg-purple-500" },
    { name: "Finance & Accounting", count: 25, color: "bg-amber-500" },
    { name: "Operations", count: 35, color: "bg-red-500" },
    { name: "Human Resources", count: 12, color: "bg-pink-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Records</h1>
          <p className="text-gray-600">Manage Horizon Bank staff across all departments</p>
        </div>
        {(hasPermission('team.manage') || hasPermission('*')) && (
          <Button 
            onClick={handleAddEmployee}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        )}
      </div>

      {/* Department Overview */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Department Overview</CardTitle>
          <CardDescription>Staff distribution across Horizon Bank departments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {departmentStats.map((dept) => (
              <div key={dept.name} className="text-center space-y-2">
                <div className={`w-12 h-12 ${dept.color} rounded-full flex items-center justify-center mx-auto`}>
                  <span className="text-white font-bold">{dept.count}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{dept.count}</p>
                  <p className="text-xs text-gray-500">{dept.name}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search and Controls */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
              <Input
                placeholder="Search by name, department, position, or banking role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <FilterIcon className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <div className="flex border rounded-lg p-1 bg-gray-100">
                <Button
                  variant={viewMode === "cards" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("cards")}
                  className="text-xs"
                >
                  Cards
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                  className="text-xs"
                >
                  Table
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Showing {filteredEmployees.length} of {employees.length} Horizon Bank employees
      </div>

      {/* Employee List */}
      {viewMode === "cards" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredEmployees.map((employee) => (
            <EmployeeCard key={employee.id} employee={employee} />
          ))}
        </div>
      ) : (
        <Card className="border-0 shadow-md">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-100">
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Banking Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id} className="border-b border-gray-50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={employee.avatar} />
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            {employee.name.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{employee.name}</p>
                          <p className="text-sm text-gray-500">{employee.position}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getBankingRoleIcon(employee.bankingRole)}
                        <span className="text-sm">{employee.bankingRole}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={employee.status === "Active" ? "default" : "secondary"}>
                        {employee.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{employee.location}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {(hasPermission('team.manage') || hasPermission('*')) && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVerticalIcon className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent 
                              align="end" 
                              className="w-48 z-[100] border border-gray-200 bg-white shadow-lg rounded-md p-1 animate-none"
                              side="bottom"
                              sideOffset={4}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditEmployee(employee);
                                }}
                              >
                                <EditIcon className="mr-2 h-4 w-4" />
                                Edit Employee
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleEmployeeStatus(employee.id);
                                }}
                              >
                                {employee.status === 'Active' ? (
                                  <>
                                    <UserIcon className="mr-2 h-4 w-4" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <UserIcon className="mr-2 h-4 w-4" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              {(user?.role === 'HR Manager' || hasPermission('*')) && (
                                <DropdownMenuItem 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleExitManagement(employee);
                                  }}
                                >
                                  <LogOutIcon className="mr-2 h-4 w-4" />
                                  Exit Management
                                </DropdownMenuItem>
                              )}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem 
                                    onSelect={(e) => e.preventDefault()}
                                    className="text-red-600 focus:text-red-600"
                                  >
                                    <TrashIcon className="mr-2 h-4 w-4" />
                                    Delete Employee
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Employee Record</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete {employee.name}'s employee record? This action cannot be undone and will remove all associated data.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => {}}>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteEmployee(employee.id);
                                      }}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Add Employee Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>
              Create a comprehensive employee profile with all required information
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Step Indicator */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-4">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      employeeFormStep >= step 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step}
                    </div>
                    {step < 5 && (
                      <div className={`w-8 h-1 mx-2 ${
                        employeeFormStep > step ? 'bg-blue-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-sm text-gray-600">
                Step {employeeFormStep} of 5
              </div>
            </div>

            {/* Step 1: Personal Information */}
            {employeeFormStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={comprehensiveEmployeeForm.personalInfo?.firstName || ''}
                      onChange={(e) => setComprehensiveEmployeeForm({
                        ...comprehensiveEmployeeForm,
                        personalInfo: {
                          ...comprehensiveEmployeeForm.personalInfo!,
                          firstName: e.target.value,
                          fullName: `${e.target.value} ${comprehensiveEmployeeForm.personalInfo?.lastName || ''}`.trim()
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={comprehensiveEmployeeForm.personalInfo?.lastName || ''}
                      onChange={(e) => setComprehensiveEmployeeForm({
                        ...comprehensiveEmployeeForm,
                        personalInfo: {
                          ...comprehensiveEmployeeForm.personalInfo!,
                          lastName: e.target.value,
                          fullName: `${comprehensiveEmployeeForm.personalInfo?.firstName || ''} ${e.target.value}`.trim()
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select 
                      value={comprehensiveEmployeeForm.personalInfo?.gender} 
                      onValueChange={(value: any) => setComprehensiveEmployeeForm({
                        ...comprehensiveEmployeeForm,
                        personalInfo: { ...comprehensiveEmployeeForm.personalInfo!, gender: value }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality *</Label>
                    <Input
                      id="nationality"
                      value={comprehensiveEmployeeForm.personalInfo?.nationality || ''}
                      onChange={(e) => setComprehensiveEmployeeForm({
                        ...comprehensiveEmployeeForm,
                        personalInfo: { ...comprehensiveEmployeeForm.personalInfo!, nationality: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={comprehensiveEmployeeForm.personalInfo?.dateOfBirth || ''}
                      onChange={(e) => setComprehensiveEmployeeForm({
                        ...comprehensiveEmployeeForm,
                        personalInfo: { ...comprehensiveEmployeeForm.personalInfo!, dateOfBirth: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maritalStatus">Marital Status</Label>
                    <Select 
                      value={comprehensiveEmployeeForm.personalInfo?.maritalStatus} 
                      onValueChange={(value: any) => setComprehensiveEmployeeForm({
                        ...comprehensiveEmployeeForm,
                        personalInfo: { ...comprehensiveEmployeeForm.personalInfo!, maritalStatus: value }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Divorced">Divorced</SelectItem>
                        <SelectItem value="Widowed">Widowed</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-md font-semibold text-gray-800">Identity Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nationalId">National ID</Label>
                      <Input
                        id="nationalId"
                        value={comprehensiveEmployeeForm.identityInfo?.nationalId || ''}
                        onChange={(e) => setComprehensiveEmployeeForm({
                          ...comprehensiveEmployeeForm,
                          identityInfo: { ...comprehensiveEmployeeForm.identityInfo!, nationalId: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passportNumber">Passport Number</Label>
                      <Input
                        id="passportNumber"
                        value={comprehensiveEmployeeForm.identityInfo?.passportNumber || ''}
                        onChange={(e) => setComprehensiveEmployeeForm({
                          ...comprehensiveEmployeeForm,
                          identityInfo: { ...comprehensiveEmployeeForm.identityInfo!, passportNumber: e.target.value }
                        })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="immigrationStatus">Immigration Status *</Label>
                      <Select 
                        value={comprehensiveEmployeeForm.identityInfo?.immigrationStatus} 
                        onValueChange={(value: any) => setComprehensiveEmployeeForm({
                          ...comprehensiveEmployeeForm,
                          identityInfo: { ...comprehensiveEmployeeForm.identityInfo!, immigrationStatus: value }
                        })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="National">National</SelectItem>
                          <SelectItem value="Work Permit">Work Permit</SelectItem>
                          <SelectItem value="Resident">Resident</SelectItem>
                          <SelectItem value="Temporary Visa">Temporary Visa</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="workPermitNumber">Work Permit Number</Label>
                      <Input
                        id="workPermitNumber"
                        value={comprehensiveEmployeeForm.identityInfo?.workPermitNumber || ''}
                        onChange={(e) => setComprehensiveEmployeeForm({
                          ...comprehensiveEmployeeForm,
                          identityInfo: { ...comprehensiveEmployeeForm.identityInfo!, workPermitNumber: e.target.value }
                        })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Identity Information */}
            {employeeFormStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Identity Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="religion">Religion</Label>
                    <Input
                      id="religion"
                      value={comprehensiveEmployeeForm.personalInfo?.religion || ''}
                      onChange={(e) => setComprehensiveEmployeeForm({
                        ...comprehensiveEmployeeForm,
                        personalInfo: { ...comprehensiveEmployeeForm.personalInfo!, religion: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality *</Label>
                    <Input
                      id="nationality"
                      value={comprehensiveEmployeeForm.personalInfo?.nationality || ''}
                      onChange={(e) => setComprehensiveEmployeeForm({
                        ...comprehensiveEmployeeForm,
                        personalInfo: { ...comprehensiveEmployeeForm.personalInfo!, nationality: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={comprehensiveEmployeeForm.personalInfo?.dateOfBirth || ''}
                      onChange={(e) => setComprehensiveEmployeeForm({
                        ...comprehensiveEmployeeForm,
                        personalInfo: { ...comprehensiveEmployeeForm.personalInfo!, dateOfBirth: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maritalStatus">Marital Status</Label>
                    <Select 
                      value={comprehensiveEmployeeForm.personalInfo?.maritalStatus} 
                      onValueChange={(value: any) => setComprehensiveEmployeeForm({
                        ...comprehensiveEmployeeForm,
                        personalInfo: { ...comprehensiveEmployeeForm.personalInfo!, maritalStatus: value }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Divorced">Divorced</SelectItem>
                        <SelectItem value="Widowed">Widowed</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Employment Details */}
            {employeeFormStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Employment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contractType">Contract Type *</Label>
                    <Select 
                      value={comprehensiveEmployeeForm.employmentInfo?.contractType} 
                      onValueChange={(value) => setComprehensiveEmployeeForm({
                        ...comprehensiveEmployeeForm,
                        employmentInfo: { ...comprehensiveEmployeeForm.employmentInfo!, contractType: value }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Permanent">Permanent</SelectItem>
                        <SelectItem value="Temporary">Temporary</SelectItem>
                        <SelectItem value="Probationary">Probationary</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title *</Label>
                    <Input
                      id="jobTitle"
                      value={comprehensiveEmployeeForm.employmentInfo?.jobTitle || ''}
                      onChange={(e) => setComprehensiveEmployeeForm({
                        ...comprehensiveEmployeeForm,
                        employmentInfo: { ...comprehensiveEmployeeForm.employmentInfo!, jobTitle: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobDescription">Job Description</Label>
                    <Textarea
                      id="jobDescription"
                      value={comprehensiveEmployeeForm.employmentInfo?.jobDescription || ''}
                      onChange={(e) => setComprehensiveEmployeeForm({
                        ...comprehensiveEmployeeForm,
                        employmentInfo: { ...comprehensiveEmployeeForm.employmentInfo!, jobDescription: e.target.value }
                      })}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Input
                      id="department"
                      value={comprehensiveEmployeeForm.employmentInfo?.department || ''}
                      onChange={(e) => setComprehensiveEmployeeForm({
                        ...comprehensiveEmployeeForm,
                        employmentInfo: { ...comprehensiveEmployeeForm.employmentInfo!, department: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="directSupervisor">Direct Supervisor</Label>
                    <Input
                      id="directSupervisor"
                      value={comprehensiveEmployeeForm.employmentInfo?.directSupervisor || ''}
                      onChange={(e) => setComprehensiveEmployeeForm({
                        ...comprehensiveEmployeeForm,
                        employmentInfo: { ...comprehensiveEmployeeForm.employmentInfo!, directSupervisor: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workLocation">Work Location *</Label>
                    <Input
                      id="workLocation"
                      value={comprehensiveEmployeeForm.employmentInfo?.workLocation || ''}
                      onChange={(e) => setComprehensiveEmployeeForm({
                        ...comprehensiveEmployeeForm,
                        employmentInfo: { ...comprehensiveEmployeeForm.employmentInfo!, workLocation: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employmentStartDate">Employment Start Date *</Label>
                    <Input
                      id="employmentStartDate"
                      type="date"
                      value={comprehensiveEmployeeForm.employmentInfo?.employmentStartDate || ''}
                      onChange={(e) => setComprehensiveEmployeeForm({
                        ...comprehensiveEmployeeForm,
                        employmentInfo: { ...comprehensiveEmployeeForm.employmentInfo!, employmentStartDate: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="probationEndDate">Probation End Date</Label>
                    <Input
                      id="probationEndDate"
                      type="date"
                      value={comprehensiveEmployeeForm.employmentInfo?.probationEndDate || ''}
                      onChange={(e) => setComprehensiveEmployeeForm({
                        ...comprehensiveEmployeeForm,
                        employmentInfo: { ...comprehensiveEmployeeForm.employmentInfo!, probationEndDate: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contractEndDate">Contract End Date</Label>
                    <Input
                      id="contractEndDate"
                      type="date"
                      value={comprehensiveEmployeeForm.employmentInfo?.contractEndDate || ''}
                      onChange={(e) => setComprehensiveEmployeeForm({
                        ...comprehensiveEmployeeForm,
                        employmentInfo: { ...comprehensiveEmployeeForm.employmentInfo!, contractEndDate: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="terminationDate">Termination Date</Label>
                    <Input
                      id="terminationDate"
                      type="date"
                      value={comprehensiveEmployeeForm.employmentInfo?.terminationDate || ''}
                      onChange={(e) => setComprehensiveEmployeeForm({
                        ...comprehensiveEmployeeForm,
                        employmentInfo: { ...comprehensiveEmployeeForm.employmentInfo!, terminationDate: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="terminationReason">Termination Reason</Label>
                    <Textarea
                      id="terminationReason"
                      value={comprehensiveEmployeeForm.employmentInfo?.terminationReason || ''}
                      onChange={(e) => setComprehensiveEmployeeForm({
                        ...comprehensiveEmployeeForm,
                        employmentInfo: { ...comprehensiveEmployeeForm.employmentInfo!, terminationReason: e.target.value }
                      })}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employmentStatus">Employment Status *</Label>
                    <Select 
                      value={comprehensiveEmployeeForm.employmentInfo?.employmentStatus} 
                      onValueChange={(value) => setComprehensiveEmployeeForm({
                        ...comprehensiveEmployeeForm,
                        employmentInfo: { ...comprehensiveEmployeeForm.employmentInfo!, employmentStatus: value }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="On Leave">On Leave</SelectItem>
                        <SelectItem value="Suspended">Suspended</SelectItem>
                        <SelectItem value="Terminated">Terminated</SelectItem>
                        <SelectItem value="Resigned">Resigned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Compensation & Benefits */}
            {employeeFormStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Compensation & Benefits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="salaryStructure">Salary Structure</Label>
                    <Textarea
                      id="salaryStructure"
                      value={comprehensiveEmployeeForm.compensationInfo?.salaryStructure || ''}
                      onChange={(e) => setComprehensiveEmployeeForm({
                        ...comprehensiveEmployeeForm,
                        compensationInfo: { ...comprehensiveEmployeeForm.compensationInfo!, salaryStructure: JSON.parse(e.target.value) }
                      })}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="benefits">Benefits</Label>
                    <Textarea
                      id="benefits"
                      value={comprehensiveEmployeeForm.compensationInfo?.benefits || ''}
                      onChange={(e) => setComprehensiveEmployeeForm({
                        ...comprehensiveEmployeeForm,
                        compensationInfo: { ...comprehensiveEmployeeForm.compensationInfo!, benefits: JSON.parse(e.target.value) }
                      })}
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxInfo">Tax Information</Label>
                    <Textarea
                      id="taxInfo"
                      value={comprehensiveEmployeeForm.compensationInfo?.taxInfo || ''}
                      onChange={(e) => setComprehensiveEmployeeForm({
                        ...comprehensiveEmployeeForm,
                        compensationInfo: { ...comprehensiveEmployeeForm.compensationInfo!, taxInfo: JSON.parse(e.target.value) }
                      })}
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Banking & Payment */}
            {employeeFormStep === 5 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Banking & Payment</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      value={comprehensiveEmployeeForm.bankingInfo?.bankName || ''}
                      onChange={(e) => setComprehensiveEmployeeForm({
                        ...comprehensiveEmployeeForm,
                        bankingInfo: { ...comprehensiveEmployeeForm.bankingInfo!, bankName: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountNumber">Account Number *</Label>
                    <Input
                      id="accountNumber"
                      value={comprehensiveEmployeeForm.bankingInfo?.accountNumber || ''}
                      onChange={(e) => setComprehensiveEmployeeForm({
                        ...comprehensiveEmployeeForm,
                        bankingInfo: { ...comprehensiveEmployeeForm.bankingInfo!, accountNumber: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountName">Account Name *</Label>
                    <Input
                      id="accountName"
                      value={comprehensiveEmployeeForm.bankingInfo?.accountName || ''}
                      onChange={(e) => setComprehensiveEmployeeForm({
                        ...comprehensiveEmployeeForm,
                        bankingInfo: { ...comprehensiveEmployeeForm.bankingInfo!, accountName: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bankBranch">Bank Branch</Label>
                    <Input
                      id="bankBranch"
                      value={comprehensiveEmployeeForm.bankingInfo?.bankBranch || ''}
                      onChange={(e) => setComprehensiveEmployeeForm({
                        ...comprehensiveEmployeeForm,
                        bankingInfo: { ...comprehensiveEmployeeForm.bankingInfo!, bankBranch: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="swiftCode">SWIFT Code</Label>
                    <Input
                      id="swiftCode"
                      value={comprehensiveEmployeeForm.bankingInfo?.swiftCode || ''}
                      onChange={(e) => setComprehensiveEmployeeForm({
                        ...comprehensiveEmployeeForm,
                        bankingInfo: { ...comprehensiveEmployeeForm.bankingInfo!, swiftCode: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Payment Method *</Label>
                    <Select 
                      value={comprehensiveEmployeeForm.bankingInfo?.paymentMethod} 
                      onValueChange={(value) => setComprehensiveEmployeeForm({
                        ...comprehensiveEmployeeForm,
                        bankingInfo: { ...comprehensiveEmployeeForm.bankingInfo!, paymentMethod: value }
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="Check">Check</SelectItem>
                        <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mobileMoneyNumber">Mobile Money Number</Label>
                    <Input
                      id="mobileMoneyNumber"
                      value={comprehensiveEmployeeForm.bankingInfo?.mobileMoneyNumber || ''}
                      onChange={(e) => setComprehensiveEmployeeForm({
                        ...comprehensiveEmployeeForm,
                        bankingInfo: { ...comprehensiveEmployeeForm.bankingInfo!, mobileMoneyNumber: e.target.value }
                      })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => setEmployeeFormStep(Math.max(1, employeeFormStep - 1))}
                disabled={employeeFormStep === 1}
              >
                Previous
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                {employeeFormStep < 5 ? (
                  <Button 
                    onClick={() => setEmployeeFormStep(employeeFormStep + 1)}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    Next
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSaveEmployee}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                  >
                    Create Employee
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Employee Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Employee Information</DialogTitle>
            <DialogDescription>
              Update employee details. Changes will be saved immediately.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="work">Work Details</TabsTrigger>
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Full Name *</Label>
                  <Input
                    id="edit-name"
                    value={employeeForm.name}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email Address *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={employeeForm.email}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone Number *</Label>
                  <Input
                    id="edit-phone"
                    value={employeeForm.phone}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-location">Location *</Label>
                  <Select 
                    value={employeeForm.location} 
                    onValueChange={(value) => setEmployeeForm({ ...employeeForm, location: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Juba, South Sudan">Juba, South Sudan</SelectItem>
                      <SelectItem value="Wau, South Sudan">Wau, South Sudan</SelectItem>
                      <SelectItem value="Malakal, South Sudan">Malakal, South Sudan</SelectItem>
                      <SelectItem value="Yei, South Sudan">Yei, South Sudan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-address">Address</Label>
                <Textarea
                  id="edit-address"
                  value={employeeForm.address}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, address: e.target.value })}
                  rows={2}
                />
              </div>
            </TabsContent>

            <TabsContent value="work" className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-department">Department *</Label>
                  <Select 
                    value={employeeForm.department} 
                    onValueChange={(value) => setEmployeeForm({ ...employeeForm, department: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Human Resources">Human Resources</SelectItem>
                      <SelectItem value="Corporate Banking">Corporate Banking</SelectItem>
                      <SelectItem value="Personal Banking">Personal Banking</SelectItem>
                      <SelectItem value="Trade Finance">Trade Finance</SelectItem>
                      <SelectItem value="Finance & Accounting">Finance & Accounting</SelectItem>
                      <SelectItem value="Risk Management">Risk Management</SelectItem>
                      <SelectItem value="Information Technology">Information Technology</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-position">Position *</Label>
                  <Input
                    id="edit-position"
                    value={employeeForm.position}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, position: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-bankingRole">Banking Role *</Label>
                  <Select 
                    value={employeeForm.bankingRole} 
                    onValueChange={(value) => setEmployeeForm({ ...employeeForm, bankingRole: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Management">Management</SelectItem>
                      <SelectItem value="Leadership">Leadership</SelectItem>
                      <SelectItem value="Customer Service">Customer Service</SelectItem>
                      <SelectItem value="Credit Analysis">Credit Analysis</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Risk & Compliance">Risk & Compliance</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Support">Support</SelectItem>
                      <SelectItem value="Specialist">Specialist</SelectItem>
                      <SelectItem value="Branch Operations">Branch Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select 
                    value={employeeForm.status} 
                    onValueChange={(value) => setEmployeeForm({ ...employeeForm, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="On Leave">On Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-salary">Salary</Label>
                  <Input
                    id="edit-salary"
                    value={employeeForm.salary}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, salary: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-manager">Manager/Supervisor</Label>
                  <Input
                    id="edit-manager"
                    value={employeeForm.manager}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, manager: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-education">Education</Label>
                  <Input
                    id="edit-education"
                    value={employeeForm.education}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, education: e.target.value })}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="personal" className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-nationalId">National ID</Label>
                  <Input
                    id="edit-nationalId"
                    value={employeeForm.nationalId}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, nationalId: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-birthDate">Date of Birth</Label>
                  <Input
                    id="edit-birthDate"
                    type="date"
                    value={employeeForm.birthDate}
                    onChange={(e) => setEmployeeForm({ ...employeeForm, birthDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-emergencyContact">Emergency Contact</Label>
                <Input
                  id="edit-emergencyContact"
                  value={employeeForm.emergencyContact}
                  onChange={(e) => setEmployeeForm({ ...employeeForm, emergencyContact: e.target.value })}
                />
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveEmployee}
              disabled={!employeeForm.name || !employeeForm.email || !employeeForm.phone || !employeeForm.department || !employeeForm.position || !employeeForm.bankingRole}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              Update Employee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Exit Management Dialog */}
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Exit Management</DialogTitle>
            <DialogDescription>
              Are you sure you want to exit management of {exitingEmployee?.name}? This action cannot be undone and will remove all associated data.
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setShowExitDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                setShowExitDialog(false);
                handleDeleteEmployee(exitingEmployee?.id || 0);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Exit Management
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Exit Management Component */}
      {exitingEmployee && (
        <ExitManagement
          employee={exitingEmployee}
          isOpen={showExitDialog}
          onClose={() => {
            setShowExitDialog(false);
            setExitingEmployee(null);
          }}
        />
      )}
    </div>
  );
}