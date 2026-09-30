export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const appId = process.env.FACEBOOK_APP_ID;
  const redirectUri = process.env.FACEBOOK_REDIRECT_URI;

  if (!appId || !redirectUri) {
    return res.status(500).json({
      error: "Facebook environment variables are missing"
    });
  }

  const state =
    globalThis.crypto?.randomUUID?.() ||
    Math.random().toString(36).slice(2);

  const facebookAuthUrl =
    "https://www.facebook.com/v23.0/dialog/oauth" +
    "?client_id=" + encodeURIComponent(appId) +
    "&redirect_uri=" + encodeURIComponent(redirectUri) +
    "&state=" + encodeURIComponent(state) +
    "&scope=" + encodeURIComponent(
      "public_profile,email,pages_show_list,pages_read_engagement"
    );

  return res.redirect(302, facebookAuthUrl);
      }
