import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  DollarSign,
  Clock,
  Award,
  AlertTriangle,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Calendar,
  Building,
  UserPlus,
  UserMinus,
  GraduationCap,
  Heart,
  Shield
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ScatterChart, Scatter } from 'recharts';

interface HRMetric {
  metric: string;
  value: number;
  previousValue: number;
  target: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'good' | 'warning' | 'critical';
}

interface DepartmentMetric {
  department: string;
  headcount: number;
  retention: number;
  satisfaction: number;
  productivity: number;
  cost: number;
  recruitment: number;
}

const HRAnalyticsDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('12months');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Key HR Metrics
  const hrMetrics: HRMetric[] = [
    {
      metric: 'Employee Retention Rate',
      value: 92.5,
      previousValue: 89.2,
      target: 95.0,
      unit: '%',
      trend: 'up',
      status: 'good'
    },
    {
      metric: 'Time to Fill Positions',
      value: 28,
      previousValue: 35,
      target: 25,
      unit: 'days',
      trend: 'up',
      status: 'warning'
    },
    {
      metric: 'Employee Engagement Score',
      value: 4.2,
      previousValue: 4.0,
      target: 4.5,
      unit: '/5',
      trend: 'up',
      status: 'good'
    },
    {
      metric: 'Training Completion Rate',
      value: 87,
      previousValue: 82,
      target: 90,
      unit: '%',
      trend: 'up',
      status: 'good'
    },
    {
      metric: 'Cost per Hire',
      value: 3250,
      previousValue: 3800,
      target: 3000,
      unit: 'USD',
      trend: 'up',
      status: 'warning'
    },
    {
      metric: 'Absenteeism Rate',
      value: 3.2,
      previousValue: 4.1,
      target: 2.5,
      unit: '%',
      trend: 'up',
      status: 'warning'
    }
  ];

  // Department Performance Data
  const departmentMetrics: DepartmentMetric[] = [
    {
      department: 'Personal Banking',
      headcount: 85,
      retention: 94.1,
      satisfaction: 4.3,
      productivity: 88,
      cost: 2850,
      recruitment: 5
    },
    {
      department: 'Corporate Banking',
      headcount: 42,
      retention: 91.7,
      satisfaction: 4.1,
      productivity: 92,
      cost: 4200,
      recruitment: 2
    },
    {
      department: 'Trade Finance',
      headcount: 18,
      retention: 88.9,
      satisfaction: 4.0,
      productivity: 85,
      cost: 3800,
      recruitment: 1
    },
    {
      department: 'Finance & Accounting',
      headcount: 25,
      retention: 96.0,
      satisfaction: 4.4,
      productivity: 90,
      cost: 3200,
      recruitment: 1
    },
    {
      department: 'Operations',
      headcount: 35,
      retention: 89.3,
      satisfaction: 3.9,
      productivity: 82,
      cost: 2600,
      recruitment: 3
    },
    {
      department: 'Human Resources',
      headcount: 12,
      retention: 100.0,
      satisfaction: 4.5,
      productivity: 95,
      cost: 3500,
      recruitment: 0
    }
  ];

  // Workforce Trends
  const workforceTrends = [
    { month: 'Jan', headcount: 210, hires: 8, terminations: 3, retention: 91.2, satisfaction: 3.9 },
    { month: 'Feb', headcount: 215, hires: 12, terminations: 7, retention: 91.8, satisfaction: 4.0 },
    { month: 'Mar', headcount: 218, hires: 6, terminations: 3, retention: 92.1, satisfaction: 4.1 },
    { month: 'Apr', headcount: 221, hires: 9, terminations: 6, retention: 92.0, satisfaction: 4.0 },
    { month: 'May', headcount: 219, hires: 5, terminations: 7, retention: 91.7, satisfaction: 4.1 },
    { month: 'Jun', headcount: 217, hires: 8, terminations: 10, retention: 91.5, satisfaction: 4.2 },
    { month: 'Jul', headcount: 215, hires: 7, terminations: 9, retention: 91.8, satisfaction: 4.1 },
    { month: 'Aug', headcount: 216, hires: 11, terminations: 10, retention: 92.2, satisfaction: 4.2 },
    { month: 'Sep', headcount: 217, hires: 9, terminations: 8, retention: 92.5, satisfaction: 4.3 },
    { month: 'Oct', headcount: 218, hires: 6, terminations: 5, retention: 92.3, satisfaction: 4.2 },
    { month: 'Nov', headcount: 217, hires: 4, terminations: 5, retention: 92.5, satisfaction: 4.2 },
    { month: 'Dec', headcount: 217, hires: 8, terminations: 8, retention: 92.5, satisfaction: 4.2 }
  ];

  // Age Demographics
  const ageDemographics = [
    { age: '18-25', count: 32, percentage: 14.7 },
    { age: '26-35', count: 89, percentage: 41.0 },
    { age: '36-45', count: 67, percentage: 30.9 },
    { age: '46-55', count: 24, percentage: 11.1 },
    { age: '56+', count: 5, percentage: 2.3 }
  ];

  // Performance Distribution
  const performanceDistribution = [
    { rating: 'Exceeds', count: 43, percentage: 19.8 },
    { rating: 'Meets+', count: 87, percentage: 40.1 },
    { rating: 'Meets', count: 75, percentage: 34.6 },
    { rating: 'Below', count: 12, percentage: 5.5 }
  ];

  // Training Analytics
  const trainingData = [
    { program: 'Banking Fundamentals', completed: 156, enrolled: 180, completion: 86.7 },
    { program: 'Customer Service Excellence', completed: 142, enrolled: 160, completion: 88.8 },
    { program: 'Risk Management', completed: 89, enrolled: 110, completion: 80.9 },
    { program: 'Digital Banking', completed: 134, enrolled: 145, completion: 92.4 },
    { program: 'Leadership Development', completed: 45, enrolled: 55, completion: 81.8 }
  ];

  // Predictive Analytics
  const predictiveInsights = [
    {
      type: 'Turnover Risk',
      description: 'Operations department shows 15% higher turnover risk based on satisfaction trends',
      probability: 68,
      action: 'Schedule engagement sessions',
      timeline: '2-3 months'
    },
    {
      type: 'Recruitment Demand',
      description: 'Expected 12-15 new hires needed in Q1 2025 based on growth projections',
      probability: 82,
      action: 'Start recruitment planning',
      timeline: '1-2 months'
    },
    {
      type: 'Training Gap',
      description: 'Digital skills gap identified in 35% of staff, requiring upskilling',
      probability: 91,
      action: 'Develop training program',
      timeline: '3-6 months'
    }
  ];

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">HR Analytics Dashboard</h1>
          <p className="text-gray-600">Strategic insights for data-driven HR decisions</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="12months">Last 12 Months</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="personal-banking">Personal Banking</SelectItem>
              <SelectItem value="corporate-banking">Corporate Banking</SelectItem>
              <SelectItem value="trade-finance">Trade Finance</SelectItem>
              <SelectItem value="finance">Finance & Accounting</SelectItem>
              <SelectItem value="operations">Operations</SelectItem>
              <SelectItem value="hr">Human Resources</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hrMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getTrendIcon(metric.trend)}
                  <span className="text-sm font-medium text-gray-600">{metric.metric}</span>
                </div>
                <Badge variant="outline" className={getStatusColor(metric.status)}>
                  {metric.trend === 'up' ? '+' : metric.trend === 'down' ? '-' : ''}{Math.abs(metric.value - metric.previousValue).toFixed(1)}
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-gray-900">
                  {metric.value}{metric.unit}
                </p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Target: {metric.target}{metric.unit}</span>
                  <span>Prev: {metric.previousValue}{metric.unit}</span>
                </div>
                <Progress value={(metric.value / metric.target) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workforce">Workforce Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance Insights</TabsTrigger>
          <TabsTrigger value="training">Training Analytics</TabsTrigger>
          <TabsTrigger value="predictive">Predictive Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Workforce Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Workforce Trends</CardTitle>
                <CardDescription>Monthly headcount and retention trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsLineChart data={workforceTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="headcount" fill="#3B82F6" name="Headcount" />
                    <Line yAxisId="right" type="monotone" dataKey="retention" stroke="#10B981" strokeWidth={2} name="Retention %" />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Department Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Department Performance</CardTitle>
                <CardDescription>Key metrics by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentMetrics.map((dept, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">{dept.department}</span>
                        <div className="flex gap-3 text-xs">
                          <span className="text-green-600">{dept.retention}%</span>
                          <span className="text-blue-600">{dept.satisfaction}/5</span>
                          <span className="text-purple-600">{dept.productivity}%</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <Progress value={dept.retention} className="h-1" />
                        <Progress value={(dept.satisfaction / 5) * 100} className="h-1" />
                        <Progress value={dept.productivity} className="h-1" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span className="text-green-600">Retention</span>
                    <span className="text-blue-600">Satisfaction</span>
                    <span className="text-purple-600">Productivity</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Age Demographics */}
            <Card>
              <CardHeader>
                <CardTitle>Age Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <RechartsPieChart>
                    <Pie
                      data={ageDemographics}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="count"
                      label={({ age, percentage }) => `${age}: ${percentage}%`}
                    >
                      {ageDemographics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Performance Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {performanceDistribution.map((perf, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{perf.rating}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={perf.percentage} className="w-20 h-2" />
                        <span className="text-sm text-gray-600 w-12">{perf.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Total Employees</span>
                    </div>
                    <span className="font-semibold">217</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4 text-green-500" />
                      <span className="text-sm">New Hires (YTD)</span>
                    </div>
                    <span className="font-semibold">48</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserMinus className="h-4 w-4 text-red-500" />
                      <span className="text-sm">Departures (YTD)</span>
                    </div>
                    <span className="font-semibold">31</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Training Hours</span>
                    </div>
                    <span className="font-semibold">2,340</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">Avg Salary</span>
                    </div>
                    <span className="font-semibold">$4,250</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Workforce Analytics Tab */}
        <TabsContent value="workforce" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Hiring vs Departures</CardTitle>
                <CardDescription>Monthly recruitment and turnover trends</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={workforceTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="hires" fill="#10B981" name="New Hires" />
                    <Bar dataKey="terminations" fill="#EF4444" name="Departures" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Satisfaction Trends</CardTitle>
                <CardDescription>Employee satisfaction over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={workforceTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[3.5, 4.5]} />
                    <Tooltip />
                    <Area type="monotone" dataKey="satisfaction" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Training Analytics Tab */}
        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Training Program Performance</CardTitle>
              <CardDescription>Completion rates and engagement by program</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainingData.map((program, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{program.program}</span>
                      <div className="flex gap-4 text-sm">
                        <span className="text-gray-600">{program.completed}/{program.enrolled}</span>
                        <span className="font-semibold">{program.completion}%</span>
                      </div>
                    </div>
                    <Progress value={program.completion} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Predictive Analytics Tab */}
        <TabsContent value="predictive" className="space-y-6">
          <div className="grid gap-6">
            {predictiveInsights.map((insight, index) => (
              <Card key={index} className="border-l-4 border-l-blue-400">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-blue-100 text-blue-800">{insight.type}</Badge>
                        <Badge variant="outline">{insight.probability}% confidence</Badge>
                      </div>
                      <p className="text-gray-700 mb-3">{insight.description}</p>
                      <div className="flex gap-4 text-sm">
                        <span><strong>Recommended Action:</strong> {insight.action}</span>
                        <span><strong>Timeline:</strong> {insight.timeline}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{insight.probability}%</div>
                      <div className="text-xs text-gray-500">Probability</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HRAnalyticsDashboard; 