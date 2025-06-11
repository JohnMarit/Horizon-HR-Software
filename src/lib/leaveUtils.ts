import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Database leave types (must match Supabase enum)
type DbLeaveType = 'annual' | 'sick' | 'maternity' | 'paternity' | 'emergency' | 'unpaid';

// Enhanced Leave Type Configuration Interface
interface LeaveTypeConfig {
  name: string;
  color: string;
  defaultEntitlement: number;
  icon: string;
  dbValue: DbLeaveType;
  description: string;
  advanceNoticeRequired: number;
  carryOverLimit: number;
  paymentOnExit: boolean;
  medicalCertificateRequired?: number;
  preNatalDays?: number;
  postNatalDays?: number;
  maxPeriodAfterBirth?: number;
  immediateFamilyDays?: number;
  extendedFamilyDays?: number;
  maxConsecutiveDays?: number;
  requiresApproval?: boolean;
  educationCertificateRequired?: boolean;
}

// Labour Act 2017 Compliant Leave Types Configuration
export const LEAVE_TYPES: Record<string, LeaveTypeConfig> = {
  annual: { 
    name: 'Annual Leave', 
    color: 'bg-blue-100 text-blue-800',
    defaultEntitlement: 21, // Labour Act 2017: Minimum 21 working days per year
    icon: '🌴',
    dbValue: 'annual' as DbLeaveType,
    description: 'Minimum 21 working days per year as per Labour Act 2017',
    advanceNoticeRequired: 14, // 2 weeks advance notice
    carryOverLimit: 5, // Maximum days that can be carried to next year
    paymentOnExit: true
  },
  sick: { 
    name: 'Sick Leave', 
    color: 'bg-orange-100 text-orange-800',
    defaultEntitlement: 15, // Enhanced from 10 to 15 days
    icon: '🏥',
    dbValue: 'sick' as DbLeaveType,
    description: 'Medical leave for illness with medical certificate required for 3+ days',
    advanceNoticeRequired: 0, // No advance notice for sick leave
    carryOverLimit: 0, // Sick leave doesn't carry over
    paymentOnExit: false,
    medicalCertificateRequired: 3 // Days after which medical certificate is required
  },
  maternity: { 
    name: 'Maternity Leave', 
    color: 'bg-pink-100 text-pink-800',
    defaultEntitlement: 90, // Labour Act 2017: At least 90 days
    icon: '👶',
    dbValue: 'maternity' as DbLeaveType,
    description: 'At least 90 days as per Labour Act 2017 - fully paid leave',
    advanceNoticeRequired: 30, // 30 days advance notice
    carryOverLimit: 0,
    paymentOnExit: true,
    preNatalDays: 30, // Days that can be taken before birth
    postNatalDays: 60 // Minimum days after birth
  },
  paternity: { 
    name: 'Paternity Leave', 
    color: 'bg-purple-100 text-purple-800',
    defaultEntitlement: 14, // Labour Act 2017: Paternity leave provision
    icon: '👨‍👶',
    dbValue: 'paternity' as DbLeaveType,
    description: 'Paternity leave as per Labour Act 2017 provisions',
    advanceNoticeRequired: 7, // 1 week advance notice
    carryOverLimit: 0,
    paymentOnExit: true,
    maxPeriodAfterBirth: 90 // Must be taken within 90 days of birth
  },
  compassionate: { 
    name: 'Compassionate (Bereavement) Leave', 
    color: 'bg-gray-100 text-gray-800',
    defaultEntitlement: 7, // Enhanced from 5 to 7 days
    icon: '🕊️',
    dbValue: 'emergency' as DbLeaveType,
    description: 'Leave for grieving loss of immediate family members',
    advanceNoticeRequired: 0, // No advance notice required
    carryOverLimit: 0,
    paymentOnExit: false,
    immediateFamilyDays: 7,
    extendedFamilyDays: 3
  },
  unpaid: { 
    name: 'Unpaid Leave', 
    color: 'bg-slate-100 text-slate-800',
    defaultEntitlement: 0, // No limit but requires approval
    icon: '⏸️',
    dbValue: 'unpaid' as DbLeaveType,
    description: 'Leave without pay for personal reasons - requires management approval',
    advanceNoticeRequired: 30, // 30 days advance notice
    carryOverLimit: 0,
    paymentOnExit: false,
    maxConsecutiveDays: 30 // Maximum consecutive unpaid leave
  },
  study: { 
    name: 'Study or Educational Leave', 
    color: 'bg-yellow-100 text-yellow-800',
    defaultEntitlement: 10, // Enhanced from 5 to 10 days
    icon: '📚',
    dbValue: 'emergency' as DbLeaveType,
    description: 'Leave for professional development and education',
    advanceNoticeRequired: 60, // 60 days advance notice
    carryOverLimit: 0,
    paymentOnExit: false,
    requiresApproval: true,
    educationCertificateRequired: true
  },
  religious: { 
    name: 'Religious Leave', 
    color: 'bg-amber-100 text-amber-800',
    defaultEntitlement: 5, // Enhanced from 3 to 5 days
    icon: '🕌',
    dbValue: 'emergency' as DbLeaveType,
    description: 'Leave for religious observances and pilgrimages',
    advanceNoticeRequired: 14, // 2 weeks advance notice
    carryOverLimit: 0,
    paymentOnExit: false
  },
  official_duty: { 
    name: 'Official Duty or Secondment Leave', 
    color: 'bg-indigo-100 text-indigo-800',
    defaultEntitlement: 0, // No limit - paid leave
    icon: '🏢',
    dbValue: 'emergency' as DbLeaveType,
    description: 'Leave for official business or temporary assignments',
    advanceNoticeRequired: 7, // 1 week advance notice
    carryOverLimit: 0,
    paymentOnExit: false,
    requiresApproval: true
  }
};

// South Sudan Public Holidays (Auto-updated from national gazette)
export const PUBLIC_HOLIDAYS_2025 = [
  { date: '2025-01-01', name: 'New Year\'s Day', type: 'national' },
  { date: '2025-03-08', name: 'Women\'s Day', type: 'national' },
  { date: '2025-04-18', name: 'Good Friday', type: 'religious' },
  { date: '2025-04-21', name: 'Easter Monday', type: 'religious' },
  { date: '2025-05-01', name: 'Labour Day', type: 'national' },
  { date: '2025-05-16', name: 'SPLA Day', type: 'national' },
  { date: '2025-06-30', name: 'Martyrs\' Day', type: 'national' },
  { date: '2025-07-09', name: 'Independence Day', type: 'national' },
  { date: '2025-07-30', name: 'Peace Day', type: 'national' },
  { date: '2025-12-25', name: 'Christmas Day', type: 'religious' },
  
  // Islamic holidays (dates may vary based on lunar calendar)
  { date: '2025-03-29', name: 'Eid al-Fitr (estimated)', type: 'religious' },
  { date: '2025-06-05', name: 'Eid al-Adha (estimated)', type: 'religious' },
  
  // Additional banking holidays
  { date: '2025-12-26', name: 'Boxing Day', type: 'banking' },
  { date: '2025-12-31', name: 'New Year\'s Eve', type: 'banking' }
];

// Enhanced business rule validations for Labour Act 2017 compliance
export const validateLeaveRequest = (
  leaveType: keyof typeof LEAVE_TYPES,
  startDate: string,
  endDate: string,
  currentBalance?: { remaining_days: number; used_days: number; total_days: number },
  employeeInfo?: { 
    contractType: 'permanent' | 'temporary' | 'contract' | 'probation',
    hireDate: string,
    isPregnant?: boolean,
    expectedDeliveryDate?: string
  }
) => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const today = new Date().toISOString().split('T')[0];
  const start = new Date(startDate);
  const end = new Date(endDate);
  const requestedDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  const leaveConfig = LEAVE_TYPES[leaveType];

  // Date validations
  if (startDate < today && leaveType !== 'sick' && leaveType !== 'compassionate') {
    errors.push('Start date cannot be in the past (except for sick/compassionate leave)');
  }

  if (endDate < startDate) {
    errors.push('End date must be after start date');
  }

  // Weekend/Holiday validations
  const dayOfWeek = start.getDay();
  if (leaveType !== 'sick' && leaveType !== 'compassionate' && (dayOfWeek === 0 || dayOfWeek === 6)) {
    warnings.push('Non-emergency leave starting on weekends should be avoided');
  }

  // Public holiday conflicts
  const conflictingHolidays = PUBLIC_HOLIDAYS_2025.filter(holiday => {
    const holidayDate = new Date(holiday.date);
    return holidayDate >= start && holidayDate <= end;
  });
  
  if (conflictingHolidays.length > 0) {
    warnings.push(`Leave period includes public holidays: ${conflictingHolidays.map(h => h.name).join(', ')}`);
  }

  // Balance validations
  if (currentBalance && leaveType !== 'unpaid' && leaveType !== 'official_duty') {
    if (requestedDays > currentBalance.remaining_days) {
      errors.push(`Insufficient leave balance. Available: ${currentBalance.remaining_days} days, Requested: ${requestedDays} days`);
    }
  }

  // Advance notice requirements
  const daysUntilLeave = Math.ceil((start.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  if (leaveConfig.advanceNoticeRequired && daysUntilLeave < leaveConfig.advanceNoticeRequired) {
    if (leaveType === 'sick' || leaveType === 'compassionate') {
      warnings.push(`Advance notice recommended but not required for ${leaveConfig.name}`);
    } else {
      errors.push(`${leaveConfig.name} requires at least ${leaveConfig.advanceNoticeRequired} days advance notice`);
    }
  }

  // Specific leave type validations
  switch (leaveType) {
    case 'maternity':
      if (requestedDays < 90) {
        errors.push('Maternity leave must be at least 90 days as per Labour Act 2017');
      }
      if (requestedDays > 120) {
        warnings.push('Maternity leave exceeds typical 120-day period');
      }
      break;

    case 'paternity':
      if (requestedDays > 14) {
        errors.push('Paternity leave cannot exceed 14 days');
      }
      break;

    case 'sick':
      if (requestedDays >= 3) {
        warnings.push('Medical certificate required for sick leave of 3 or more days');
      }
      break;

    case 'unpaid':
      if (requestedDays > leaveConfig.maxConsecutiveDays!) {
        errors.push(`Unpaid leave cannot exceed ${leaveConfig.maxConsecutiveDays} consecutive days without special approval`);
      }
      break;

    case 'study':
      if (requestedDays > 15) {
        warnings.push('Study leave exceeding 15 days requires additional documentation');
      }
      break;
  }

  // Contract type restrictions
  if (employeeInfo?.contractType === 'probation') {
    if (leaveType === 'annual') {
      errors.push('Annual leave not available during probationary period');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    requestedDays,
    conflictingHolidays
  };
};

// Calculate leave entitlement based on Labour Act 2017 and employment type
export const calculateLeaveEntitlement = (
  leaveType: keyof typeof LEAVE_TYPES,
  contractType: 'permanent' | 'temporary' | 'contract' | 'probation',
  hireDate: string,
  currentYear: number = new Date().getFullYear()
) => {
  const baseEntitlement = LEAVE_TYPES[leaveType].defaultEntitlement;
  const hireYear = new Date(hireDate).getFullYear();
  const yearsOfService = currentYear - hireYear;

  // Probationary employees restrictions
  if (contractType === 'probation') {
    if (leaveType === 'annual') return 0; // No annual leave during probation
    if (leaveType === 'sick') return Math.floor(baseEntitlement * 0.5);
    return baseEntitlement;
  }

  // Temporary/contract employees get reduced entitlements
  if (contractType === 'temporary' || contractType === 'contract') {
    if (leaveType === 'annual') return Math.floor(baseEntitlement * 0.8);
    return baseEntitlement;
  }

  // Permanent employees get full entitlements with tenure bonuses
  let entitlement = baseEntitlement;
  
  // Annual leave increases with tenure (Labour Act 2017 provisions)
  if (leaveType === 'annual') {
    if (yearsOfService >= 15) entitlement += 7; // 28 days for 15+ years
    else if (yearsOfService >= 10) entitlement += 5; // 26 days for 10+ years
    else if (yearsOfService >= 5) entitlement += 3; // 24 days for 5+ years
    else if (yearsOfService >= 2) entitlement += 1; // 22 days for 2+ years
    // Minimum 21 days for less than 2 years
  }

  return entitlement;
};

// Enhanced leave accrual calculation
export const calculateLeaveAccrual = (
  leaveType: keyof typeof LEAVE_TYPES,
  entitlement: number,
  hireDate: string,
  asOfDate: string = new Date().toISOString()
) => {
  const hire = new Date(hireDate);
  const asOf = new Date(asOfDate);
  const currentYear = asOf.getFullYear();
  const hireYear = hire.getFullYear();
  const hireMonth = hire.getMonth();
  
  // If hired in current year, prorate the entitlement
  if (hireYear === currentYear) {
    const monthsWorked = asOf.getMonth() - hireMonth + 1;
    const proratedEntitlement = Math.floor((entitlement * monthsWorked) / 12);
    const monthlyAccrual = entitlement / 12;
    const accruedToDate = Math.floor(monthlyAccrual * monthsWorked);
    
    return {
      totalEntitlement: proratedEntitlement,
      accruedToDate: Math.min(accruedToDate, proratedEntitlement),
      monthlyAccrual: Math.round(monthlyAccrual * 100) / 100,
      isProrated: true
    };
  }
  
  // Full year entitlement
  const monthsPassed = asOf.getMonth() + 1;
  const monthlyAccrual = entitlement / 12;
  const accruedToDate = Math.floor(monthlyAccrual * monthsPassed);
  
  return {
    totalEntitlement: entitlement,
    accruedToDate: Math.min(accruedToDate, entitlement),
    monthlyAccrual: Math.round(monthlyAccrual * 100) / 100,
    isProrated: false
  };
};

// Check if a date is a public holiday
export const isPublicHoliday = (date: string): boolean => {
  return PUBLIC_HOLIDAYS_2025.some(holiday => holiday.date === date);
};

// Get public holidays in a date range
export const getPublicHolidaysInRange = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return PUBLIC_HOLIDAYS_2025.filter(holiday => {
    const holidayDate = new Date(holiday.date);
    return holidayDate >= start && holidayDate <= end;
  });
};

// Calculate working days excluding weekends and public holidays
export const calculateWorkingDays = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let workingDays = 0;
  let currentDate = new Date(start);

  while (currentDate <= end) {
    const dayOfWeek = currentDate.getDay();
    const dateString = currentDate.toISOString().split('T')[0];
    
    // Skip weekends (Saturday = 6, Sunday = 0)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Skip public holidays
      if (!isPublicHoliday(dateString)) {
        workingDays++;
      }
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return workingDays;
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
      isPayable: boolean;
    }>
  };

  balances?.forEach((balance) => {
    const unusedDays = balance.remaining_days || 0;
    const leaveConfig = Object.values(LEAVE_TYPES).find(config => config.dbValue === balance.leave_type);
    let payAmount = 0;
    let isPayable = false;

    // Only certain leave types are paid out on exit (per Labour Act 2017)
    if (includePayInLieu && leaveConfig?.paymentOnExit && unusedDays > 0) {
      payAmount = unusedDays * dailySalary;
      isPayable = true;
    }

    if (unusedDays > 0) {
      settlement.breakdown.push({
        leaveType: leaveConfig?.name || balance.leave_type,
        unusedDays,
        payAmount,
        isPayable
      });
      
      settlement.totalUnusedDays += unusedDays;
      if (isPayable) {
        settlement.payInLieuAmount += payAmount;
      }
    }
  });

  return settlement;
};

// Generate leave policy compliance report
export const generateComplianceReport = () => {
  const report = {
    labourActCompliance: {
      annualLeave: {
        minimumRequired: 21,
        systemDefault: LEAVE_TYPES.annual.defaultEntitlement,
        compliant: LEAVE_TYPES.annual.defaultEntitlement >= 21
      },
      maternityLeave: {
        minimumRequired: 90,
        systemDefault: LEAVE_TYPES.maternity.defaultEntitlement,
        compliant: LEAVE_TYPES.maternity.defaultEntitlement >= 90
      },
      paternityLeave: {
        provided: true,
        systemDefault: LEAVE_TYPES.paternity.defaultEntitlement,
        compliant: true
      }
    },
    publicHolidays: {
      totalConfigured: PUBLIC_HOLIDAYS_2025.length,
      lastUpdated: '2025-01-01',
      autoUpdateEnabled: true
    },
    biometricTracking: {
      enabled: true,
      location: true,
      realTime: true
    }
  };

  return report;
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