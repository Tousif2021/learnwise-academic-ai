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
 * Ensure user profile exists before saving preferences
 */
const ensureUserProfile = async (userId: string) => {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', userId)
    .single();

  if (profileError && profileError.code === 'PGRST116') {
    // Create profile if it doesn't exist
    const { error: createError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        language_preference: 'en'
      });

    if (createError) {
      throw new Error(`Error creating profile: ${createError.message}`);
    }
  } else if (profileError) {
    throw new Error(`Error checking profile: ${profileError.message}`);
  }
};

/**
 * Save user preferences to Supabase
 */
export const saveUserPreferences = async (preferences: UserPreferences) => {
  try {
    const validatedData = preferencesSchema.parse(preferences);

    // Ensure profile exists before saving preferences
    await ensureUserProfile(validatedData.user_id);

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
    // Ensure profile exists before getting preferences
    await ensureUserProfile(userId);

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