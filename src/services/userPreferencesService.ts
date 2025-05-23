import { supabase, getServerTimestamp } from '@/lib/supabase';
import { z } from 'zod';

// User preferences schema
export const preferencesSchema = z.object({
  user_id: z.string().uuid(),
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  notification_preferences: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(true),
    reminder: z.boolean().default(false)
  }).default({
    email: true,
    push: true,
    reminder: false
  })
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
        notification_preferences: validatedData.notification_preferences,
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
      // If no preferences found, create default preferences
      if (error.code === 'PGRST116') {
        const defaultPreferences = preferencesSchema.parse({
          user_id: userId,
          theme: 'system',
          notification_preferences: {
            email: true,
            push: true,
            reminder: false
          }
        });

        // Save default preferences
        const { data: savedData, error: saveError } = await supabase
          .from('user_preferences')
          .insert(defaultPreferences)
          .select()
          .single();

        if (saveError) {
          console.error('Error saving default preferences:', saveError);
          // Even if save fails, return default preferences
          return {
            success: true,
            data: defaultPreferences
          };
        }

        return {
          success: true,
          data: savedData
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