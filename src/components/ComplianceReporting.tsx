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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  ShieldCheckIcon, 
  AlertTriangleIcon, 
  FileTextIcon, 
  DownloadIcon,
  TrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  BarChartIcon,
  PlusIcon,
  EyeIcon
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface HealthSafetyIncident {
  id: number;
  incidentNumber: string;
  employeeId: string;
  employeeName: string;
  department: string;
  incidentType: 'Injury' | 'Near Miss' | 'Property Damage' | 'Environmental' | 'Security Breach' | 'Other';
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  location: string;
  incidentDate: string;
  reportedDate: string;
  reportedBy: string;
  status: 'Reported' | 'Under Investigation' | 'Resolved' | 'Closed';
  corrective_actions: string[];
  witnesses: string[];
  investigationFindings?: string;
  preventiveMeasures?: string;
  closureDate?: string;
}

interface ComplianceReport {
  id: number;
  reportType: 'Labour Inspection' | 'Gender Diversity' | 'Training Compliance' | 'Bank of South Sudan' | 'Revenue Authority' | 'Custom';
  title: string;
  period: string;
  generatedDate: string;
  status: 'Draft' | 'Generated' | 'Submitted' | 'Approved';
  recipient: string;
  dueDate?: string;
  submittedDate?: string;
  complianceScore: number;
  findings: string[];
  recommendations: string[];
}

interface ComplianceMetric {
  category: string;
  metric: string;
  current: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  status: 'compliant' | 'warning' | 'non-compliant';
}

export const ComplianceReporting: React.FC = () => {
  const { user, hasPermission, addAuditLog } = useAuth();
  const [activeTab, setActiveTab] = useState('incidents');
  const [showNewIncidentDialog, setShowNewIncidentDialog] = useState(false);
  const [showGenerateReportDialog, setShowGenerateReportDialog] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<HealthSafetyIncident | null>(null);

  // Form states
  const [incidentForm, setIncidentForm] = useState({
    employeeId: '',
    employeeName: '',
    department: '',
    incidentType: 'Near Miss' as const,
    severity: 'Low' as const,
    description: '',
    location: '',
    incidentDate: '',
    witnesses: '',
    correctiveActions: ''
  });

  const [reportForm, setReportForm] = useState({
    reportType: 'Labour Inspection' as const,
    title: '',
    period: '',
    recipient: '',
    dueDate: ''
  });

  // Mock data for health & safety incidents
  const [incidents, setIncidents] = useState<HealthSafetyIncident[]>([
    {
      id: 1,
      incidentNumber: 'HS-2025-001',
      employeeId: 'HB008',
      employeeName: 'David Majok',
      department: 'Information Technology',
      incidentType: 'Near Miss',
      severity: 'Medium',
      description: 'Employee almost tripped on loose network cable in server room',
      location: 'Server Room - 2nd Floor',
      incidentDate: '2025-01-15',
      reportedDate: '2025-01-15',
      reportedBy: 'David Majok',
      status: 'Resolved',
      corrective_actions: ['Secured loose cables', 'Installed cable management system', 'Added warning signs'],
      witnesses: ['IT Support Staff'],
      investigationFindings: 'Improper cable management led to safety hazard',
      preventiveMeasures: 'Regular safety inspections of server room, proper cable management training',
      closureDate: '2025-01-18'
    },
    {
      id: 2,
      incidentNumber: 'HS-2025-002',
      employeeId: 'HB005',
      employeeName: 'Grace Ajak',
      department: 'Personal Banking',
      incidentType: 'Injury',
      severity: 'Low',
      description: 'Minor cut on finger from paper while handling customer documents',
      location: 'Customer Service Desk - Ground Floor',
      incidentDate: '2025-01-20',
      reportedDate: '2025-01-20',
      reportedBy: 'Grace Ajak',
      status: 'Under Investigation',
      corrective_actions: ['First aid administered', 'Incident reported to HR'],
      witnesses: ['Customer Service Supervisor']
    }
  ]);

  // Mock data for compliance reports
  const [complianceReports, setComplianceReports] = useState<ComplianceReport[]>([
    {
      id: 1,
      reportType: 'Labour Inspection',
      title: 'Labour Inspection Readiness Report - Q4 2024',
      period: '2024-Q4',
      generatedDate: '2025-01-10',
      status: 'Submitted',
      recipient: 'Ministry of Labour - South Sudan',
      dueDate: '2025-01-15',
      submittedDate: '2025-01-12',
      complianceScore: 96,
      findings: ['All employee records compliant', 'Leave policies aligned with Labour Act 2017', 'Minor documentation gaps in training records'],
      recommendations: ['Update training documentation', 'Implement quarterly compliance reviews']
    },
    {
      id: 2,
      reportType: 'Gender Diversity',
      title: 'Workforce Gender Diversity Report - 2024',
      period: '2024-Annual',
      generatedDate: '2025-01-05',
      status: 'Approved',
      recipient: 'Ministry of Gender & Social Welfare',
      dueDate: '2025-01-31',
      submittedDate: '2025-01-15',
      complianceScore: 89,
      findings: ['40% female representation achieved', 'Gender pay gap reduced to 3%', 'Leadership positions: 35% female'],
      recommendations: ['Increase female leadership to 40%', 'Implement mentorship programs', 'Continue gender equality initiatives']
    },
    {
      id: 3,
      reportType: 'Bank of South Sudan',
      title: 'Banking Staff Compliance & Certification Report',
      period: '2024-Q4',
      generatedDate: '2025-01-08',
      status: 'Generated',
      recipient: 'Bank of South Sudan - Supervision Department',
      dueDate: '2025-02-01',
      complianceScore: 94,
      findings: ['95% AML certification completion', '100% KYC training compliance', 'Risk management certification at 92%'],
      recommendations: ['Complete remaining AML certifications', 'Schedule risk management refresher training']
    }
  ]);

  // Compliance metrics dashboard
  const complianceMetrics: ComplianceMetric[] = [
    {
      category: 'Training Compliance',
      metric: 'Mandatory Training Completion',
      current: 94,
      target: 95,
      trend: 'up',
      status: 'warning'
    },
    {
      category: 'Labour Law',
      metric: 'Leave Policy Compliance',
      current: 98,
      target: 95,
      trend: 'stable',
      status: 'compliant'
    },
    {
      category: 'Gender Diversity',
      metric: 'Female Employee Percentage',
      current: 42,
      target: 40,
      trend: 'up',
      status: 'compliant'
    },
    {
      category: 'Banking Regulation',
      metric: 'AML Certification Rate',
      current: 95,
      target: 100,
      trend: 'up',
      status: 'warning'
    },
    {
      category: 'Health & Safety',
      metric: 'Incident Response Time (hours)',
      current: 2,
      target: 4,
      trend: 'down',
      status: 'compliant'
    },
    {
      category: 'Documentation',
      metric: 'Employee Record Completeness',
      current: 97,
      target: 95,
      trend: 'stable',
      status: 'compliant'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Reported':
      case 'Draft': return 'bg-blue-100 text-blue-800';
      case 'Under Investigation':
      case 'Generated': return 'bg-yellow-100 text-yellow-800';
      case 'Resolved':
      case 'Submitted': return 'bg-green-100 text-green-800';
      case 'Closed':
      case 'Approved': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMetricStatusColor = (status: string) => {
    switch (status) {
      case 'compliant': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'non-compliant': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const generateIncidentNumber = () => {
    const year = new Date().getFullYear();
    const nextNumber = incidents.length + 1;
    return `HS-${year}-${nextNumber.toString().padStart(3, '0')}`;
  };

  const handleCreateIncident = () => {
    const newIncident: HealthSafetyIncident = {
      id: Math.max(...incidents.map(i => i.id)) + 1,
      incidentNumber: generateIncidentNumber(),
      employeeId: incidentForm.employeeId,
      employeeName: incidentForm.employeeName,
      department: incidentForm.department,
      incidentType: incidentForm.incidentType,
      severity: incidentForm.severity,
      description: incidentForm.description,
      location: incidentForm.location,
      incidentDate: incidentForm.incidentDate,
      reportedDate: new Date().toISOString().split('T')[0],
      reportedBy: user?.name || 'HR Manager',
      status: 'Reported',
      corrective_actions: incidentForm.correctiveActions.split(',').map(a => a.trim()).filter(a => a),
      witnesses: incidentForm.witnesses.split(',').map(w => w.trim()).filter(w => w)
    };

    setIncidents([...incidents, newIncident]);
    setShowNewIncidentDialog(false);
    resetIncidentForm();

    addAuditLog('HEALTH_SAFETY_INCIDENT_REPORTED', 'COMPLIANCE', {
      incidentId: newIncident.id,
      incidentNumber: newIncident.incidentNumber,
      incidentType: newIncident.incidentType,
      severity: newIncident.severity
    });
  };

  const handleGenerateReport = () => {
    const newReport: ComplianceReport = {
      id: Math.max(...complianceReports.map(r => r.id)) + 1,
      reportType: reportForm.reportType,
      title: reportForm.title,
      period: reportForm.period,
      generatedDate: new Date().toISOString().split('T')[0],
      status: 'Generated',
      recipient: reportForm.recipient,
      dueDate: reportForm.dueDate,
      complianceScore: Math.floor(Math.random() * 20) + 80, // Mock score between 80-100
      findings: [],
      recommendations: []
    };

    setComplianceReports([...complianceReports, newReport]);
    setShowGenerateReportDialog(false);
    resetReportForm();

    addAuditLog('COMPLIANCE_REPORT_GENERATED', 'COMPLIANCE', {
      reportId: newReport.id,
      reportType: newReport.reportType,
      period: newReport.period
    });
  };

  const resetIncidentForm = () => {
    setIncidentForm({
      employeeId: '',
      employeeName: '',
      department: '',
      incidentType: 'Near Miss',
      severity: 'Low',
      description: '',
      location: '',
      incidentDate: '',
      witnesses: '',
      correctiveActions: ''
    });
  };

  const resetReportForm = () => {
    setReportForm({
      reportType: 'Labour Inspection',
      title: '',
      period: '',
      recipient: '',
      dueDate: ''
    });
  };

  // Permission check
  if (!hasPermission('compliance.view') && !hasPermission('*')) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <ShieldCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">Access Restricted</h3>
          <p className="mt-2 text-gray-500">You don't have permission to view compliance reporting.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance Reporting & Health Safety</h1>
          <p className="text-gray-600">Monitor compliance metrics and manage health & safety incidents</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowNewIncidentDialog(true)}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <AlertTriangleIcon className="mr-2 h-4 w-4" />
            Report Incident
          </Button>
          {(hasPermission('compliance.manage') || hasPermission('*')) && (
            <Button 
              onClick={() => setShowGenerateReportDialog(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <FileTextIcon className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          )}
        </div>
      </div>

      {/* Compliance Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {complianceMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-gray-600">{metric.category}</CardTitle>
              <CardDescription className="text-xs">{metric.metric}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className={`text-lg font-bold ${getMetricStatusColor(metric.status)}`}>
                  {metric.current}{metric.metric.includes('Percentage') ? '%' : metric.metric.includes('hours') ? 'h' : ''}
                </div>
                <Progress 
                  value={metric.metric.includes('hours') ? (metric.target / metric.current) * 100 : (metric.current / metric.target) * 100} 
                  className="h-2"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Target: {metric.target}{metric.metric.includes('Percentage') ? '%' : metric.metric.includes('hours') ? 'h' : ''}</span>
                  <span className={metric.trend === 'up' ? 'text-green-600' : metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'}>
                    {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Legal Compliance Alert */}
      <Alert className="border-green-200 bg-green-50">
        <ShieldCheckIcon className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>South Sudan Compliance Status:</strong> All reporting systems are aligned with South Sudan Labour Act 2017, Income Tax Act 2009 (Amended 2016), and Bank of South Sudan regulatory requirements.
        </AlertDescription>
      </Alert>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="incidents" className="flex items-center gap-2">
            <AlertTriangleIcon className="h-4 w-4" />
            Health & Safety Incidents
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileTextIcon className="h-4 w-4" />
            Compliance Reports
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChartIcon className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Health & Safety Incidents Tab */}
        <TabsContent value="incidents">
          <Card>
            <CardHeader>
              <CardTitle>Health & Safety Incident Log</CardTitle>
              <CardDescription>OSHA-style incident tracking for workplace safety compliance</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Incident #</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {incidents.map((incident) => (
                    <TableRow key={incident.id}>
                      <TableCell className="font-medium">{incident.incidentNumber}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{incident.employeeName}</div>
                          <div className="text-sm text-gray-500">{incident.department}</div>
                        </div>
                      </TableCell>
                      <TableCell>{incident.incidentType}</TableCell>
                      <TableCell>
                        <Badge className={getSeverityColor(incident.severity)}>
                          {incident.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>{incident.location}</TableCell>
                      <TableCell>{new Date(incident.incidentDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(incident.status)}>
                          {incident.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedIncident(incident)}
                        >
                          <EyeIcon className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Reports Tab */}
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Regulatory Compliance Reports</CardTitle>
              <CardDescription>Automated reports for regulatory authorities</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Compliance Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {complianceReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>{report.reportType}</TableCell>
                      <TableCell className="font-medium">{report.title}</TableCell>
                      <TableCell>{report.period}</TableCell>
                      <TableCell>{report.recipient}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={report.complianceScore} className="w-16 h-2" />
                          <span className="text-sm font-medium">{report.complianceScore}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{report.dueDate ? new Date(report.dueDate).toLocaleDateString() : '-'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <EyeIcon className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <DownloadIcon className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Trends</CardTitle>
                <CardDescription>Monthly compliance score trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Overall Compliance Score</span>
                    <span className="text-2xl font-bold text-green-600">94%</span>
                  </div>
                  <Progress value={94} className="h-3" />
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">This Month:</span>
                      <div className="font-medium">94% (+2%)</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Target:</span>
                      <div className="font-medium">95%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Incident Statistics</CardTitle>
                <CardDescription>Health & safety incident breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">2</div>
                      <div className="text-sm text-gray-600">Total Incidents</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">1.5</div>
                      <div className="text-sm text-gray-600">Avg Response (hrs)</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Near Miss</span>
                      <span className="text-sm font-medium">50%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Injury</span>
                      <span className="text-sm font-medium">50%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* New Incident Dialog */}
      <Dialog open={showNewIncidentDialog} onOpenChange={setShowNewIncidentDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Report Health & Safety Incident</DialogTitle>
            <DialogDescription>
              Report workplace incidents for investigation and prevention
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inc-employee-id">Employee ID</Label>
                <Input
                  id="inc-employee-id"
                  value={incidentForm.employeeId}
                  onChange={(e) => setIncidentForm({...incidentForm, employeeId: e.target.value})}
                  placeholder="e.g. HB001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inc-employee-name">Employee Name</Label>
                <Input
                  id="inc-employee-name"
                  value={incidentForm.employeeName}
                  onChange={(e) => setIncidentForm({...incidentForm, employeeName: e.target.value})}
                  placeholder="Full name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="inc-department">Department</Label>
              <Input
                id="inc-department"
                value={incidentForm.department}
                onChange={(e) => setIncidentForm({...incidentForm, department: e.target.value})}
                placeholder="Employee's department"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="inc-type">Incident Type</Label>
                <Select 
                  value={incidentForm.incidentType} 
                  onValueChange={(value: any) => setIncidentForm({...incidentForm, incidentType: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Near Miss">Near Miss</SelectItem>
                    <SelectItem value="Injury">Injury</SelectItem>
                    <SelectItem value="Property Damage">Property Damage</SelectItem>
                    <SelectItem value="Environmental">Environmental</SelectItem>
                    <SelectItem value="Security Breach">Security Breach</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="inc-severity">Severity</Label>
                <Select 
                  value={incidentForm.severity} 
                  onValueChange={(value: any) => setIncidentForm({...incidentForm, severity: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="inc-date">Incident Date</Label>
                <Input
                  id="inc-date"
                  type="date"
                  value={incidentForm.incidentDate}
                  onChange={(e) => setIncidentForm({...incidentForm, incidentDate: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="inc-location">Location</Label>
              <Input
                id="inc-location"
                value={incidentForm.location}
                onChange={(e) => setIncidentForm({...incidentForm, location: e.target.value})}
                placeholder="Specific location where incident occurred"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inc-description">Incident Description</Label>
              <Textarea
                id="inc-description"
                value={incidentForm.description}
                onChange={(e) => setIncidentForm({...incidentForm, description: e.target.value})}
                placeholder="Detailed description of what happened..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inc-witnesses">Witnesses</Label>
              <Input
                id="inc-witnesses"
                value={incidentForm.witnesses}
                onChange={(e) => setIncidentForm({...incidentForm, witnesses: e.target.value})}
                placeholder="Comma-separated list of witnesses"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="inc-actions">Immediate Corrective Actions</Label>
              <Textarea
                id="inc-actions"
                value={incidentForm.correctiveActions}
                onChange={(e) => setIncidentForm({...incidentForm, correctiveActions: e.target.value})}
                placeholder="Actions taken immediately after the incident..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewIncidentDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateIncident} className="bg-orange-600 hover:bg-orange-700">
              Report Incident
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Generate Report Dialog */}
      <Dialog open={showGenerateReportDialog} onOpenChange={setShowGenerateReportDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Generate Compliance Report</DialogTitle>
            <DialogDescription>
              Create automated compliance reports for regulatory authorities
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="report-type">Report Type</Label>
              <Select 
                value={reportForm.reportType} 
                onValueChange={(value: any) => setReportForm({...reportForm, reportType: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Labour Inspection">Labour Inspection Readiness</SelectItem>
                  <SelectItem value="Gender Diversity">Gender & Diversity Report</SelectItem>
                  <SelectItem value="Training Compliance">Training Compliance Report</SelectItem>
                  <SelectItem value="Bank of South Sudan">Bank of South Sudan Report</SelectItem>
                  <SelectItem value="Revenue Authority">Revenue Authority Report</SelectItem>
                  <SelectItem value="Custom">Custom Report</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="report-title">Report Title</Label>
              <Input
                id="report-title"
                value={reportForm.title}
                onChange={(e) => setReportForm({...reportForm, title: e.target.value})}
                placeholder="Enter report title"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="report-period">Reporting Period</Label>
              <Input
                id="report-period"
                value={reportForm.period}
                onChange={(e) => setReportForm({...reportForm, period: e.target.value})}
                placeholder="e.g. 2025-Q1, 2024-Annual"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="report-recipient">Recipient</Label>
              <Input
                id="report-recipient"
                value={reportForm.recipient}
                onChange={(e) => setReportForm({...reportForm, recipient: e.target.value})}
                placeholder="e.g. Ministry of Labour - South Sudan"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="report-due">Due Date</Label>
              <Input
                id="report-due"
                type="date"
                value={reportForm.dueDate}
                onChange={(e) => setReportForm({...reportForm, dueDate: e.target.value})}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowGenerateReportDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerateReport} className="bg-blue-600 hover:bg-blue-700">
              Generate Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ComplianceReporting; 