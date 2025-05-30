export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      announcements: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          expires_date: string | null
          id: string
          is_active: boolean | null
          is_urgent: boolean | null
          published_date: string | null
          target_departments: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          expires_date?: string | null
          id?: string
          is_active?: boolean | null
          is_urgent?: boolean | null
          published_date?: string | null
          target_departments?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          expires_date?: string | null
          id?: string
          is_active?: boolean | null
          is_urgent?: boolean | null
          published_date?: string | null
          target_departments?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "announcements_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          budget: number | null
          created_at: string | null
          description: string | null
          head_id: string | null
          id: string
          location: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          budget?: number | null
          created_at?: string | null
          description?: string | null
          head_id?: string | null
          id?: string
          location?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          budget?: number | null
          created_at?: string | null
          description?: string | null
          head_id?: string | null
          id?: string
          location?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "departments_head_id_fkey"
            columns: ["head_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_documents: {
        Row: {
          created_at: string | null
          document_name: string
          document_type: string
          employee_id: string | null
          expires_date: string | null
          file_url: string
          id: string
          updated_at: string | null
          upload_date: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          document_name: string
          document_type: string
          employee_id?: string | null
          expires_date?: string | null
          file_url: string
          id?: string
          updated_at?: string | null
          upload_date?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          document_name?: string
          document_type?: string
          employee_id?: string | null
          expires_date?: string | null
          file_url?: string
          id?: string
          updated_at?: string | null
          upload_date?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_documents_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          applicant_email: string
          applicant_name: string
          applicant_phone: string | null
          applied_date: string | null
          cover_letter: string | null
          created_at: string | null
          id: string
          job_posting_id: string | null
          resume_url: string | null
          review_notes: string | null
          reviewer_id: string | null
          status: Database["public"]["Enums"]["application_status"] | null
          updated_at: string | null
        }
        Insert: {
          applicant_email: string
          applicant_name: string
          applicant_phone?: string | null
          applied_date?: string | null
          cover_letter?: string | null
          created_at?: string | null
          id?: string
          job_posting_id?: string | null
          resume_url?: string | null
          review_notes?: string | null
          reviewer_id?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          updated_at?: string | null
        }
        Update: {
          applicant_email?: string
          applicant_name?: string
          applicant_phone?: string | null
          applied_date?: string | null
          cover_letter?: string | null
          created_at?: string | null
          id?: string
          job_posting_id?: string | null
          resume_url?: string | null
          review_notes?: string | null
          reviewer_id?: string | null
          status?: Database["public"]["Enums"]["application_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_posting_id_fkey"
            columns: ["job_posting_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_applications_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      job_postings: {
        Row: {
          closing_date: string | null
          created_at: string | null
          department_id: string | null
          description: string
          id: string
          is_active: boolean | null
          location: string | null
          posted_by: string | null
          posted_date: string | null
          requirements: string | null
          salary_range_max: number | null
          salary_range_min: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          closing_date?: string | null
          created_at?: string | null
          department_id?: string | null
          description: string
          id?: string
          is_active?: boolean | null
          location?: string | null
          posted_by?: string | null
          posted_date?: string | null
          requirements?: string | null
          salary_range_max?: number | null
          salary_range_min?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          closing_date?: string | null
          created_at?: string | null
          department_id?: string | null
          description?: string
          id?: string
          is_active?: boolean | null
          location?: string | null
          posted_by?: string | null
          posted_date?: string | null
          requirements?: string | null
          salary_range_max?: number | null
          salary_range_min?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_postings_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "job_postings_posted_by_fkey"
            columns: ["posted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_balances: {
        Row: {
          created_at: string | null
          employee_id: string | null
          id: string
          leave_type: Database["public"]["Enums"]["leave_type"]
          remaining_days: number | null
          total_days: number | null
          updated_at: string | null
          used_days: number | null
          year: number | null
        }
        Insert: {
          created_at?: string | null
          employee_id?: string | null
          id?: string
          leave_type: Database["public"]["Enums"]["leave_type"]
          remaining_days?: number | null
          total_days?: number | null
          updated_at?: string | null
          used_days?: number | null
          year?: number | null
        }
        Update: {
          created_at?: string | null
          employee_id?: string | null
          id?: string
          leave_type?: Database["public"]["Enums"]["leave_type"]
          remaining_days?: number | null
          total_days?: number | null
          updated_at?: string | null
          used_days?: number | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "leave_balances_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_requests: {
        Row: {
          approved_by: string | null
          approved_date: string | null
          comments: string | null
          created_at: string | null
          days_requested: number
          employee_id: string | null
          end_date: string
          id: string
          leave_type: Database["public"]["Enums"]["leave_type"]
          reason: string | null
          start_date: string
          status: Database["public"]["Enums"]["leave_status"] | null
          updated_at: string | null
        }
        Insert: {
          approved_by?: string | null
          approved_date?: string | null
          comments?: string | null
          created_at?: string | null
          days_requested: number
          employee_id?: string | null
          end_date: string
          id?: string
          leave_type: Database["public"]["Enums"]["leave_type"]
          reason?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["leave_status"] | null
          updated_at?: string | null
        }
        Update: {
          approved_by?: string | null
          approved_date?: string | null
          comments?: string | null
          created_at?: string | null
          days_requested?: number
          employee_id?: string | null
          end_date?: string
          id?: string
          leave_type?: Database["public"]["Enums"]["leave_type"]
          reason?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["leave_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_records: {
        Row: {
          allowances: number | null
          basic_salary: number
          created_at: string | null
          deductions: number | null
          employee_id: string | null
          id: string
          is_paid: boolean | null
          net_pay: number
          overtime: number | null
          pay_period_end: string
          pay_period_start: string
          payment_date: string | null
          tax_deduction: number | null
          updated_at: string | null
        }
        Insert: {
          allowances?: number | null
          basic_salary: number
          created_at?: string | null
          deductions?: number | null
          employee_id?: string | null
          id?: string
          is_paid?: boolean | null
          net_pay: number
          overtime?: number | null
          pay_period_end: string
          pay_period_start: string
          payment_date?: string | null
          tax_deduction?: number | null
          updated_at?: string | null
        }
        Update: {
          allowances?: number | null
          basic_salary?: number
          created_at?: string | null
          deductions?: number | null
          employee_id?: string | null
          id?: string
          is_paid?: boolean | null
          net_pay?: number
          overtime?: number | null
          pay_period_end?: string
          pay_period_start?: string
          payment_date?: string | null
          tax_deduction?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payroll_records_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_reviews: {
        Row: {
          achievements: string | null
          areas_improvement: string | null
          comments: string | null
          created_at: string | null
          employee_id: string | null
          goals_set: string | null
          id: string
          overall_rating: number | null
          promotion_ready: boolean | null
          review_period_end: string
          review_period_start: string
          reviewer_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          achievements?: string | null
          areas_improvement?: string | null
          comments?: string | null
          created_at?: string | null
          employee_id?: string | null
          goals_set?: string | null
          id?: string
          overall_rating?: number | null
          promotion_ready?: boolean | null
          review_period_end: string
          review_period_start: string
          reviewer_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          achievements?: string | null
          areas_improvement?: string | null
          comments?: string | null
          created_at?: string | null
          employee_id?: string | null
          goals_set?: string | null
          id?: string
          overall_rating?: number | null
          promotion_ready?: boolean | null
          review_period_end?: string
          review_period_start?: string
          reviewer_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "performance_reviews_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          contract_type: Database["public"]["Enums"]["contract_type"] | null
          created_at: string | null
          department_id: string | null
          email: string
          employee_id: string | null
          employment_status:
            | Database["public"]["Enums"]["employment_status"]
            | null
          first_name: string
          hire_date: string | null
          id: string
          last_name: string
          manager_id: string | null
          phone: string | null
          position: string | null
          role: Database["public"]["Enums"]["user_role"]
          salary: number | null
          updated_at: string | null
        }
        Insert: {
          contract_type?: Database["public"]["Enums"]["contract_type"] | null
          created_at?: string | null
          department_id?: string | null
          email: string
          employee_id?: string | null
          employment_status?:
            | Database["public"]["Enums"]["employment_status"]
            | null
          first_name: string
          hire_date?: string | null
          id: string
          last_name: string
          manager_id?: string | null
          phone?: string | null
          position?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          salary?: number | null
          updated_at?: string | null
        }
        Update: {
          contract_type?: Database["public"]["Enums"]["contract_type"] | null
          created_at?: string | null
          department_id?: string | null
          email?: string
          employee_id?: string | null
          employment_status?:
            | Database["public"]["Enums"]["employment_status"]
            | null
          first_name?: string
          hire_date?: string | null
          id?: string
          last_name?: string
          manager_id?: string | null
          phone?: string | null
          position?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          salary?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_profiles_department"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      training_courses: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          duration_hours: number | null
          id: string
          instructor: string | null
          is_mandatory: boolean | null
          materials_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_hours?: number | null
          id?: string
          instructor?: string | null
          is_mandatory?: boolean | null
          materials_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_hours?: number | null
          id?: string
          instructor?: string | null
          is_mandatory?: boolean | null
          materials_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_courses_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      training_enrollments: {
        Row: {
          certificate_url: string | null
          completion_date: string | null
          course_id: string | null
          created_at: string | null
          employee_id: string | null
          enrollment_date: string | null
          id: string
          score: number | null
          status: Database["public"]["Enums"]["training_status"] | null
          updated_at: string | null
        }
        Insert: {
          certificate_url?: string | null
          completion_date?: string | null
          course_id?: string | null
          created_at?: string | null
          employee_id?: string | null
          enrollment_date?: string | null
          id?: string
          score?: number | null
          status?: Database["public"]["Enums"]["training_status"] | null
          updated_at?: string | null
        }
        Update: {
          certificate_url?: string | null
          completion_date?: string | null
          course_id?: string | null
          created_at?: string | null
          employee_id?: string | null
          enrollment_date?: string | null
          id?: string
          score?: number | null
          status?: Database["public"]["Enums"]["training_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "training_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_enrollments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      application_status:
        | "submitted"
        | "screening"
        | "interview"
        | "offered"
        | "hired"
        | "rejected"
      contract_type: "permanent" | "temporary" | "contract" | "probation"
      employment_status: "active" | "inactive" | "terminated" | "suspended"
      leave_status: "pending" | "approved" | "rejected" | "cancelled"
      leave_type:
        | "annual"
        | "sick"
        | "maternity"
        | "paternity"
        | "emergency"
        | "unpaid"
      training_status: "enrolled" | "in_progress" | "completed" | "failed"
      user_role:
        | "hr_manager"
        | "recruiter"
        | "department_head"
        | "finance_officer"
        | "employee"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      application_status: [
        "submitted",
        "screening",
        "interview",
        "offered",
        "hired",
        "rejected",
      ],
      contract_type: ["permanent", "temporary", "contract", "probation"],
      employment_status: ["active", "inactive", "terminated", "suspended"],
      leave_status: ["pending", "approved", "rejected", "cancelled"],
      leave_type: [
        "annual",
        "sick",
        "maternity",
        "paternity",
        "emergency",
        "unpaid",
      ],
      training_status: ["enrolled", "in_progress", "completed", "failed"],
      user_role: [
        "hr_manager",
        "recruiter",
        "department_head",
        "finance_officer",
        "employee",
      ],
    },
  },
} as const
