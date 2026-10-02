import apiClient from './client';
import type { LoginRequest, LoginResponse, UserRequest, UserResponse } from '../types';

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<LoginResponse>('/user-service/login', data),

  register: (data: UserRequest) =>
    apiClient.post<UserResponse>('/user-service/register', data),
};
