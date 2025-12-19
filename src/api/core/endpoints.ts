/**
 * API Endpoints Configuration
 * 
 * Define all your API endpoints here as constants.
 * This provides a single source of truth for all API routes.
 */

export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },

  // User management endpoints
  USERS: {
    LIST: '/users',
    DETAIL: (id: number | string) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id: number | string) => `/users/${id}`,
    DELETE: (id: number | string) => `/users/${id}`,
    PROFILE: '/users/profile',
    AVATAR: (id: number | string) => `/users/${id}/avatar`,
  },

  // Example endpoints - Replace with your actual endpoints
  // POSTS: {
  //   LIST: '/posts',
  //   DETAIL: (id: number) => `/posts/${id}`,
  //   CREATE: '/posts',
  //   UPDATE: (id: number) => `/posts/${id}`,
  //   DELETE: (id: number) => `/posts/${id}`,
  // },

  // Add more endpoint groups as needed...
} as const;

