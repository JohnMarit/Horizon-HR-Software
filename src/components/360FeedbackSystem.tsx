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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { 
  Users2, 
  Star, 
  TrendingUp, 
  BarChart3, 
  Eye, 
  Plus, 
  MessageSquare,
  Target,
  Award,
  CheckCircle,
  Clock,
  UserPlus,
  PieChart,
  Activity,
  Send,
  FileText,
  Settings,
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface FeedbackRequest {
  id: number;
  employeeId: string;
  employeeName: string;
  department: string;
  position: string;
  reviewCycle: string;
  status: 'Draft' | 'Active' | 'Completed' | 'Cancelled';
  createdDate: string;
  dueDate: string;
  completedDate?: string;
  requestedBy: string;
  feedbackProviders: FeedbackProvider[];
  competencies: string[];
  overallScore?: number;
}

interface FeedbackProvider {
  id: number;
  type: 'Self' | 'Manager' | 'Peer' | 'Direct Report' | 'Customer' | 'External';
  name: string;
  email: string;
  status: 'Pending' | 'In Progress' | 'Completed' | 'Declined';
  submittedDate?: string;
  relationship: string;
  feedback?: FeedbackSubmission;
}

interface FeedbackSubmission {
  id: number;
  providerId: number;
  competencyRatings: { [competency: string]: number };
  strengths: string[];
  developmentAreas: string[];
  comments: string;
  recommendedActions: string[];
  overallRating: number;
  submittedDate: string;
}

interface Competency {
  id: string;
  name: string;
  description: string;
  category: 'Technical' | 'Leadership' | 'Communication' | 'Banking' | 'Compliance';
  weight: number;
  behaviorIndicators: string[];
}

const competencies: Competency[] = [
  {
    id: 'technical_expertise',
    name: 'Technical Banking Expertise',
    description: 'Demonstrates comprehensive knowledge of banking products, regulations, and procedures',
    category: 'Technical',
    weight: 25,
    behaviorIndicators: [
      'Stays current with banking regulations and industry trends',
      'Demonstrates deep product knowledge',
      'Applies technical skills effectively to solve problems',
      'Shares knowledge with team members'
    ]
  },
  {
    id: 'leadership',
    name: 'Leadership & Influence',
    description: 'Effectively leads teams, influences outcomes, and drives organizational success',
    category: 'Leadership',
    weight: 20,
    behaviorIndicators: [
      'Inspires and motivates team members',
      'Makes sound decisions under pressure',
      'Takes initiative and drives results',
      'Develops others and builds capabilities'
    ]
  },
  {
    id: 'communication',
    name: 'Communication & Collaboration',
    description: 'Communicates clearly and collaborates effectively across all levels',
    category: 'Communication',
    weight: 20,
    behaviorIndicators: [
      'Communicates clearly and concisely',
      'Listens actively and shows empathy',
      'Collaborates effectively with diverse teams',
      'Presents ideas persuasively'
    ]
  },
  {
    id: 'customer_focus',
    name: 'Customer Excellence',
    description: 'Delivers exceptional customer service and builds lasting relationships',
    category: 'Banking',
    weight: 15,
    behaviorIndicators: [
      'Prioritizes customer needs and satisfaction',
      'Resolves customer issues proactively',
      'Builds trust and long-term relationships',
      'Identifies opportunities to enhance customer experience'
    ]
  },
  {
    id: 'compliance',
    name: 'Risk & Compliance',
    description: 'Maintains highest standards of compliance and risk management',
    category: 'Compliance',
    weight: 10,
    behaviorIndicators: [
      'Follows all regulatory requirements',
      'Identifies and mitigates risks proactively',
      'Maintains ethical standards',
      'Reports concerns appropriately'
    ]
  },
  {
    id: 'innovation',
    name: 'Innovation & Adaptability',
    description: 'Embraces change, drives innovation, and adapts to new challenges',
    category: 'Technical',
    weight: 10,
    behaviorIndicators: [
      'Proposes innovative solutions',
      'Adapts quickly to change',
      'Learns new technologies and processes',
      'Challenges status quo constructively'
    ]
  }
];

const FeedbackSystem360: React.FC = () => {
  const { user, hasPermission, addAuditLog } = useAuth();
  const [activeTab, setActiveTab] = useState('requests');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [showAnalyticsDialog, setShowAnalyticsDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<FeedbackRequest | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<FeedbackProvider | null>(null);

  // Mock data for demonstration
  const [feedbackRequests, setFeedbackRequests] = useState<FeedbackRequest[]>([
    {
      id: 1,
      employeeId: 'HB005',
      employeeName: 'Grace Ajak',
      department: 'Personal Banking',
      position: 'Customer Relationship Manager',
      reviewCycle: '2024 Annual Review',
      status: 'Active',
      createdDate: '2024-12-01',
      dueDate: '2024-12-31',
      requestedBy: 'Sarah Akol',
      competencies: ['technical_expertise', 'customer_focus', 'communication', 'compliance'],
      feedbackProviders: [
        { id: 1, type: 'Self', name: 'Grace Ajak', email: 'grace.ajak@horizonbankss.com', status: 'Completed', relationship: 'Self Assessment', submittedDate: '2024-12-15' },
        { id: 2, type: 'Manager', name: 'Mary Deng', email: 'mary.deng@horizonbankss.com', status: 'Completed', relationship: 'Direct Manager', submittedDate: '2024-12-18' },
        { id: 3, type: 'Peer', name: 'Michael Jok', email: 'michael.jok@horizonbankss.com', status: 'In Progress', relationship: 'Team Colleague' },
        { id: 4, type: 'Peer', name: 'Anna Nyong', email: 'anna.nyong@horizonbankss.com', status: 'Pending', relationship: 'Cross-functional Peer' },
        { id: 5, type: 'Direct Report', name: 'John Kuol', email: 'john.kuol@horizonbankss.com', status: 'Completed', relationship: 'Team Member', submittedDate: '2024-12-20' }
      ],
      overallScore: 8.4
    },
    {
      id: 2,
      employeeId: 'HB006',
      employeeName: 'Michael Jok',
      department: 'Trade Finance',
      position: 'Trade Finance Officer',
      reviewCycle: '2024 Annual Review',
      status: 'Completed',
      createdDate: '2024-11-15',
      dueDate: '2024-12-15',
      completedDate: '2024-12-10',
      requestedBy: 'Peter Musa',
      competencies: ['technical_expertise', 'leadership', 'innovation', 'compliance'],
      feedbackProviders: [
        { id: 6, type: 'Self', name: 'Michael Jok', email: 'michael.jok@horizonbankss.com', status: 'Completed', relationship: 'Self Assessment', submittedDate: '2024-11-25' },
        { id: 7, type: 'Manager', name: 'Peter Musa', email: 'peter.musa@horizonbankss.com', status: 'Completed', relationship: 'Direct Manager', submittedDate: '2024-12-05' },
        { id: 8, type: 'Peer', name: 'Grace Ajak', email: 'grace.ajak@horizonbankss.com', status: 'Completed', relationship: 'Cross-department Peer', submittedDate: '2024-12-08' },
        { id: 9, type: 'Customer', name: 'Global Trade Corp', email: 'contact@globaltrade.com', status: 'Completed', relationship: 'Key Client', submittedDate: '2024-12-10' }
      ],
      overallScore: 9.1
    }
  ]);

  const [createForm, setCreateForm] = useState({
    employeeId: '',
    reviewCycle: '',
    dueDate: '',
    competencies: [] as string[],
    providers: [] as { type: string; name: string; email: string; relationship: string }[]
  });

  const [feedbackForm, setFeedbackForm] = useState({
    competencyRatings: {} as { [key: string]: number },
    strengths: '',
    developmentAreas: '',
    comments: '',
    recommendedActions: '',
    overallRating: 0
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Active': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Pending': return 'bg-gray-100 text-gray-800';
      case 'Declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProviderTypeIcon = (type: string) => {
    switch (type) {
      case 'Self': return <User className="h-4 w-4" />;
      case 'Manager': return <Award className="h-4 w-4" />;
      case 'Peer': return <Users2 className="h-4 w-4" />;
      case 'Direct Report': return <UserPlus className="h-4 w-4" />;
      case 'Customer': return <Star className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const calculateCompetencyAverage = (request: FeedbackRequest, competencyId: string) => {
    const completedProviders = request.feedbackProviders.filter(p => p.status === 'Completed' && p.feedback);
    if (completedProviders.length === 0) return 0;
    
    const total = completedProviders.reduce((sum, provider) => {
      return sum + (provider.feedback?.competencyRatings[competencyId] || 0);
    }, 0);
    
    return total / completedProviders.length;
  };

  const getCompletionRate = (request: FeedbackRequest) => {
    const completed = request.feedbackProviders.filter(p => p.status === 'Completed').length;
    return (completed / request.feedbackProviders.length) * 100;
  };

  const resetCreateForm = () => {
    setCreateForm({
      employeeId: '',
      reviewCycle: '',
      dueDate: '',
      competencies: [],
      providers: []
    });
  };

  const resetFeedbackForm = () => {
    setFeedbackForm({
      competencyRatings: {},
      strengths: '',
      developmentAreas: '',
      comments: '',
      recommendedActions: '',
      overallRating: 0
    });
  };

  const handleCreateRequest = () => {
    const newRequest: FeedbackRequest = {
      id: Math.max(...feedbackRequests.map(r => r.id)) + 1,
      employeeId: createForm.employeeId,
      employeeName: 'Selected Employee', // This would come from employee lookup
      department: 'Department',
      position: 'Position',
      reviewCycle: createForm.reviewCycle,
      status: 'Active',
      createdDate: new Date().toISOString().split('T')[0],
      dueDate: createForm.dueDate,
      requestedBy: user?.email || 'System',
      competencies: createForm.competencies,
      feedbackProviders: createForm.providers.map((p, index) => ({
        id: Date.now() + index,
        type: p.type as any,
        name: p.name,
        email: p.email,
        status: 'Pending' as const,
        relationship: p.relationship
      }))
    };

    setFeedbackRequests([newRequest, ...feedbackRequests]);
    setShowCreateDialog(false);
    resetCreateForm();

    addAuditLog('360_FEEDBACK_REQUEST_CREATED', 'PERFORMANCE', {
      requestId: newRequest.id,
      employeeId: newRequest.employeeId,
      competencies: newRequest.competencies,
      providersCount: newRequest.feedbackProviders.length
    });
  };

  const handleSubmitFeedback = () => {
    if (!selectedProvider || !selectedRequest) return;

    const newFeedback: FeedbackSubmission = {
      id: Date.now(),
      providerId: selectedProvider.id,
      competencyRatings: feedbackForm.competencyRatings,
      strengths: feedbackForm.strengths.split('\n').filter(s => s.trim()),
      developmentAreas: feedbackForm.developmentAreas.split('\n').filter(d => d.trim()),
      comments: feedbackForm.comments,
      recommendedActions: feedbackForm.recommendedActions.split('\n').filter(a => a.trim()),
      overallRating: feedbackForm.overallRating,
      submittedDate: new Date().toISOString().split('T')[0]
    };

    // Update the provider with the feedback
    const updatedRequests = feedbackRequests.map(request => {
      if (request.id === selectedRequest.id) {
        const updatedProviders = request.feedbackProviders.map(provider => {
          if (provider.id === selectedProvider.id) {
            return {
              ...provider,
              status: 'Completed' as const,
              submittedDate: newFeedback.submittedDate,
              feedback: newFeedback
            };
          }
          return provider;
        });
        return { ...request, feedbackProviders: updatedProviders };
      }
      return request;
    });

    setFeedbackRequests(updatedRequests);
    setShowFeedbackDialog(false);
    setSelectedProvider(null);
    setSelectedRequest(null);
    resetFeedbackForm();

    addAuditLog('360_FEEDBACK_SUBMITTED', 'PERFORMANCE', {
      requestId: selectedRequest.id,
      providerId: selectedProvider.id,
      overallRating: newFeedback.overallRating
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">360° Feedback System</h1>
          <p className="text-gray-600">Comprehensive multi-source performance feedback and development insights</p>
        </div>
        {hasPermission('performance.manage') && (
          <Button onClick={() => setShowCreateDialog(true)} className="bg-gradient-to-r from-blue-600 to-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Create 360° Review
          </Button>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Active Reviews</p>
                <p className="text-2xl font-bold text-gray-900">
                  {feedbackRequests.filter(r => r.status === 'Active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Reviews</p>
                <p className="text-2xl font-bold text-gray-900">
                  {feedbackRequests.filter(r => r.status === 'Completed').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Feedback</p>
                <p className="text-2xl font-bold text-gray-900">
                  {feedbackRequests.reduce((sum, r) => sum + r.feedbackProviders.filter(p => p.status === 'Pending').length, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Star className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(feedbackRequests
                    .filter(r => r.overallScore)
                    .reduce((sum, r) => sum + (r.overallScore || 0), 0) / 
                    feedbackRequests.filter(r => r.overallScore).length || 0).toFixed(1)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="requests">Feedback Requests</TabsTrigger>
          <TabsTrigger value="pending">My Pending Feedback</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="competencies">Competencies</TabsTrigger>
        </TabsList>

        {/* Feedback Requests Tab */}
        <TabsContent value="requests" className="space-y-6">
          <div className="grid gap-6">
            {feedbackRequests.map((request) => (
              <Card key={request.id} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {request.employeeName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{request.employeeName}</h3>
                        <p className="text-sm text-gray-600">{request.position} • {request.department}</p>
                        <p className="text-xs text-gray-500">Review Cycle: {request.reviewCycle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                      {request.overallScore && (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                          <Star className="h-3 w-3 mr-1" />
                          {request.overallScore.toFixed(1)}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Feedback Progress</span>
                      <span>{getCompletionRate(request).toFixed(0)}% Complete</span>
                    </div>
                    <Progress value={getCompletionRate(request)} className="h-2" />
                  </div>

                  {/* Feedback Providers */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                    {request.feedbackProviders.map((provider) => (
                      <div key={provider.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          {getProviderTypeIcon(provider.type)}
                          <div>
                            <p className="text-sm font-medium">{provider.name}</p>
                            <p className="text-xs text-gray-500">{provider.type}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(provider.status)} variant="outline">
                          {provider.status}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  {/* Competency Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                    {request.competencies.map((competencyId) => {
                      const competency = competencies.find(c => c.id === competencyId);
                      const avgScore = calculateCompetencyAverage(request, competencyId);
                      return (
                        <div key={competencyId} className="p-3 border rounded-lg">
                          <div className="flex justify-between items-center mb-2">
                            <p className="text-sm font-medium">{competency?.name}</p>
                            <span className="text-sm font-bold">{avgScore.toFixed(1)}</span>
                          </div>
                          <Progress value={avgScore * 20} className="h-1" />
                        </div>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowAnalyticsDialog(true);
                      }}
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Analytics
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const pendingProvider = request.feedbackProviders.find(p => 
                          p.status === 'Pending' && p.email === user?.email
                        );
                        if (pendingProvider) {
                          setSelectedRequest(request);
                          setSelectedProvider(pendingProvider);
                          setShowFeedbackDialog(true);
                        }
                      }}
                      disabled={!request.feedbackProviders.some(p => p.status === 'Pending' && p.email === user?.email)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Provide Feedback
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Pending Feedback Tab */}
        <TabsContent value="pending" className="space-y-6">
          <div className="grid gap-4">
            {feedbackRequests
              .filter(request => request.feedbackProviders.some(p => p.email === user?.email && p.status === 'Pending'))
              .map((request) => {
                const myProvider = request.feedbackProviders.find(p => p.email === user?.email);
                return (
                  <Card key={request.id} className="border-l-4 border-l-orange-400">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{request.employeeName}</h3>
                          <p className="text-sm text-gray-600">{request.position} • {request.department}</p>
                          <p className="text-xs text-gray-500">As: {myProvider?.type} • Due: {request.dueDate}</p>
                        </div>
                        <Button
                          onClick={() => {
                            setSelectedRequest(request);
                            setSelectedProvider(myProvider || null);
                            setShowFeedbackDialog(true);
                          }}
                          className="bg-orange-600 hover:bg-orange-700"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Provide Feedback
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Competency Trends</CardTitle>
                <CardDescription>Average ratings across all completed reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {competencies.map((competency) => {
                    const avgRating = 4.2; // This would be calculated from actual data
                    return (
                      <div key={competency.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{competency.name}</span>
                          <span>{avgRating.toFixed(1)}/5</span>
                        </div>
                        <Progress value={avgRating * 20} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feedback Distribution</CardTitle>
                <CardDescription>Sources of feedback across the organization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Manager', 'Peer', 'Direct Report', 'Self', 'Customer'].map((type) => {
                    const count = Math.floor(Math.random() * 20) + 5; // Mock data
                    return (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getProviderTypeIcon(type)}
                          <span className="text-sm">{type}</span>
                        </div>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Competencies Tab */}
        <TabsContent value="competencies" className="space-y-6">
          <div className="grid gap-6">
            {competencies.map((competency) => (
              <Card key={competency.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{competency.name}</CardTitle>
                      <CardDescription>{competency.description}</CardDescription>
                    </div>
                    <Badge variant="outline">{competency.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Weight: {competency.weight}%</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Behavior Indicators:</p>
                      <ul className="space-y-1">
                        {competency.behaviorIndicators.map((indicator, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                            {indicator}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Request Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create 360° Feedback Request</DialogTitle>
            <DialogDescription>
              Set up a comprehensive feedback review for an employee
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Employee</Label>
                <Select value={createForm.employeeId} onValueChange={(value) => setCreateForm({...createForm, employeeId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HB005">Grace Ajak - Personal Banking</SelectItem>
                    <SelectItem value="HB006">Michael Jok - Trade Finance</SelectItem>
                    <SelectItem value="HB007">Rebecca Akuoc - Risk Management</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Review Cycle</Label>
                <Input
                  value={createForm.reviewCycle}
                  onChange={(e) => setCreateForm({...createForm, reviewCycle: e.target.value})}
                  placeholder="e.g., 2024 Annual Review"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input
                type="date"
                value={createForm.dueDate}
                onChange={(e) => setCreateForm({...createForm, dueDate: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="space-y-2">
              <Label>Competencies to Assess</Label>
              <div className="grid grid-cols-2 gap-2">
                {competencies.map((competency) => (
                  <div key={competency.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={competency.id}
                      checked={createForm.competencies.includes(competency.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCreateForm({...createForm, competencies: [...createForm.competencies, competency.id]});
                        } else {
                          setCreateForm({...createForm, competencies: createForm.competencies.filter(c => c !== competency.id)});
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor={competency.id} className="text-sm">{competency.name}</label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRequest} disabled={!createForm.employeeId || !createForm.reviewCycle}>
              Create Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Feedback Submission Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Provide 360° Feedback</DialogTitle>
            <DialogDescription>
              {selectedRequest && selectedProvider && (
                <>Providing feedback for {selectedRequest.employeeName} as {selectedProvider.type}</>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6">
              {/* Competency Ratings */}
              <div className="space-y-4">
                <h4 className="font-medium">Competency Ratings</h4>
                {selectedRequest.competencies.map((competencyId) => {
                  const competency = competencies.find(c => c.id === competencyId);
                  return (
                    <div key={competencyId} className="p-4 border rounded-lg space-y-3">
                      <div>
                        <p className="font-medium">{competency?.name}</p>
                        <p className="text-sm text-gray-600">{competency?.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Rating:</span>
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => setFeedbackForm({
                              ...feedbackForm,
                              competencyRatings: {
                                ...feedbackForm.competencyRatings,
                                [competencyId]: rating
                              }
                            })}
                            className={`p-1 rounded ${
                              feedbackForm.competencyRatings[competencyId] >= rating
                                ? 'text-yellow-500'
                                : 'text-gray-300'
                            }`}
                          >
                            <Star className="h-5 w-5 fill-current" />
                          </button>
                        ))}
                        <span className="text-sm ml-2">
                          {feedbackForm.competencyRatings[competencyId] || 0}/5
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Qualitative Feedback */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Key Strengths</Label>
                  <Textarea
                    value={feedbackForm.strengths}
                    onChange={(e) => setFeedbackForm({...feedbackForm, strengths: e.target.value})}
                    placeholder="List key strengths (one per line)"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Development Areas</Label>
                  <Textarea
                    value={feedbackForm.developmentAreas}
                    onChange={(e) => setFeedbackForm({...feedbackForm, developmentAreas: e.target.value})}
                    placeholder="List areas for development (one per line)"
                    rows={4}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Additional Comments</Label>
                <Textarea
                  value={feedbackForm.comments}
                  onChange={(e) => setFeedbackForm({...feedbackForm, comments: e.target.value})}
                  placeholder="Provide additional context and specific examples"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Recommended Actions</Label>
                <Textarea
                  value={feedbackForm.recommendedActions}
                  onChange={(e) => setFeedbackForm({...feedbackForm, recommendedActions: e.target.value})}
                  placeholder="Suggest specific actions for improvement (one per line)"
                  rows={3}
                />
              </div>

              {/* Overall Rating */}
              <div className="space-y-2">
                <Label>Overall Rating</Label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setFeedbackForm({...feedbackForm, overallRating: rating})}
                      className={`p-1 rounded ${
                        feedbackForm.overallRating >= rating
                          ? 'text-yellow-500'
                          : 'text-gray-300'
                      }`}
                    >
                      <Star className="h-6 w-6 fill-current" />
                    </button>
                  ))}
                  <span className="text-sm ml-2">
                    {feedbackForm.overallRating}/5
                  </span>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFeedbackDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitFeedback}
              disabled={feedbackForm.overallRating === 0}
            >
              Submit Feedback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeedbackSystem360; 