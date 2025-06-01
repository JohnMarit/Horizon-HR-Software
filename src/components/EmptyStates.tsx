import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PlusIcon, 
  SearchIcon, 
  UsersIcon, 
  FileTextIcon, 
  CalendarIcon,
  GraduationCapIcon,
  BriefcaseIcon,
  CreditCardIcon,
  AwardIcon,
  MessageSquareIcon,
  TrendingUpIcon,
  AlertCircleIcon,
  RefreshCwIcon,
  FilterIcon,
  BookOpenIcon
} from 'lucide-react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  illustration?: 'search' | 'empty' | 'error' | 'filter';
}

export const EmptyState = ({ 
  icon, 
  title, 
  description, 
  action, 
  secondaryAction,
  illustration = 'empty'
}: EmptyStateProps) => {
  const getIllustrationColor = () => {
    switch (illustration) {
      case 'search': return 'text-blue-400';
      case 'error': return 'text-red-400';
      case 'filter': return 'text-amber-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <Card className="border-dashed border-2 border-gray-200">
      <CardContent className="flex flex-col items-center justify-center text-center p-12">
        <div className={`w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-6 ${getIllustrationColor()}`}>
          {icon}
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 mb-6 max-w-md leading-relaxed">{description}</p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {action && (
            <Button 
              onClick={action.onClick}
              variant={action.variant || 'default'}
              className="min-w-[140px]"
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button 
              variant="outline" 
              onClick={secondaryAction.onClick}
              className="min-w-[140px]"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Specific empty states for HR modules
export const NoEmployeesState = ({ onAddEmployee }: { onAddEmployee: () => void }) => (
  <EmptyState
    icon={<UsersIcon className="h-8 w-8" />}
    title="No employees found"
    description="Start building your team by adding the first employee to the Horizon Bank HR system."
    action={{
      label: "Add Employee",
      onClick: onAddEmployee
    }}
    secondaryAction={{
      label: "Import from CSV",
      onClick: () => console.log('Import employees')
    }}
  />
);

export const NoJobPostingsState = ({ onCreateJob }: { onCreateJob: () => void }) => (
  <EmptyState
    icon={<BriefcaseIcon className="h-8 w-8" />}
    title="No job postings yet"
    description="Attract top banking talent by creating your first job posting. Build your team with qualified professionals."
    action={{
      label: "Post New Job",
      onClick: onCreateJob
    }}
    secondaryAction={{
      label: "Browse Templates",
      onClick: () => console.log('Browse job templates')
    }}
  />
);

export const NoTrainingCoursesState = ({ onCreateCourse }: { onCreateCourse: () => void }) => (
  <EmptyState
    icon={<GraduationCapIcon className="h-8 w-8" />}
    title="No training courses available"
    description="Enhance your team's banking skills and compliance knowledge by creating comprehensive training programs."
    action={{
      label: "Create Course",
      onClick: onCreateCourse
    }}
    secondaryAction={{
      label: "Import Courses",
      onClick: () => console.log('Import courses')
    }}
  />
);

export const NoCertificationsState = ({ onAddCertification }: { onAddCertification: () => void }) => (
  <EmptyState
    icon={<AwardIcon className="h-8 w-8" />}
    title="No certifications tracked"
    description="Maintain regulatory compliance by tracking banking certifications, licenses, and professional qualifications."
    action={{
      label: "Add Certification",
      onClick: onAddCertification
    }}
    secondaryAction={{
      label: "View Requirements",
      onClick: () => console.log('View certification requirements')
    }}
  />
);

export const NoPayrollRecordsState = ({ onProcessPayroll }: { onProcessPayroll: () => void }) => (
  <EmptyState
    icon={<CreditCardIcon className="h-8 w-8" />}
    title="No payroll records"
    description="Start by processing the monthly payroll to generate salary records and payment information for your team."
    action={{
      label: "Process Payroll",
      onClick: onProcessPayroll
    }}
    secondaryAction={{
      label: "Import Records",
      onClick: () => console.log('Import payroll records')
    }}
  />
);

export const NoLeaveRequestsState = ({ onRequestLeave }: { onRequestLeave: () => void }) => (
  <EmptyState
    icon={<CalendarIcon className="h-8 w-8" />}
    title="No leave requests"
    description="Time off requests and approvals will appear here. Start by submitting your first leave request."
    action={{
      label: "Request Leave",
      onClick: onRequestLeave
    }}
    secondaryAction={{
      label: "View Leave Policy",
      onClick: () => console.log('View leave policy')
    }}
  />
);

export const NoPerformanceReviewsState = ({ onStartReview }: { onStartReview: () => void }) => (
  <EmptyState
    icon={<TrendingUpIcon className="h-8 w-8" />}
    title="No performance reviews"
    description="Track employee performance and set goals by conducting regular performance evaluations and feedback sessions."
    action={{
      label: "Start Review",
      onClick: onStartReview
    }}
    secondaryAction={{
      label: "Review Templates",
      onClick: () => console.log('View review templates')
    }}
  />
);

export const NoCommunicationsState = ({ onSendMessage }: { onSendMessage: () => void }) => (
  <EmptyState
    icon={<MessageSquareIcon className="h-8 w-8" />}
    title="No messages yet"
    description="Stay connected with your team through announcements, updates, and important communications."
    action={{
      label: "Send Message",
      onClick: onSendMessage
    }}
    secondaryAction={{
      label: "View Templates",
      onClick: () => console.log('View message templates')
    }}
  />
);

// Search and filter empty states
export const NoSearchResultsState = ({ 
  searchQuery, 
  onClearSearch 
}: { 
  searchQuery: string; 
  onClearSearch: () => void;
}) => (
  <EmptyState
    icon={<SearchIcon className="h-8 w-8" />}
    title="No results found"
    description={`We couldn't find any results for "${searchQuery}". Try adjusting your search terms or clearing the filters.`}
    action={{
      label: "Clear Search",
      onClick: onClearSearch,
      variant: "outline"
    }}
    secondaryAction={{
      label: "Reset Filters",
      onClick: () => console.log('Reset filters')
    }}
    illustration="search"
  />
);

export const NoFilterResultsState = ({ onClearFilters }: { onClearFilters: () => void }) => (
  <EmptyState
    icon={<FilterIcon className="h-8 w-8" />}
    title="No matching records"
    description="Your current filters are too restrictive. Try broadening your criteria or clearing some filters to see more results."
    action={{
      label: "Clear Filters",
      onClick: onClearFilters,
      variant: "outline"
    }}
    secondaryAction={{
      label: "Reset All",
      onClick: () => console.log('Reset all filters')
    }}
    illustration="filter"
  />
);

// Error states
export const LoadingErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <EmptyState
    icon={<AlertCircleIcon className="h-8 w-8" />}
    title="Unable to load data"
    description="We're having trouble loading this information. Please check your connection and try again."
    action={{
      label: "Try Again",
      onClick: onRetry,
      variant: "outline"
    }}
    secondaryAction={{
      label: "Report Issue",
      onClick: () => console.log('Report issue')
    }}
    illustration="error"
  />
);

export const NetworkErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <EmptyState
    icon={<RefreshCwIcon className="h-8 w-8" />}
    title="Connection error"
    description="We're having trouble connecting to the Horizon Bank servers. Please check your internet connection and try again."
    action={{
      label: "Retry Connection",
      onClick: onRetry
    }}
    secondaryAction={{
      label: "Go Offline",
      onClick: () => console.log('Go offline mode')
    }}
    illustration="error"
  />
);

// Banking-specific empty states
export const NoComplianceRecordsState = ({ onAddRecord }: { onAddRecord: () => void }) => (
  <EmptyState
    icon={<BookOpenIcon className="h-8 w-8" />}
    title="No compliance records"
    description="Maintain regulatory compliance by tracking audit trails, policy adherence, and regulatory documentation."
    action={{
      label: "Add Record",
      onClick: onAddRecord
    }}
    secondaryAction={{
      label: "View Guidelines",
      onClick: () => console.log('View compliance guidelines')
    }}
  />
);

export const NoAnalyticsDataState = ({ onGenerateReport }: { onGenerateReport: () => void }) => (
  <EmptyState
    icon={<TrendingUpIcon className="h-8 w-8" />}
    title="No analytics data available"
    description="Generate insights and reports to track HR metrics, employee performance, and organizational trends."
    action={{
      label: "Generate Report",
      onClick: onGenerateReport
    }}
    secondaryAction={{
      label: "Configure Metrics",
      onClick: () => console.log('Configure metrics')
    }}
  />
); 