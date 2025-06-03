import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];

export interface NewEmployeeAccount {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  employeeId: string;
  position: string;
  department: string;
  phone?: string;
  salary?: number;
}

export interface AccountCreationResult {
  success: boolean;
  employee?: any;
  credentials?: {
    email: string;
    password: string;
    employeeId: string;
  };
  error?: string;
}

/**
 * Generates a secure temporary password for new employees
 */
export const generateSecurePassword = (): string => {
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  
  const allChars = uppercase + lowercase + numbers + symbols;
  
  let password = '';
  
  // Ensure at least one character from each category
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += symbols[Math.floor(Math.random() * symbols.length)];
  
  // Fill the rest with random characters
  for (let i = 4; i < 12; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

/**
 * Generates a unique employee ID
 */
export const generateEmployeeId = async (): Promise<string> => {
  const prefix = 'HB'; // Horizon Bank
  const randomNum = Math.floor(Math.random() * 9000) + 1000; // 4-digit number
  const employeeId = `${prefix}${randomNum}`;
  
  // Check if this ID already exists
  const { data } = await supabase
    .from('profiles')
    .select('employee_id')
    .eq('employee_id', employeeId)
    .single();
  
  // If exists, generate a new one recursively
  if (data) {
    return generateEmployeeId();
  }
  
  return employeeId;
};

/**
 * Creates a new employee account with login credentials
 */
export const createEmployeeAccount = async (employeeData: NewEmployeeAccount): Promise<AccountCreationResult> => {
  try {
    // Generate employee ID if not provided
    const employeeId = employeeData.employeeId || await generateEmployeeId();
    
    // Generate a UUID for the profile ID (will be used for auth.users.id as well)
    const profileId = crypto.randomUUID();
    
    // Create the profile record in Supabase
    const profileInsert: ProfileInsert = {
      id: profileId,
      first_name: employeeData.firstName,
      last_name: employeeData.lastName,
      email: employeeData.email,
      employee_id: employeeId,
      position: employeeData.position,
      department_id: employeeData.department,
      phone: employeeData.phone,
      salary: employeeData.salary,
      role: 'employee',
      employment_status: 'active',
      hire_date: new Date().toISOString(),
    };

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert(profileInsert)
      .select()
      .single();

    if (profileError) {
      throw new Error(`Failed to create employee profile: ${profileError.message}`);
    }

    // Prepare credentials for email
    const credentials = {
      email: employeeData.email,
      password: employeeData.password,
      employeeId: employeeId
    };

    return {
      success: true,
      employee: profile,
      credentials
    };

  } catch (error) {
    console.error('Error creating employee account:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create employee account'
    };
  }
};

/**
 * Validates email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Checks if email already exists in the system
 */
export const checkEmailExists = async (email: string): Promise<boolean> => {
  const { data } = await supabase
    .from('profiles')
    .select('email')
    .eq('email', email.toLowerCase())
    .single();
  
  return !!data;
}; 