// src/app/api/auth/callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { GOOGLE_OAUTH_CONFIG } from "@/config/oauth";
import { db } from "@/config/firebase";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  // Handle OAuth errors
  if (error) {
    console.error("❌ OAuth error:", error);
    return NextResponse.json({ error: `OAuth error: ${error}` }, { status: 400 });
  }

  if (!code) {
    return NextResponse.json({ error: "No authorization code provided" }, { status: 400 });
  }

  // Validate state parameter for CSRF protection
  const cookieState = req.cookies.get('oauth_state')?.value;
  if (!state || !cookieState || state !== cookieState) {
    console.error("❌ Invalid or missing state parameter");
    return NextResponse.json({ error: "Invalid state parameter" }, { status: 400 });
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      GOOGLE_OAUTH_CONFIG.clientId,
      GOOGLE_OAUTH_CONFIG.clientSecret,
      GOOGLE_OAUTH_CONFIG.redirectUri
    );

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    
    if (!tokens.access_token) {
      throw new Error("No access token received");
    }

    oauth2Client.setCredentials(tokens);

    // Get user info from Google
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();
    
    if (!userInfo.data.email) {
      throw new Error("Could not retrieve user email");
    }

    const userEmail = userInfo.data.email;

    // 🔑 Save tokens to Firestore
    const tokenData = {
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expiry_date: tokens.expiry_date,
      scope: tokens.scope,
      token_type: tokens.token_type,
      user_email: userEmail,
      user_name: userInfo.data.name || "",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    await db.collection("tokens").doc(userEmail).set(tokenData, { merge: true });

    console.log(`✅ Saved tokens for ${userEmail}`);

    // Return success response without exposing tokens
    return NextResponse.json({
      message: "Authentication successful",
      user: {
        email: userEmail,
        name: userInfo.data.name,
        picture: userInfo.data.picture,
      },
      success: true,
    });

  } catch (err: any) {
    console.error("❌ Error in OAuth callback:", err);
    
    // Return more specific error messages
    if (err.message?.includes("invalid_grant")) {
      return NextResponse.json({ error: "Authorization code expired or invalid" }, { status: 400 });
    }
    
    if (err.message?.includes("access_denied")) {
      return NextResponse.json({ error: "User denied access" }, { status: 403 });
    }

    return NextResponse.json({ 
      error: "Authentication failed", 
      details: process.env.NODE_ENV === "development" ? err.message : undefined 
    }, { status: 500 });
  }
}
