# Inbox Placement Testing Setup

This document outlines how to set up OAuth credentials for inbox placement testing functionality.

## OAuth Credentials

Your Google OAuth credentials have been stored in `src/config/oauth.ts`:

- **Client ID**: `[STORED IN oauth.ts - DO NOT COMMIT]`
- **Client Secret**: `[STORED IN oauth.ts - DO NOT COMMIT]`

## Security Notes

⚠️ **IMPORTANT**: These credentials are currently stored in the codebase for development purposes. For production deployment:

1. Move credentials to environment variables
2. Never commit credentials to version control
3. Use a secure secret management system

## Environment Variables Setup

Create a `.env.local` file in the project root:

```bash
GOOGLE_OAUTH_CLIENT_ID=your_client_id_here
GOOGLE_OAUTH_CLIENT_SECRET=your_client_secret_here
GOOGLE_OAUTH_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
GMAIL_API_SCOPES=https://www.googleapis.com/auth/gmail.readonly,https://www.googleapis.com/auth/gmail.modify
```

## Google Console Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services > Credentials
3. Find your OAuth 2.0 Client ID
4. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback` (development)
   - `https://yourdomain.com/api/auth/google/callback` (production)

## Inbox Placement Testing Features

The stored configuration enables:

- **Gmail API Access**: Read and modify Gmail messages
- **Folder Detection**: Check where emails land (inbox, promotions, spam, etc.)
- **Email Analysis**: Track email deliverability across different folders
- **OAuth Flow**: Secure authentication with Google services

## Next Steps

1. Set up the OAuth flow in your application
2. Implement Gmail API integration
3. Create inbox placement test functionality
4. Move credentials to environment variables for production 
## Files Modified

- `src/config/oauth.ts` - OAuth configuration and credentials
- `.gitignore` - Added oauth.ts to prevent accidental commits
