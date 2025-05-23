import { supabase } from '@/lib/supabase';

export const fetchCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('No authenticated user found');
    }

    // First ensure the user has a profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError && profileError.code === 'PGRST116') {
      // Create profile if it doesn't exist
      const { data: newProfile, error: createProfileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          full_name: user.email?.split('@')[0] || 'User',
          language_preference: 'en'
        })
        .select()
        .single();

      if (createProfileError) {
        throw new Error(`Error creating profile: ${createProfileError.message}`);
      }
    } else if (profileError) {
      throw new Error(`Error fetching profile: ${profileError.message}`);
    }

    // Get student profile data - handle case where it might not exist
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Don't throw error if student data doesn't exist
    if (studentError && studentError.code !== 'PGRST116') {
      console.error('Error fetching student data:', studentError);
    }

    return {
      id: user.id,
      displayName: studentData?.student_id || user.email?.split('@')[0] || 'User',
      email: user.email || '',
      photoURL: `https://i.pravatar.cc/150?u=${user.id}`,
      institution: {
        name: 'EduGenius University',
        domain: 'edugenius.edu',
      },
      createdAt: new Date(user.created_at),
      lastLogin: new Date(),
      // Include additional student data if it exists
      ...(studentData && {
        studentId: studentData.student_id,
        enrollmentStatus: studentData.enrollment_status,
        academicYear: studentData.academic_year
      })
    };
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};