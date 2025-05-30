
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Building, Users, DollarSign } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const DepartmentManagement = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: departments, isLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select(`
          *,
          head:profiles!head_id(first_name, last_name),
          employee_count:profiles!department_id(count)
        `);
      
      if (error) throw error;
      return data;
    }
  });

  const { data: employees } = useQuery({
    queryKey: ['employees-for-heads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, role')
        .in('role', ['hr_manager', 'department_head', 'finance_officer']);
      
      if (error) throw error;
      return data;
    }
  });

  const handleAddDepartment = async (formData: FormData) => {
    try {
      const departmentData = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        head_id: formData.get('head_id') as string || null,
        budget: parseFloat(formData.get('budget') as string) || 0,
        location: formData.get('location') as string,
      };

      const { error } = await supabase
        .from('departments')
        .insert([departmentData]);

      if (error) throw error;

      toast({
        title: "Department Added",
        description: "New department has been successfully created.",
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add department. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading departments...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Department Management</h2>
          <p className="text-gray-600">Manage organizational departments and structure</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Department
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Department</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleAddDepartment(formData);
            }} className="space-y-4">
              <div>
                <Label htmlFor="name">Department Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" />
              </div>
              <div>
                <Label htmlFor="head_id">Department Head</Label>
                <Select name="head_id">
                  <SelectTrigger>
                    <SelectValue placeholder="Select department head" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees?.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {`${employee.first_name} ${employee.last_name}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget">Budget (SSP)</Label>
                  <Input id="budget" name="budget" type="number" step="0.01" />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Department</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments?.map((department) => (
          <Card key={department.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Building className="h-8 w-8 text-blue-600" />
                <Button size="sm" variant="outline">Edit</Button>
              </div>
              <CardTitle className="text-xl">{department.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-600 text-sm">{department.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Department Head:</span>
                  <span className="font-medium">
                    {department.head 
                      ? `${department.head.first_name} ${department.head.last_name}`
                      : 'Not assigned'
                    }
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Employees:
                  </span>
                  <span className="font-medium">{department.employee_count?.[0]?.count || 0}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" />
                    Budget:
                  </span>
                  <span className="font-medium">
                    SSP {department.budget?.toLocaleString() || '0'}
                  </span>
                </div>
                
                {department.location && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Location:</span>
                    <span className="font-medium">{department.location}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DepartmentManagement;
