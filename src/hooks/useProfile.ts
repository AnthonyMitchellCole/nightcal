import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables, TablesUpdate } from '@/integrations/supabase/types';
import { validateFileUpload, sanitizeDisplayName, getSecureErrorMessage } from '@/lib/validation';

type Profile = Tables<'profiles'>;

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(getSecureErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const updateProfile = async (updates: Partial<TablesUpdate<'profiles'>>) => {
    if (!user || !profile) return { error: 'No user or profile found' };

    setLoading(true);
    setError(null);

    try {
      // Sanitize display name if provided
      const sanitizedUpdates = { ...updates };
      if (sanitizedUpdates.display_name) {
        sanitizedUpdates.display_name = sanitizeDisplayName(sanitizedUpdates.display_name);
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(sanitizedUpdates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      
      setProfile(data);
      return { data, error: null };
    } catch (err) {
      const errorMessage = getSecureErrorMessage(err);
      setError(errorMessage);
      return { error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return { error: 'No user found' };

    try {
      // Validate file before upload
      validateFileUpload(file);

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      const { error: updateError } = await updateProfile({
        avatar_url: data.publicUrl
      });

      if (updateError) throw new Error(updateError);

      return { data: data.publicUrl, error: null };
    } catch (err) {
      const errorMessage = getSecureErrorMessage(err);
      return { error: errorMessage };
    }
  };

  return { 
    profile, 
    loading, 
    error, 
    updateProfile,
    uploadAvatar
  };
};