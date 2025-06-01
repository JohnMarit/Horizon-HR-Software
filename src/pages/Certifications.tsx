import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ShieldCheckIcon, 
  AwardIcon, 
  CalendarIcon, 
  AlertTriangleIcon,
  PlusIcon,
  DownloadIcon,
  UploadIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  GraduationCapIcon,
  BanknoteIcon,
  ScaleIcon,
  FileTextIcon,
  ExternalLinkIcon,
  FilterIcon,
  SearchIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Certification {
  id: string;
  employeeId: string;
  employeeName: string;
  type: 'banking_license' | 'aml_certification' | 'compliance_training' | 'risk_management' | 'cdd_training' | 'kyc_certification' | 'other';
  name: string;
  issuingBody: string;
  issueDate: Date;
  expiryDate: Date | null;
  status: 'active' | 'expired' | 'pending_renewal' | 'suspended';
  certificateNumber: string;
  documentUrl?: string;
  renewalRequired: boolean;
  centralBankApproved: boolean;
  complianceScore: number;
  notes: string;
}

interface CertificationRequirement {
  role: string;
  requiredCertifications: string[];
  renewalPeriod: number; // months
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export default function Certifications() {
  const { user, hasPermission, addAuditLog } = useAuth();
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState<Certification | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for Horizon Bank certifications
  useEffect(() => {
    const mockCertifications: Certification[] = [
      {
        id: '1',
        employeeId: '1',
        employeeName: 'Sarah Akol',
        type: 'banking_license',
        name: 'Central Bank Banking License',
        issuingBody: 'Central Bank of South Sudan',
        issueDate: new Date('2023-01-15'),
        expiryDate: new Date('2025-01-15'),
        status: 'active',
        certificateNumber: 'CBSS-BL-2023-001',
        renewalRequired: true,
        centralBankApproved: true,
        complianceScore: 98,
        notes: 'Primary banking license for operations'
      },
      {
        id: '2',
        employeeId: '4',
        employeeName: 'Peter Garang',
        type: 'aml_certification',
        name: 'Anti-Money Laundering Certification',
        issuingBody: 'International AML Institute',
        issueDate: new Date('2023-06-10'),
        expiryDate: new Date('2024-06-10'),
        status: 'pending_renewal',
        certificateNumber: 'AML-2023-456',
        renewalRequired: true,
        centralBankApproved: true,
        complianceScore: 95,
        notes: 'Due for renewal in 2 months'
      },
      {
        id: '3',
        employeeId: '5',
        employeeName: 'Grace Ajak',
        type: 'kyc_certification',
        name: 'Know Your Customer Certification',
        issuingBody: 'Banking Institute of South Sudan',
        issueDate: new Date('2023-09-20'),
        expiryDate: new Date('2025-09-20'),
        status: 'active',
        certificateNumber: 'KYC-2023-789',
        renewalRequired: true,
        centralBankApproved: true,
        complianceScore: 92,
        notes: 'Customer service compliance'
      },
      {
        id: '4',
        employeeId: '3',
        employeeName: 'Mary Deng',
        type: 'risk_management',
        name: 'Banking Risk Management Certificate',
        issuingBody: 'African Banking Institute',
        issueDate: new Date('2022-12-01'),
        expiryDate: new Date('2024-12-01'),
        status: 'active',
        certificateNumber: 'BRM-2022-321',
        renewalRequired: true,
        centralBankApproved: true,
        complianceScore: 97,
        notes: 'Corporate banking risk assessment'
      },
      {
        id: '5',
        employeeId: '2',
        employeeName: 'James Wani',
        type: 'compliance_training',
        name: 'Banking Compliance Training',
        issuingBody: 'Horizon Bank Training Center',
        issueDate: new Date('2024-01-15'),
        expiryDate: new Date('2025-01-15'),
        status: 'active',
        certificateNumber: 'HB-CT-2024-101',
        renewalRequired: true,
        centralBankApproved: false,
        complianceScore: 89,
        notes: 'Internal compliance training'
      }
    ];

    setCertifications(mockCertifications);
  }, []);

  const certificationRequirements: CertificationRequirement[] = [
    {
      role: 'HR Manager',
      requiredCertifications: ['Banking Compliance Training', 'Risk Management'],
      renewalPeriod: 12,
      priority: 'high'
    },
    {
      role: 'Finance Officer',
      requiredCertifications: ['Anti-Money Laundering Certification', 'Banking License', 'Risk Management'],
      renewalPeriod: 12,
      priority: 'critical'
    },
    {
      role: 'Department Head',
      requiredCertifications: ['Banking Risk Management Certificate', 'Compliance Training'],
      renewalPeriod: 18,
      priority: 'high'
    },
    {
      role: 'Employee',
      requiredCertifications: ['Know Your Customer Certification', 'Compliance Training'],
      renewalPeriod: 24,
      priority: 'medium'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700 border-green-200';
      case 'expired': return 'bg-red-50 text-red-700 border-red-200';
      case 'pending_renewal': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'suspended': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'banking_license': return <BanknoteIcon className="h-4 w-4" />;
      case 'aml_certification': return <ShieldCheckIcon className="h-4 w-4" />;
      case 'compliance_training': return <ScaleIcon className="h-4 w-4" />;
      case 'risk_management': return <AlertTriangleIcon className="h-4 w-4" />;
      case 'kyc_certification': return <FileTextIcon className="h-4 w-4" />;
      default: return <AwardIcon className="h-4 w-4" />;
    }
  };

  const getDaysUntilExpiry = (expiryDate: Date | null) => {
    if (!expiryDate) return null;
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getExpiryAlert = (days: number | null) => {
    if (days === null) return null;
    if (days < 0) return { type: 'expired', message: 'Expired', color: 'text-red-600' };
    if (days <= 30) return { type: 'critical', message: `${days} days left`, color: 'text-red-600' };
    if (days <= 90) return { type: 'warning', message: `${days} days left`, color: 'text-amber-600' };
    return { type: 'good', message: `${days} days left`, color: 'text-green-600' };
  };

  const filteredCertifications = certifications.filter(cert => {
    const matchesSearch = cert.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || cert.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddCertification = () => {
    addAuditLog('CERTIFICATION_ADDED', 'CERTIFICATIONS', { timestamp: new Date() });
    setIsAddDialogOpen(false);
  };

  const handleRenewCertification = (certId: string) => {
    addAuditLog('CERTIFICATION_RENEWED', 'CERTIFICATIONS', { certificationId: certId });
  };

  const getComplianceOverview = () => {
    const total = certifications.length;
    const active = certifications.filter(c => c.status === 'active').length;
    const expiringSoon = certifications.filter(c => {
      const days = getDaysUntilExpiry(c.expiryDate);
      return days !== null && days <= 90 && days > 0;
    }).length;
    const expired = certifications.filter(c => c.status === 'expired' || (c.expiryDate && getDaysUntilExpiry(c.expiryDate)! < 0)).length;

    return { total, active, expiringSoon, expired };
  };

  const complianceStats = getComplianceOverview();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <AwardIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-responsive-2xl font-bold text-gray-900">Banking Certifications</h1>
              <p className="text-gray-600">Manage financial services certifications and regulatory compliance</p>
            </div>
          </div>
        </div>
        {hasPermission('*') && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="shadow-enhanced-md hover:shadow-enhanced-lg">
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Certification
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-xl">Add New Certification</DialogTitle>
                <DialogDescription className="text-base">
                  Register a new banking certification or license for regulatory compliance
                </DialogDescription>
              </DialogHeader>
              {/* Enhanced form would go here */}
              <DialogFooter className="gap-3">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCertification}>
                  Add Certification
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Enhanced Compliance Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-enhanced hover:shadow-enhanced-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <AwardIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">Total Certifications</p>
                <p className="text-3xl font-bold text-gray-900">{complianceStats.total}</p>
                <p className="text-xs text-gray-500">Active programs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-enhanced hover:shadow-enhanced-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-3xl font-bold text-green-600">{complianceStats.active}</p>
                <p className="text-xs text-green-600">Compliant status</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-enhanced hover:shadow-enhanced-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 rounded-xl">
                <ClockIcon className="h-6 w-6 text-amber-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                <p className="text-3xl font-bold text-amber-600">{complianceStats.expiringSoon}</p>
                <p className="text-xs text-amber-600">Within 90 days</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-enhanced hover:shadow-enhanced-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <XCircleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">Expired</p>
                <p className="text-3xl font-bold text-red-600">{complianceStats.expired}</p>
                <p className="text-xs text-red-600">Requires renewal</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Critical Renewals Alert */}
      {complianceStats.expiringSoon > 0 && (
        <Alert className="alert-warning border-l-4 border-l-amber-500">
          <AlertTriangleIcon className="h-5 w-5 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <strong>{complianceStats.expiringSoon} certifications</strong> are expiring within 90 days. 
            Please schedule renewals to maintain regulatory compliance.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="certifications" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
          <TabsTrigger value="certifications" className="text-sm">All Certifications</TabsTrigger>
          <TabsTrigger value="requirements" className="text-sm">Role Requirements</TabsTrigger>
          <TabsTrigger value="compliance" className="text-sm">Compliance Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="certifications" className="space-y-6">
          {/* Enhanced Filters */}
          <Card className="card-enhanced">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search certifications, employees, or certificate numbers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 input-enhanced"
                  />
                </div>
                <div className="flex gap-3">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-48">
                      <FilterIcon className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending_renewal">Pending Renewal</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Certifications Table */}
          <Card className="card-enhanced">
            <div className="overflow-x-auto">
              <Table className="table-enhanced">
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Employee</TableHead>
                    <TableHead className="min-w-[250px]">Certification</TableHead>
                    <TableHead className="min-w-[150px]">Type</TableHead>
                    <TableHead className="min-w-[120px]">Status</TableHead>
                    <TableHead className="min-w-[140px]">Expiry</TableHead>
                    <TableHead className="min-w-[140px]">Central Bank</TableHead>
                    <TableHead className="min-w-[120px]">Score</TableHead>
                    <TableHead className="min-w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCertifications.map((cert) => {
                    const daysUntilExpiry = getDaysUntilExpiry(cert.expiryDate);
                    const expiryAlert = getExpiryAlert(daysUntilExpiry);
                    
                    return (
                      <TableRow key={cert.id} className="hover:bg-gray-50/50 transition-colors">
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-semibold text-gray-900">{cert.employeeName}</p>
                            <p className="text-sm text-gray-500">ID: {cert.employeeId}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-semibold text-gray-900">{cert.name}</p>
                            <p className="text-sm text-gray-600">{cert.issuingBody}</p>
                            <p className="text-xs text-gray-400 font-mono">{cert.certificateNumber}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-lg">
                              {getTypeIcon(cert.type)}
                            </div>
                            <span className="capitalize text-sm font-medium">
                              {cert.type.replace('_', ' ')}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn("font-medium", getStatusColor(cert.status))}>
                            {cert.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {cert.expiryDate ? (
                            <div className="space-y-1">
                              <p className="text-sm font-medium">{cert.expiryDate.toLocaleDateString()}</p>
                              {expiryAlert && (
                                <p className={cn("text-xs font-medium", expiryAlert.color)}>
                                  {expiryAlert.message}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">No expiry</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {cert.centralBankApproved ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-medium">
                              <CheckCircleIcon className="h-3 w-3 mr-1" />
                              Approved
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 font-medium">
                              Internal
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <Progress value={cert.complianceScore} className="h-2" />
                            <p className="text-xs text-center font-medium text-gray-600">
                              {cert.complianceScore}%
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {cert.documentUrl && (
                              <Button variant="ghost" size="icon-sm" className="hover:bg-blue-50 hover:text-blue-600">
                                <DownloadIcon className="h-4 w-4" />
                                <span className="sr-only">Download certificate</span>
                              </Button>
                            )}
                            {cert.status === 'pending_renewal' && hasPermission('*') && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleRenewCertification(cert.id)}
                                className="text-green-600 border-green-200 hover:bg-green-50"
                              >
                                Renew
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="requirements" className="space-y-6">
          <div className="grid gap-6">
            {certificationRequirements.map((req, index) => (
              <Card key={index} className="card-enhanced">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{req.role}</CardTitle>
                    <Badge variant="outline" className={cn(
                      "font-medium",
                      req.priority === 'critical' ? 'bg-red-50 text-red-700 border-red-200' :
                      req.priority === 'high' ? 'bg-orange-50 text-orange-700 border-orange-200' :
                      req.priority === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-gray-50 text-gray-700 border-gray-200'
                    )}>
                      {req.priority} priority
                    </Badge>
                  </div>
                  <CardDescription className="text-base">
                    Required certifications for this role • Renewal period: {req.renewalPeriod} months
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {req.requiredCertifications.map((cert, certIndex) => (
                      <div key={certIndex} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <GraduationCapIcon className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="flex-1 font-medium text-gray-900">{cert}</span>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
                          Required
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="text-xl">Central Bank Compliance</CardTitle>
                <CardDescription className="text-base">
                  Track regulatory compliance status with South Sudan Central Bank
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <ShieldCheckIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <span className="font-semibold text-green-800">Banking License</span>
                  </div>
                  <Badge className="bg-green-600 hover:bg-green-700">Active</Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <AlertTriangleIcon className="h-5 w-5 text-amber-600" />
                    </div>
                    <span className="font-semibold text-amber-800">AML Compliance</span>
                  </div>
                  <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 font-medium">
                    Renewal Due
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileTextIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="font-semibold text-blue-800">KYC Procedures</span>
                  </div>
                  <Badge className="bg-blue-600 hover:bg-blue-700">Compliant</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="card-enhanced">
              <CardHeader>
                <CardTitle className="text-xl">Training Completion Rates</CardTitle>
                <CardDescription className="text-base">
                  Department-wise certification progress and compliance scoring
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-gray-700">Personal Banking</span>
                      <span className="font-semibold text-gray-900">89%</span>
                    </div>
                    <Progress value={89} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-gray-700">Corporate Banking</span>
                      <span className="font-semibold text-gray-900">93%</span>
                    </div>
                    <Progress value={93} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-gray-700">Trade Finance</span>
                      <span className="font-semibold text-gray-900">85%</span>
                    </div>
                    <Progress value={85} className="h-3" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium text-gray-700">Finance & Accounting</span>
                      <span className="font-semibold text-gray-900">96%</span>
                    </div>
                    <Progress value={96} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 