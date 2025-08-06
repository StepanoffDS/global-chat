export const SECURITY_CONSTANTS = {
  // Password requirements
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 128,

  // Username requirements
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 20,
  USERNAME_PATTERN: /^[a-zA-Z0-9_-]+$/,

  // Email requirements
  EMAIL_MAX_LENGTH: 255,

  // Avatar URL requirements
  AVATAR_URL_MAX_LENGTH: 500,

  // Search limits
  SEARCH_QUERY_MIN_LENGTH: 2,
  SEARCH_QUERY_MAX_LENGTH: 50,
  SEARCH_MAX_LIMIT: 50,
  SEARCH_DEFAULT_LIMIT: 10,

  // Pagination limits
  PAGINATION_MAX_PAGE: 1000,
  PAGINATION_DEFAULT_PAGE: 1,

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100,

  // JWT settings
  JWT_EXPIRES_IN: '1h',
  JWT_REFRESH_EXPIRES_IN: '7d',

  // Session settings
  SESSION_MAX_AGE_MS: 7 * 24 * 60 * 60 * 1000, // 7 days

  // Online status
  ONLINE_TIMEOUT_MS: 5 * 60 * 1000, // 5 minutes
} as const;
