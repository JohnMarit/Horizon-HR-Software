import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Heart,
  Eye,
  DollarSign,
  FileText,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  Calculator,
  Calendar,
  Building
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface BenefitPlan {
  id: string;
  name: string;
  type: string;
  provider: string;
  description: string;
  cost_employee: number;
  cost_employer: number;
  coverage_details: any;
  is_active: boolean;
  is_mandatory: boolean;
}

interface EmployeeBenefit {
  id: string;
  benefit_plan_id: string;
  enrollment_date: string;
  effective_date: string;
  termination_date?: string;
  dependents: any;
  coverage_amount: number;
  employee_contribution: number;
  employer_contribution: number;
  status: string;
  benefit_plans: BenefitPlan;
}

interface BenefitClaim {
  id: string;
  employee_benefit_id: string;
  claim_number: string;
  claim_date: string;
  service_date: string;
  provider_name: string;
  description: string;
  amount_claimed: number;
  amount_approved?: number;
  amount_paid?: number;
  status: string;
  reviewed_at?: string;
  notes?: string;
}

const BenefitsManagement: React.FC = () => {
  const { user } = useAuth();
  const [availablePlans, setAvailablePlans] = useState<BenefitPlan[]>([]);
  const [myBenefits, setMyBenefits] = useState<EmployeeBenefit[]>([]);
  const [myClaims, setMyClaims] = useState<BenefitClaim[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<BenefitPlan | null>(null);
  const [enrollmentDialog, setEnrollmentDialog] = useState(false);
  const [claimDialog, setClaimDialog] = useState(false);

  // Form states
  const [dependents, setDependents] = useState<Array<{ name: string; relationship: string; dob: string }>>([]);
  const [newClaim, setNewClaim] = useState({
    employee_benefit_id: '',
    service_date: '',
    provider_name: '',
    description: '',
    amount_claimed: 0
  });

  useEffect(() => {
    if (user) {
      loadAvailablePlans();
      loadMyBenefits();
      loadMyClaims();
    }
  }, [user]);

  const loadAvailablePlans = async () => {
    try {
      // @ts-ignore - Table will exist after schema update
      const { data, error } = await supabase
        .from('benefit_plans')
        .select('*')
        .eq('is_active', true)
        .order('type', { ascending: true });

      if (error) throw error;
      setAvailablePlans(data || []);
    } catch (error) {
      console.error('Error loading benefit plans:', error);
      toast.error('Failed to load benefit plans - ensure database schema is applied');
    }
  };

  const loadMyBenefits = async () => {
    if (!user) return;

    try {
      // @ts-ignore - Table will exist after schema update
      const { data, error } = await supabase
        .from('employee_benefits')
        .select(`
          *,
          benefit_plans (*)
        `)
        .eq('employee_id', user.id)
        .order('enrollment_date', { ascending: false });

      if (error) throw error;
      setMyBenefits(data || []);
    } catch (error) {
      console.error('Error loading my benefits:', error);
      toast.error('Failed to load your benefits - ensure database schema is applied');
    }
  };

  const loadMyClaims = async () => {
    if (!user) return;

    try {
      // @ts-ignore - Table will exist after schema update
      const { data, error } = await supabase
        .from('benefit_claims')
        .select(`
          *,
          employee_benefits!inner (
            employee_id,
            benefit_plans (name, type)
          )
        `)
        .eq('employee_benefits.employee_id', user.id)
        .order('claim_date', { ascending: false });

      if (error) throw error;
      setMyClaims(data || []);
    } catch (error) {
      console.error('Error loading claims:', error);
      toast.error('Failed to load your claims - ensure database schema is applied');
    }
  };

  const handleEnrollment = async (planId: string) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const plan = availablePlans.find(p => p.id === planId);
      if (!plan) throw new Error('Plan not found');

      // @ts-ignore - Table will exist after schema update
      const { error } = await supabase
        .from('employee_benefits')
        .insert([{
          employee_id: user.id,
          benefit_plan_id: planId,
          enrollment_date: new Date().toISOString().split('T')[0],
          effective_date: new Date().toISOString().split('T')[0],
          dependents: dependents.length > 0 ? dependents : null,
          coverage_amount: plan.cost_employee + plan.cost_employer,
          employee_contribution: plan.cost_employee,
          employer_contribution: plan.cost_employer,
          status: 'active'
        }]);

      if (error) throw error;

      await loadMyBenefits();
      setEnrollmentDialog(false);
      setSelectedPlan(null);
      setDependents([]);
      toast.success('Successfully enrolled in benefit plan!');
    } catch (error) {
      console.error('Enrollment error:', error);
      toast.error('Failed to enroll in benefit plan - ensure database schema is applied');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClaimSubmission = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Generate claim number
      const claimNumber = `CLM-${Date.now()}`;

      // @ts-ignore - Table will exist after schema update
      const { error } = await supabase
        .from('benefit_claims')
        .insert([{
          ...newClaim,
          claim_number: claimNumber,
          claim_date: new Date().toISOString().split('T')[0],
          status: 'submitted'
        }]);

      if (error) throw error;

      await loadMyClaims();
      setClaimDialog(false);
      setNewClaim({
        employee_benefit_id: '',
        service_date: '',
        provider_name: '',
        description: '',
        amount_claimed: 0
      });
      toast.success('Claim submitted successfully!');
    } catch (error) {
      console.error('Claim submission error:', error);
      toast.error('Failed to submit claim - ensure database schema is applied');
    } finally {
      setIsLoading(false);
    }
  };

  // Early return with setup notice if tables don't exist yet
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Please log in</h3>
          <p className="text-gray-600">You need to be logged in to access benefits management.</p>
        </div>
      </div>
    );
  }

  const addDependent = () => {
    setDependents([...dependents, { name: '', relationship: '', dob: '' }]);
  };

  const updateDependent = (index: number, field: string, value: string) => {
    const updated = [...dependents];
    updated[index] = { ...updated[index], [field]: value };
    setDependents(updated);
  };

  const removeDependent = (index: number) => {
    setDependents(dependents.filter((_, i) => i !== index));
  };

  const getBenefitTypeIcon = (type: string) => {
    switch (type) {
      case 'health': return <Heart className="h-5 w-5 text-red-500" />;
      case 'dental': return <Shield className="h-5 w-5 text-blue-500" />;
      case 'vision': return <Eye className="h-5 w-5 text-green-500" />;
      case 'retirement': return <DollarSign className="h-5 w-5 text-yellow-500" />;
      case 'life_insurance': return <Shield className="h-5 w-5 text-purple-500" />;
      default: return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-orange-100 text-orange-800';
      case 'terminated': return 'bg-red-100 text-red-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'denied': return 'bg-red-100 text-red-800';
      case 'paid': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateMonthlyCost = () => {
    return myBenefits.reduce((total, benefit) => {
      return total + (benefit.employee_contribution || 0);
    }, 0);
  };

  const calculateAnnualSavings = () => {
    return myBenefits.reduce((total, benefit) => {
      return total + (benefit.employer_contribution || 0);
    }, 0) * 12;
  };

  return (
    <div className="space-y-6">
      {/* Database Setup Notice */}
      {availablePlans.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800">Database Setup Required</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Apply the <code>DATABASE_SCHEMA_UPDATES.sql</code> script to your Supabase database to enable Benefits Management.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Benefits Management</h2>
          <p className="text-gray-600">Manage your employee benefits and submit claims</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={claimDialog} onOpenChange={setClaimDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Submit Claim
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Submit New Claim</DialogTitle>
                <DialogDescription>
                  Submit a claim for your enrolled benefits
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="benefit">Benefit Plan</Label>
                  <Select value={newClaim.employee_benefit_id} onValueChange={(value) => setNewClaim({...newClaim, employee_benefit_id: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select benefit plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {myBenefits.filter(b => b.status === 'active').map((benefit) => (
                        <SelectItem key={benefit.id} value={benefit.id}>
                          {benefit.benefit_plans.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="service_date">Service Date</Label>
                  <Input
                    id="service_date"
                    type="date"
                    value={newClaim.service_date}
                    onChange={(e) => setNewClaim({...newClaim, service_date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="provider">Provider Name</Label>
                  <Input
                    id="provider"
                    value={newClaim.provider_name}
                    onChange={(e) => setNewClaim({...newClaim, provider_name: e.target.value})}
                    placeholder="Healthcare provider name"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newClaim.description}
                    onChange={(e) => setNewClaim({...newClaim, description: e.target.value})}
                    placeholder="Describe the service or treatment"
                  />
                </div>
                <div>
                  <Label htmlFor="amount">Claim Amount ($)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={newClaim.amount_claimed}
                    onChange={(e) => setNewClaim({...newClaim, amount_claimed: parseFloat(e.target.value) || 0})}
                    placeholder="0.00"
                  />
                </div>
                <Button 
                  onClick={handleClaimSubmission} 
                  disabled={isLoading || !newClaim.employee_benefit_id || !newClaim.amount_claimed}
                  className="w-full"
                >
                  Submit Claim
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Benefits Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myBenefits.filter(b => b.status === 'active').length}</div>
            <p className="text-xs text-gray-600 mt-1">Currently enrolled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">${calculateMonthlyCost()}</div>
            <p className="text-xs text-gray-600 mt-1">Your contribution</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Annual Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${calculateAnnualSavings()}</div>
            <p className="text-xs text-gray-600 mt-1">Company contribution</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {myClaims.filter(c => c.status === 'submitted' || c.status === 'under_review').length}
            </div>
            <p className="text-xs text-gray-600 mt-1">Awaiting processing</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="my-benefits" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="my-benefits">My Benefits</TabsTrigger>
          <TabsTrigger value="available">Available Plans</TabsTrigger>
          <TabsTrigger value="claims">Claims History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* My Benefits Tab */}
        <TabsContent value="my-benefits" className="space-y-4">
          {myBenefits.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myBenefits.map((benefit) => (
                <Card key={benefit.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getBenefitTypeIcon(benefit.benefit_plans.type)}
                        <div>
                          <CardTitle className="text-lg">{benefit.benefit_plans.name}</CardTitle>
                          <CardDescription>{benefit.benefit_plans.provider}</CardDescription>
                        </div>
                      </div>
                      <Badge className={getStatusColor(benefit.status)}>
                        {benefit.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Enrolled:</span>
                          <div className="font-medium">{new Date(benefit.enrollment_date).toLocaleDateString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Coverage:</span>
                          <div className="font-medium">${benefit.coverage_amount}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Your Cost:</span>
                          <div className="font-medium text-blue-600">${benefit.employee_contribution}/month</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Company Pays:</span>
                          <div className="font-medium text-green-600">${benefit.employer_contribution}/month</div>
                        </div>
                      </div>
                      
                      {benefit.dependents && Array.isArray(benefit.dependents) && benefit.dependents.length > 0 && (
                        <div>
                          <span className="text-gray-500 text-sm">Dependents:</span>
                          <div className="mt-1">
                            {benefit.dependents.map((dep: any, idx: number) => (
                              <div key={idx} className="text-sm bg-gray-50 rounded px-2 py-1 mb-1">
                                {dep.name} ({dep.relationship})
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Benefits Enrolled</h3>
                <p className="text-gray-600 mb-4">You haven't enrolled in any benefit plans yet.</p>
                <Button onClick={() => {}}>Browse Available Plans</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Available Plans Tab */}
        <TabsContent value="available" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availablePlans.map((plan) => (
              <Card key={plan.id} className="relative">
                {plan.is_mandatory && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-red-100 text-red-800">Mandatory</Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {getBenefitTypeIcon(plan.type)}
                    <div>
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <CardDescription>{plan.provider}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">{plan.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Your Cost:</span>
                        <div className="font-bold text-blue-600">${plan.cost_employee}/month</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Company Pays:</span>
                        <div className="font-bold text-green-600">${plan.cost_employer}/month</div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            className="w-full"
                            onClick={() => setSelectedPlan(plan)}
                            disabled={myBenefits.some(b => b.benefit_plan_id === plan.id && b.status === 'active')}
                          >
                            {myBenefits.some(b => b.benefit_plan_id === plan.id && b.status === 'active') 
                              ? 'Already Enrolled' 
                              : 'Enroll Now'
                            }
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Enroll in {selectedPlan?.name}</DialogTitle>
                            <DialogDescription>
                              Complete your enrollment for this benefit plan
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                              <h4 className="font-medium mb-2">Cost Breakdown</h4>
                              <div className="text-sm space-y-1">
                                <div className="flex justify-between">
                                  <span>Your monthly cost:</span>
                                  <span className="font-medium">${selectedPlan?.cost_employee}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Company contribution:</span>
                                  <span className="font-medium text-green-600">${selectedPlan?.cost_employer}</span>
                                </div>
                                <div className="border-t pt-1 flex justify-between">
                                  <span className="font-medium">Total coverage:</span>
                                  <span className="font-bold">${(selectedPlan?.cost_employee || 0) + (selectedPlan?.cost_employer || 0)}</span>
                                </div>
                              </div>
                            </div>

                            <div>
                              <Label>Add Dependents (Optional)</Label>
                              <div className="space-y-2 mt-2">
                                {dependents.map((dep, index) => (
                                  <div key={index} className="grid grid-cols-3 gap-2">
                                    <Input
                                      placeholder="Name"
                                      value={dep.name}
                                      onChange={(e) => updateDependent(index, 'name', e.target.value)}
                                    />
                                    <Select value={dep.relationship} onValueChange={(value) => updateDependent(index, 'relationship', value)}>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Relationship" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="spouse">Spouse</SelectItem>
                                        <SelectItem value="child">Child</SelectItem>
                                        <SelectItem value="parent">Parent</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => removeDependent(index)}
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                ))}
                                <Button variant="outline" size="sm" onClick={addDependent}>
                                  Add Dependent
                                </Button>
                              </div>
                            </div>

                            <Button 
                              onClick={() => selectedPlan && handleEnrollment(selectedPlan.id)} 
                              disabled={isLoading}
                              className="w-full"
                            >
                              Complete Enrollment
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Claims History Tab */}
        <TabsContent value="claims" className="space-y-4">
          {myClaims.length > 0 ? (
            <div className="space-y-4">
              {myClaims.map((claim) => (
                <Card key={claim.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">{claim.claim_number}</div>
                          <div className="text-sm text-gray-600">{claim.description}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Service Date: {new Date(claim.service_date).toLocaleDateString()} • 
                            Provider: {claim.provider_name}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(claim.status)}>
                          {claim.status.replace('_', ' ')}
                        </Badge>
                        <div className="mt-1">
                          <div className="text-lg font-bold">${claim.amount_claimed}</div>
                          {claim.amount_approved && (
                            <div className="text-sm text-green-600">
                              Approved: ${claim.amount_approved}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Claims Submitted</h3>
                <p className="text-gray-600 mb-4">You haven't submitted any benefit claims yet.</p>
                <Button onClick={() => setClaimDialog(true)}>Submit Your First Claim</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Benefits Utilization</CardTitle>
                <CardDescription>Your benefit usage over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Health Claims</span>
                    <span className="text-sm font-medium">
                      {myClaims.filter(c => c.status === 'paid').length} claims
                    </span>
                  </div>
                  <Progress value={75} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Claimed</span>
                    <span className="text-sm font-medium">
                      ${myClaims.reduce((sum, claim) => sum + claim.amount_claimed, 0)}
                    </span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Savings</CardTitle>
                <CardDescription>How much you're saving with benefits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      ${calculateAnnualSavings()}
                    </div>
                    <p className="text-sm text-gray-600">Annual company contribution</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold">${calculateMonthlyCost() * 12}</div>
                      <p className="text-xs text-gray-600">Your annual cost</p>
                    </div>
                    <div>
                      <div className="text-lg font-bold">
                        {myBenefits.filter(b => b.dependents && Array.isArray(b.dependents)).reduce((sum, b) => sum + b.dependents.length, 0)}
                      </div>
                      <p className="text-xs text-gray-600">Dependents covered</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BenefitsManagement; 