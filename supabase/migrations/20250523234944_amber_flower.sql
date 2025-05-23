/*
  # Add students and user preferences tables

  1. New Tables
    - `students`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles.id)
      - `student_id` (text, unique)
      - `enrollment_status` (text)
      - `academic_year` (integer)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)
    
    - `user_preferences`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles.id)
      - `theme` (text)
      - `notification_preferences` (jsonb)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)

  2. Security
    - Enable RLS on both tables
    - Add policies for users to manage their own data
*/

-- Create students table
CREATE TABLE IF NOT EXISTS public.students (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.profiles(id),
    student_id text UNIQUE,
    enrollment_status text,
    academic_year integer,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS for students
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Create policy for students table
CREATE POLICY "Users can manage own student profile"
    ON public.students
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger for students
CREATE TRIGGER update_students_updated_at
    BEFORE UPDATE ON public.students
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.profiles(id),
    theme text DEFAULT 'system',
    notification_preferences jsonb DEFAULT '{"email": true, "push": true}'::jsonb,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS for user_preferences
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Create policy for user_preferences table
CREATE POLICY "Users can manage own preferences"
    ON public.user_preferences
    FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger for user_preferences
CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();