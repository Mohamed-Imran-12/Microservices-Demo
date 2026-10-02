import apiClient from './client';
import type { UserResponse, UserUpdateRequest } from '../types';

export const userApi = {
  // ADMIN only
  getUsers: () =>
    apiClient.get<UserResponse[]>('/user-service/users'),

  // ADMIN only
  getUser: (id: number) =>
    apiClient.get<UserResponse>(`/user-service/user/${id}`),

  // Authenticated: user can update own profile (backend verifies via X-User-Email from JWT)
  updateUser: (data: UserUpdateRequest) =>
    apiClient.put<UserResponse>('/user-service/user', data),

  // Authenticated: user can delete own account (backend verifies via X-User-Email from JWT)
  deleteUser: (id: number) =>
    apiClient.delete<string>(`/user-service/user/${id}`),
};
