export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      configs: {
        Row: {
          created_at: string | null
          environment: string | null
          id: string
          is_secret: boolean | null
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          environment?: string | null
          id?: string
          is_secret?: boolean | null
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          environment?: string | null
          id?: string
          is_secret?: boolean | null
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      deployments: {
        Row: {
          created_at: string | null
          environment: Database["public"]["Enums"]["deployment_env"]
          id: string
          notes: string | null
          repository_id: string | null
          status: Database["public"]["Enums"]["deployment_status"] | null
          version: string
        }
        Insert: {
          created_at?: string | null
          environment: Database["public"]["Enums"]["deployment_env"]
          id?: string
          notes?: string | null
          repository_id?: string | null
          status?: Database["public"]["Enums"]["deployment_status"] | null
          version: string
        }
        Update: {
          created_at?: string | null
          environment?: Database["public"]["Enums"]["deployment_env"]
          id?: string
          notes?: string | null
          repository_id?: string | null
          status?: Database["public"]["Enums"]["deployment_status"] | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "deployments_repository_id_fkey"
            columns: ["repository_id"]
            isOneToOne: false
            referencedRelation: "repositories"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          layer: Database["public"]["Enums"]["layer_type"]
          name: string
          progress: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          layer: Database["public"]["Enums"]["layer_type"]
          name: string
          progress?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          layer?: Database["public"]["Enums"]["layer_type"]
          name?: string
          progress?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      progress_history: {
        Row: {
          id: string
          layer: Database["public"]["Enums"]["layer_type"]
          progress: number
          recorded_at: string | null
        }
        Insert: {
          id?: string
          layer: Database["public"]["Enums"]["layer_type"]
          progress: number
          recorded_at?: string | null
        }
        Update: {
          id?: string
          layer?: Database["public"]["Enums"]["layer_type"]
          progress?: number
          recorded_at?: string | null
        }
        Relationships: []
      }
      repositories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          layer: Database["public"]["Enums"]["layer_type"]
          name: string
          stack: string[] | null
          status: Database["public"]["Enums"]["repo_status"] | null
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          layer: Database["public"]["Enums"]["layer_type"]
          name: string
          stack?: string[] | null
          status?: Database["public"]["Enums"]["repo_status"] | null
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          layer?: Database["public"]["Enums"]["layer_type"]
          name?: string
          stack?: string[] | null
          status?: Database["public"]["Enums"]["repo_status"] | null
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assignee: string | null
          created_at: string | null
          id: string
          module_id: string | null
          priority: Database["public"]["Enums"]["task_priority"] | null
          status: Database["public"]["Enums"]["task_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assignee?: string | null
          created_at?: string | null
          id?: string
          module_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          status?: Database["public"]["Enums"]["task_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assignee?: string | null
          created_at?: string | null
          id?: string
          module_id?: string | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          status?: Database["public"]["Enums"]["task_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      deployment_env: "staging" | "production"
      deployment_status: "success" | "pending" | "failed"
      layer_type:
        | "identity"
        | "communication"
        | "information"
        | "intelligence"
        | "economy"
        | "governance"
        | "documentation"
      repo_status: "active" | "development" | "planning" | "paused"
      task_priority: "critical" | "high" | "medium" | "low"
      task_status: "todo" | "in_progress" | "review" | "done"
      user_role: "admin" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      deployment_env: ["staging", "production"],
      deployment_status: ["success", "pending", "failed"],
      layer_type: [
        "identity",
        "communication",
        "information",
        "intelligence",
        "economy",
        "governance",
        "documentation",
      ],
      repo_status: ["active", "development", "planning", "paused"],
      task_priority: ["critical", "high", "medium", "low"],
      task_status: ["todo", "in_progress", "review", "done"],
      user_role: ["admin", "viewer"],
    },
  },
} as const
