import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { 
  PlusIcon, 
  SearchIcon, 
  FilterIcon, 
  MoreVerticalIcon,
  MailIcon,
  PhoneIcon,
  CalendarIcon,
  BriefcaseIcon,
  UsersIcon,
  FileTextIcon,
  CreditCardIcon,
  DollarSignIcon,
  StarIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  EditIcon,
  TrashIcon,
  EyeIcon
} from "lucide-react";

// Job posting interface
interface JobPosting {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  level: string;
  applications: number;
  status: string;
  posted: string;
  deadline: string;
  requirements: string;
  salary: string;
  description: string;
}

export default function Recruitment() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("jobs");
  const [showCreateJobDialog, setShowCreateJobDialog] = useState(false);
  const [editingJob, setEditingJob] = useState<JobPosting | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [jobs, setJobs] = useState<JobPosting[]>([
    {
      id: 1,
      title: "Senior Credit Analyst",
      department: "Corporate Banking",
      location: "Juba, South Sudan",
      type: "Full-time",
      level: "Senior",
      applications: 24,
      status: "Active",
      posted: "2025-01-10",
      deadline: "2025-02-15",
      requirements: "Bachelor's in Finance, 5+ years banking experience, credit risk assessment skills",
      salary: "$3,500 - $4,500",
      description: "Lead credit analysis for corporate clients, assess loan applications, and manage portfolio risk."
    },
    {
      id: 2,
      title: "Customer Relationship Manager",
      department: "Personal Banking",
      location: "Juba, South Sudan",
      type: "Full-time",
      level: "Mid-level",
      applications: 18,
      status: "Active",
      posted: "2025-01-08",
      deadline: "2025-02-10",
      requirements: "Bachelor's degree, 3+ years customer service in banking, sales experience",
      salary: "$2,200 - $3,000",
      description: "Build and maintain relationships with personal banking clients, promote banking products."
    },
    {
      id: 3,
      title: "Trade Finance Officer",
      department: "Trade Finance",
      location: "Juba, South Sudan",
      type: "Full-time",
      level: "Mid-level",
      applications: 12,
      status: "Active",
      posted: "2025-01-05",
      deadline: "2025-02-05",
      requirements: "Finance degree, trade finance knowledge, LC and guarantee processing experience",
      salary: "$3,000 - $3,800",
      description: "Process trade finance transactions, manage letters of credit, and support import/export clients."
    },
    {
      id: 4,
      title: "IT Systems Analyst",
      department: "Information Technology",
      location: "Juba, South Sudan",
      type: "Full-time",
      level: "Senior",
      applications: 8,
      status: "On Hold",
      posted: "2025-01-03",
      deadline: "2025-01-30",
      requirements: "Computer Science degree, banking systems experience, cybersecurity knowledge",
      salary: "$3,200 - $4,000",
      description: "Maintain banking systems, ensure cybersecurity compliance, and support digital banking initiatives."
    }
  ]);

  // Form state for new/edit job
  const [jobForm, setJobForm] = useState({
    title: "",
    department: "",
    location: "Juba, South Sudan",
    type: "Full-time",
    level: "",
    requirements: "",
    salary: "",
    description: "",
    deadline: "",
    status: "Active"
  });

  const { user, hasPermission, addAuditLog } = useAuth();

  const candidates = [
    {
      id: 1,
      name: "Daniel Maker",
      email: "daniel.maker@email.com",
      phone: "+211 987 654 321",
      position: "Senior Credit Analyst",
      experience: "7 years",
      education: "MBA Finance",
      status: "Interview Scheduled",
      score: 8.5,
      stage: "Technical Interview",
      appliedDate: "2025-01-12",
      notes: "Strong banking background, excellent analytical skills"
    },
    {
      id: 2,
      name: "Ruth Ayuel",
      email: "ruth.ayuel@email.com",
      phone: "+211 876 543 210",
      position: "Customer Relationship Manager",
      experience: "4 years",
      education: "Bachelor's Business",
      status: "Under Review",
      score: 7.8,
      stage: "Document Verification",
      appliedDate: "2025-01-11",
      notes: "Great customer service experience in microfinance"
    },
    {
      id: 3,
      name: "Samuel Jok",
      email: "samuel.jok@email.com",
      phone: "+211 765 432 109",
      position: "Trade Finance Officer",
      experience: "5 years",
      education: "Bachelor's Economics",
      status: "Offer Extended",
      score: 9.0,
      stage: "Final Approval",
      appliedDate: "2025-01-09",
      notes: "Exceptional trade finance knowledge, worked with international banks"
    },
    {
      id: 4,
      name: "Grace Wani",
      email: "grace.wani@email.com",
      phone: "+211 654 321 098",
      position: "IT Systems Analyst",
      experience: "6 years",
      education: "Master's Computer Science",
      status: "Rejected",
      score: 6.5,
      stage: "Completed",
      appliedDate: "2025-01-07",
      notes: "Good technical skills but lacking banking systems experience"
    }
  ];

  // Job management functions
  const resetJobForm = () => {
    setJobForm({
      title: "",
      department: "",
      location: "Juba, South Sudan",
      type: "Full-time",
      level: "",
      requirements: "",
      salary: "",
      description: "",
      deadline: "",
      status: "Active"
    });
  };

  const handleCreateJob = () => {
    if (!hasPermission('recruitment.create') && !hasPermission('*')) {
      addAuditLog('UNAUTHORIZED_ACCESS_ATTEMPT', 'RECRUITMENT', { action: 'create_job' });
      return;
    }
    
    resetJobForm();
    setShowCreateJobDialog(true);
    addAuditLog('JOB_POSTING_DIALOG_OPENED', 'RECRUITMENT', { action: 'create_job_form_opened' });
  };

  const handleEditJob = (job: JobPosting) => {
    if (!hasPermission('recruitment.edit') && !hasPermission('*')) {
      addAuditLog('UNAUTHORIZED_ACCESS_ATTEMPT', 'RECRUITMENT', { action: 'edit_job', jobId: job.id });
      return;
    }

    setEditingJob(job);
    setJobForm({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      level: job.level,
      requirements: job.requirements,
      salary: job.salary,
      description: job.description,
      deadline: job.deadline,
      status: job.status
    });
    setShowEditDialog(true);
    addAuditLog('JOB_EDIT_DIALOG_OPENED', 'RECRUITMENT', { action: 'edit_job_form_opened', jobId: job.id });
  };

  const handleDeleteJob = (jobId: number) => {
    if (!hasPermission('recruitment.edit') && !hasPermission('*')) {
      addAuditLog('UNAUTHORIZED_ACCESS_ATTEMPT', 'RECRUITMENT', { action: 'delete_job', jobId });
      return;
    }

    const jobToDelete = jobs.find(job => job.id === jobId);
    setJobs(jobs.filter(job => job.id !== jobId));
    addAuditLog('JOB_POSTING_DELETED', 'RECRUITMENT', { 
      action: 'job_deleted', 
      jobId, 
      jobTitle: jobToDelete?.title,
      deletedBy: user?.email 
    });
  };

  const handleSaveJob = () => {
    if (editingJob) {
      // Update existing job
      const updatedJobs = jobs.map(job => 
        job.id === editingJob.id 
          ? { 
              ...job, 
              ...jobForm,
              posted: job.posted // Keep original posted date
            }
          : job
      );
      setJobs(updatedJobs);
      addAuditLog('JOB_POSTING_UPDATED', 'RECRUITMENT', { 
        action: 'job_updated', 
        jobId: editingJob.id, 
        jobTitle: jobForm.title,
        updatedBy: user?.email 
      });
      setShowEditDialog(false);
      setEditingJob(null);
    } else {
      // Create new job
      const newJob: JobPosting = {
        id: Math.max(...jobs.map(j => j.id)) + 1,
        ...jobForm,
        applications: 0,
        posted: new Date().toISOString().split('T')[0]
      };
      setJobs([...jobs, newJob]);
      addAuditLog('JOB_POSTING_CREATED', 'RECRUITMENT', { 
        action: 'job_created', 
        jobId: newJob.id, 
        jobTitle: jobForm.title,
        createdBy: user?.email 
      });
      setShowCreateJobDialog(false);
    }
    resetJobForm();
  };

  const handleToggleJobStatus = (jobId: number) => {
    if (!hasPermission('recruitment.edit') && !hasPermission('*')) {
      addAuditLog('UNAUTHORIZED_ACCESS_ATTEMPT', 'RECRUITMENT', { action: 'toggle_job_status', jobId });
      return;
    }

    const updatedJobs = jobs.map(job => {
      if (job.id === jobId) {
        const newStatus = job.status === 'Active' ? 'On Hold' : 'Active';
        addAuditLog('JOB_STATUS_CHANGED', 'RECRUITMENT', { 
          action: 'job_status_changed', 
          jobId, 
          oldStatus: job.status,
          newStatus,
          changedBy: user?.email 
        });
        return { ...job, status: newStatus };
      }
      return job;
    });
    setJobs(updatedJobs);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "On Hold": return "bg-yellow-100 text-yellow-800";
      case "Closed": return "bg-gray-100 text-gray-800";
      case "Interview Scheduled": return "bg-blue-100 text-blue-800";
      case "Under Review": return "bg-yellow-100 text-yellow-800";
      case "Offer Extended": return "bg-green-100 text-green-800";
      case "Rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDepartmentIcon = (department: string) => {
    switch (department) {
      case "Corporate Banking": return <BriefcaseIcon className="h-4 w-4" />;
      case "Personal Banking": return <UsersIcon className="h-4 w-4" />;
      case "Trade Finance": return <CreditCardIcon className="h-4 w-4" />;
      case "Information Technology": return <FileTextIcon className="h-4 w-4" />;
      default: return <DollarSignIcon className="h-4 w-4" />;
    }
  };

  const handleCandidateAction = (candidateId: number, action: string) => {
    addAuditLog('CANDIDATE_ACTION', 'RECRUITMENT', { candidateId, action });
    // In real app, perform the action
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    candidate.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recruitment & Talent Acquisition</h1>
          <p className="text-gray-600">Manage job postings and candidate pipeline for Horizon Bank</p>
        </div>
        {hasPermission('recruitment.create') && (
          <Button 
            onClick={handleCreateJob}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Post New Job
          </Button>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open Positions</p>
                <p className="text-3xl font-bold text-gray-900">12</p>
                <p className="text-xs text-gray-500">Banking roles</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <BriefcaseIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-3xl font-bold text-gray-900">67</p>
                <p className="text-xs text-gray-500">This month</p>
              </div>
              <div className="p-3 rounded-full bg-green-100">
                <UsersIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Interviews Scheduled</p>
                <p className="text-3xl font-bold text-gray-900">15</p>
                <p className="text-xs text-gray-500">Next 2 weeks</p>
              </div>
              <div className="p-3 rounded-full bg-amber-100">
                <CalendarIcon className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hires This Quarter</p>
                <p className="text-3xl font-bold text-gray-900">8</p>
                <p className="text-xs text-gray-500">Target: 12</p>
              </div>
              <div className="p-3 rounded-full bg-purple-100">
                <CheckCircleIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="jobs">Job Postings</TabsTrigger>
          <TabsTrigger value="candidates">Candidates</TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-6">
          {/* Search and Filters */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
                  <Input
                    placeholder="Search job postings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <FilterIcon className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Listings */}
          <div className="grid gap-6">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-blue-100">
                        {getDepartmentIcon(job.department)}
                      </div>
                      <div className="space-y-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                          <p className="text-sm text-gray-600">{job.department} • {job.location}</p>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{job.type}</span>
                          <span>•</span>
                          <span>{job.level}</span>
                          <span>•</span>
                          <span>{job.salary}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(job.status)}>
                        {job.status}
                      </Badge>
                      {(hasPermission('recruitment.edit') || hasPermission('*')) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVerticalIcon className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditJob(job)}>
                              <EditIcon className="mr-2 h-4 w-4" />
                              Edit Posting
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleJobStatus(job.id)}>
                              {job.status === 'Active' ? (
                                <>
                                  <ClockIcon className="mr-2 h-4 w-4" />
                                  Put On Hold
                                </>
                              ) : (
                                <>
                                  <CheckCircleIcon className="mr-2 h-4 w-4" />
                                  Activate
                                </>
                              )}
                            </DropdownMenuItem>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem 
                                  onSelect={(e) => e.preventDefault()}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <TrashIcon className="mr-2 h-4 w-4" />
                                  Delete Posting
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Job Posting</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete "{job.title}"? This action cannot be undone and will remove all associated applications.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteJob(job.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-4">{job.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Applications</p>
                      <p className="text-lg font-semibold text-gray-900">{job.applications}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Posted</p>
                      <p className="text-sm text-gray-700">{job.posted}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 mb-1">Deadline</p>
                      <p className="text-sm text-gray-700">{job.deadline}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      View Applications ({job.applications})
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="candidates" className="space-y-6">
          {/* Search and Filters */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 transform -translate-y-1/2" />
                  <Input
                    placeholder="Search candidates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <FilterIcon className="mr-2 h-4 w-4" />
                    Filter by Stage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Candidates Table */}
          <Card className="border-0 shadow-md">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-100">
                    <TableHead>Candidate</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCandidates.map((candidate) => (
                    <TableRow key={candidate.id} className="border-b border-gray-50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-blue-100 text-blue-700">
                              {candidate.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">{candidate.name}</p>
                            <p className="text-sm text-gray-500">{candidate.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{candidate.position}</p>
                          <p className="text-sm text-gray-500">{candidate.education}</p>
                        </div>
                      </TableCell>
                      <TableCell>{candidate.experience}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(candidate.status)}>
                          {candidate.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <StarIcon className="h-4 w-4 text-yellow-500" />
                          <span className="font-medium">{candidate.score}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {hasPermission('candidates.manage') && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCandidateAction(candidate.id, 'schedule_interview')}
                              >
                                <CalendarIcon className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleCandidateAction(candidate.id, 'view_profile')}
                              >
                                <FileTextIcon className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button variant="ghost" size="sm">
                            <MoreVerticalIcon className="h-4 w-4" />
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
      </Tabs>

      {/* Create Job Dialog */}
      <Dialog open={showCreateJobDialog} onOpenChange={setShowCreateJobDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Post New Job Opening</DialogTitle>
            <DialogDescription>
              Create a new job posting for Horizon Bank. Fill in all required details.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  placeholder="e.g. Senior Credit Analyst"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select 
                  value={jobForm.department} 
                  onValueChange={(value) => setJobForm({ ...jobForm, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Corporate Banking">Corporate Banking</SelectItem>
                    <SelectItem value="Personal Banking">Personal Banking</SelectItem>
                    <SelectItem value="Trade Finance">Trade Finance</SelectItem>
                    <SelectItem value="Information Technology">Information Technology</SelectItem>
                    <SelectItem value="Human Resources">Human Resources</SelectItem>
                    <SelectItem value="Finance & Accounting">Finance & Accounting</SelectItem>
                    <SelectItem value="Risk Management">Risk Management</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Employment Type *</Label>
                <Select 
                  value={jobForm.type} 
                  onValueChange={(value) => setJobForm({ ...jobForm, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Temporary">Temporary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Experience Level *</Label>
                <Select 
                  value={jobForm.level} 
                  onValueChange={(value) => setJobForm({ ...jobForm, level: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entry-level">Entry-level</SelectItem>
                    <SelectItem value="Mid-level">Mid-level</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                    <SelectItem value="Executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={jobForm.location}
                  onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salary">Salary Range</Label>
                <Input
                  id="salary"
                  value={jobForm.salary}
                  onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                  placeholder="e.g. $3,000 - $4,000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Application Deadline *</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={jobForm.deadline}
                  onChange={(e) => setJobForm({ ...jobForm, deadline: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                value={jobForm.description}
                onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements & Qualifications *</Label>
              <Textarea
                id="requirements"
                value={jobForm.requirements}
                onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                placeholder="List education, experience, skills, and other requirements..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateJobDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveJob}
              disabled={!jobForm.title || !jobForm.department || !jobForm.level || !jobForm.description || !jobForm.requirements || !jobForm.deadline}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              Post Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Job Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Job Posting</DialogTitle>
            <DialogDescription>
              Update the job posting details. Changes will be reflected immediately.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Job Title *</Label>
                <Input
                  id="edit-title"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-department">Department *</Label>
                <Select 
                  value={jobForm.department} 
                  onValueChange={(value) => setJobForm({ ...jobForm, department: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Corporate Banking">Corporate Banking</SelectItem>
                    <SelectItem value="Personal Banking">Personal Banking</SelectItem>
                    <SelectItem value="Trade Finance">Trade Finance</SelectItem>
                    <SelectItem value="Information Technology">Information Technology</SelectItem>
                    <SelectItem value="Human Resources">Human Resources</SelectItem>
                    <SelectItem value="Finance & Accounting">Finance & Accounting</SelectItem>
                    <SelectItem value="Risk Management">Risk Management</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-type">Type *</Label>
                <Select 
                  value={jobForm.type} 
                  onValueChange={(value) => setJobForm({ ...jobForm, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Temporary">Temporary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-level">Level *</Label>
                <Select 
                  value={jobForm.level} 
                  onValueChange={(value) => setJobForm({ ...jobForm, level: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Entry-level">Entry-level</SelectItem>
                    <SelectItem value="Mid-level">Mid-level</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                    <SelectItem value="Executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={jobForm.status} 
                  onValueChange={(value) => setJobForm({ ...jobForm, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-location">Location *</Label>
                <Input
                  id="edit-location"
                  value={jobForm.location}
                  onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-salary">Salary Range</Label>
                <Input
                  id="edit-salary"
                  value={jobForm.salary}
                  onChange={(e) => setJobForm({ ...jobForm, salary: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-deadline">Application Deadline *</Label>
                <Input
                  id="edit-deadline"
                  type="date"
                  value={jobForm.deadline}
                  onChange={(e) => setJobForm({ ...jobForm, deadline: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Job Description *</Label>
              <Textarea
                id="edit-description"
                value={jobForm.description}
                onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-requirements">Requirements & Qualifications *</Label>
              <Textarea
                id="edit-requirements"
                value={jobForm.requirements}
                onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveJob}
              disabled={!jobForm.title || !jobForm.department || !jobForm.level || !jobForm.description || !jobForm.requirements || !jobForm.deadline}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              Update Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 