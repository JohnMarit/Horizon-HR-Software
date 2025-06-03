import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Search, Edit, Eye, FileText, AlertCircle } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CredentialsDialog } from '@/components/ui/credentials-dialog';
import { 
  createEmployeeAccount, 
  generateSecurePassword, 
  validateEmail, 
  checkEmailExists,
  type NewEmployeeAccount,
  type AccountCreationResult 
} from '@/lib/auth-utils';
import { sendWelcomeEmail } from '@/lib/email-service';

const EmployeeManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isCredentialsDialogOpen, setIsCredentialsDialogOpen] = useState(false);
  const [newEmployeeCredentials, setNewEmployeeCredentials] = useState<any>(null);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const queryClient = useQueryClient();

  const { data: employees, isLoading } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          departments(name),
          manager:profiles!manager_id(first_name, last_name)
        `);
      
      if (error) throw error;
      return data;
    }
  });

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  const filteredEmployees = employees?.filter(employee => {
    const matchesSearch = `${employee.first_name} ${employee.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.employee_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === 'all' || employee.department_id === departmentFilter;
    const matchesStatus = statusFilter === 'all' || employee.employment_status === statusFilter;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      terminated: 'bg-red-100 text-red-800',
      suspended: 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.active}>
        {status}
      </Badge>
    );
  };

  const validateForm = async (formData: FormData): Promise<boolean> => {
    const errors: Record<string, string> = {};
    
    const email = formData.get('email') as string;
    const firstName = formData.get('firstName') as string;
    const lastName = formData.get('lastName') as string;
    const department = formData.get('department') as string;
    
    // Validate required fields
    if (!firstName?.trim()) errors.firstName = 'First name is required';
    if (!lastName?.trim()) errors.lastName = 'Last name is required';
    if (!email?.trim()) errors.email = 'Email is required';
    if (!department) errors.department = 'Department is required';
    
    // Validate email format
    if (email && !validateEmail(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    // Check if email already exists
    if (email && validateEmail(email)) {
      const emailExists = await checkEmailExists(email);
      if (emailExists) {
        errors.email = 'An account with this email already exists';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddEmployee = async (formData: FormData) => {
    setIsCreatingAccount(true);
    
    try {
      // Validate form
      const isValid = await validateForm(formData);
      if (!isValid) {
        setIsCreatingAccount(false);
        return;
      }

      // Extract form data
      const firstName = formData.get('firstName') as string;
      const lastName = formData.get('lastName') as string;
      const email = formData.get('email') as string;
      const phone = formData.get('phone') as string;
      const position = formData.get('position') as string;
      const department = formData.get('department') as string;
      const salary = formData.get('salary') as string;

      // Generate secure password
      const password = generateSecurePassword();

      // Create employee account data
      const employeeData: NewEmployeeAccount = {
        firstName,
        lastName,
        email,
        password,
        position: position || 'Employee',
        department,
        phone: phone || undefined,
        salary: salary ? parseInt(salary) : undefined,
        employeeId: '' // Will be generated automatically
      };

      // Create the employee account
      const result: AccountCreationResult = await createEmployeeAccount(employeeData);

      if (result.success && result.credentials) {
        // Show credentials dialog
        setNewEmployeeCredentials({
          ...result.credentials,
          firstName,
          lastName
        });
        setIsCredentialsDialogOpen(true);
        setIsAddDialogOpen(false);
        
        // Refresh employees list
        queryClient.invalidateQueries({ queryKey: ['employees'] });
        
        toast.success('Employee account created successfully!');
      } else {
        throw new Error(result.error || 'Failed to create employee account');
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create employee account');
    } finally {
      setIsCreatingAccount(false);
    }
  };

  const handleSendWelcomeEmail = async () => {
    if (!newEmployeeCredentials) return;
    
    try {
      const result = await sendWelcomeEmail(newEmployeeCredentials);
      if (!result.success) {
        throw new Error(result.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }
  };

  const resetForm = () => {
    setFormErrors({});
    setIsAddDialogOpen(false);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading employees...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Employee Management</h2>
          <p className="text-gray-600">Manage employee records and information</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={resetForm}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
            </DialogHeader>
            
            <Alert className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Automatic Account Creation:</strong> A login account will be created automatically and 
                credentials will be sent to the employee's email address.
              </AlertDescription>
            </Alert>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleAddEmployee(formData);
            }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input 
                    id="firstName" 
                    name="firstName" 
                    required 
                    className={formErrors.firstName ? 'border-red-500' : ''}
                  />
                  {formErrors.firstName && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.firstName}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input 
                    id="lastName" 
                    name="lastName" 
                    required 
                    className={formErrors.lastName ? 'border-red-500' : ''}
                  />
                  {formErrors.lastName && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.lastName}</p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required 
                  placeholder="employee@horizonbankss.com"
                  className={formErrors.email ? 'border-red-500' : ''}
                />
                {formErrors.email && (
                  <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Login credentials will be sent to this email address
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" placeholder="+211..." />
                </div>
                <div>
                  <Label htmlFor="position">Position</Label>
                  <Input id="position" name="position" placeholder="e.g. Teller, Manager" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="department">Department *</Label>
                  <Select name="department">
                    <SelectTrigger className={formErrors.department ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments?.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.department && (
                    <p className="text-sm text-red-500 mt-1">{formErrors.department}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="salary">Salary (SSP)</Label>
                  <Input id="salary" name="salary" type="number" placeholder="50000" />
                </div>
              </div>
              
              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>What happens next:</strong>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>A secure password will be generated automatically</li>
                    <li>Employee ID will be assigned (format: HB####)</li>
                    <li>Login credentials will be displayed for review</li>
                    <li>Welcome email will be sent to the employee</li>
                    <li>Employee can change password after first login</li>
                  </ul>
                </AlertDescription>
              </Alert>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isCreatingAccount}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isCreatingAccount ? (
                    <>Creating Account...</>
                  ) : (
                    <>Create Employee Account</>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments?.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Hire Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees?.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.employee_id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{`${employee.first_name} ${employee.last_name}`}</div>
                      <div className="text-sm text-gray-500">{employee.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.departments?.name || 'N/A'}</TableCell>
                  <TableCell>{employee.position || 'N/A'}</TableCell>
                  <TableCell>{getStatusBadge(employee.employment_status || 'active')}</TableCell>
                  <TableCell>{employee.hire_date || 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Credentials Dialog */}
      {newEmployeeCredentials && (
        <CredentialsDialog
          isOpen={isCredentialsDialogOpen}
          onClose={() => {
            setIsCredentialsDialogOpen(false);
            setNewEmployeeCredentials(null);
          }}
          credentials={newEmployeeCredentials}
          onSendEmail={handleSendWelcomeEmail}
        />
      )}
    </div>
  );
};

export default EmployeeManagement;
