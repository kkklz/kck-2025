export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      answer: {
        Row: {
          answer: string
          correct: boolean
          id: string
          questionId: string
        }
        Insert: {
          answer: string
          correct: boolean
          id?: string
          questionId: string
        }
        Update: {
          answer?: string
          correct?: boolean
          id?: string
          questionId?: string
        }
        Relationships: [
          {
            foreignKeyName: 'answer_questionId_fkey'
            columns: ['questionId']
            isOneToOne: false
            referencedRelation: 'question'
            referencedColumns: ['id']
          },
        ]
      }
      course: {
        Row: {
          description: string
          id: string
          name: string
          prizeId: string
        }
        Insert: {
          description: string
          id?: string
          name: string
          prizeId: string
        }
        Update: {
          description?: string
          id?: string
          name?: string
          prizeId?: string
        }
        Relationships: [
          {
            foreignKeyName: 'course_prizeId_fkey'
            columns: ['prizeId']
            isOneToOne: false
            referencedRelation: 'prize'
            referencedColumns: ['id']
          },
        ]
      }
      course_user: {
        Row: {
          courseId: string
          userId: string
        }
        Insert: {
          courseId: string
          userId: string
        }
        Update: {
          courseId?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: 'course_user_courseId_fkey'
            columns: ['courseId']
            isOneToOne: false
            referencedRelation: 'course'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'course_user_userId_fkey'
            columns: ['userId']
            isOneToOne: false
            referencedRelation: 'user'
            referencedColumns: ['id']
          },
        ]
      }
      prize: {
        Row: {
          id: string
          placeFrom: number
          placeTo: number
          reward: string
        }
        Insert: {
          id?: string
          placeFrom: number
          placeTo: number
          reward: string
        }
        Update: {
          id?: string
          placeFrom?: number
          placeTo?: number
          reward?: string
        }
        Relationships: []
      }
      question: {
        Row: {
          content: string
          id: string
          points: number
          quizId: string
        }
        Insert: {
          content: string
          id?: string
          points: number
          quizId: string
        }
        Update: {
          content?: string
          id?: string
          points?: number
          quizId?: string
        }
        Relationships: [
          {
            foreignKeyName: 'question_quizId_fkey'
            columns: ['quizId']
            isOneToOne: false
            referencedRelation: 'quiz'
            referencedColumns: ['id']
          },
        ]
      }
      quiz: {
        Row: {
          courseId: string
          description: string
          id: string
          maxAttempts: number
          timeLimit: number
        }
        Insert: {
          courseId: string
          description: string
          id?: string
          maxAttempts: number
          timeLimit: number
        }
        Update: {
          courseId?: string
          description?: string
          id?: string
          maxAttempts?: number
          timeLimit?: number
        }
        Relationships: [
          {
            foreignKeyName: 'quiz_courseId_fkey'
            columns: ['courseId']
            isOneToOne: false
            referencedRelation: 'course'
            referencedColumns: ['id']
          },
        ]
      }
      quiz_attempt: {
        Row: {
          attemptDate: string
          currentStreak: number
          finalScore: number
          id: string
          questionAnswered: number
          quizId: string
          status: Database['public']['Enums']['status']
          userId: string
        }
        Insert: {
          attemptDate: string
          currentStreak: number
          finalScore: number
          id?: string
          questionAnswered: number
          quizId: string
          status: Database['public']['Enums']['status']
          userId: string
        }
        Update: {
          attemptDate?: string
          currentStreak?: number
          finalScore?: number
          id?: string
          questionAnswered?: number
          quizId?: string
          status?: Database['public']['Enums']['status']
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: 'quiz_attempt_quizId_fkey'
            columns: ['quizId']
            isOneToOne: false
            referencedRelation: 'quiz'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'quiz_attempt_userId_fkey'
            columns: ['userId']
            isOneToOne: false
            referencedRelation: 'user'
            referencedColumns: ['id']
          },
        ]
      }
      user: {
        Row: {
          firstName: string
          id: string
          lastName: string
          photoUrl: string | null
          role: Database['public']['Enums']['role'] | null
          studentIndex: string | null
        }
        Insert: {
          firstName: string
          id: string
          lastName: string
          photoUrl?: string | null
          role?: Database['public']['Enums']['role'] | null
          studentIndex?: string | null
        }
        Update: {
          firstName?: string
          id?: string
          lastName?: string
          photoUrl?: string | null
          role?: Database['public']['Enums']['role'] | null
          studentIndex?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      role: 'admin' | 'student'
      status: 'started' | 'submitted'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
  | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
  | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
    Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
      ? R
      : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
    DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
      DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
        ? R
        : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema['Tables']
  | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
    Insert: infer I
  }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I
    }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
  | keyof DefaultSchema['Tables']
  | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
    Update: infer U
  }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U
    }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
  | keyof DefaultSchema['Enums']
  | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
  | keyof DefaultSchema['CompositeTypes']
  | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      role: ['admin', 'student'],
      status: ['started', 'submitted'],
    },
  },
} as const
