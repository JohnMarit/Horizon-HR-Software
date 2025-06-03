import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Mail, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CredentialsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  credentials: {
    email: string;
    password: string;
    employeeId: string;
    firstName: string;
    lastName: string;
  };
  onSendEmail: () => Promise<void>;
}

export const CredentialsDialog: React.FC<CredentialsDialogProps> = ({
  isOpen,
  onClose,
  credentials,
  onSendEmail
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleSendEmail = async () => {
    setIsSending(true);
    try {
      await onSendEmail();
      setEmailSent(true);
      toast.success('Welcome email sent successfully!');
    } catch (error) {
      toast.error('Failed to send welcome email');
    } finally {
      setIsSending(false);
    }
  };

  const copyAllCredentials = () => {
    const credentialsText = `
Employee Account Details - Horizon Bank HR System
================================================

Name: ${credentials.firstName} ${credentials.lastName}
Employee ID: ${credentials.employeeId}
Email: ${credentials.email}
Password: ${credentials.password}

Important: Please change your password after first login.
Portal: ${window.location.origin}
    `.trim();
    
    copyToClipboard(credentialsText, 'All credentials');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {emailSent ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                Account Created Successfully
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-blue-600" />
                Employee Account Created
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {emailSent ? (
              "The employee account has been created and welcome email sent successfully."
            ) : (
              "A new employee account has been created. Please review and send the login credentials."
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Employee Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Employee Information</CardTitle>
              <CardDescription>New employee account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Full Name:</span>
                <span className="font-semibold">{credentials.firstName} {credentials.lastName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Employee ID:</span>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-mono">
                    {credentials.employeeId}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(credentials.employeeId, 'Employee ID')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-600">Email:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{credentials.email}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(credentials.email, 'Email')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Login Credentials */}
          <Card className="border-2 border-dashed border-orange-200 bg-orange-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-orange-800">🔐 Login Credentials</CardTitle>
              <CardDescription className="text-orange-700">
                Temporary credentials that must be changed after first login
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                  <div>
                    <div className="font-medium text-gray-600 text-sm">Login Email</div>
                    <div className="font-mono text-sm">{credentials.email}</div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(credentials.email, 'Login email')}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>

                <div className="flex justify-between items-center p-3 bg-white rounded-lg border">
                  <div className="flex-1">
                    <div className="font-medium text-gray-600 text-sm">Temporary Password</div>
                    <div className="font-mono text-sm">
                      {showPassword ? credentials.password : '••••••••••••'}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(credentials.password, 'Password')}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  variant="outline" 
                  onClick={copyAllCredentials}
                  className="w-full"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy All Credentials
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Security Note:</strong> The employee must change their password immediately after their first login. 
              These credentials will be sent via email and should be treated as confidential.
            </AlertDescription>
          </Alert>

          {emailSent && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                <strong>Email Sent Successfully!</strong> The welcome email with login credentials has been sent to {credentials.email}.
                The employee can now log in and update their password.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="gap-2">
          {!emailSent ? (
            <>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button 
                onClick={handleSendEmail}
                disabled={isSending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSending ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    Send Welcome Email
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button onClick={onClose} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="h-4 w-4 mr-2" />
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}; 