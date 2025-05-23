
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export const fetchCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('No authenticated user found');
    }

    // Get student profile data
    const { data: studentData, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (studentError && studentError.code !== 'PGRST116') {
      throw new Error(studentError.message);
    }

    return {
      id: user.id,
      displayName: studentData ? `${studentData.first_name} ${studentData.last_name}` : user.email?.split('@')[0] || 'User',
      email: user.email || '',
      photoURL: studentData?.profile_image_url || `https://i.pravatar.cc/150?u=${user.id}`,
      institution: {
        name: studentData?.institution || 'EduGenius University',
        domain: studentData?.institution ? `${studentData.institution.toLowerCase().replace(/\s+/g, '')}.edu` : 'edugenius.edu',
      },
      createdAt: new Date(user.created_at),
      lastLogin: new Date()
    };
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};
