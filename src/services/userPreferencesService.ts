
import { supabase, getServerTimestamp } from '@/lib/supabase';
import { z } from 'zod';

// User preferences schema
export const preferencesSchema = z.object({
  user_id: z.string().uuid(),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(true),
    reminder: z.boolean().default(false)
  }).default({
    email: true,
    push: true,
    reminder: false
  }),
  language: z.enum(['english', 'spanish', 'french']).default('english')
});

export type UserPreferences = z.infer<typeof preferencesSchema>;

/**
 * Save user preferences to Supabase
 */
export const saveUserPreferences = async (preferences: UserPreferences) => {
  try {
    const validatedData = preferencesSchema.parse(preferences);

    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({
        user_id: validatedData.user_id,
        theme: validatedData.theme,
        notifications: validatedData.notifications,
        language: validatedData.language,
        updated_at: getServerTimestamp()
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Error saving preferences: ${error.message}`);
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Failed to save user preferences:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

/**
 * Get user preferences from Supabase
 */
export const getUserPreferences = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No preferences found, return defaults
        return {
          success: true,
          data: preferencesSchema.parse({ user_id: userId })
        };
      }
      throw new Error(`Error fetching preferences: ${error.message}`);
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Failed to fetch user preferences:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};
