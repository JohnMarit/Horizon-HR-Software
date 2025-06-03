import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  FileText,
  Upload,
  Download,
  Share2,
  Lock,
  Unlock,
  Eye,
  Edit,
  Trash2,
  Copy,
  Archive,
  Search,
  Filter,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Users,
  Building,
  Calendar,
  Tag,
  Folder,
  FolderOpen,
  Plus,
  MoreVertical,
  Shield,
  Signature
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Document {
  id: number;
  name: string;
  type: string;
  category: 'Contract' | 'Policy' | 'Form' | 'Report' | 'Certificate' | 'Other';
  size: number;
  uploadedBy: string;
  uploadedDate: string;
  lastModified: string;
  version: string;
  status: 'Draft' | 'Review' | 'Approved' | 'Archived';
  permissions: 'Public' | 'Department' | 'Private' | 'Confidential';
  tags: string[];
  description?: string;
  folderId?: number;
  signatureRequired: boolean;
  signatureStatus?: 'Pending' | 'Signed' | 'Rejected';
  expiryDate?: string;
  downloadCount: number;
}

interface Folder {
  id: number;
  name: string;
  parentId?: number;
  createdBy: string;
  createdDate: string;
  documentCount: number;
  permissions: 'Public' | 'Department' | 'Private' | 'Confidential';
}

interface SignatureRequest {
  id: number;
  documentId: number;
  documentName: string;
  requestedBy: string;
  requestedTo: string;
  requestedDate: string;
  status: 'Pending' | 'Signed' | 'Rejected';
  signedDate?: string;
  notes?: string;
}

const DocumentManagement: React.FC = () => {
  const { user, hasPermission, addAuditLog } = useAuth();
  const [activeTab, setActiveTab] = useState('documents');
  const [selectedFolder, setSelectedFolder] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showFolderDialog, setShowFolderDialog] = useState(false);
  const [showSignatureDialog, setShowSignatureDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  // Mock data
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 1,
      name: 'Employee Handbook 2024.pdf',
      type: 'PDF',
      category: 'Policy',
      size: 2456789,
      uploadedBy: 'Sarah Akol',
      uploadedDate: '2024-01-15',
      lastModified: '2024-12-01',
      version: '2.1',
      status: 'Approved',
      permissions: 'Public',
      tags: ['handbook', 'policy', 'guidelines'],
      description: 'Comprehensive employee handbook with updated policies',
      folderId: 1,
      signatureRequired: false,
      downloadCount: 156
    },
    {
      id: 2,
      name: 'Employment Contract Template.docx',
      type: 'DOCX',
      category: 'Contract',
      size: 456789,
      uploadedBy: 'Sarah Akol',
      uploadedDate: '2024-03-10',
      lastModified: '2024-11-20',
      version: '1.3',
      status: 'Approved',
      permissions: 'Department',
      tags: ['contract', 'template', 'employment'],
      description: 'Standard employment contract template',
      folderId: 2,
      signatureRequired: true,
      signatureStatus: 'Pending',
      downloadCount: 89
    },
    {
      id: 3,
      name: 'Leave Application Form.pdf',
      type: 'PDF',
      category: 'Form',
      size: 234567,
      uploadedBy: 'James Wani',
      uploadedDate: '2024-02-20',
      lastModified: '2024-10-15',
      version: '1.0',
      status: 'Approved',
      permissions: 'Public',
      tags: ['leave', 'form', 'application'],
      description: 'Standard leave application form',
      folderId: 3,
      signatureRequired: false,
      downloadCount: 234
    },
    {
      id: 4,
      name: 'Banking Compliance Certificate.pdf',
      type: 'PDF',
      category: 'Certificate',
      size: 1234567,
      uploadedBy: 'Mary Deng',
      uploadedDate: '2024-06-01',
      lastModified: '2024-12-20',
      version: '1.0',
      status: 'Approved',
      permissions: 'Confidential',
      tags: ['compliance', 'certificate', 'banking'],
      description: 'Central Bank compliance certificate',
      folderId: 4,
      signatureRequired: false,
      expiryDate: '2025-06-01',
      downloadCount: 12
    }
  ]);

  const [folders, setFolders] = useState<Folder[]>([
    { id: 1, name: 'HR Policies', createdBy: 'Sarah Akol', createdDate: '2024-01-01', documentCount: 15, permissions: 'Public' },
    { id: 2, name: 'Contracts & Templates', createdBy: 'Sarah Akol', createdDate: '2024-01-01', documentCount: 8, permissions: 'Department' },
    { id: 3, name: 'Forms', createdBy: 'James Wani', createdDate: '2024-02-01', documentCount: 12, permissions: 'Public' },
    { id: 4, name: 'Compliance Documents', createdBy: 'Mary Deng', createdDate: '2024-03-01', documentCount: 6, permissions: 'Confidential' },
    { id: 5, name: 'Training Materials', createdBy: 'Sarah Akol', createdDate: '2024-04-01', documentCount: 20, permissions: 'Public' }
  ]);

  const [signatureRequests, setSignatureRequests] = useState<SignatureRequest[]>([
    {
      id: 1,
      documentId: 2,
      documentName: 'Employment Contract Template.docx',
      requestedBy: 'Sarah Akol',
      requestedTo: 'Grace Ajak',
      requestedDate: '2024-12-15',
      status: 'Pending'
    },
    {
      id: 2,
      documentId: 2,
      documentName: 'Employment Contract Template.docx',
      requestedBy: 'Sarah Akol',
      requestedTo: 'Michael Jok',
      requestedDate: '2024-12-10',
      status: 'Signed',
      signedDate: '2024-12-12'
    }
  ]);

  const [uploadForm, setUploadForm] = useState({
    name: '',
    category: 'Other' as const,
    description: '',
    permissions: 'Department' as const,
    tags: '',
    signatureRequired: false,
    expiryDate: ''
  });

  const [folderForm, setFolderForm] = useState({
    name: '',
    permissions: 'Department' as const,
    parentId: null as number | null
  });

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesFolder = selectedFolder === null || doc.folderId === selectedFolder;
    const matchesSearch = searchQuery === '' || 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    
    return matchesFolder && matchesSearch && matchesCategory && matchesStatus;
  });

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf': return <FileText className="h-5 w-5 text-red-500" />;
      case 'docx':
      case 'doc': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'xlsx':
      case 'xls': return <FileText className="h-5 w-5 text-green-500" />;
      default: return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Review': return 'bg-yellow-100 text-yellow-800';
      case 'Draft': return 'bg-gray-100 text-gray-800';
      case 'Archived': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPermissionIcon = (permission: string) => {
    switch (permission) {
      case 'Public': return <Users className="h-4 w-4 text-green-500" />;
      case 'Department': return <Building className="h-4 w-4 text-blue-500" />;
      case 'Private': return <User className="h-4 w-4 text-yellow-500" />;
      case 'Confidential': return <Shield className="h-4 w-4 text-red-500" />;
      default: return <Lock className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleUpload = () => {
    const newDocument: Document = {
      id: Math.max(...documents.map(d => d.id)) + 1,
      name: uploadForm.name,
      type: uploadForm.name.split('.').pop()?.toUpperCase() || 'Unknown',
      category: uploadForm.category,
      size: Math.floor(Math.random() * 10000000) + 100000,
      uploadedBy: user?.email || 'System',
      uploadedDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0],
      version: '1.0',
      status: 'Draft',
      permissions: uploadForm.permissions,
      tags: uploadForm.tags.split(',').map(t => t.trim()).filter(t => t),
      description: uploadForm.description,
      folderId: selectedFolder || undefined,
      signatureRequired: uploadForm.signatureRequired,
      signatureStatus: uploadForm.signatureRequired ? 'Pending' : undefined,
      expiryDate: uploadForm.expiryDate || undefined,
      downloadCount: 0
    };

    setDocuments([newDocument, ...documents]);
    setShowUploadDialog(false);
    setUploadForm({
      name: '',
      category: 'Other',
      description: '',
      permissions: 'Department',
      tags: '',
      signatureRequired: false,
      expiryDate: ''
    });

    addAuditLog('DOCUMENT_UPLOADED', 'DOCUMENTS', {
      documentId: newDocument.id,
      name: newDocument.name,
      category: newDocument.category
    });
  };

  const handleCreateFolder = () => {
    const newFolder: Folder = {
      id: Math.max(...folders.map(f => f.id)) + 1,
      name: folderForm.name,
      parentId: folderForm.parentId || undefined,
      createdBy: user?.email || 'System',
      createdDate: new Date().toISOString().split('T')[0],
      documentCount: 0,
      permissions: folderForm.permissions
    };

    setFolders([...folders, newFolder]);
    setShowFolderDialog(false);
    setFolderForm({
      name: '',
      permissions: 'Department',
      parentId: null
    });

    addAuditLog('FOLDER_CREATED', 'DOCUMENTS', {
      folderId: newFolder.id,
      name: newFolder.name
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Document Management</h1>
          <p className="text-gray-600">Secure digital storage, e-signatures, and document workflow</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowFolderDialog(true)}>
            <Folder className="mr-2 h-4 w-4" />
            New Folder
          </Button>
          <Button onClick={() => setShowUploadDialog(true)} className="bg-gradient-to-r from-blue-600 to-blue-700">
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Documents</p>
                <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
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
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {documents.filter(d => d.status === 'Approved').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Signature className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Signatures</p>
                <p className="text-2xl font-bold text-gray-900">
                  {signatureRequests.filter(s => s.status === 'Pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-gray-900">
                  {documents.filter(d => d.expiryDate && new Date(d.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="signatures">E-Signatures</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Documents Tab */}
        <TabsContent value="documents" className="space-y-6">
          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Policy">Policy</SelectItem>
                  <SelectItem value="Form">Form</SelectItem>
                  <SelectItem value="Report">Report</SelectItem>
                  <SelectItem value="Certificate">Certificate</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Review">Review</SelectItem>
                  <SelectItem value="Approved">Approved</SelectItem>
                  <SelectItem value="Archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </Button>
            </div>
          </div>

          {/* Folder Navigation */}
          <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedFolder(null)}
              className={selectedFolder === null ? 'bg-white' : ''}
            >
              <FolderOpen className="h-4 w-4 mr-2" />
              All Documents
            </Button>
            {folders.map((folder) => (
              <Button
                key={folder.id}
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFolder(folder.id)}
                className={selectedFolder === folder.id ? 'bg-white' : ''}
              >
                <Folder className="h-4 w-4 mr-2" />
                {folder.name}
                <Badge variant="secondary" className="ml-2">
                  {documents.filter(d => d.folderId === folder.id).length}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Document List */}
          <div className="space-y-4">
            {filteredDocuments.map((doc) => (
              <Card key={doc.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-gray-100 rounded-lg">
                        {getFileIcon(doc.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900 truncate">{doc.name}</h3>
                          <Badge className={getStatusColor(doc.status)}>{doc.status}</Badge>
                          <Badge variant="outline">{doc.category}</Badge>
                          {getPermissionIcon(doc.permissions)}
                          {doc.signatureRequired && (
                            <Badge className="bg-purple-100 text-purple-800">
                              <Signature className="h-3 w-3 mr-1" />
                              Signature Required
                            </Badge>
                          )}
                        </div>
                        
                        {doc.description && (
                          <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>v{doc.version}</span>
                          <span>{formatFileSize(doc.size)}</span>
                          <span>By {doc.uploadedBy}</span>
                          <span>{doc.lastModified}</span>
                          <span>{doc.downloadCount} downloads</span>
                        </div>
                        
                        {doc.tags.length > 0 && (
                          <div className="flex gap-2 mt-2">
                            {doc.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                <Tag className="h-2 w-2 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        {doc.expiryDate && (
                          <Alert className="mt-3 border-yellow-200 bg-yellow-50">
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                            <AlertDescription className="text-yellow-800">
                              Expires on {doc.expiryDate}
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      {doc.signatureRequired && doc.signatureStatus === 'Pending' && (
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          <Signature className="h-4 w-4 mr-2" />
                          Sign
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* E-Signatures Tab */}
        <TabsContent value="signatures" className="space-y-6">
          <div className="grid gap-4">
            {signatureRequests.map((request) => (
              <Card key={request.id} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <Signature className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{request.documentName}</h3>
                        <p className="text-sm text-gray-600">
                          Requested by {request.requestedBy} for {request.requestedTo}
                        </p>
                        <p className="text-xs text-gray-500">Requested on {request.requestedDate}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge className={
                        request.status === 'Signed' 
                          ? 'bg-green-100 text-green-800'
                          : request.status === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }>
                        {request.status}
                      </Badge>
                      
                      {request.status === 'Pending' && (
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          <Signature className="h-4 w-4 mr-2" />
                          Sign Document
                        </Button>
                      )}
                      
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </div>
                  </div>
                  
                  {request.signedDate && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">
                        ✓ Signed on {request.signedDate}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['Contract', 'Policy', 'Form', 'Report', 'Certificate', 'Other'].map((category) => {
                    const count = documents.filter(d => d.category === category).length;
                    const percentage = (count / documents.length) * 100;
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium">{category}</span>
                          <span>{count} documents</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Storage Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900">
                      {formatFileSize(documents.reduce((sum, doc) => sum + doc.size, 0))}
                    </p>
                    <p className="text-sm text-gray-600">Total Storage Used</p>
                  </div>
                  <Progress value={35} className="h-2" />
                  <p className="text-xs text-gray-500 text-center">35% of 10 GB limit</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Add a new document to the system with appropriate metadata
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-600">PDF, DOC, DOCX, XLS, XLSX up to 10MB</p>
              <Button className="mt-4">Choose File</Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Document Name</label>
                <Input
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm({...uploadForm, name: e.target.value})}
                  placeholder="Enter document name"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select value={uploadForm.category} onValueChange={(value: any) => setUploadForm({...uploadForm, category: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Policy">Policy</SelectItem>
                    <SelectItem value="Form">Form</SelectItem>
                    <SelectItem value="Report">Report</SelectItem>
                    <SelectItem value="Certificate">Certificate</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={uploadForm.description}
                onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                placeholder="Brief description of the document"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Permissions</label>
                <Select value={uploadForm.permissions} onValueChange={(value: any) => setUploadForm({...uploadForm, permissions: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Public">Public</SelectItem>
                    <SelectItem value="Department">Department</SelectItem>
                    <SelectItem value="Private">Private</SelectItem>
                    <SelectItem value="Confidential">Confidential</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Tags</label>
                <Input
                  value={uploadForm.tags}
                  onChange={(e) => setUploadForm({...uploadForm, tags: e.target.value})}
                  placeholder="Comma-separated tags"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="signatureRequired"
                checked={uploadForm.signatureRequired}
                onChange={(e) => setUploadForm({...uploadForm, signatureRequired: e.target.checked})}
                className="rounded border-gray-300"
              />
              <label htmlFor="signatureRequired" className="text-sm">Requires digital signature</label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={!uploadForm.name}>
              Upload Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Folder Dialog */}
      <Dialog open={showFolderDialog} onOpenChange={setShowFolderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
            <DialogDescription>
              Organize your documents with a new folder
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Folder Name</label>
              <Input
                value={folderForm.name}
                onChange={(e) => setFolderForm({...folderForm, name: e.target.value})}
                placeholder="Enter folder name"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Permissions</label>
              <Select value={folderForm.permissions} onValueChange={(value: any) => setFolderForm({...folderForm, permissions: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Public">Public</SelectItem>
                  <SelectItem value="Department">Department</SelectItem>
                  <SelectItem value="Private">Private</SelectItem>
                  <SelectItem value="Confidential">Confidential</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFolderDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder} disabled={!folderForm.name}>
              Create Folder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentManagement; 