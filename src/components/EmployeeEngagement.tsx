import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  Heart,
  Star,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Users,
  Award,
  MessageCircle,
  ThumbsUp,
  Gift,
  Calendar,
  Target,
  Activity,
  Zap,
  Coffee,
  Lightbulb,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Send,
  Eye,
  Download,
  Filter,
  Search
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface Survey {
  id: number;
  title: string;
  description: string;
  type: 'Pulse' | 'Annual' | 'Exit' | 'Onboarding' | 'Custom';
  status: 'Draft' | 'Active' | 'Completed' | 'Closed';
  createdBy: string;
  createdDate: string;
  startDate: string;
  endDate: string;
  targetAudience: string[];
  questions: SurveyQuestion[];
  responses: number;
  targetResponses: number;
  averageScore?: number;
}

interface SurveyQuestion {
  id: number;
  text: string;
  type: 'scale' | 'multiple-choice' | 'text' | 'yes-no';
  required: boolean;
  options?: string[];
  responses?: any[];
}

interface Recognition {
  id: number;
  fromEmployeeId: string;
  fromEmployeeName: string;
  toEmployeeId: string;
  toEmployeeName: string;
  type: 'Peer Recognition' | 'Manager Recognition' | 'Achievement' | 'Milestone' | 'Innovation';
  category: 'Excellence' | 'Teamwork' | 'Innovation' | 'Customer Service' | 'Leadership';
  title: string;
  message: string;
  points: number;
  isPublic: boolean;
  createdDate: string;
  likes: number;
  comments: Comment[];
}

interface Comment {
  id: number;
  authorId: string;
  authorName: string;
  text: string;
  createdDate: string;
}

interface EngagementMetric {
  metric: string;
  current: number;
  previous: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  description: string;
}

const EmployeeEngagement: React.FC = () => {
  const { user, hasPermission, addAuditLog } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showSurveyDialog, setShowSurveyDialog] = useState(false);
  const [showRecognitionDialog, setShowRecognitionDialog] = useState(false);
  const [showSurveyResponseDialog, setShowSurveyResponseDialog] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for demonstration
  const [surveys, setSurveys] = useState<Survey[]>([
    {
      id: 1,
      title: 'Q4 2024 Pulse Survey',
      description: 'Quarterly engagement and satisfaction check-in',
      type: 'Pulse',
      status: 'Active',
      createdBy: 'Sarah Akol',
      createdDate: '2024-12-01',
      startDate: '2024-12-15',
      endDate: '2024-12-31',
      targetAudience: ['All Employees'],
      responses: 187,
      targetResponses: 217,
      averageScore: 4.2,
      questions: [
        {
          id: 1,
          text: 'How satisfied are you with your current role?',
          type: 'scale',
          required: true,
          responses: []
        },
        {
          id: 2,
          text: 'How likely are you to recommend Horizon Bank as a great place to work?',
          type: 'scale',
          required: true,
          responses: []
        },
        {
          id: 3,
          text: 'What motivates you most at work?',
          type: 'multiple-choice',
          required: false,
          options: ['Career Growth', 'Recognition', 'Work-Life Balance', 'Compensation', 'Team Environment'],
          responses: []
        }
      ]
    },
    {
      id: 2,
      title: 'Annual Employee Engagement Survey 2024',
      description: 'Comprehensive annual engagement assessment',
      type: 'Annual',
      status: 'Completed',
      createdBy: 'Sarah Akol',
      createdDate: '2024-10-01',
      startDate: '2024-11-01',
      endDate: '2024-11-30',
      targetAudience: ['All Employees'],
      responses: 203,
      targetResponses: 217,
      averageScore: 4.1,
      questions: []
    }
  ]);

  const [recognitions, setRecognitions] = useState<Recognition[]>([
    {
      id: 1,
      fromEmployeeId: 'HB003',
      fromEmployeeName: 'Mary Deng',
      toEmployeeId: 'HB005',
      toEmployeeName: 'Grace Ajak',
      type: 'Manager Recognition',
      category: 'Excellence',
      title: 'Outstanding Customer Service',
      message: 'Grace consistently exceeds customer expectations and has received multiple positive feedback this month.',
      points: 100,
      isPublic: true,
      createdDate: '2024-12-20',
      likes: 15,
      comments: [
        {
          id: 1,
          authorId: 'HB006',
          authorName: 'Michael Jok',
          text: 'Well deserved! Grace always goes above and beyond.',
          createdDate: '2024-12-20'
        }
      ]
    },
    {
      id: 2,
      fromEmployeeId: 'HB005',
      fromEmployeeName: 'Grace Ajak',
      toEmployeeId: 'HB006',
      toEmployeeName: 'Michael Jok',
      type: 'Peer Recognition',
      category: 'Teamwork',
      title: 'Excellent Collaboration',
      message: 'Michael was incredibly helpful during our joint project and made the collaboration seamless.',
      points: 50,
      isPublic: true,
      createdDate: '2024-12-18',
      likes: 8,
      comments: []
    }
  ]);

  const engagementMetrics: EngagementMetric[] = [
    {
      metric: 'Overall Satisfaction',
      current: 4.2,
      previous: 4.0,
      target: 4.5,
      trend: 'up',
      description: 'Employee satisfaction score (1-5 scale)'
    },
    {
      metric: 'Employee Net Promoter Score',
      current: 72,
      previous: 68,
      target: 80,
      trend: 'up',
      description: 'Likelihood to recommend as employer'
    },
    {
      metric: 'Retention Rate',
      current: 92.5,
      previous: 91.2,
      target: 95.0,
      trend: 'up',
      description: 'Annual employee retention percentage'
    },
    {
      metric: 'Recognition Participation',
      current: 68,
      previous: 62,
      target: 75,
      trend: 'up',
      description: 'Percentage participating in recognition'
    }
  ];

  const monthlyEngagement = [
    { month: 'Jul', satisfaction: 3.9, participation: 62, recognition: 45 },
    { month: 'Aug', satisfaction: 4.0, participation: 65, recognition: 52 },
    { month: 'Sep', satisfaction: 4.1, participation: 67, recognition: 58 },
    { month: 'Oct', satisfaction: 4.0, participation: 64, recognition: 48 },
    { month: 'Nov', satisfaction: 4.2, participation: 68, recognition: 63 },
    { month: 'Dec', satisfaction: 4.2, participation: 70, recognition: 67 }
  ];

  const [surveyForm, setSurveyForm] = useState({
    title: '',
    description: '',
    type: 'Pulse' as const,
    startDate: '',
    endDate: '',
    targetAudience: [] as string[],
    questions: [] as Omit<SurveyQuestion, 'id' | 'responses'>[]
  });

  const [recognitionForm, setRecognitionForm] = useState({
    toEmployeeId: '',
    type: 'Peer Recognition' as const,
    category: 'Excellence' as const,
    title: '',
    message: '',
    isPublic: true
  });

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Closed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Excellence': return <Star className="h-4 w-4 text-yellow-500" />;
      case 'Teamwork': return <Users className="h-4 w-4 text-blue-500" />;
      case 'Innovation': return <Lightbulb className="h-4 w-4 text-purple-500" />;
      case 'Customer Service': return <Heart className="h-4 w-4 text-red-500" />;
      case 'Leadership': return <Award className="h-4 w-4 text-orange-500" />;
      default: return <Target className="h-4 w-4 text-gray-500" />;
    }
  };

  const resetSurveyForm = () => {
    setSurveyForm({
      title: '',
      description: '',
      type: 'Pulse',
      startDate: '',
      endDate: '',
      targetAudience: [],
      questions: []
    });
  };

  const resetRecognitionForm = () => {
    setRecognitionForm({
      toEmployeeId: '',
      type: 'Peer Recognition',
      category: 'Excellence',
      title: '',
      message: '',
      isPublic: true
    });
  };

  const handleCreateSurvey = () => {
    const newSurvey: Survey = {
      id: Math.max(...surveys.map(s => s.id)) + 1,
      title: surveyForm.title,
      description: surveyForm.description,
      type: surveyForm.type,
      status: 'Draft',
      createdBy: user?.email || 'System',
      createdDate: new Date().toISOString().split('T')[0],
      startDate: surveyForm.startDate,
      endDate: surveyForm.endDate,
      targetAudience: surveyForm.targetAudience,
      questions: surveyForm.questions.map((q, index) => ({ ...q, id: index + 1, responses: [] })),
      responses: 0,
      targetResponses: 217 // Default target
    };

    setSurveys([newSurvey, ...surveys]);
    setShowSurveyDialog(false);
    resetSurveyForm();

    addAuditLog('SURVEY_CREATED', 'ENGAGEMENT', {
      surveyId: newSurvey.id,
      title: newSurvey.title,
      type: newSurvey.type
    });
  };

  const handleCreateRecognition = () => {
    const newRecognition: Recognition = {
      id: Math.max(...recognitions.map(r => r.id)) + 1,
      fromEmployeeId: user?.id || 'USR001',
      fromEmployeeName: user?.email || 'System User',
      toEmployeeId: recognitionForm.toEmployeeId,
      toEmployeeName: 'Selected Employee', // Would be looked up
      type: recognitionForm.type,
      category: recognitionForm.category,
      title: recognitionForm.title,
      message: recognitionForm.message,
      points: recognitionForm.type === 'Peer Recognition' ? 50 : 100,
      isPublic: recognitionForm.isPublic,
      createdDate: new Date().toISOString().split('T')[0],
      likes: 0,
      comments: []
    };

    setRecognitions([newRecognition, ...recognitions]);
    setShowRecognitionDialog(false);
    resetRecognitionForm();

    addAuditLog('RECOGNITION_CREATED', 'ENGAGEMENT', {
      recognitionId: newRecognition.id,
      toEmployeeId: newRecognition.toEmployeeId,
      category: newRecognition.category
    });
  };

  const filteredSurveys = surveys.filter(survey =>
    survey.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    survey.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRecognitions = recognitions.filter(recognition =>
    recognition.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recognition.toEmployeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recognition.fromEmployeeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Engagement</h1>
          <p className="text-gray-600">Foster engagement, recognition, and continuous feedback culture</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowRecognitionDialog(true)} variant="outline">
            <Award className="mr-2 h-4 w-4" />
            Give Recognition
          </Button>
          {hasPermission('engagement.manage') && (
            <Button onClick={() => setShowSurveyDialog(true)} className="bg-gradient-to-r from-blue-600 to-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Survey
            </Button>
          )}
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {engagementMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getTrendIcon(metric.trend)}
                  <span className="text-sm font-medium text-gray-600">{metric.metric}</span>
                </div>
                <Badge variant="outline" className={metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                  {metric.trend === 'up' ? '+' : metric.trend === 'down' ? '-' : ''}{Math.abs(metric.current - metric.previous).toFixed(1)}
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold text-gray-900">{metric.current}</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Target: {metric.target}</span>
                  <span>Prev: {metric.previous}</span>
                </div>
                <Progress value={(metric.current / metric.target) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="surveys">Surveys</TabsTrigger>
          <TabsTrigger value="recognition">Recognition</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Engagement Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Engagement Trends</CardTitle>
                <CardDescription>Monthly satisfaction and participation rates</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyEngagement}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="satisfaction" stroke="#3B82F6" strokeWidth={2} name="Satisfaction" />
                    <Line type="monotone" dataKey="participation" stroke="#10B981" strokeWidth={2} name="Participation %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recognition Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recognition Activity</CardTitle>
                <CardDescription>Monthly recognition given and received</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyEngagement}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="recognition" fill="#8B5CF6" name="Recognitions" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activities */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Recognitions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recognitions.slice(0, 3).map((recognition) => (
                    <div key={recognition.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-white rounded-lg">
                        {getCategoryIcon(recognition.category)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{recognition.title}</p>
                        <p className="text-xs text-gray-600">
                          {recognition.fromEmployeeName} → {recognition.toEmployeeName}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{recognition.category}</Badge>
                          <span className="text-xs text-gray-500">{recognition.createdDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Surveys</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {surveys.filter(s => s.status === 'Active').map((survey) => (
                    <div key={survey.id} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{survey.title}</h4>
                        <Badge className={getStatusColor(survey.status)}>{survey.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{survey.description}</p>
                      <div className="flex justify-between items-center">
                        <div className="text-xs text-gray-500">
                          {survey.responses}/{survey.targetResponses} responses
                        </div>
                        <Progress value={(survey.responses / survey.targetResponses) * 100} className="w-20 h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Surveys Tab */}
        <TabsContent value="surveys" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search surveys..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid gap-6">
            {filteredSurveys.map((survey) => (
              <Card key={survey.id} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{survey.title}</h3>
                        <Badge className={getStatusColor(survey.status)}>{survey.status}</Badge>
                        <Badge variant="outline">{survey.type}</Badge>
                      </div>
                      <p className="text-gray-600 mb-3">{survey.description}</p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Created:</span>
                          <p className="font-medium">{survey.createdDate}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Period:</span>
                          <p className="font-medium">{survey.startDate} - {survey.endDate}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Responses:</span>
                          <p className="font-medium">{survey.responses}/{survey.targetResponses}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Avg Score:</span>
                          <p className="font-medium">{survey.averageScore?.toFixed(1) || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Progress value={(survey.responses / survey.targetResponses) * 100} className="w-32 h-2" />
                      <span className="text-sm text-gray-500">
                        {((survey.responses / survey.targetResponses) * 100).toFixed(0)}% complete
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Results
                      </Button>
                      {survey.status === 'Active' && (
                        <Button 
                          size="sm"
                          onClick={() => {
                            setSelectedSurvey(survey);
                            setShowSurveyResponseDialog(true);
                          }}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Take Survey
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Recognition Tab */}
        <TabsContent value="recognition" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search recognitions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-4">
            {filteredRecognitions.map((recognition) => (
              <Card key={recognition.id} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-gray-100 rounded-full">
                      {getCategoryIcon(recognition.category)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-gray-900">{recognition.title}</h3>
                          <Badge variant="outline">{recognition.category}</Badge>
                          <Badge className="bg-purple-100 text-purple-800">{recognition.type}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {recognition.likes}
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            {recognition.comments.length}
                          </Button>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{recognition.message}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span>
                            <strong>From:</strong> {recognition.fromEmployeeName}
                          </span>
                          <span>
                            <strong>To:</strong> {recognition.toEmployeeName}
                          </span>
                          <span className="text-gray-500">{recognition.createdDate}</span>
                        </div>
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                          <Gift className="h-3 w-3 mr-1" />
                          {recognition.points} pts
                        </Badge>
                      </div>
                      
                      {recognition.comments.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Comments</h4>
                          <div className="space-y-2">
                            {recognition.comments.map((comment) => (
                              <div key={comment.id} className="flex gap-2">
                                <Avatar className="h-6 w-6">
                                  <AvatarFallback className="text-xs">
                                    {comment.authorName.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <p className="text-sm text-gray-700">{comment.text}</p>
                                  <p className="text-xs text-gray-500">{comment.authorName} • {comment.createdDate}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Score Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { range: '4.5-5.0', count: 45, percentage: 35 },
                    { range: '4.0-4.4', count: 52, percentage: 40 },
                    { range: '3.5-3.9', count: 28, percentage: 22 },
                    { range: '3.0-3.4', count: 4, percentage: 3 },
                    { range: 'Below 3.0', count: 0, percentage: 0 }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{item.range}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={item.percentage} className="w-20 h-2" />
                        <span className="text-sm font-medium">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recognition Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { category: 'Excellence', count: 23, percentage: 40 },
                    { category: 'Teamwork', count: 18, percentage: 31 },
                    { category: 'Innovation', count: 8, percentage: 14 },
                    { category: 'Customer Service', count: 6, percentage: 10 },
                    { category: 'Leadership', count: 3, percentage: 5 }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(item.category)}
                        <span className="text-sm text-gray-600">{item.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={item.percentage} className="w-16 h-2" />
                        <span className="text-sm font-medium">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Survey Response Rates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {surveys.map((survey) => (
                    <div key={survey.id}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{survey.title}</span>
                        <span>{((survey.responses / survey.targetResponses) * 100).toFixed(0)}%</span>
                      </div>
                      <Progress value={(survey.responses / survey.targetResponses) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Survey Dialog */}
      <Dialog open={showSurveyDialog} onOpenChange={setShowSurveyDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Employee Survey</DialogTitle>
            <DialogDescription>
              Design a survey to gather feedback and measure engagement
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Survey Title</Label>
                <Input
                  value={surveyForm.title}
                  onChange={(e) => setSurveyForm({...surveyForm, title: e.target.value})}
                  placeholder="e.g., Q1 2025 Pulse Survey"
                />
              </div>
              <div className="space-y-2">
                <Label>Survey Type</Label>
                <Select value={surveyForm.type} onValueChange={(value: any) => setSurveyForm({...surveyForm, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pulse">Pulse Survey</SelectItem>
                    <SelectItem value="Annual">Annual Survey</SelectItem>
                    <SelectItem value="Exit">Exit Survey</SelectItem>
                    <SelectItem value="Onboarding">Onboarding Survey</SelectItem>
                    <SelectItem value="Custom">Custom Survey</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={surveyForm.description}
                onChange={(e) => setSurveyForm({...surveyForm, description: e.target.value})}
                placeholder="Brief description of the survey purpose"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={surveyForm.startDate}
                  onChange={(e) => setSurveyForm({...surveyForm, startDate: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={surveyForm.endDate}
                  onChange={(e) => setSurveyForm({...surveyForm, endDate: e.target.value})}
                  min={surveyForm.startDate || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSurveyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateSurvey} disabled={!surveyForm.title || !surveyForm.startDate}>
              Create Survey
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Give Recognition Dialog */}
      <Dialog open={showRecognitionDialog} onOpenChange={setShowRecognitionDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Give Recognition</DialogTitle>
            <DialogDescription>
              Recognize a colleague for their outstanding work and contributions
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Recognize Employee</Label>
              <Select value={recognitionForm.toEmployeeId} onValueChange={(value) => setRecognitionForm({...recognitionForm, toEmployeeId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee to recognize" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HB005">Grace Ajak - Personal Banking</SelectItem>
                  <SelectItem value="HB006">Michael Jok - Trade Finance</SelectItem>
                  <SelectItem value="HB007">Rebecca Akuoc - Risk Management</SelectItem>
                  <SelectItem value="HB008">David Majok - Information Technology</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Recognition Type</Label>
                <Select value={recognitionForm.type} onValueChange={(value: any) => setRecognitionForm({...recognitionForm, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Peer Recognition">Peer Recognition</SelectItem>
                    <SelectItem value="Manager Recognition">Manager Recognition</SelectItem>
                    <SelectItem value="Achievement">Achievement</SelectItem>
                    <SelectItem value="Milestone">Milestone</SelectItem>
                    <SelectItem value="Innovation">Innovation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={recognitionForm.category} onValueChange={(value: any) => setRecognitionForm({...recognitionForm, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Excellence">Excellence</SelectItem>
                    <SelectItem value="Teamwork">Teamwork</SelectItem>
                    <SelectItem value="Innovation">Innovation</SelectItem>
                    <SelectItem value="Customer Service">Customer Service</SelectItem>
                    <SelectItem value="Leadership">Leadership</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={recognitionForm.title}
                onChange={(e) => setRecognitionForm({...recognitionForm, title: e.target.value})}
                placeholder="Brief title for the recognition"
              />
            </div>

            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                value={recognitionForm.message}
                onChange={(e) => setRecognitionForm({...recognitionForm, message: e.target.value})}
                placeholder="Describe why you're recognizing this person..."
                rows={4}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={recognitionForm.isPublic}
                onChange={(e) => setRecognitionForm({...recognitionForm, isPublic: e.target.checked})}
                className="rounded border-gray-300"
              />
              <label htmlFor="isPublic" className="text-sm">Make this recognition public</label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRecognitionDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateRecognition} 
              disabled={!recognitionForm.toEmployeeId || !recognitionForm.title || !recognitionForm.message}
            >
              Give Recognition
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeEngagement; 