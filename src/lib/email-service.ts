interface EmailCredentials {
  email: string;
  password: string;
  employeeId: string;
  firstName: string;
  lastName: string;
}

interface EmailResult {
  success: boolean;
  error?: string;
}

/**
 * Sends welcome email with login credentials to a new employee
 */
export const sendWelcomeEmail = async (credentials: EmailCredentials): Promise<EmailResult> => {
  try {
    // In a real application, you would integrate with an email service
    // like SendGrid, Mailgun, or AWS SES. For now, we'll simulate the email
    // and show the credentials in a notification
    
    const emailTemplate = generateWelcomeEmailTemplate(credentials);
    
    // Simulate email sending
    console.log('📧 Welcome Email Content:');
    console.log(emailTemplate);
    
    // In production, you would actually send the email here:
    // await emailProvider.send({
    //   to: credentials.email,
    //   subject: 'Welcome to Horizon Bank HR System - Your Account Details',
    //   html: emailTemplate
    // });
    
    return { success: true };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    };
  }
};

/**
 * Generates a professional welcome email template
 */
export const generateWelcomeEmailTemplate = (credentials: EmailCredentials): string => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Horizon Bank</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; margin: -20px -20px 30px -20px; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 300; }
        .welcome-msg { background-color: #f8f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
        .credentials-box { background-color: #fff5f5; border: 2px dashed #e53e3e; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .credential-item { margin: 10px 0; padding: 10px; background-color: #f7fafc; border-radius: 4px; }
        .credential-label { font-weight: bold; color: #2d3748; display: inline-block; width: 120px; }
        .credential-value { font-family: 'Courier New', monospace; background-color: #edf2f7; padding: 4px 8px; border-radius: 4px; }
        .security-notice { background-color: #fef5e7; border: 1px solid #f6ad55; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .security-notice h3 { margin-top: 0; color: #c05621; }
        .next-steps { background-color: #f0fff4; border-left: 4px solid #38a169; padding: 20px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #718096; }
        .btn { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 15px 0; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🏦 Welcome to Horizon Bank</h1>
          <p>HR Management System</p>
        </div>
        
        <div class="welcome-msg">
          <h2>Welcome ${credentials.firstName} ${credentials.lastName}!</h2>
          <p>We're excited to have you join the Horizon Bank team. Your employee account has been created and you now have access to our HR Management System.</p>
        </div>
        
        <div class="credentials-box">
          <h3>🔐 Your Login Credentials</h3>
          <p><strong>Please save these credentials securely:</strong></p>
          
          <div class="credential-item">
            <span class="credential-label">Employee ID:</span>
            <span class="credential-value">${credentials.employeeId}</span>
          </div>
          
          <div class="credential-item">
            <span class="credential-label">Email:</span>
            <span class="credential-value">${credentials.email}</span>
          </div>
          
          <div class="credential-item">
            <span class="credential-label">Password:</span>
            <span class="credential-value">${credentials.password}</span>
          </div>
        </div>
        
        <div class="security-notice">
          <h3>🛡️ Important Security Information</h3>
          <ul>
            <li><strong>Change your password</strong> immediately after your first login</li>
            <li><strong>Never share</strong> your login credentials with anyone</li>
            <li><strong>Use strong passwords</strong> with a mix of letters, numbers, and symbols</li>
            <li><strong>Log out</strong> when you're finished using the system</li>
          </ul>
        </div>
        
        <div class="next-steps">
          <h3>📋 Next Steps</h3>
          <ol>
            <li>Visit the HR portal and log in with your credentials</li>
            <li>Update your password in the Profile section</li>
            <li>Complete your profile information</li>
            <li>Review company policies and procedures</li>
            <li>Check your training assignments</li>
          </ol>
        </div>
        
        <div style="text-align: center;">
          <a href="${window.location.origin}" class="btn">Access HR Portal</a>
        </div>
        
        <div class="footer">
          <p>If you have any questions or need assistance, please contact HR at <strong>hr@horizonbankss.com</strong></p>
          <p>© 2024 Horizon Bank South Sudan. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Sends password reset instructions to an employee
 */
export const sendPasswordResetEmail = async (email: string, resetToken: string): Promise<EmailResult> => {
  try {
    const resetTemplate = generatePasswordResetTemplate(email, resetToken);
    
    console.log('📧 Password Reset Email Content:');
    console.log(resetTemplate);
    
    return { success: true };
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    };
  }
};

/**
 * Generates password reset email template
 */
export const generatePasswordResetTemplate = (email: string, resetToken: string): string => {
  const resetUrl = `${window.location.origin}/reset-password?token=${resetToken}`;
  
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset - Horizon Bank</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; margin: -20px -20px 30px -20px; }
        .btn { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 15px 0; font-weight: bold; }
        .warning { background-color: #fef5e7; border: 1px solid #f6ad55; padding: 15px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔒 Password Reset Request</h1>
        </div>
        
        <p>A password reset was requested for your account (${email}).</p>
        
        <div style="text-align: center;">
          <a href="${resetUrl}" class="btn">Reset Your Password</a>
        </div>
        
        <div class="warning">
          <p><strong>Security Notice:</strong></p>
          <ul>
            <li>This link will expire in 1 hour</li>
            <li>If you didn't request this reset, please ignore this email</li>
            <li>Never share this link with anyone</li>
          </ul>
        </div>
        
        <p>If you're having trouble clicking the button, copy and paste this URL into your browser:</p>
        <p style="word-break: break-all; background-color: #f7fafc; padding: 10px; border-radius: 4px;">${resetUrl}</p>
      </div>
    </body>
    </html>
  `;
}; 