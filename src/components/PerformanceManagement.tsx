
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Star, Target, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const PerformanceManagement = () => {
  const { data: performanceReviews, isLoading } = useQuery({
    queryKey: ['performance-reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('performance_reviews')
        .select(`
          *,
          employee:profiles!employee_id(first_name, last_name, employee_id),
          reviewer:profiles!reviewer_id(first_name, last_name)
        `)
        .order('review_period_end', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      draft: 'bg-gray-100 text-gray-800',
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants] || variants.draft}>
        {status}
      </Badge>
    );
  };

  const getRatingStars = (rating: number | null) => {
    if (!rating) return 'Not rated';
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const averageRating = performanceReviews?.reduce((sum, review) => sum + (review.overall_rating || 0), 0) / (performanceReviews?.length || 1);
  const completedReviews = performanceReviews?.filter(review => review.status === 'completed').length || 0;
  const promotionReady = performanceReviews?.filter(review => review.promotion_ready).length || 0;

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading performance data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Performance Management</h2>
          <p className="text-gray-600">Track and manage employee performance reviews</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Start New Review
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {averageRating ? averageRating.toFixed(1) : '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Out of 5.0
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Reviews</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {completedReviews}
            </div>
            <p className="text-xs text-muted-foreground">
              This period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promotion Ready</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {promotionReady}
            </div>
            <p className="text-xs text-muted-foreground">
              Employees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {performanceReviews?.filter(review => review.status === 'pending').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              To complete
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Review Period</TableHead>
                <TableHead>Reviewer</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Promotion Ready</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {performanceReviews?.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {review.employee ? 
                          `${review.employee.first_name} ${review.employee.last_name}` : 
                          'Unknown Employee'
                        }
                      </div>
                      <div className="text-sm text-gray-500">
                        {review.employee?.employee_id}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {review.review_period_start} to {review.review_period_end}
                    </div>
                  </TableCell>
                  <TableCell>
                    {review.reviewer ? 
                      `${review.reviewer.first_name} ${review.reviewer.last_name}` : 
                      'Not assigned'
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-500">{getRatingStars(review.overall_rating)}</span>
                      <span className="text-sm text-gray-500">
                        ({review.overall_rating || 'N/A'}/5)
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(review.status || 'draft')}</TableCell>
                  <TableCell>
                    <Badge className={review.promotion_ready ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {review.promotion_ready ? 'Yes' : 'No'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        View
                      </Button>
                      {review.status !== 'completed' && (
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Edit
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceManagement;
