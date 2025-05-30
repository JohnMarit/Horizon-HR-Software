
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, Award, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const TrainingManagement = () => {
  const { data: trainingCourses, isLoading: loadingCourses } = useQuery({
    queryKey: ['training-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('training_courses')
        .select(`
          *,
          created_by_profile:profiles!created_by(first_name, last_name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: trainingEnrollments, isLoading: loadingEnrollments } = useQuery({
    queryKey: ['training-enrollments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('training_enrollments')
        .select(`
          *,
          employee:profiles!employee_id(first_name, last_name, employee_id),
          course:training_courses!course_id(title)
        `)
        .order('enrollment_date', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      enrolled: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.enrolled}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const totalCourses = trainingCourses?.length || 0;
  const activeEnrollments = trainingEnrollments?.filter(e => e.status === 'in_progress').length || 0;
  const completedTrainings = trainingEnrollments?.filter(e => e.status === 'completed').length || 0;
  const mandatoryCourses = trainingCourses?.filter(c => c.is_mandatory).length || 0;

  if (loadingCourses || loadingEnrollments) {
    return <div className="flex justify-center items-center h-64">Loading training data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Training Management</h2>
          <p className="text-gray-600">Manage training courses and employee enrollments</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <BookOpen className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses}</div>
            <p className="text-xs text-muted-foreground">
              {mandatoryCourses} mandatory
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Enrollments</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{activeEnrollments}</div>
            <p className="text-xs text-muted-foreground">
              In progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedTrainings}</div>
            <p className="text-xs text-muted-foreground">
              This quarter
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trainingCourses?.length ? 
                Math.round(trainingCourses.reduce((sum, course) => sum + (course.duration_hours || 0), 0) / trainingCourses.length) : 
                0
              }h
            </div>
            <p className="text-xs text-muted-foreground">
              Per course
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Training Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trainingCourses?.slice(0, 5).map((course) => (
                <div key={course.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">{course.title}</div>
                    <div className="text-sm text-gray-500">
                      {course.instructor} • {course.duration_hours}h
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      {course.is_mandatory && (
                        <Badge variant="outline" className="text-xs">
                          Mandatory
                        </Badge>
                      )}
                      <span className="text-xs text-gray-400">
                        {trainingEnrollments?.filter(e => e.course_id === course.id).length || 0} enrolled
                      </span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trainingEnrollments?.slice(0, 5).map((enrollment) => (
                  <TableRow key={enrollment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {enrollment.employee ? 
                            `${enrollment.employee.first_name} ${enrollment.employee.last_name}` : 
                            'Unknown'
                          }
                        </div>
                        <div className="text-sm text-gray-500">
                          {enrollment.employee?.employee_id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{enrollment.course?.title}</TableCell>
                    <TableCell>{getStatusBadge(enrollment.status || 'enrolled')}</TableCell>
                    <TableCell>
                      {enrollment.completion_date ? 
                        new Date(enrollment.completion_date).toLocaleDateString() : 
                        enrollment.status === 'completed' ? 'Completed' : 'In Progress'
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrainingManagement;
