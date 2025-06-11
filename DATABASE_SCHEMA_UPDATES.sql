-- =====================================================
-- HORIZON BANK HR SYSTEM - DATABASE SCHEMA UPDATES
-- =====================================================

-- Time & Attendance Tables
-- =====================================================

-- Time entries for employee clock-in/out tracking
CREATE TABLE IF NOT EXISTS time_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    clock_in TIMESTAMP WITH TIME ZONE NOT NULL,
    clock_out TIMESTAMP WITH TIME ZONE,
    break_duration INTEGER DEFAULT 0, -- in minutes
    overtime_hours DECIMAL(4,2) DEFAULT 0,
    location_lat DECIMAL(10,8),
    location_lng DECIMAL(11,8),
    status VARCHAR(20) DEFAULT 'clocked_in' CHECK (status IN ('clocked_in', 'on_break', 'clocked_out')),
    notes TEXT,
    approved_by UUID REFERENCES profiles(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Work schedules and shift patterns
CREATE TABLE IF NOT EXISTS work_schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    schedule_name VARCHAR(100) NOT NULL,
    monday_start TIME,
    monday_end TIME,
    tuesday_start TIME,
    tuesday_end TIME,
    wednesday_start TIME,
    wednesday_end TIME,
    thursday_start TIME,
    thursday_end TIME,
    friday_start TIME,
    friday_end TIME,
    saturday_start TIME,
    saturday_end TIME,
    sunday_start TIME,
    sunday_end TIME,
    total_weekly_hours INTEGER DEFAULT 40,
    is_active BOOLEAN DEFAULT true,
    effective_from DATE NOT NULL,
    effective_to DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Attendance policies and rules
CREATE TABLE IF NOT EXISTS attendance_policies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    overtime_threshold INTEGER DEFAULT 480, -- in minutes (8 hours)
    break_duration_max INTEGER DEFAULT 60, -- in minutes
    late_threshold INTEGER DEFAULT 15, -- in minutes
    early_departure_threshold INTEGER DEFAULT 15, -- in minutes
    location_required BOOLEAN DEFAULT false,
    geofence_radius INTEGER DEFAULT 100, -- in meters
    auto_clock_out BOOLEAN DEFAULT false,
    auto_clock_out_time TIME DEFAULT '18:00:00',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Benefits Management Tables
-- =====================================================

-- Benefit plans (health, dental, retirement, etc.)
CREATE TABLE IF NOT EXISTS benefit_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('health', 'dental', 'vision', 'retirement', 'life_insurance', 'disability', 'other')),
    provider VARCHAR(100) NOT NULL,
    description TEXT,
    cost_employee DECIMAL(10,2) DEFAULT 0,
    cost_employer DECIMAL(10,2) DEFAULT 0,
    coverage_details JSONB,
    eligibility_criteria JSONB,
    enrollment_period_start DATE,
    enrollment_period_end DATE,
    is_active BOOLEAN DEFAULT true,
    is_mandatory BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employee benefit enrollments
CREATE TABLE IF NOT EXISTS employee_benefits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    benefit_plan_id UUID REFERENCES benefit_plans(id) ON DELETE CASCADE,
    enrollment_date DATE NOT NULL,
    effective_date DATE NOT NULL,
    termination_date DATE,
    dependents JSONB, -- Array of dependent information
    coverage_amount DECIMAL(10,2),
    employee_contribution DECIMAL(10,2),
    employer_contribution DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('pending', 'active', 'suspended', 'terminated')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Benefit claims tracking
CREATE TABLE IF NOT EXISTS benefit_claims (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_benefit_id UUID REFERENCES employee_benefits(id) ON DELETE CASCADE,
    claim_number VARCHAR(50) UNIQUE NOT NULL,
    claim_date DATE NOT NULL,
    service_date DATE,
    provider_name VARCHAR(100),
    description TEXT,
    amount_claimed DECIMAL(10,2) NOT NULL,
    amount_approved DECIMAL(10,2),
    amount_paid DECIMAL(10,2),
    status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'approved', 'denied', 'paid')),
    reviewed_by UUID REFERENCES profiles(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    documents JSONB, -- Array of document URLs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workplace Management Tables
-- =====================================================

-- Office locations and buildings
CREATE TABLE IF NOT EXISTS office_locations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(50),
    country VARCHAR(50),
    postal_code VARCHAR(20),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    capacity INTEGER DEFAULT 0,
    facilities JSONB, -- Array of facility types
    contact_person VARCHAR(100),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Desk and workspace assignments
CREATE TABLE IF NOT EXISTS desk_assignments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    location_id UUID REFERENCES office_locations(id) ON DELETE CASCADE,
    desk_number VARCHAR(20) NOT NULL,
    floor VARCHAR(10),
    section VARCHAR(50),
    assignment_type VARCHAR(20) DEFAULT 'permanent' CHECK (assignment_type IN ('permanent', 'temporary', 'hot_desk', 'shared')),
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meeting room management
CREATE TABLE IF NOT EXISTS meeting_rooms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    location_id UUID REFERENCES office_locations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    capacity INTEGER NOT NULL,
    equipment JSONB, -- Array of equipment available
    hourly_rate DECIMAL(8,2) DEFAULT 0,
    is_bookable BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meeting room bookings
CREATE TABLE IF NOT EXISTS room_bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    room_id UUID REFERENCES meeting_rooms(id) ON DELETE CASCADE,
    booked_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    attendee_count INTEGER DEFAULT 1,
    attendees JSONB, -- Array of attendee IDs
    status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    cost DECIMAL(8,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Remote work tracking
CREATE TABLE IF NOT EXISTS remote_work_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    request_date DATE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    work_location TEXT,
    reason TEXT,
    equipment_needed JSONB,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied', 'cancelled')),
    approved_by UUID REFERENCES profiles(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Integration Framework Tables
-- =====================================================

-- Third-party system integrations
CREATE TABLE IF NOT EXISTS api_integrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('accounting', 'email', 'communication', 'banking', 'bi', 'crm', 'other')),
    provider VARCHAR(100) NOT NULL,
    endpoint_url TEXT,
    api_key_encrypted TEXT,
    config JSONB, -- Configuration parameters
    is_active BOOLEAN DEFAULT true,
    last_sync TIMESTAMP WITH TIME ZONE,
    sync_frequency VARCHAR(20) DEFAULT 'daily' CHECK (sync_frequency IN ('real_time', 'hourly', 'daily', 'weekly', 'manual')),
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Data synchronization logs
CREATE TABLE IF NOT EXISTS sync_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    integration_id UUID REFERENCES api_integrations(id) ON DELETE CASCADE,
    sync_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('success', 'failed', 'partial')),
    records_processed INTEGER DEFAULT 0,
    records_successful INTEGER DEFAULT 0,
    records_failed INTEGER DEFAULT 0,
    error_message TEXT,
    sync_duration INTEGER, -- in seconds
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employee Self-Service Tables
-- =====================================================

-- Employee requests (general purpose)
CREATE TABLE IF NOT EXISTS employee_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    request_type VARCHAR(50) NOT NULL CHECK (request_type IN ('personal_info_change', 'document_request', 'equipment_request', 'policy_clarification', 'other')),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('submitted', 'in_progress', 'completed', 'rejected', 'cancelled')),
    assigned_to UUID REFERENCES profiles(id),
    due_date DATE,
    resolution TEXT,
    attachments JSONB, -- Array of file URLs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employee goals and objectives
CREATE TABLE IF NOT EXISTS employee_goals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employee_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    goal_title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50) CHECK (category IN ('performance', 'learning', 'career', 'project', 'other')),
    target_date DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused', 'cancelled')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    measurement_criteria TEXT,
    created_by UUID REFERENCES profiles(id),
    reviewed_by UUID REFERENCES profiles(id),
    last_review_date DATE,
    next_review_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Performance
-- =====================================================

-- Time entries indexes
CREATE INDEX IF NOT EXISTS idx_time_entries_employee_date ON time_entries(employee_id, DATE(clock_in));
CREATE INDEX IF NOT EXISTS idx_time_entries_status ON time_entries(status);
CREATE INDEX IF NOT EXISTS idx_time_entries_clock_in ON time_entries(clock_in);

-- Benefits indexes
CREATE INDEX IF NOT EXISTS idx_employee_benefits_employee_id ON employee_benefits(employee_id);
CREATE INDEX IF NOT EXISTS idx_employee_benefits_plan_id ON employee_benefits(benefit_plan_id);
CREATE INDEX IF NOT EXISTS idx_benefit_claims_employee_benefit ON benefit_claims(employee_benefit_id);

-- Workplace indexes
CREATE INDEX IF NOT EXISTS idx_desk_assignments_employee ON desk_assignments(employee_id);
CREATE INDEX IF NOT EXISTS idx_room_bookings_room_time ON room_bookings(room_id, start_time);
CREATE INDEX IF NOT EXISTS idx_remote_work_employee_date ON remote_work_requests(employee_id, start_date);

-- Row Level Security (RLS) Policies
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE benefit_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE desk_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE room_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE remote_work_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE employee_goals ENABLE ROW LEVEL SECURITY;

-- Time entries policies
CREATE POLICY "Users can view their own time entries" ON time_entries
    FOR SELECT USING (auth.uid()::text = employee_id::text);

CREATE POLICY "Users can insert their own time entries" ON time_entries
    FOR INSERT WITH CHECK (auth.uid()::text = employee_id::text);

CREATE POLICY "Users can update their own time entries" ON time_entries
    FOR UPDATE USING (auth.uid()::text = employee_id::text);

CREATE POLICY "HR managers can view all time entries" ON time_entries
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id::text = auth.uid()::text 
            AND role IN ('hr_manager', 'department_head')
        )
    );

-- Employee benefits policies
CREATE POLICY "Users can view their own benefits" ON employee_benefits
    FOR SELECT USING (auth.uid()::text = employee_id::text);

CREATE POLICY "HR managers can manage all benefits" ON employee_benefits
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id::text = auth.uid()::text 
            AND role IN ('hr_manager', 'finance_officer')
        )
    );

-- Room bookings policies
CREATE POLICY "Users can view all room bookings" ON room_bookings
    FOR SELECT USING (true);

CREATE POLICY "Users can create room bookings" ON room_bookings
    FOR INSERT WITH CHECK (auth.uid()::text = booked_by::text);

CREATE POLICY "Users can update their own bookings" ON room_bookings
    FOR UPDATE USING (auth.uid()::text = booked_by::text);

-- Employee requests policies
CREATE POLICY "Users can manage their own requests" ON employee_requests
    FOR ALL USING (auth.uid()::text = employee_id::text);

CREATE POLICY "HR managers can view all requests" ON employee_requests
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id::text = auth.uid()::text 
            AND role IN ('hr_manager', 'department_head')
        )
    );

-- Employee goals policies
CREATE POLICY "Users can view their own goals" ON employee_goals
    FOR SELECT USING (auth.uid()::text = employee_id::text);

CREATE POLICY "Users can update their own goals" ON employee_goals
    FOR UPDATE USING (auth.uid()::text = employee_id::text);

CREATE POLICY "Managers can view team goals" ON employee_goals
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id::text = auth.uid()::text 
            AND (role IN ('hr_manager', 'department_head') OR id = created_by)
        )
    );

-- Triggers for Updated_at Timestamps
-- =====================================================

-- Function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at columns
CREATE TRIGGER update_time_entries_updated_at BEFORE UPDATE ON time_entries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_work_schedules_updated_at BEFORE UPDATE ON work_schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_benefit_plans_updated_at BEFORE UPDATE ON benefit_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employee_benefits_updated_at BEFORE UPDATE ON employee_benefits FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_benefit_claims_updated_at BEFORE UPDATE ON benefit_claims FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_office_locations_updated_at BEFORE UPDATE ON office_locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_desk_assignments_updated_at BEFORE UPDATE ON desk_assignments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meeting_rooms_updated_at BEFORE UPDATE ON meeting_rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_room_bookings_updated_at BEFORE UPDATE ON room_bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_remote_work_requests_updated_at BEFORE UPDATE ON remote_work_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_api_integrations_updated_at BEFORE UPDATE ON api_integrations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employee_requests_updated_at BEFORE UPDATE ON employee_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_employee_goals_updated_at BEFORE UPDATE ON employee_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample Data for Testing
-- =====================================================

-- Insert sample benefit plans
INSERT INTO benefit_plans (name, type, provider, description, cost_employee, cost_employer) VALUES
('Basic Health Insurance', 'health', 'MedInsure Corp', 'Basic health coverage with preventive care', 150.00, 400.00),
('Premium Health Insurance', 'health', 'MedInsure Corp', 'Comprehensive health coverage with dental', 250.00, 600.00),
('Dental Plan', 'dental', 'DentalCare Plus', 'Full dental coverage including orthodontics', 50.00, 80.00),
('Vision Plan', 'vision', 'VisionFirst', 'Eye care and glasses coverage', 25.00, 40.00),
('401k Retirement Plan', 'retirement', 'RetireSafe', 'Company matching retirement plan', 0.00, 0.00),
('Life Insurance', 'life_insurance', 'LifeGuard Insurance', '2x annual salary life insurance', 0.00, 150.00);

-- Insert sample office locations
INSERT INTO office_locations (name, address, city, country, capacity, facilities) VALUES
('Horizon Bank Headquarters', '123 Banking Street', 'Juba', 'South Sudan', 200, '["parking", "cafeteria", "gym", "meeting_rooms"]'),
('Horizon Bank - Wau Branch', '456 Commerce Avenue', 'Wau', 'South Sudan', 50, '["parking", "meeting_rooms"]'),
('Horizon Bank - Malakal Branch', '789 Finance Road', 'Malakal', 'South Sudan', 30, '["parking", "customer_service"]');

-- Insert sample meeting rooms
INSERT INTO meeting_rooms (location_id, name, capacity, equipment) VALUES
((SELECT id FROM office_locations WHERE name = 'Horizon Bank Headquarters'), 'Executive Boardroom', 12, '["projector", "whiteboard", "video_conference", "phone"]'),
((SELECT id FROM office_locations WHERE name = 'Horizon Bank Headquarters'), 'Conference Room A', 8, '["projector", "whiteboard", "phone"]'),
((SELECT id FROM office_locations WHERE name = 'Horizon Bank Headquarters'), 'Training Room', 20, '["projector", "whiteboard", "computers", "audio_system"]'),
((SELECT id FROM office_locations WHERE name = 'Horizon Bank - Wau Branch'), 'Meeting Room 1', 6, '["whiteboard", "phone"]');

-- Insert sample attendance policy
INSERT INTO attendance_policies (name, description, overtime_threshold, break_duration_max, late_threshold) VALUES
('Standard Banking Hours Policy', 'Standard 8-hour workday with flexible break times', 480, 60, 15);

-- Comments and Documentation
-- =====================================================

COMMENT ON TABLE time_entries IS 'Employee time tracking with clock-in/out functionality';
COMMENT ON TABLE work_schedules IS 'Employee work schedules and shift patterns';
COMMENT ON TABLE benefit_plans IS 'Available employee benefit plans';
COMMENT ON TABLE employee_benefits IS 'Employee benefit enrollments and coverage';
COMMENT ON TABLE benefit_claims IS 'Benefit claims tracking and processing';
COMMENT ON TABLE office_locations IS 'Physical office locations and facilities';
COMMENT ON TABLE desk_assignments IS 'Employee desk and workspace assignments';
COMMENT ON TABLE meeting_rooms IS 'Meeting room inventory and specifications';
COMMENT ON TABLE room_bookings IS 'Meeting room booking and scheduling';
COMMENT ON TABLE remote_work_requests IS 'Remote work requests and approvals';
COMMENT ON TABLE api_integrations IS 'Third-party system integration configurations';
COMMENT ON TABLE employee_requests IS 'General employee service requests';
COMMENT ON TABLE employee_goals IS 'Employee performance goals and objectives';

-- =====================================================
-- END OF SCHEMA UPDATES
-- ===================================================== 