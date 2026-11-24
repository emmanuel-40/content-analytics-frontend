import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiClient, apiUrl } from '@/lib/api'
import { queryKeys } from '@/lib/queryClient'
import type {
  ChangePasswordRequest,
  UpdateProfileRequest,
  UserProfile,
} from '@/types/api'

export function useProfile(enabled = true) {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: () => apiClient.get<UserProfile>('/api/profile'),
    enabled,
  })
}

/** Presigned S3 URLs are absolute; local API URLs are relative. */
export function resolveAvatarUrl(url: string | undefined): string | undefined {
  if (!url) return undefined
  return url.startsWith('http') ? url : apiUrl(url)
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UpdateProfileRequest) =>
      apiClient.put<UserProfile>('/api/profile', input),
    onSuccess: (profile) => {
      queryClient.setQueryData(queryKeys.profile, profile)
      void queryClient.invalidateQueries({ queryKey: queryKeys.session })
    },
  })
}

export function useUploadAvatar() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (file: File) => {
      const form = new FormData()
      form.append('file', file)
      return apiClient.upload<UserProfile>('/api/profile/picture', form)
    },
    onSuccess: (profile) => {
      queryClient.setQueryData(queryKeys.profile, profile)
    },
  })
}

export function useDeleteAvatar() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => apiClient.delete<{ status: string; message: string; avatarUrl?: string }>(
      '/api/profile/picture',
    ),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.profile })
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (input: ChangePasswordRequest) =>
      apiClient.post<{
        status: string
        message: string
        changedAt?: string
        allSessionsLoggedOut?: boolean
      }>('/api/profile/change-password', input),
  })
}
