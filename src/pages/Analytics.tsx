import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { 
  TrendingUpIcon, 
  TrendingDownIcon,
  DollarSignIcon, 
  UsersIcon,
  BanknoteIcon,
  BarChartIcon,
  PieChartIcon,
  LineChartIcon,
  TargetIcon,
  AlertTriangleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon,
  StarIcon,
  ClockIcon,
  ShieldCheckIcon,
  CalendarIcon,
  FileTextIcon,
  GraduationCapIcon
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DepartmentMetrics {
  department: string;
  headcount: number;
  turnover: number;
  satisfaction: number;
  productivity: number;
  revenue: number;
  costs: number;
  clientSatisfaction: number;
  complianceScore: number;
}

interface PredictiveMetrics {
  metric: string;
  current: number;
  predicted: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  impact: 'high' | 'medium' | 'low';
}

export default function Analytics() {
  const { user, hasPermission } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('ytd');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  // Mock data for banking analytics
  const departmentMetrics: DepartmentMetrics[] = [
    {
      department: 'Personal Banking',
      headcount: 85,
      turnover: 8.2,
      satisfaction: 4.3,
      productivity: 92,
      revenue: 2800000,
      costs: 1200000,
      clientSatisfaction: 94,
      complianceScore: 96
    },
    {
      department: 'Corporate Banking',
      headcount: 42,
      turnover: 5.1,
      satisfaction: 4.5,
      productivity: 95,
      revenue: 4200000,
      costs: 800000,
      clientSatisfaction: 96,
      complianceScore: 98
    },
    {
      department: 'Trade Finance',
      headcount: 18,
      turnover: 11.3,
      satisfaction: 4.1,
      productivity: 88,
      revenue: 1500000,
      costs: 450000,
      clientSatisfaction: 92,
      complianceScore: 99
    },
    {
      department: 'Finance & Accounting',
      headcount: 25,
      turnover: 6.8,
      satisfaction: 4.4,
      productivity: 94,
      revenue: 0,
      costs: 650000,
      clientSatisfaction: 0,
      complianceScore: 99
    },
    {
      department: 'Operations',
      headcount: 35,
      turnover: 9.5,
      satisfaction: 4.2,
      productivity: 90,
      revenue: 0,
      costs: 850000,
      clientSatisfaction: 0,
      complianceScore: 95
    },
    {
      department: 'Human Resources',
      headcount: 12,
      turnover: 4.2,
      satisfaction: 4.6,
      productivity: 96,
      revenue: 0,
      costs: 320000,
      clientSatisfaction: 0,
      complianceScore: 97
    }
  ];

  const predictiveMetrics: PredictiveMetrics[] = [
    {
      metric: 'Employee Turnover',
      current: 7.8,
      predicted: 6.2,
      confidence: 85,
      trend: 'down',
      impact: 'high'
    },
    {
      metric: 'Training Completion',
      current: 89,
      predicted: 94,
      confidence: 92,
      trend: 'up',
      impact: 'medium'
    },
    {
      metric: 'Client Satisfaction',
      current: 94.2,
      predicted: 95.8,
      confidence: 78,
      trend: 'up',
      impact: 'high'
    },
    {
      metric: 'Compliance Score',
      current: 97.1,
      predicted: 98.5,
      confidence: 88,
      trend: 'up',
      impact: 'high'
    },
    {
      metric: 'Revenue per Employee',
      current: 125000,
      predicted: 132000,
      confidence: 73,
      trend: 'up',
      impact: 'high'
    }
  ];

  // Time series data for trends
  const monthlyData = [
    { month: 'Jan', employees: 278, turnover: 3.2, satisfaction: 4.1, revenue: 8500000, compliance: 95.2 },
    { month: 'Feb', employees: 281, turnover: 2.8, satisfaction: 4.2, revenue: 8800000, compliance: 96.1 },
    { month: 'Mar', employees: 285, turnover: 4.1, satisfaction: 4.3, revenue: 9200000, compliance: 96.8 },
    { month: 'Apr', employees: 283, turnover: 3.5, satisfaction: 4.2, revenue: 8900000, compliance: 97.2 },
    { month: 'May', employees: 287, turnover: 2.9, satisfaction: 4.4, revenue: 9400000, compliance: 97.5 },
    { month: 'Jun', employees: 285, turnover: 3.8, satisfaction: 4.3, revenue: 9100000, compliance: 97.1 }
  ];

  const riskFactors = [
    {
      factor: 'High Turnover Risk - Trade Finance',
      probability: 78,
      impact: 'High',
      timeframe: '3 months',
      mitigation: 'Salary review & career development program'
    },
    {
      factor: 'Certification Expiry - AML Training',
      probability: 95,
      impact: 'Critical',
      timeframe: '2 months',
      mitigation: 'Schedule renewal training sessions'
    },
    {
      factor: 'Skills Gap - Digital Banking',
      probability: 65,
      impact: 'Medium',
      timeframe: '6 months',
      mitigation: 'Implement digital transformation training'
    },
    {
      factor: 'Regulatory Change Impact',
      probability: 55,
      impact: 'High',
      timeframe: '12 months',
      mitigation: 'Monitor Central Bank updates & prepare training'
    }
  ];

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUpIcon className="h-4 w-4 text-green-600" />;
      case 'down': return <ArrowDownIcon className="h-4 w-4 text-red-600" />;
      default: return <MinusIcon className="h-4 w-4 text-gray-600" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredMetrics = selectedDepartment === 'all' 
    ? departmentMetrics 
    : departmentMetrics.filter(d => d.department === selectedDepartment);

  const totalRevenue = departmentMetrics.reduce((sum, dept) => sum + dept.revenue, 0);
  const totalCosts = departmentMetrics.reduce((sum, dept) => sum + dept.costs, 0);
  const totalHeadcount = departmentMetrics.reduce((sum, dept) => sum + dept.headcount, 0);
  const avgSatisfaction = departmentMetrics.reduce((sum, dept) => sum + dept.satisfaction, 0) / departmentMetrics.length;
  const avgTurnover = departmentMetrics.reduce((sum, dept) => sum + dept.turnover, 0) / departmentMetrics.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">HR Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Advanced insights and predictive analytics for Horizon Bank</p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mtd">Month</SelectItem>
              <SelectItem value="qtd">Quarter</SelectItem>
              <SelectItem value="ytd">Year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="Personal Banking">Personal Banking</SelectItem>
              <SelectItem value="Corporate Banking">Corporate Banking</SelectItem>
              <SelectItem value="Trade Finance">Trade Finance</SelectItem>
              <SelectItem value="Finance & Accounting">Finance & Accounting</SelectItem>
              <SelectItem value="Operations">Operations</SelectItem>
              <SelectItem value="Human Resources">Human Resources</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UsersIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">{totalHeadcount}</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <ArrowUpIcon className="h-3 w-3" />
                  +5.2% vs last month
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSignIcon className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue/Employee</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue / totalHeadcount)}</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <ArrowUpIcon className="h-3 w-3" />
                  +8.1% productivity gain
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingDownIcon className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Turnover Rate</p>
                <p className="text-2xl font-bold text-gray-900">{avgTurnover.toFixed(1)}%</p>
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <ArrowUpIcon className="h-3 w-3" />
                  +0.3% vs target
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <StarIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Satisfaction</p>
                <p className="text-2xl font-bold text-gray-900">{avgSatisfaction.toFixed(1)}/5</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <ArrowUpIcon className="h-3 w-3" />
                  +0.2 vs last quarter
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <ShieldCheckIcon className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Compliance</p>
                <p className="text-2xl font-bold text-gray-900">97.1%</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <ArrowUpIcon className="h-3 w-3" />
                  +1.3% improvement
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="predictive">Predictive Analytics</TabsTrigger>
          <TabsTrigger value="departments">Department Analysis</TabsTrigger>
          <TabsTrigger value="risks">Risk Assessment</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Employee Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Employee & Revenue Trends</CardTitle>
                <CardDescription>Monthly performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="employees" stroke="#3B82F6" strokeWidth={2} name="Employees" />
                    <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} name="Revenue ($)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Satisfaction & Turnover */}
            <Card>
              <CardHeader>
                <CardTitle>Satisfaction & Turnover</CardTitle>
                <CardDescription>Employee engagement metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Area yAxisId="left" type="monotone" dataKey="satisfaction" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} name="Satisfaction" />
                    <Area yAxisId="right" type="monotone" dataKey="turnover" stackId="2" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} name="Turnover %" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Department Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Department Performance</CardTitle>
                <CardDescription>Productivity and compliance scores</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={departmentMetrics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="productivity" fill="#3B82F6" name="Productivity %" />
                    <Bar dataKey="complianceScore" fill="#10B981" name="Compliance %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Department</CardTitle>
                <CardDescription>Revenue-generating departments</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={departmentMetrics.filter(d => d.revenue > 0)}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="revenue"
                      label={({ department, value }) => `${department}: ${formatCurrency(value)}`}
                    >
                      {departmentMetrics.filter(d => d.revenue > 0).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="predictive" className="space-y-4">
          <Alert className="border-blue-200 bg-blue-50">
            <TrendingUpIcon className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <strong>AI-Powered Insights:</strong> These predictions are based on historical data, 
              current trends, and machine learning algorithms specific to banking sector HR patterns.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4">
            {predictiveMetrics.map((metric, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{metric.metric}</h3>
                        {getTrendIcon(metric.trend)}
                        <Badge variant="outline" className={getImpactColor(metric.impact)}>
                          {metric.impact} impact
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-6">
                        <div>
                          <p className="text-sm text-gray-600">Current</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {metric.metric === 'Revenue per Employee' ? formatCurrency(metric.current) : `${metric.current}${metric.metric.includes('Rate') || metric.metric.includes('Score') || metric.metric.includes('Completion') ? '%' : ''}`}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Predicted (6mo)</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {metric.metric === 'Revenue per Employee' ? formatCurrency(metric.predicted) : `${metric.predicted}${metric.metric.includes('Rate') || metric.metric.includes('Score') || metric.metric.includes('Completion') ? '%' : ''}`}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Confidence</p>
                          <div className="flex items-center gap-2">
                            <Progress value={metric.confidence} className="flex-1 h-2" />
                            <span className="text-sm font-medium">{metric.confidence}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department</TableHead>
                  <TableHead>Headcount</TableHead>
                  <TableHead>Turnover</TableHead>
                  <TableHead>Satisfaction</TableHead>
                  <TableHead>Productivity</TableHead>
                  <TableHead>Revenue</TableHead>
                  <TableHead>Client Sat.</TableHead>
                  <TableHead>Compliance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMetrics.map((dept) => (
                  <TableRow key={dept.department}>
                    <TableCell className="font-medium">{dept.department}</TableCell>
                    <TableCell>{dept.headcount}</TableCell>
                    <TableCell>
                      <span className={dept.turnover > 10 ? 'text-red-600' : dept.turnover > 7 ? 'text-yellow-600' : 'text-green-600'}>
                        {dept.turnover}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <StarIcon className="h-4 w-4 text-yellow-500" />
                        {dept.satisfaction.toFixed(1)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-16">
                        <Progress value={dept.productivity} className="h-2" />
                        <p className="text-xs text-center mt-1">{dept.productivity}%</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {dept.revenue > 0 ? formatCurrency(dept.revenue) : '-'}
                    </TableCell>
                    <TableCell>
                      {dept.clientSatisfaction > 0 ? `${dept.clientSatisfaction}%` : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="w-16">
                        <Progress value={dept.complianceScore} className="h-2" />
                        <p className="text-xs text-center mt-1">{dept.complianceScore}%</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="risks" className="space-y-4">
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangleIcon className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>Risk Assessment:</strong> Identified potential HR risks that could impact 
              Horizon Bank's operations and compliance. Proactive mitigation recommended.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4">
            {riskFactors.map((risk, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold text-lg">{risk.factor}</h3>
                        <Badge variant="outline" className={getImpactColor(risk.impact.toLowerCase())}>
                          {risk.impact} Impact
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Probability</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={risk.probability} className="flex-1 h-2" />
                            <span className="text-sm font-medium">{risk.probability}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Timeframe</p>
                          <p className="text-lg font-semibold text-gray-900">{risk.timeframe}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Mitigation Strategy</p>
                          <p className="text-sm text-gray-700">{risk.mitigation}</p>
                        </div>
                      </div>
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
} 