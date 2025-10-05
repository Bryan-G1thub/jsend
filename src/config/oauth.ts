// OAuth Configuration for Inbox Placement Testing
// This file loads OAuth credentials from environment variables for security
// Environment variables are defined in .env.local (development) or hosting platform (production)

export const GOOGLE_OAUTH_CONFIG = {
  clientId: process.env.GOOGLE_OAUTH_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET!,
  redirectUri: process.env.GOOGLE_OAUTH_REDIRECT_URI || (process.env.NODE_ENV === 'production' 
    ? 'https://yourdomain.com/api/auth/callback'
    : 'http://localhost:3000/api/auth/callback'),
  scopes: [
    // Gmail scopes (existing)
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.modify',
    // Add user identity scopes so we can call oauth2.userinfo.get()
    'openid',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
  ]
};

// Gmail API endpoints for inbox placement testing
export const GMAIL_API_ENDPOINTS = {
  messages: 'https://gmail.googleapis.com/gmail/v1/users/me/messages',
  threads: 'https://gmail.googleapis.com/gmail/v1/users/me/threads',
  labels: 'https://gmail.googleapis.com/gmail/v1/users/me/labels'
};

// Inbox placement test configuration
export const INBOX_PLACEMENT_CONFIG = {
  testEmailSubject: 'Inbox Placement Test',
  testEmailFrom: 'test@yourdomain.com',
  searchQueries: [
    'in:inbox', // Primary inbox
    'in:promotions', // Promotions tab
    'in:social', // Social tab
    'in:updates', // Updates tab
    'in:spam' // Spam folder
  ]
};