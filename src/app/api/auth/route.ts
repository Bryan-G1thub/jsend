import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { GOOGLE_OAUTH_CONFIG } from "@/config/oauth";
import { randomBytes } from "crypto";

export async function GET(req: NextRequest) {
  try {
    const oauth2Client = new google.auth.OAuth2(
      GOOGLE_OAUTH_CONFIG.clientId,
      GOOGLE_OAUTH_CONFIG.clientSecret,
      GOOGLE_OAUTH_CONFIG.redirectUri
    );

    // Generate a random state parameter for CSRF protection
    const state = randomBytes(32).toString('hex');
    
    // Store state in a cookie for validation (optional but recommended)
    const response = NextResponse.redirect(
      oauth2Client.generateAuthUrl({
        access_type: "offline", // get refresh token
        prompt: "consent",      // force new refresh token
        scope: GOOGLE_OAUTH_CONFIG.scopes,
        state: state,           // CSRF protection
        include_granted_scopes: true, // incremental authorization
      })
    );

    // Set state cookie (expires in 10 minutes)
    response.cookies.set('oauth_state', state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    });

    return response;
  } catch (error) {
    console.error("❌ Error generating OAuth URL:", error);
    return NextResponse.json(
      { error: "Failed to generate authorization URL" }, 
      { status: 500 }
    );
  }
}
