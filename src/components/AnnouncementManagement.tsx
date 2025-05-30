
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Bell, AlertTriangle, Calendar, Eye } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const AnnouncementManagement = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: announcements, isLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select(`
          *,
          author:profiles!author_id(first_name, last_name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const handleAddAnnouncement = async (formData: FormData) => {
    try {
      const announcementData = {
        title: formData.get('title') as string,
        content: formData.get('content') as string,
        is_urgent: formData.get('is_urgent') === 'on',
        expires_date: formData.get('expires_date') as string || null,
        author_id: 'current-user-id', // This would be the current user's ID
      };

      const { error } = await supabase
        .from('announcements')
        .insert([announcementData]);

      if (error) throw error;

      toast({
        title: "Announcement Created",
        description: "Your announcement has been published successfully.",
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create announcement. Please try again.",
        variant: "destructive",
      });
    }
  };

  const activeAnnouncements = announcements?.filter(a => a.is_active).length || 0;
  const urgentAnnouncements = announcements?.filter(a => a.is_urgent && a.is_active).length || 0;
  const expiringAnnouncements = announcements?.filter(a => {
    if (!a.expires_date) return false;
    const expireDate = new Date(a.expires_date);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return expireDate <= nextWeek && a.is_active;
  }).length || 0;

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading announcements...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Announcements</h2>
          <p className="text-gray-600">Manage company-wide announcements and communications</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Bell className="h-4 w-4 mr-2" />
              Create Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Announcement</DialogTitle>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              handleAddAnnouncement(formData);
            }} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required />
              </div>
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea id="content" name="content" rows={5} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expires_date">Expiry Date (Optional)</Label>
                  <Input id="expires_date" name="expires_date" type="date" />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="is_urgent" name="is_urgent" />
                  <Label htmlFor="is_urgent">Mark as Urgent</Label>
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Publish Announcement</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Announcements</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAnnouncements}</div>
            <p className="text-xs text-muted-foreground">Currently published</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgent Announcements</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{urgentAnnouncements}</div>
            <p className="text-xs text-muted-foreground">Requiring attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{expiringAnnouncements}</div>
            <p className="text-xs text-muted-foreground">Within 7 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {announcements?.map((announcement) => (
          <Card key={announcement.id} className={`${announcement.is_urgent ? 'border-red-200 bg-red-50' : ''}`}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-lg">{announcement.title}</CardTitle>
                    {announcement.is_urgent && (
                      <Badge className="bg-red-100 text-red-800">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Urgent
                      </Badge>
                    )}
                    {!announcement.is_active && (
                      <Badge variant="outline">Inactive</Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    By {announcement.author ? 
                      `${announcement.author.first_name} ${announcement.author.last_name}` : 
                      'Unknown Author'
                    } • {new Date(announcement.published_date || '').toLocaleDateString()}
                    {announcement.expires_date && (
                      <span> • Expires: {new Date(announcement.expires_date).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 whitespace-pre-wrap">{announcement.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementManagement;
