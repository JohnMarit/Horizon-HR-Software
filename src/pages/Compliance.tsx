import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { 
  AlertCircleIcon, 
  FileTextIcon, 
  CheckCircleIcon, 
  PlusIcon,
  SearchIcon,
  FilterIcon,
  EditIcon,
  TrashIcon,
  MoreVerticalIcon,
  CalendarIcon,
  UsersIcon,
  ShieldIcon,
  ClockIcon,
  DownloadIcon,
  EyeIcon,
  UserCheckIcon,
  AlertTriangleIcon,
  BookOpenIcon
} from "lucide-react";

// Enhanced interfaces
interface Policy {
  id: number;
  title: string;
  description: string;
  category: 'Financial Compliance' | 'IT Security' | 'HR Policies' | 'Operational' | 'Risk Management' | 'Legal & Regulatory' | 'Data Protection';
  type: 'Mandatory' | 'Optional' | 'Guideline';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  content: string;
  version: string;
  status: 'Draft' | 'Under Review' | 'Active' | 'Archived' | 'Suspended';
  effectiveDate: string;
  expiryDate?: string;
  lastUpdated: string;
  createdBy: string;
  approvedBy?: string;
  approvalDate?: string;
  targetAudience: string[];
  attachments: string[];
  relatedPolicies: number[];
  acknowledgmentRequired: boolean;
  reviewFrequency: 'Monthly' | 'Quarterly' | 'Semi-Annually' | 'Annually' | 'Bi-Annually';
  nextReviewDate: string;
  tags: string[];
  complianceScore?: number;
}

export default function Compliance() {
  const [activeTab, setActiveTab] = useState("policies");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreatePolicyDialog, setShowCreatePolicyDialog] = useState(false);
  const [showEditPolicyDialog, setShowEditPolicyDialog] = useState(false);
  const [showDeletePolicyDialog, setShowDeletePolicyDialog] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [policyToDelete, setPolicyToDelete] = useState<Policy | null>(null);
  
  const { user, hasPermission, addAuditLog } = useAuth();

  // Policy form state
  const [policyForm, setPolicyForm] = useState({
    title: "",
    description: "",
    category: "HR Policies" as const,
    type: "Mandatory" as const,
    priority: "Medium" as const,
    content: "",
    effectiveDate: "",
    expiryDate: "",
    targetAudience: "",
    acknowledgmentRequired: true,
    reviewFrequency: "Annually" as const,
    tags: ""
  });

  // Enhanced policies data
  const [policies, setPolicies] = useState<Policy[]>([
    {
      id: 1,
      title: "HR Policy Manual",
      description: "Comprehensive HR policies and procedures for Horizon Bank South Sudan",
      category: "HR Policies",
      type: "Mandatory",
      priority: "High",
      content: "This manual contains all HR policies including recruitment, performance management, and employee relations procedures.",
      version: "2.1",
      status: "Published",
      effectiveDate: "2024-01-01",
      expiryDate: "2025-12-31",
      lastUpdated: "2024-11-15",
      createdBy: "sarah.akol@horizonbankss.com",
      targetAudience: ["All Employees", "HR Team", "Management"],
      acknowledgmentRequired: true,
      reviewFrequency: "Annually",
      nextReviewDate: "2025-01-01",
      attachments: ["hr-manual-v2.1.pdf"],
      relatedPolicies: [2, 3, 4],
      tags: ["HR", "Mandatory", "All Staff"]
    },
    {
      id: 2,
      title: "Code of Conduct",
      description: "Ethical standards and behavioral expectations for all bank employees",
      category: "Compliance",
      type: "Mandatory",
      priority: "Critical",
      content: "Defines ethical standards, conflict of interest policies, and professional conduct expectations.",
      version: "1.8",
      status: "Published",
      effectiveDate: "2024-01-01",
      expiryDate: "2025-12-31",
      lastUpdated: "2024-10-20",
      createdBy: "compliance@horizonbankss.com",
      targetAudience: ["All Employees"],
      acknowledgmentRequired: true,
      reviewFrequency: "Annually",
      nextReviewDate: "2025-01-01",
      attachments: ["code-of-conduct-v1.8.pdf"],
      relatedPolicies: [1, 6, 7],
      tags: ["Ethics", "Mandatory", "Compliance"]
    },
    {
      id: 3,
      title: "Leave and Attendance Policy",
      description: "Comprehensive leave management policy aligned with South Sudan Labour Act 2017",
      category: "HR Policies",
      type: "Mandatory",
      priority: "High",
      content: "Details all leave types including annual leave (21 days), maternity leave (90 days), sick leave, and attendance requirements.",
      version: "1.5",
      status: "Published",
      effectiveDate: "2024-01-01",
      expiryDate: "2025-12-31",
      lastUpdated: "2024-09-15",
      createdBy: "sarah.akol@horizonbankss.com",
      targetAudience: ["All Employees", "HR Team", "Department Heads"],
      acknowledgmentRequired: true,
      reviewFrequency: "Annually",
      nextReviewDate: "2025-01-01",
      attachments: ["leave-policy-v1.5.pdf"],
      relatedPolicies: [1],
      tags: ["Leave", "Attendance", "Legal Compliance"]
    },
    {
      id: 4,
      title: "Disciplinary Code and Procedures",
      description: "Progressive disciplinary procedures in compliance with South Sudan Labour Act 2017",
      category: "HR Policies",
      type: "Mandatory",
      priority: "High",
      content: "Outlines progressive disciplinary procedures, violation categories, and fair hearing processes as required by law.",
      version: "1.3",
      status: "Published",
      effectiveDate: "2024-01-01",
      lastUpdated: "2024-08-10",
      createdBy: "sarah.akol@horizonbankss.com",
      targetAudience: ["HR Team", "Management", "Department Heads"],
      acknowledgmentRequired: true,
      reviewFrequency: "Annually",
      nextReviewDate: "2025-01-01",
      attachments: ["disciplinary-procedures-v1.3.pdf"],
      relatedPolicies: [1, 5],
      tags: ["Disciplinary", "Legal Compliance", "Management"]
    },
    {
      id: 5,
      title: "Grievance and Whistleblower Policy",
      description: "Procedures for reporting grievances and protecting whistleblowers in compliance with South Sudan Labour Act 2017",
      category: "HR Policies",
      type: "Mandatory",
      priority: "Critical",
      content: "Establishes clear procedures for employees to report grievances, workplace harassment, discrimination, and unethical conduct. Includes whistleblower protection mechanisms and anonymous reporting channels. Compliant with South Sudan Labour Act 2017 Part IX (Grievance Handling).",
      version: "1.0",
      status: "Published",
      effectiveDate: "2025-01-22",
      lastUpdated: "2025-01-22",
      createdBy: "sarah.akol@horizonbankss.com",
      targetAudience: ["All Employees", "HR Team", "Management"],
      acknowledgmentRequired: true,
      reviewFrequency: "Annually",
      nextReviewDate: "2026-01-22",
      attachments: ["grievance-whistleblower-policy-v1.0.pdf"],
      relatedPolicies: [1, 4, 6],
      tags: ["Grievance", "Whistleblower", "Legal Compliance", "Protection"]
    },
    {
      id: 6,
      title: "Anti-harassment and Equal Opportunity Policy",
      description: "Zero-tolerance policy against harassment and commitment to equal opportunity employment",
      category: "HR Policies",
      type: "Mandatory",
      priority: "Critical",
      content: "Establishes zero-tolerance policy for workplace harassment, sexual harassment, discrimination, and bullying. Defines equal opportunity employment practices, diversity and inclusion initiatives, and reporting mechanisms. Includes investigation procedures and disciplinary measures for violations.",
      version: "1.0",
      status: "Published",
      effectiveDate: "2025-01-22",
      lastUpdated: "2025-01-22",
      createdBy: "sarah.akol@horizonbankss.com",
      targetAudience: ["All Employees", "HR Team", "Management"],
      acknowledgmentRequired: true,
      reviewFrequency: "Annually",
      nextReviewDate: "2026-01-22",
      attachments: ["anti-harassment-equal-opportunity-v1.0.pdf"],
      relatedPolicies: [1, 2, 5],
      tags: ["Anti-harassment", "Equal Opportunity", "Diversity", "Inclusion", "Legal Compliance"]
    },
    {
      id: 7,
      title: "Banking Security and Confidentiality Policy",
      description: "Customer data protection and banking security procedures",
      category: "Security",
      type: "Mandatory",
      priority: "Critical",
      content: "Comprehensive security measures for customer data protection, information security, and banking operations security.",
      version: "2.0",
      status: "Published",
      effectiveDate: "2024-06-01",
      lastUpdated: "2024-11-01",
      createdBy: "security@horizonbankss.com",
      targetAudience: ["All Employees", "IT Team", "Management"],
      acknowledgmentRequired: true,
      reviewFrequency: "Semi-annually",
      nextReviewDate: "2025-06-01",
      attachments: ["security-policy-v2.0.pdf"],
      relatedPolicies: [2],
      tags: ["Security", "Confidentiality", "Banking", "Customer Data"]
    },
    {
      id: 8,
      title: "Anti-Money Laundering (AML) and Know Your Customer (KYC) Policy",
      description: "AML/KYC procedures for banking compliance",
      category: "Compliance",
      type: "Mandatory",
      priority: "Critical",
      content: "Detailed AML/KYC procedures, customer due diligence, suspicious transaction reporting, and regulatory compliance requirements.",
      version: "1.4",
      status: "Published",
      effectiveDate: "2024-03-01",
      lastUpdated: "2024-10-15",
      createdBy: "compliance@horizonbankss.com",
      targetAudience: ["Banking Staff", "Compliance Team", "Management"],
      acknowledgmentRequired: true,
      reviewFrequency: "Quarterly",
      nextReviewDate: "2025-01-15",
      attachments: ["aml-kyc-policy-v1.4.pdf"],
      relatedPolicies: [2, 7],
      tags: ["AML", "KYC", "Banking Compliance", "Regulatory"]
    }
  ]);

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Draft": return "bg-gray-100 text-gray-800";
      case "Under Review": return "bg-yellow-100 text-yellow-800";
      case "Suspended": return "bg-red-100 text-red-800";
      case "Archived": return "bg-gray-100 text-gray-600";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "bg-red-100 text-red-800";
      case "High": return "bg-orange-100 text-orange-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Policy management functions
  const resetPolicyForm = () => {
    setPolicyForm({
      title: "",
      description: "",
      category: "HR Policies",
      type: "Mandatory",
      priority: "Medium",
      content: "",
      effectiveDate: "",
      expiryDate: "",
      targetAudience: "",
      acknowledgmentRequired: true,
      reviewFrequency: "Annually",
      tags: ""
    });
  };

  const handleCreatePolicy = () => {
    if (!hasPermission('compliance.manage') && !hasPermission('*')) {
      addAuditLog('UNAUTHORIZED_ACCESS_ATTEMPT', 'COMPLIANCE', { action: 'create_policy' });
      return;
    }

    const targetAudience = policyForm.targetAudience.split(',').map(a => a.trim()).filter(a => a);
    const tags = policyForm.tags.split(',').map(t => t.trim()).filter(t => t);

    const newPolicy: Policy = {
      id: Math.max(...policies.map(p => p.id)) + 1,
      title: policyForm.title,
      description: policyForm.description,
      category: policyForm.category,
      type: policyForm.type,
      priority: policyForm.priority,
      content: policyForm.content,
      version: "1.0",
      status: "Draft",
      effectiveDate: policyForm.effectiveDate,
      expiryDate: policyForm.expiryDate || undefined,
      lastUpdated: new Date().toISOString().split('T')[0],
      createdBy: user?.email || 'System',
      targetAudience,
      attachments: [],
      relatedPolicies: [],
      acknowledgmentRequired: policyForm.acknowledgmentRequired,
      reviewFrequency: policyForm.reviewFrequency,
      nextReviewDate: calculateNextReviewDate(policyForm.effectiveDate, policyForm.reviewFrequency),
      tags
    };

    setPolicies([...policies, newPolicy]);
    setShowCreatePolicyDialog(false);
    resetPolicyForm();

    addAuditLog('POLICY_CREATED', 'COMPLIANCE', {
      action: 'policy_created',
      policyId: newPolicy.id,
      policyTitle: newPolicy.title,
      createdBy: user?.email
    });
  };

  const handleEditPolicy = () => {
    if (!hasPermission('compliance.manage') && !hasPermission('*')) {
      addAuditLog('UNAUTHORIZED_ACCESS_ATTEMPT', 'COMPLIANCE', { action: 'edit_policy' });
      return;
    }

    if (!selectedPolicy) return;

    const targetAudience = policyForm.targetAudience.split(',').map(a => a.trim()).filter(a => a);
    const tags = policyForm.tags.split(',').map(t => t.trim()).filter(t => t);

    const updatedPolicy: Policy = {
      ...selectedPolicy,
      title: policyForm.title,
      description: policyForm.description,
      category: policyForm.category,
      type: policyForm.type,
      priority: policyForm.priority,
      content: policyForm.content,
      effectiveDate: policyForm.effectiveDate,
      expiryDate: policyForm.expiryDate || undefined,
      lastUpdated: new Date().toISOString().split('T')[0],
      targetAudience,
      acknowledgmentRequired: policyForm.acknowledgmentRequired,
      reviewFrequency: policyForm.reviewFrequency,
      nextReviewDate: calculateNextReviewDate(policyForm.effectiveDate, policyForm.reviewFrequency),
      tags,
      version: incrementVersion(selectedPolicy.version)
    };

    const updatedPolicies = policies.map(policy => 
      policy.id === selectedPolicy.id ? updatedPolicy : policy
    );
    
    setPolicies(updatedPolicies);
    setShowEditPolicyDialog(false);
    resetPolicyForm();
    setSelectedPolicy(null);

    addAuditLog('POLICY_UPDATED', 'COMPLIANCE', {
      action: 'policy_updated',
      policyId: selectedPolicy.id,
      policyTitle: updatedPolicy.title,
      updatedBy: user?.email
    });
  };

  const openEditPolicyDialog = (policy: Policy) => {
    setSelectedPolicy(policy);
    setPolicyForm({
      title: policy.title,
      description: policy.description,
      category: policy.category as "HR Policies",
      type: policy.type as "Mandatory",
      priority: policy.priority as "Medium",
      content: policy.content,
      effectiveDate: policy.effectiveDate,
      expiryDate: policy.expiryDate || '',
      targetAudience: policy.targetAudience.join(', '),
      acknowledgmentRequired: policy.acknowledgmentRequired,
      reviewFrequency: policy.reviewFrequency as "Annually",
      tags: policy.tags?.join(', ') || ''
    });
    setShowEditPolicyDialog(true);
  };

  const incrementVersion = (version: string): string => {
    const parts = version.split('.');
    const minor = parseInt(parts[1] || '0') + 1;
    return `${parts[0]}.${minor}`;
  };

  const handleDeletePolicy = () => {
    if (!hasPermission('compliance.manage') && !hasPermission('*')) {
      addAuditLog('UNAUTHORIZED_ACCESS_ATTEMPT', 'COMPLIANCE', { action: 'delete_policy' });
      return;
    }

    if (!policyToDelete) return;

    const updatedPolicies = policies.filter(policy => policy.id !== policyToDelete.id);
    setPolicies(updatedPolicies);
    setShowDeletePolicyDialog(false);
    setPolicyToDelete(null);

    addAuditLog('POLICY_DELETED', 'COMPLIANCE', {
      action: 'policy_deleted',
      policyId: policyToDelete.id,
      policyTitle: policyToDelete.title,
      deletedBy: user?.email
    });
  };

  const calculateNextReviewDate = (effectiveDate: string, frequency: string): string => {
    const date = new Date(effectiveDate);
    switch (frequency) {
      case 'Monthly': date.setMonth(date.getMonth() + 1); break;
      case 'Quarterly': date.setMonth(date.getMonth() + 3); break;
      case 'Semi-Annually': date.setMonth(date.getMonth() + 6); break;
      case 'Annually': date.setFullYear(date.getFullYear() + 1); break;
      case 'Bi-Annually': date.setFullYear(date.getFullYear() + 2); break;
      default: date.setFullYear(date.getFullYear() + 1);
    }
    return date.toISOString().split('T')[0];
  };

  // Filter functions
  const filteredPolicies = policies.filter(policy =>
    policy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    policy.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    policy.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance & Policy Management</h1>
          <p className="text-gray-600">Manage policies, audits, and compliance reporting at Horizon Bank</p>
        </div>
        <div className="flex gap-2">
          {(hasPermission('compliance.manage') || hasPermission('*')) && (
            <Button 
              onClick={() => setShowCreatePolicyDialog(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Policy
            </Button>
          )}
          <Button variant="outline">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Policies</p>
                <p className="text-3xl font-bold text-gray-900">{policies.filter(p => p.status === 'Active').length}</p>
                <p className="text-xs text-gray-500">Currently enforced</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <ShieldIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Compliance Rate</p>
                <p className="text-3xl font-bold text-gray-900">94%</p>
                <p className="text-xs text-gray-500">Overall score</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <CheckCircleIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                <p className="text-3xl font-bold text-gray-900">{policies.filter(p => p.status === 'Under Review').length}</p>
                <p className="text-xs text-gray-500">Awaiting approval</p>
              </div>
              <div className="p-3 rounded-full bg-yellow-100">
                <ClockIcon className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
      <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Due Reviews</p>
                <p className="text-3xl font-bold text-gray-900">2</p>
                <p className="text-xs text-gray-500">This quarter</p>
              </div>
              <div className="p-3 rounded-full bg-amber-100">
                <AlertTriangleIcon className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="audits">Audits</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="space-y-6">
          {/* Search and Filters */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
                  <Input
                    placeholder="Search policies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <FilterIcon className="mr-2 h-4 w-4" />
                    Filter by Category
                  </Button>
                  <Button variant="outline">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Filter by Status
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Policy Cards */}
          <div className="grid gap-6">
            {filteredPolicies.map((policy) => (
              <Card key={policy.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-full bg-blue-100">
                        <FileTextIcon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="space-y-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{policy.title}</h3>
                          <p className="text-sm text-gray-600">{policy.description}</p>
                          <p className="text-xs text-gray-500">Version {policy.version} • Created by {policy.createdBy}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{policy.category}</Badge>
                          <Badge className={getPriorityColor(policy.priority)}>
                            {policy.priority}
                          </Badge>
                          <Badge variant="outline">{policy.type}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(policy.status)}>
                          {policy.status}
                        </Badge>
                      {policy.complianceScore && (
                        <div className="text-right">
                          <div className="text-sm font-medium text-green-600">{policy.complianceScore}%</div>
                          <div className="text-xs text-gray-500">Compliance</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{policy.effectiveDate}</p>
                      <p className="text-xs text-gray-500">Effective Date</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{policy.nextReviewDate}</p>
                      <p className="text-xs text-gray-500">Next Review</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{policy.targetAudience.length}</p>
                      <p className="text-xs text-gray-500">Target Groups</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-900">{policy.reviewFrequency}</p>
                      <p className="text-xs text-gray-500">Review Cycle</p>
                    </div>
                  </div>

                  {policy.targetAudience && policy.targetAudience.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <UsersIcon className="h-4 w-4 text-blue-600" />
                        Target Audience
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {policy.targetAudience.slice(0, 3).map((audience, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {audience}
                          </Badge>
                        ))}
                        {policy.targetAudience.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{policy.targetAudience.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {policy.tags && policy.tags.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <BookOpenIcon className="h-4 w-4 text-purple-600" />
                        Tags
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {policy.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex gap-4">
                      <span>Updated: {policy.lastUpdated}</span>
                      {policy.acknowledgmentRequired && (
                        <span className="flex items-center gap-1">
                          <UserCheckIcon className="h-3 w-3" />
                          Acknowledgment Required
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <EyeIcon className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      {(hasPermission('compliance.manage') || hasPermission('*')) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVerticalIcon className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => openEditPolicyDialog(policy)}>
                              <EditIcon className="mr-2 h-4 w-4" />
                              Edit Policy
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => {
                                setPolicyToDelete(policy);
                                setShowDeletePolicyDialog(true);
                              }}
                            >
                              <TrashIcon className="mr-2 h-4 w-4" />
                              Delete Policy
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
            </CardContent>
          </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Trails</CardTitle>
              <CardDescription>Track compliance audits and findings</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Audit management features coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Reports</CardTitle>
              <CardDescription>Generate and view compliance reports</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Reporting features coming soon...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Policy Dialog */}
      <Dialog open={showCreatePolicyDialog} onOpenChange={setShowCreatePolicyDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Policy</DialogTitle>
            <DialogDescription>
              Create a comprehensive policy for Horizon Bank compliance management.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="policy-title">Policy Title *</Label>
                <Input
                  id="policy-title"
                  value={policyForm.title}
                  onChange={(e) => setPolicyForm({ ...policyForm, title: e.target.value })}
                  placeholder="e.g. Remote Work Policy"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="policy-category">Category *</Label>
                <Select 
                  value={policyForm.category} 
                  onValueChange={(value: any) => setPolicyForm({ ...policyForm, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HR Policies">HR Policies</SelectItem>
                    <SelectItem value="Financial Compliance">Financial Compliance</SelectItem>
                    <SelectItem value="IT Security">IT Security</SelectItem>
                    <SelectItem value="Operational">Operational</SelectItem>
                    <SelectItem value="Risk Management">Risk Management</SelectItem>
                    <SelectItem value="Legal & Regulatory">Legal & Regulatory</SelectItem>
                    <SelectItem value="Data Protection">Data Protection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="policy-description">Description *</Label>
              <Textarea
                id="policy-description"
                value={policyForm.description}
                onChange={(e) => setPolicyForm({ ...policyForm, description: e.target.value })}
                placeholder="Brief description of the policy purpose and scope..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="policy-type">Type *</Label>
                <Select 
                  value={policyForm.type} 
                  onValueChange={(value: any) => setPolicyForm({ ...policyForm, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mandatory">Mandatory</SelectItem>
                    <SelectItem value="Optional">Optional</SelectItem>
                    <SelectItem value="Guideline">Guideline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="policy-priority">Priority *</Label>
                <Select 
                  value={policyForm.priority} 
                  onValueChange={(value: any) => setPolicyForm({ ...policyForm, priority: value })}
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
                <Label htmlFor="policy-review">Review Frequency *</Label>
                <Select 
                  value={policyForm.reviewFrequency} 
                  onValueChange={(value: any) => setPolicyForm({ ...policyForm, reviewFrequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Semi-Annually">Semi-Annually</SelectItem>
                    <SelectItem value="Annually">Annually</SelectItem>
                    <SelectItem value="Bi-Annually">Bi-Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="policy-effective">Effective Date *</Label>
                <Input
                  id="policy-effective"
                  type="date"
                  value={policyForm.effectiveDate}
                  onChange={(e) => setPolicyForm({ ...policyForm, effectiveDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="policy-expiry">Expiry Date (Optional)</Label>
                <Input
                  id="policy-expiry"
                  type="date"
                  value={policyForm.expiryDate}
                  onChange={(e) => setPolicyForm({ ...policyForm, expiryDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="policy-content">Policy Content *</Label>
              <Textarea
                id="policy-content"
                value={policyForm.content}
                onChange={(e) => setPolicyForm({ ...policyForm, content: e.target.value })}
                placeholder="Detailed policy content, procedures, and guidelines..."
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="policy-audience">Target Audience</Label>
              <Input
                id="policy-audience"
                value={policyForm.targetAudience}
                onChange={(e) => setPolicyForm({ ...policyForm, targetAudience: e.target.value })}
                placeholder="e.g. All Staff, HR Team, IT Department (comma-separated)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="policy-tags">Tags</Label>
              <Input
                id="policy-tags"
                value={policyForm.tags}
                onChange={(e) => setPolicyForm({ ...policyForm, tags: e.target.value })}
                placeholder="e.g. Remote Work, Flexibility, COVID-19 (comma-separated)"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="acknowledgment-required"
                checked={policyForm.acknowledgmentRequired}
                onChange={(e) => setPolicyForm({ ...policyForm, acknowledgmentRequired: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="acknowledgment-required">Require employee acknowledgment</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreatePolicyDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreatePolicy}
              disabled={!policyForm.title || !policyForm.description || !policyForm.content || !policyForm.effectiveDate}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Policy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Policy Dialog */}
      <Dialog open={showEditPolicyDialog} onOpenChange={setShowEditPolicyDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Policy</DialogTitle>
            <DialogDescription>
              Update the policy details for "{selectedPolicy?.title}". Changes will increment the version number.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-policy-title">Policy Title *</Label>
                <Input
                  id="edit-policy-title"
                  value={policyForm.title}
                  onChange={(e) => setPolicyForm({ ...policyForm, title: e.target.value })}
                  placeholder="e.g. Remote Work Policy"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-policy-category">Category *</Label>
                <Select 
                  value={policyForm.category} 
                  onValueChange={(value: any) => setPolicyForm({ ...policyForm, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HR Policies">HR Policies</SelectItem>
                    <SelectItem value="Financial Compliance">Financial Compliance</SelectItem>
                    <SelectItem value="IT Security">IT Security</SelectItem>
                    <SelectItem value="Operational">Operational</SelectItem>
                    <SelectItem value="Risk Management">Risk Management</SelectItem>
                    <SelectItem value="Legal & Regulatory">Legal & Regulatory</SelectItem>
                    <SelectItem value="Data Protection">Data Protection</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-policy-description">Description *</Label>
              <Textarea
                id="edit-policy-description"
                value={policyForm.description}
                onChange={(e) => setPolicyForm({ ...policyForm, description: e.target.value })}
                placeholder="Brief description of the policy purpose and scope..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-policy-type">Type *</Label>
                <Select 
                  value={policyForm.type} 
                  onValueChange={(value: any) => setPolicyForm({ ...policyForm, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Mandatory">Mandatory</SelectItem>
                    <SelectItem value="Optional">Optional</SelectItem>
                    <SelectItem value="Guideline">Guideline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-policy-priority">Priority *</Label>
                <Select 
                  value={policyForm.priority} 
                  onValueChange={(value: any) => setPolicyForm({ ...policyForm, priority: value })}
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
                <Label htmlFor="edit-policy-review">Review Frequency *</Label>
                <Select 
                  value={policyForm.reviewFrequency} 
                  onValueChange={(value: any) => setPolicyForm({ ...policyForm, reviewFrequency: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Semi-Annually">Semi-Annually</SelectItem>
                    <SelectItem value="Annually">Annually</SelectItem>
                    <SelectItem value="Bi-Annually">Bi-Annually</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-policy-effective">Effective Date *</Label>
                <Input
                  id="edit-policy-effective"
                  type="date"
                  value={policyForm.effectiveDate}
                  onChange={(e) => setPolicyForm({ ...policyForm, effectiveDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-policy-expiry">Expiry Date (Optional)</Label>
                <Input
                  id="edit-policy-expiry"
                  type="date"
                  value={policyForm.expiryDate}
                  onChange={(e) => setPolicyForm({ ...policyForm, expiryDate: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-policy-content">Policy Content *</Label>
              <Textarea
                id="edit-policy-content"
                value={policyForm.content}
                onChange={(e) => setPolicyForm({ ...policyForm, content: e.target.value })}
                placeholder="Detailed policy content, procedures, and guidelines..."
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-policy-audience">Target Audience</Label>
              <Input
                id="edit-policy-audience"
                value={policyForm.targetAudience}
                onChange={(e) => setPolicyForm({ ...policyForm, targetAudience: e.target.value })}
                placeholder="e.g. All Staff, HR Team, IT Department (comma-separated)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-policy-tags">Tags</Label>
              <Input
                id="edit-policy-tags"
                value={policyForm.tags}
                onChange={(e) => setPolicyForm({ ...policyForm, tags: e.target.value })}
                placeholder="e.g. Remote Work, Flexibility, COVID-19 (comma-separated)"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="edit-acknowledgment-required"
                checked={policyForm.acknowledgmentRequired}
                onChange={(e) => setPolicyForm({ ...policyForm, acknowledgmentRequired: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="edit-acknowledgment-required">Require employee acknowledgment</Label>
            </div>

            {selectedPolicy && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Version Information</h4>
                <div className="text-sm text-blue-700">
                  <p>Current Version: {selectedPolicy.version}</p>
                  <p>New Version: {incrementVersion(selectedPolicy.version)}</p>
                  <p>Last Updated: {selectedPolicy.lastUpdated}</p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowEditPolicyDialog(false);
              resetPolicyForm();
              setSelectedPolicy(null);
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleEditPolicy}
              disabled={!policyForm.title || !policyForm.description || !policyForm.content || !policyForm.effectiveDate}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <EditIcon className="mr-2 h-4 w-4" />
              Update Policy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Policy Confirmation Dialog */}
      <AlertDialog open={showDeletePolicyDialog} onOpenChange={setShowDeletePolicyDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Policy</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the policy "{policyToDelete?.title}"? 
              This action cannot be undone and will remove all associated data, approvals, and acknowledgments.
              <br /><br />
              <strong>This will also affect:</strong>
              <ul className="list-disc list-inside mt-2 text-sm">
                <li>Employee acknowledgment records</li>
                <li>Compliance tracking data</li>
                <li>Related audit findings</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePolicy}
              className="bg-red-600 hover:bg-red-700"
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              Delete Policy
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 