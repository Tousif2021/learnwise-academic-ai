/*
  # Fix profiles table RLS policies

  1. Changes
    - Drop existing RLS policies on profiles table
    - Add new comprehensive RLS policies for profiles table:
      - Enable users to create their own profile
      - Allow users to read their own profile
      - Allow users to update their own profile
  
  2. Security
    - Maintains RLS enabled on profiles table
    - Ensures users can only access their own profile data
    - Prevents unauthorized access to other users' profiles
*/

-- First, drop existing policies
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;

-- Create new policies
CREATE POLICY "Enable insert for authenticated users only"
ON profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable read access for users to own profile"
ON profiles FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "Enable update for users to own profile"
ON profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);