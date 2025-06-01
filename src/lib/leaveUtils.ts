import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type DbLeaveType = Database['public']['Enums']['leave_type'];

// Leave Types Configuration
export const LEAVE_TYPES = {
  annual: { 
    name: 'Annual Leave', 
    color: 'bg-blue-100 text-blue-800',
    defaultEntitlement: 21,
    icon: '🌴',
    dbValue: 'annual' as DbLeaveType,
    description: 'Vacation days for rest and recreation'
  },
  sick: { 
    name: 'Sick Leave', 
    color: 'bg-orange-100 text-orange-800',
    defaultEntitlement: 10,
    icon: '🏥',
    dbValue: 'sick' as DbLeaveType,
    description: 'Medical leave for illness or health issues'
  },
  maternity: { 
    name: 'Maternity Leave', 
    color: 'bg-pink-100 text-pink-800',
    defaultEntitlement: 90,
    icon: '👶',
    dbValue: 'maternity' as DbLeaveType,
    description: 'Leave for new mothers before and after childbirth'
  },
  paternity: { 
    name: 'Paternity Leave', 
    color: 'bg-purple-100 text-purple-800',
    defaultEntitlement: 14,
    icon: '👨‍👶',
    dbValue: 'paternity' as DbLeaveType,
    description: 'Leave for new fathers to care for newborn children'
  },
  parental: { 
    name: 'Parental Leave', 
    color: 'bg-green-100 text-green-800',
    defaultEntitlement: 30,
    icon: '👨‍👩‍👧‍👦',
    dbValue: 'emergency' as DbLeaveType,
    description: 'Extended leave for childcare and family bonding'
  },
  compassionate: { 
    name: 'Compassionate (Bereavement) Leave', 
    color: 'bg-gray-100 text-gray-800',
    defaultEntitlement: 5,
    icon: '🕊️',
    dbValue: 'emergency' as DbLeaveType,
    description: 'Leave for grieving the loss of family members'
  },
  unpaid: { 
    name: 'Unpaid Leave', 
    color: 'bg-slate-100 text-slate-800',
    defaultEntitlement: 0,
    icon: '⏸️',
    dbValue: 'unpaid' as DbLeaveType,
    description: 'Leave without pay for personal reasons'
  },
  public_holiday: { 
    name: 'Public Holiday Leave', 
    color: 'bg-red-100 text-red-800',
    defaultEntitlement: 12,
    icon: '🎉',
    dbValue: 'annual' as DbLeaveType,
    description: 'Designated public holidays and national observances'
  },
  study: { 
    name: 'Study or Educational Leave', 
    color: 'bg-yellow-100 text-yellow-800',
    defaultEntitlement: 5,
    icon: '📚',
    dbValue: 'emergency' as DbLeaveType,
    description: 'Leave for professional development and education'
  },
  official_duty: { 
    name: 'Official Duty or Secondment Leave', 
    color: 'bg-indigo-100 text-indigo-800',
    defaultEntitlement: 0,
    icon: '🏢',
    dbValue: 'emergency' as DbLeaveType,
    description: 'Leave for official business or temporary assignments'
  },
  religious: { 
    name: 'Religious Leave', 
    color: 'bg-amber-100 text-amber-800',
    defaultEntitlement: 3,
    icon: '🕌',
    dbValue: 'emergency' as DbLeaveType,
    description: 'Leave for religious observances and pilgrimages'
  },
  administrative: { 
    name: 'Administrative Leave', 
    color: 'bg-cyan-100 text-cyan-800',
    defaultEntitlement: 0,
    icon: '📋',
    dbValue: 'emergency' as DbLeaveType,
    description: 'Paid leave during investigations or disciplinary procedures'
  }
};

// Business rule validations
export const validateLeaveRequest = (
  leaveType: keyof typeof LEAVE_TYPES,
  startDate: string,
  endDate: string,
  currentBalance?: { remaining_days: number; used_days: number; total_days: number }
) => {
  const errors: string[] = [];
  const today = new Date().toISOString().split('T')[0];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const requestedDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  // Date validations
  if (startDate < today) {
    errors.push('Start date cannot be in the past');
  }

  if (endDate < startDate) {
    errors.push('End date must be after start date');
  }

  // Weekend/Holiday validations (basic implementation)
  const dayOfWeek = start.getDay();
  if (leaveType !== 'sick' && leaveType !== 'compassionate' && (dayOfWeek === 0 || dayOfWeek === 6)) {
    errors.push('Non-emergency leave cannot start on weekends');
  }

  // Balance validations
  if (currentBalance && leaveType !== 'unpaid' && leaveType !== 'administrative') {
    if (requestedDays > currentBalance.remaining_days) {
      errors.push(`Insufficient leave balance. Available: ${currentBalance.remaining_days} days, Requested: ${requestedDays} days`);
    }
  }

  // Advance notice requirements
  const daysUntilLeave = Math.ceil((start.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  if (leaveType === 'annual' && daysUntilLeave < 14) {
    errors.push('Annual leave requires at least 14 days advance notice');
  }

  if (leaveType === 'study' && daysUntilLeave < 30) {
    errors.push('Study leave requires at least 30 days advance notice');
  }

  return {
    isValid: errors.length === 0,
    errors,
    requestedDays
  };
};

// Initialize leave balances for a new employee
export const initializeEmployeeLeaveBalances = async (
  employeeId: string,
  year: number = new Date().getFullYear(),
  customEntitlements?: Partial<Record<keyof typeof LEAVE_TYPES, number>>
) => {
  const balancesToInsert = Object.entries(LEAVE_TYPES).map(([key, config]) => {
    const entitlement = customEntitlements?.[key as keyof typeof LEAVE_TYPES] ?? config.defaultEntitlement;
    return {
      employee_id: employeeId,
      leave_type: config.dbValue,
      year,
      total_days: entitlement,
      used_days: 0,
      remaining_days: entitlement
    };
  });

  const { data, error } = await supabase
    .from('leave_balances')
    .insert(balancesToInsert);

  if (error) {
    console.error('Error initializing leave balances:', error);
    throw error;
  }

  return data;
};

// Calculate leave entitlement based on employment type and tenure
export const calculateLeaveEntitlement = (
  leaveType: keyof typeof LEAVE_TYPES,
  contractType: 'permanent' | 'temporary' | 'contract' | 'probation',
  hireDate: string,
  currentYear: number = new Date().getFullYear()
) => {
  const baseEntitlement = LEAVE_TYPES[leaveType].defaultEntitlement;
  const yearsOfService = currentYear - new Date(hireDate).getFullYear();

  // Probationary employees get reduced entitlements
  if (contractType === 'probation') {
    return Math.floor(baseEntitlement * 0.5);
  }

  // Temporary/contract employees get pro-rated entitlements
  if (contractType === 'temporary' || contractType === 'contract') {
    return Math.floor(baseEntitlement * 0.8);
  }

  // Permanent employees get full entitlements with tenure bonuses
  let entitlement = baseEntitlement;
  
  // Annual leave increases with tenure
  if (leaveType === 'annual') {
    if (yearsOfService >= 10) entitlement += 5;
    else if (yearsOfService >= 5) entitlement += 3;
    else if (yearsOfService >= 2) entitlement += 1;
  }

  return entitlement;
};

// Calculate final settlement for resignation/termination
export const calculateFinalSettlement = async (
  employeeId: string,
  lastWorkingDate: string,
  includePayInLieu: boolean = true
) => {
  const year = new Date(lastWorkingDate).getFullYear();
  
  // Fetch current leave balances
  const { data: balances, error } = await supabase
    .from('leave_balances')
    .select('*')
    .eq('employee_id', employeeId)
    .eq('year', year);

  if (error) {
    console.error('Error fetching leave balances:', error);
    throw error;
  }

  // Fetch employee salary for pay-in-lieu calculation
  const { data: employee, error: empError } = await supabase
    .from('profiles')
    .select('salary')
    .eq('id', employeeId)
    .single();

  if (empError) {
    console.error('Error fetching employee data:', empError);
    throw empError;
  }

  const dailySalary = (employee.salary || 0) / 365;
  
  const settlement = {
    totalUnusedDays: 0,
    payInLieuAmount: 0,
    breakdown: [] as Array<{
      leaveType: string;
      unusedDays: number;
      payAmount: number;
    }>
  };

  balances?.forEach((balance) => {
    const unusedDays = balance.remaining_days || 0;
    let payAmount = 0;

    // Only annual leave and emergency leave (if applicable) are typically paid out
    if (includePayInLieu && (balance.leave_type === 'annual' || balance.leave_type === 'emergency')) {
      payAmount = unusedDays * dailySalary;
    }

    if (unusedDays > 0) {
      const leaveConfig = Object.values(LEAVE_TYPES).find(config => config.dbValue === balance.leave_type);
      settlement.breakdown.push({
        leaveType: leaveConfig?.name || balance.leave_type,
        unusedDays,
        payAmount
      });
      
      settlement.totalUnusedDays += unusedDays;
      settlement.payInLieuAmount += payAmount;
    }
  });

  return settlement;
};

// Check for leave conflicts (overlapping requests)
export const checkLeaveConflicts = async (
  employeeId: string,
  startDate: string,
  endDate: string,
  excludeRequestId?: string
) => {
  let query = supabase
    .from('leave_requests')
    .select('*')
    .eq('employee_id', employeeId)
    .eq('status', 'approved')
    .or(`start_date.lte.${endDate},end_date.gte.${startDate}`);

  if (excludeRequestId) {
    query = query.neq('id', excludeRequestId);
  }

  const { data: conflicts, error } = await query;

  if (error) {
    console.error('Error checking leave conflicts:', error);
    throw error;
  }

  return conflicts || [];
};

// Generate leave reports
export const generateLeaveReport = async (
  startDate: string,
  endDate: string,
  departmentId?: string,
  leaveType?: DbLeaveType
) => {
  let query = supabase
    .from('leave_requests')
    .select(`
      *,
      employee:profiles!employee_id(first_name, last_name, employee_id, position, department_id),
      approver:profiles!approved_by(first_name, last_name)
    `)
    .gte('start_date', startDate)
    .lte('end_date', endDate);

  if (leaveType) {
    query = query.eq('leave_type', leaveType);
  }

  const { data: requests, error } = await query;

  if (error) {
    console.error('Error generating leave report:', error);
    throw error;
  }

  // Filter by department if specified
  const filteredRequests = departmentId 
    ? requests?.filter(req => req.employee?.department_id === departmentId)
    : requests;

  // Calculate statistics
  const stats = {
    totalRequests: filteredRequests?.length || 0,
    approvedRequests: filteredRequests?.filter(req => req.status === 'approved').length || 0,
    pendingRequests: filteredRequests?.filter(req => req.status === 'pending').length || 0,
    rejectedRequests: filteredRequests?.filter(req => req.status === 'rejected').length || 0,
    totalDaysRequested: filteredRequests?.reduce((sum, req) => sum + (req.days_requested || 0), 0) || 0,
    averageDaysPerRequest: 0
  };

  if (stats.totalRequests > 0) {
    stats.averageDaysPerRequest = Math.round(stats.totalDaysRequested / stats.totalRequests);
  }

  return {
    requests: filteredRequests,
    statistics: stats,
    generatedAt: new Date().toISOString(),
    period: { startDate, endDate },
    filters: { departmentId, leaveType }
  };
}; 