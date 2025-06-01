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
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, DollarSignIcon, FileTextIcon, CalculatorIcon, PrinterIcon, AlertTriangleIcon, CheckCircleIcon, ClockIcon } from 'lucide-react';

interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  status: string;
  joinDate: string;
  salary?: string;
  manager?: string;
  location: string;
}

interface BenefitCalculation {
  basicSalary: number;
  severancePay: number;
  noticePay: number;
  annualLeaveBalance: number;
  unpaidLeave: number;
  pensionContribution: number;
  medicalBenefits: number;
  bonusProration: number;
  overtimePayment: number;
  taxDeductions: number;
  socialSecurityDeductions: number;
  loanDeductions: number;
  advanceDeductions: number;
  totalGross: number;
  totalDeductions: number;
  netPayable: number;
}

interface ExitProcess {
  exitType: 'resignation' | 'retirement' | 'termination' | 'redundancy';
  exitDate: string;
  noticeDate: string;
  reason: string;
  lastWorkingDay: string;
  handoverStatus: 'pending' | 'in-progress' | 'completed';
  clearanceStatus: 'pending' | 'in-progress' | 'completed';
  status: 'initiated' | 'processing' | 'approved' | 'completed';
}

interface ExitManagementProps {
  employee: Employee;
  isOpen: boolean;
  onClose: () => void;
}

export const ExitManagement: React.FC<ExitManagementProps> = ({ employee, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'calculation' | 'process' | 'documents'>('calculation');
  const [exitProcess, setExitProcess] = useState<ExitProcess>({
    exitType: 'resignation',
    exitDate: '',
    noticeDate: '',
    reason: '',
    lastWorkingDay: '',
    handoverStatus: 'pending',
    clearanceStatus: 'pending',
    status: 'initiated'
  });

  // Calculate years and months of service
  const calculateServicePeriod = (joinDate: string, exitDate: string) => {
    const join = new Date(joinDate);
    const exit = new Date(exitDate);
    const diffTime = Math.abs(exit.getTime() - join.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    return { years, months, totalDays: diffDays };
  };

  // Calculate benefits based on South Sudan labor laws and banking industry standards
  const calculateBenefits = (): BenefitCalculation => {
    const salaryString = employee.salary || '$0';
    const basicSalary = parseFloat(salaryString.replace(/[$,]/g, '')) || 0;
    
    if (!exitProcess.exitDate) {
      return {
        basicSalary: 0, severancePay: 0, noticePay: 0, annualLeaveBalance: 0,
        unpaidLeave: 0, pensionContribution: 0, medicalBenefits: 0, bonusProration: 0,
        overtimePayment: 0, taxDeductions: 0, socialSecurityDeductions: 0,
        loanDeductions: 0, advanceDeductions: 0, totalGross: 0, totalDeductions: 0, netPayable: 0
      };
    }

    const servicePeriod = calculateServicePeriod(employee.joinDate, exitProcess.exitDate);
    
    // Severance pay calculation (based on years of service)
    let severanceMultiplier = 0;
    if (exitProcess.exitType === 'termination' || exitProcess.exitType === 'redundancy') {
      if (servicePeriod.years >= 10) severanceMultiplier = 3;
      else if (servicePeriod.years >= 5) severanceMultiplier = 2;
      else if (servicePeriod.years >= 1) severanceMultiplier = 1;
    } else if (exitProcess.exitType === 'retirement' && servicePeriod.years >= 10) {
      severanceMultiplier = servicePeriod.years * 0.5;
    }
    
    const severancePay = basicSalary * severanceMultiplier;
    
    // Notice pay (1 month for each year of service, max 3 months)
    const noticeMonths = Math.min(servicePeriod.years, 3);
    const noticePay = basicSalary * noticeMonths;
    
    // Annual leave balance (assuming 21 days per year, prorated)
    const annualLeaveEntitlement = (servicePeriod.totalDays / 365) * 21;
    const annualLeaveBalance = (annualLeaveEntitlement / 30) * basicSalary; // Convert days to salary
    
    // Pension contribution (10% of basic salary for years of service)
    const pensionContribution = basicSalary * 0.10 * servicePeriod.years;
    
    // Medical benefits (3 months coverage)
    const medicalBenefits = basicSalary * 0.05 * 3;
    
    // Bonus proratation (assuming annual bonus)
    const currentYear = new Date().getFullYear();
    const exitYear = new Date(exitProcess.exitDate).getFullYear();
    const bonusProration = exitYear === currentYear ? 
      (basicSalary * 0.5 * (new Date(exitProcess.exitDate).getMonth() + 1) / 12) : 0;
    
    // Overtime payment (estimated)
    const overtimePayment = basicSalary * 0.1;
    
    // Calculate gross total
    const totalGross = basicSalary + severancePay + noticePay + annualLeaveBalance + 
                     pensionContribution + medicalBenefits + bonusProration + overtimePayment;
    
    // Deductions
    const taxDeductions = totalGross * 0.10; // 10% tax
    const socialSecurityDeductions = basicSalary * 0.08; // 8% social security
    const loanDeductions = 0; // Would be fetched from employee records
    const advanceDeductions = 0; // Would be fetched from employee records
    const unpaidLeave = 0; // Would be calculated from leave records
    
    const totalDeductions = taxDeductions + socialSecurityDeductions + loanDeductions + 
                          advanceDeductions + unpaidLeave;
    
    const netPayable = totalGross - totalDeductions;

    return {
      basicSalary,
      severancePay,
      noticePay,
      annualLeaveBalance,
      unpaidLeave,
      pensionContribution,
      medicalBenefits,
      bonusProration,
      overtimePayment,
      taxDeductions,
      socialSecurityDeductions,
      loanDeductions,
      advanceDeductions,
      totalGross,
      totalDeductions,
      netPayable
    };
  };

  const benefits = calculateBenefits();
  const servicePeriod = exitProcess.exitDate ? calculateServicePeriod(employee.joinDate, exitProcess.exitDate) : null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleProcessExit = () => {
    // Here you would integrate with your backend to process the exit
    console.log('Processing exit for employee:', employee.id);
    console.log('Exit process details:', exitProcess);
    console.log('Benefit calculations:', benefits);
  };

  const generateExitDocument = () => {
    // Generate exit clearance document
    console.log('Generating exit document for:', employee.name);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileTextIcon className="h-5 w-5" />
            Exit Management - {employee.name}
          </DialogTitle>
          <DialogDescription>
            Calculate benefits and manage exit process for {employee.position} in {employee.department}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Employee Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Employee Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Employee ID</Label>
                  <p className="text-sm text-gray-900">{employee.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Department</Label>
                  <p className="text-sm text-gray-900">{employee.department}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Join Date</Label>
                  <p className="text-sm text-gray-900">{new Date(employee.joinDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Current Salary</Label>
                  <p className="text-sm text-gray-900">{employee.salary || 'Not specified'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Manager</Label>
                  <p className="text-sm text-gray-900">{employee.manager || 'Not specified'}</p>
                </div>
                {servicePeriod && (
                  <div>
                    <Label className="text-sm font-medium text-gray-600">Service Period</Label>
                    <p className="text-sm text-gray-900">
                      {servicePeriod.years} years, {servicePeriod.months} months
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tab Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('calculation')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'calculation'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CalculatorIcon className="inline h-4 w-4 mr-2" />
              Benefit Calculation
            </button>
            <button
              onClick={() => setActiveTab('process')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'process'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <ClockIcon className="inline h-4 w-4 mr-2" />
              Exit Process
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'documents'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileTextIcon className="inline h-4 w-4 mr-2" />
              Documents
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'calculation' && (
            <div className="space-y-4">
              {/* Exit Details Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Exit Details</CardTitle>
                  <CardDescription>Enter exit information to calculate benefits</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="exitType">Exit Type</Label>
                      <Select 
                        value={exitProcess.exitType} 
                        onValueChange={(value: any) => setExitProcess({...exitProcess, exitType: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="resignation">Resignation</SelectItem>
                          <SelectItem value="retirement">Retirement</SelectItem>
                          <SelectItem value="termination">Termination</SelectItem>
                          <SelectItem value="redundancy">Redundancy</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="exitDate">Exit Date</Label>
                      <Input
                        type="date"
                        value={exitProcess.exitDate}
                        onChange={(e) => setExitProcess({...exitProcess, exitDate: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="noticeDate">Notice Date</Label>
                      <Input
                        type="date"
                        value={exitProcess.noticeDate}
                        onChange={(e) => setExitProcess({...exitProcess, noticeDate: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastWorkingDay">Last Working Day</Label>
                      <Input
                        type="date"
                        value={exitProcess.lastWorkingDay}
                        onChange={(e) => setExitProcess({...exitProcess, lastWorkingDay: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <Label htmlFor="reason">Reason for Exit</Label>
                    <Textarea
                      placeholder="Enter reason for exit..."
                      value={exitProcess.reason}
                      onChange={(e) => setExitProcess({...exitProcess, reason: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Benefit Calculations */}
              {exitProcess.exitDate && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSignIcon className="h-5 w-5" />
                      Financial Settlement Calculation
                    </CardTitle>
                    <CardDescription>
                      Based on South Sudan labor laws and banking industry standards
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Entitlements */}
                      <div>
                        <h4 className="font-semibold text-green-700 mb-3">Entitlements</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Description</TableHead>
                              <TableHead className="text-right">Amount (USD)</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>Final Month Salary</TableCell>
                              <TableCell className="text-right">{formatCurrency(benefits.basicSalary)}</TableCell>
                            </TableRow>
                            {benefits.severancePay > 0 && (
                              <TableRow>
                                <TableCell>Severance Pay</TableCell>
                                <TableCell className="text-right">{formatCurrency(benefits.severancePay)}</TableCell>
                              </TableRow>
                            )}
                            <TableRow>
                              <TableCell>Notice Pay</TableCell>
                              <TableCell className="text-right">{formatCurrency(benefits.noticePay)}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Annual Leave Balance</TableCell>
                              <TableCell className="text-right">{formatCurrency(benefits.annualLeaveBalance)}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Pension Contribution</TableCell>
                              <TableCell className="text-right">{formatCurrency(benefits.pensionContribution)}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Medical Benefits</TableCell>
                              <TableCell className="text-right">{formatCurrency(benefits.medicalBenefits)}</TableCell>
                            </TableRow>
                            {benefits.bonusProration > 0 && (
                              <TableRow>
                                <TableCell>Bonus Proration</TableCell>
                                <TableCell className="text-right">{formatCurrency(benefits.bonusProration)}</TableCell>
                              </TableRow>
                            )}
                            <TableRow>
                              <TableCell>Overtime Payment</TableCell>
                              <TableCell className="text-right">{formatCurrency(benefits.overtimePayment)}</TableCell>
                            </TableRow>
                            <TableRow className="border-t-2">
                              <TableCell className="font-semibold">Total Gross</TableCell>
                              <TableCell className="text-right font-semibold text-green-600">
                                {formatCurrency(benefits.totalGross)}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>

                      <Separator />

                      {/* Deductions */}
                      <div>
                        <h4 className="font-semibold text-red-700 mb-3">Deductions</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Description</TableHead>
                              <TableHead className="text-right">Amount (USD)</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>Tax Deductions (10%)</TableCell>
                              <TableCell className="text-right">{formatCurrency(benefits.taxDeductions)}</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>Social Security (8%)</TableCell>
                              <TableCell className="text-right">{formatCurrency(benefits.socialSecurityDeductions)}</TableCell>
                            </TableRow>
                            {benefits.unpaidLeave > 0 && (
                              <TableRow>
                                <TableCell>Unpaid Leave</TableCell>
                                <TableCell className="text-right">{formatCurrency(benefits.unpaidLeave)}</TableCell>
                              </TableRow>
                            )}
                            {benefits.loanDeductions > 0 && (
                              <TableRow>
                                <TableCell>Outstanding Loans</TableCell>
                                <TableCell className="text-right">{formatCurrency(benefits.loanDeductions)}</TableCell>
                              </TableRow>
                            )}
                            {benefits.advanceDeductions > 0 && (
                              <TableRow>
                                <TableCell>Salary Advances</TableCell>
                                <TableCell className="text-right">{formatCurrency(benefits.advanceDeductions)}</TableCell>
                              </TableRow>
                            )}
                            <TableRow className="border-t-2">
                              <TableCell className="font-semibold">Total Deductions</TableCell>
                              <TableCell className="text-right font-semibold text-red-600">
                                {formatCurrency(benefits.totalDeductions)}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>

                      <Separator />

                      {/* Net Payment */}
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-blue-900">Net Amount Payable</span>
                          <span className="text-2xl font-bold text-blue-600">
                            {formatCurrency(benefits.netPayable)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'process' && (
            <Card>
              <CardHeader>
                <CardTitle>Exit Process Management</CardTitle>
                <CardDescription>Track and manage the exit process stages</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Process Status */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${
                        exitProcess.status === 'initiated' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                      }`}>
                        <CheckCircleIcon className="h-6 w-6" />
                      </div>
                      <h4 className="mt-2 font-medium">Exit Initiated</h4>
                      <p className="text-sm text-gray-600">Process started</p>
                    </div>
                    <div className="text-center">
                      <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${
                        ['processing', 'approved', 'completed'].includes(exitProcess.status) 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-gray-100 text-gray-400'
                      }`}>
                        <ClockIcon className="h-6 w-6" />
                      </div>
                      <h4 className="mt-2 font-medium">Processing</h4>
                      <p className="text-sm text-gray-600">Clearance & calculations</p>
                    </div>
                    <div className="text-center">
                      <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center ${
                        exitProcess.status === 'completed' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        <CheckCircleIcon className="h-6 w-6" />
                      </div>
                      <h4 className="mt-2 font-medium">Completed</h4>
                      <p className="text-sm text-gray-600">Final settlement</p>
                    </div>
                  </div>

                  {/* Clearance Checklist */}
                  <div>
                    <h4 className="font-semibold mb-3">Exit Clearance Checklist</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircleIcon className="h-5 w-5 text-green-600" />
                          <span>Handover Documentation</span>
                        </div>
                        <Badge variant={exitProcess.handoverStatus === 'completed' ? 'default' : 'secondary'}>
                          {exitProcess.handoverStatus}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircleIcon className="h-5 w-5 text-green-600" />
                          <span>IT Equipment Return</span>
                        </div>
                        <Badge variant="secondary">Pending</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircleIcon className="h-5 w-5 text-green-600" />
                          <span>Access Card Return</span>
                        </div>
                        <Badge variant="secondary">Pending</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <CheckCircleIcon className="h-5 w-5 text-green-600" />
                          <span>Final Approval</span>
                        </div>
                        <Badge variant={exitProcess.clearanceStatus === 'completed' ? 'default' : 'secondary'}>
                          {exitProcess.clearanceStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'documents' && (
            <Card>
              <CardHeader>
                <CardTitle>Exit Documents</CardTitle>
                <CardDescription>Generate and manage exit-related documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col gap-2"
                    onClick={generateExitDocument}
                  >
                    <FileTextIcon className="h-6 w-6" />
                    <span>Exit Clearance Form</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <PrinterIcon className="h-6 w-6" />
                    <span>Benefit Calculation Report</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <FileTextIcon className="h-6 w-6" />
                    <span>Experience Certificate</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <FileTextIcon className="h-6 w-6" />
                    <span>No Dues Certificate</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleProcessExit} className="bg-blue-600 hover:bg-blue-700">
            Process Exit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExitManagement; 