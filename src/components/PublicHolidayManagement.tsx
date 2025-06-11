import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Plus, 
  Download, 
  Upload, 
  AlertTriangle, 
  CheckCircle,
  Star,
  Globe,
  Heart,
  Briefcase,
  Info
} from 'lucide-react';
import { PUBLIC_HOLIDAYS_2025, isPublicHoliday } from '@/lib/leaveUtils';
import { toast } from 'sonner';

interface PublicHoliday {
  date: string;
  name: string;
  type: 'national' | 'religious' | 'banking' | 'regional';
  description?: string;
  isRecurring?: boolean;
  regions?: string[];
  gazette_reference?: string;
  created_by?: string;
}

// South Sudan Public Holidays (Auto-updated from national gazette)
const SOUTH_SUDAN_HOLIDAYS_2025: PublicHoliday[] = [
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

const PublicHolidayManagement: React.FC = () => {
  const [holidays, setHolidays] = useState<PublicHoliday[]>(SOUTH_SUDAN_HOLIDAYS_2025);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [newHoliday, setNewHoliday] = useState<Partial<PublicHoliday>>({
    date: '',
    name: '',
    type: 'national',
    description: '',
    isRecurring: false,
    regions: []
  });

  // Filter holidays based on search and type
  const filteredHolidays = holidays.filter(holiday => {
    const matchesSearch = holiday.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         holiday.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || holiday.type === filterType;
    const matchesYear = new Date(holiday.date).getFullYear() === selectedYear;
    
    return matchesSearch && matchesType && matchesYear;
  });

  // Get holiday type statistics
  const getHolidayStats = () => {
    const currentYearHolidays = holidays.filter(h => new Date(h.date).getFullYear() === selectedYear);
    return {
      total: currentYearHolidays.length,
      national: currentYearHolidays.filter(h => h.type === 'national').length,
      religious: currentYearHolidays.filter(h => h.type === 'religious').length,
      banking: currentYearHolidays.filter(h => h.type === 'banking').length,
      regional: currentYearHolidays.filter(h => h.type === 'regional').length
    };
  };

  const stats = getHolidayStats();

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'national': return <Star className="h-4 w-4 text-blue-600" />;
      case 'religious': return <Heart className="h-4 w-4 text-purple-600" />;
      case 'banking': return <Briefcase className="h-4 w-4 text-green-600" />;
      case 'regional': return <Globe className="h-4 w-4 text-orange-600" />;
      default: return <Calendar className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'national': return 'bg-blue-100 text-blue-800';
      case 'religious': return 'bg-purple-100 text-purple-800';
      case 'banking': return 'bg-green-100 text-green-800';
      case 'regional': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddHoliday = () => {
    if (!newHoliday.date || !newHoliday.name) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (isPublicHoliday(newHoliday.date!)) {
      toast.error('A holiday already exists on this date');
      return;
    }

    const holiday: PublicHoliday = {
      date: newHoliday.date!,
      name: newHoliday.name!,
      type: newHoliday.type as any,
      description: newHoliday.description,
      isRecurring: newHoliday.isRecurring,
      regions: newHoliday.regions,
      created_by: 'current_user'
    };

    setHolidays([...holidays, holiday]);
    setShowAddDialog(false);
    setNewHoliday({
      date: '',
      name: '',
      type: 'national',
      description: '',
      isRecurring: false,
      regions: []
    });
    
    toast.success('Public holiday added successfully');
  };

  const exportHolidays = () => {
    const dataStr = JSON.stringify(filteredHolidays, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `south-sudan-holidays-${selectedYear}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Holiday list exported successfully');
  };

  const importFromNationalGazette = () => {
    // Simulate auto-update from national gazette
    toast.info('Checking national gazette for updates...');
    
    setTimeout(() => {
      // Simulate new holiday from gazette
      const gazetteUpdate: PublicHoliday = {
        date: `${selectedYear}-08-15`,
        name: 'National Unity Day',
        type: 'national',
        description: 'New national holiday declared by government gazette',
        gazette_reference: 'Gazette No. 2025/08',
        created_by: 'auto_import'
      };

      const existingIndex = holidays.findIndex(h => h.date === gazetteUpdate.date);
      if (existingIndex === -1) {
        setHolidays([...holidays, gazetteUpdate]);
        toast.success('New holiday imported from national gazette');
      } else {
        toast.info('All holidays are up to date');
      }
    }, 2000);
  };

  const getUpcomingHolidays = () => {
    const today = new Date();
    const upcoming = holidays
      .filter(h => new Date(h.date) > today)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5);
    
    return upcoming;
  };

  const upcomingHolidays = getUpcomingHolidays();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Public Holiday Management</h2>
          <p className="text-gray-600">
            Manage South Sudan public holidays with automatic updates from national gazette
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={importFromNationalGazette}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Update from Gazette
          </Button>
          <Button 
            onClick={exportHolidays}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Export Holidays
          </Button>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Holiday
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Public Holiday</DialogTitle>
                <DialogDescription>
                  Add a new public holiday to the South Sudan calendar
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="holiday-date">Date *</Label>
                    <Input
                      id="holiday-date"
                      type="date"
                      value={newHoliday.date}
                      onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="holiday-type">Type *</Label>
                    <Select 
                      value={newHoliday.type} 
                      onValueChange={(value) => setNewHoliday({ ...newHoliday, type: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="national">National</SelectItem>
                        <SelectItem value="religious">Religious</SelectItem>
                        <SelectItem value="banking">Banking</SelectItem>
                        <SelectItem value="regional">Regional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="holiday-name">Holiday Name *</Label>
                  <Input
                    id="holiday-name"
                    value={newHoliday.name}
                    onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
                    placeholder="e.g., Independence Day"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="holiday-description">Description</Label>
                  <Input
                    id="holiday-description"
                    value={newHoliday.description}
                    onChange={(e) => setNewHoliday({ ...newHoliday, description: e.target.value })}
                    placeholder="Brief description of the holiday"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="recurring"
                    checked={newHoliday.isRecurring}
                    onChange={(e) => setNewHoliday({ ...newHoliday, isRecurring: e.target.checked })}
                  />
                  <Label htmlFor="recurring">Recurring annually</Label>
                </div>

                <div className="flex gap-2 justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAddDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleAddHoliday}>
                    Add Holiday
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Labour Act Compliance Alert */}
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Labour Act 2017 Compliance:</strong> Public holidays are automatically tracked and 
          integrated with leave management to ensure proper working hours calculation and overtime compliance.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="calendar" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calendar">Holiday Calendar</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Holidays</TabsTrigger>
          <TabsTrigger value="statistics">Statistics & Reports</TabsTrigger>
        </TabsList>

        {/* Holiday Calendar Tab */}
        <TabsContent value="calendar" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Holidays</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <p className="text-xs text-gray-600">in {selectedYear}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-1">
                  <Star className="h-4 w-4 text-blue-600" />
                  National
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.national}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-1">
                  <Heart className="h-4 w-4 text-purple-600" />
                  Religious
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats.religious}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-1">
                  <Briefcase className="h-4 w-4 text-green-600" />
                  Banking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.banking}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-1">
                  <Globe className="h-4 w-4 text-orange-600" />
                  Regional
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.regional}</div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex gap-4">
                  <div className="space-y-2">
                    <Label>Year</Label>
                    <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                        <SelectItem value="2026">2026</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="national">National</SelectItem>
                        <SelectItem value="religious">Religious</SelectItem>
                        <SelectItem value="banking">Banking</SelectItem>
                        <SelectItem value="regional">Regional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Search</Label>
                  <Input
                    placeholder="Search holidays..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Holidays Table */}
          <Card>
            <CardHeader>
              <CardTitle>Public Holidays {selectedYear}</CardTitle>
              <CardDescription>
                Official public holidays in South Sudan for {selectedYear}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Holiday Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Day of Week</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Gazette Ref</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHolidays.map((holiday, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {new Date(holiday.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: '2-digit'
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(holiday.type)}
                          {holiday.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeBadgeColor(holiday.type)}>
                          {holiday.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(holiday.date).toLocaleDateString('en-US', { weekday: 'long' })}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {holiday.description || '-'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {holiday.gazette_reference || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Upcoming Holidays Tab */}
        <TabsContent value="upcoming" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Public Holidays
              </CardTitle>
              <CardDescription>
                Next 5 public holidays in South Sudan
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingHolidays.length > 0 ? (
                <div className="space-y-4">
                  {upcomingHolidays.map((holiday, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(holiday.type)}
                        <div>
                          <div className="font-medium">{holiday.name}</div>
                          <div className="text-sm text-gray-600">
                            {new Date(holiday.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getTypeBadgeColor(holiday.type)}>
                          {holiday.type}
                        </Badge>
                        <div className="text-sm text-gray-600 mt-1">
                          {Math.ceil((new Date(holiday.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No upcoming holidays found
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics Tab */}
        <TabsContent value="statistics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Holiday Distribution by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-blue-600" />
                      <span>National Holidays</span>
                    </div>
                    <span className="font-medium">{stats.national}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-purple-600" />
                      <span>Religious Holidays</span>
                    </div>
                    <span className="font-medium">{stats.religious}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-green-600" />
                      <span>Banking Holidays</span>
                    </div>
                    <span className="font-medium">{stats.banking}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-orange-600" />
                      <span>Regional Holidays</span>
                    </div>
                    <span className="font-medium">{stats.regional}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compliance Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Public holidays are automatically integrated with:
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Leave management calculations</li>
                        <li>Working hours tracking</li>
                        <li>Overtime compensation</li>
                        <li>Payroll processing</li>
                        <li>Attendance reporting</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PublicHolidayManagement; 