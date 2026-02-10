export const API_BASE_URL = import.meta.env.VITE_API_URL || ''

export const API_ENDPOINTS = {
  VOLUNTEER_APPLICATION: `${API_BASE_URL}/applications/volunteer`,
  ADOPTION_APPLICATION: `${API_BASE_URL}/applications/adoption`,
  ADOPTED_PETS_COUNT: `${API_BASE_URL}/pets/adopted-count`,
  PET_SPOTLIGHT: `${API_BASE_URL}/pets/spotlight`,
  SURRENDER_APPLICATION: `${API_BASE_URL}/applications/surrender`,
  METRICS: `${API_BASE_URL}/metrics`,
  PETS: `${API_BASE_URL}/pets`,
  PET_PHOTOS: (id: string) => `${API_BASE_URL}/pets/${id}/photos`,
  MARKETING_CAMPAIGNS: `${API_BASE_URL}/v1/marketing/campaigns`, // Using v1
  APPLICATIONS: `${API_BASE_URL}/v1/applications`,
  VOLUNTEERS: `${API_BASE_URL}/v1/volunteers`,
  SHIFTS: `${API_BASE_URL}/v1/shifts`,
  SHIFTS_META_ROLES: `${API_BASE_URL}/v1/shifts/meta/roles`,

  // Auth & Users
  VALIDATE_INVITE: (token: string) => `${API_BASE_URL}/api/validate-invite/${token}`,
  REGISTER: `${API_BASE_URL}/api/register`,
  USERS_ME: `${API_BASE_URL}/api/users/me`,
  LOGIN: `${API_BASE_URL}/api/login`,
  LOGOUT: `${API_BASE_URL}/api/users/logout`,
  USERS: `${API_BASE_URL}/api/users`,

  // Notifications
  NOTIFICATIONS_PUBLIC_KEY: `${API_BASE_URL}/v1/notifications/public-key`,
  NOTIFICATIONS_SUBSCRIBE: `${API_BASE_URL}/v1/notifications/subscribe`,
  NOTIFICATIONS_TEST: `${API_BASE_URL}/v1/notifications/test`,
}
