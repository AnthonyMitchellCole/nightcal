import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables, TablesUpdate } from '@/integrations/supabase/types';
import { validateFileUpload, sanitizeDisplayName, getSecureErrorMessage } from '@/lib/validation';

type Profile = Tables<'profiles'>;

// Query key factory for consistent cache management
const profileKeys = {
  all: ['profiles'] as const,
  byUser: (userId: string) => [...profileKeys.all, userId] as const,
};

// Profile fetching function
const fetchProfile = async (userId: string): Promise<Profile> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
};

export const useProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Query for profile data with caching
  const {
    data: profile,
    isLoading: loading,
    error: queryError
  } = useQuery({
    queryKey: profileKeys.byUser(user?.id || ''),
    queryFn: () => fetchProfile(user!.id),
    enabled: !!user,
    staleTime: 30 * 60 * 1000, // Profile data is cached for 30 minutes
    gcTime: 60 * 60 * 1000, // Keep in memory for 1 hour
  });

  const error = queryError ? getSecureErrorMessage(queryError) : null;

  // Mutation for updating profile with optimistic updates
  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<TablesUpdate<'profiles'>>) => {
      if (!user || !profile) throw new Error('No user or profile found');

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
      return data;
    },
    onMutate: async (updates) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: profileKeys.byUser(user!.id) });

      // Snapshot previous value
      const previousProfile = queryClient.getQueryData<Profile>(profileKeys.byUser(user!.id));

      // Optimistically update cache
      if (previousProfile) {
        queryClient.setQueryData<Profile>(profileKeys.byUser(user!.id), {
          ...previousProfile,
          ...updates,
        });
      }

      return { previousProfile };
    },
    onError: (err, updates, context) => {
      // Rollback optimistic update on error
      if (context?.previousProfile) {
        queryClient.setQueryData(profileKeys.byUser(user!.id), context.previousProfile);
      }
    },
    onSuccess: (data) => {
      // Update cache with server response
      queryClient.setQueryData(profileKeys.byUser(user!.id), data);
    },
  });

  // Avatar upload mutation
  const uploadAvatarMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!user) throw new Error('No user found');

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

      // Update profile with new avatar URL
      const result = await updateProfileMutation.mutateAsync({
        avatar_url: data.publicUrl
      });

      return data.publicUrl;
    },
  });

  // Wrapper functions that maintain the original API
  const updateProfile = async (updates: Partial<TablesUpdate<'profiles'>>) => {
    try {
      const data = await updateProfileMutation.mutateAsync(updates);
      return { data, error: null };
    } catch (err) {
      const errorMessage = getSecureErrorMessage(err);
      return { error: errorMessage };
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      const data = await uploadAvatarMutation.mutateAsync(file);
      return { data, error: null };
    } catch (err) {
      const errorMessage = getSecureErrorMessage(err);
      return { error: errorMessage };
    }
  };

  return { 
    profile, 
    loading: loading || updateProfileMutation.isPending || uploadAvatarMutation.isPending, 
    error, 
    updateProfile,
    uploadAvatar
  };
};