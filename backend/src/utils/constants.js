export const POST_STATUS = Object.freeze({
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived"
});

export const USER_ROLES = Object.freeze({
  ADMIN: "admin",
  AUTHOR: "author",
  USER: "user"
});

export const RATE_LIMIT = Object.freeze({
  WINDOW_MS: 15 * 60 * 1000,
  MAX_REQUESTS: 100
});

export const ALLOWED_IMAGE_MIME_TYPES = Object.freeze([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif"
]);

export const PAGINATION = Object.freeze({
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 50
});

export const ERROR_CODES = Object.freeze({
  VALIDATION_ERROR: "VALIDATION_ERROR",

  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",

  USER_NOT_FOUND: "USER_NOT_FOUND",
  USER_ALREADY_EXISTS: "USER_ALREADY_EXISTS",

  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",

  POST_NOT_FOUND: "POST_NOT_FOUND",
  POST_ALREADY_EXISTS: "POST_ALREADY_EXISTS",

  CATEGORY_NOT_FOUND: "CATEGORY_NOT_FOUND",

  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",

  RESOURCE_NOT_FOUND: "RESOURCE_NOT_FOUND"
});