export default async function handler(req, res) {
  const { code, error, error_description } = req.query;

  if (error) {
    return res.status(400).json({
      success: false,
      error: error_description || "Facebook login cancelled"
    });
  }

  if (!code) {
    return res.status(400).json({
      success: false,
      error: "Facebook authorization code missing"
    });
  }

  const appId = process.env.FACEBOOK_APP_ID;
  const appSecret = process.env.FACEBOOK_APP_SECRET;
  const redirectUri = process.env.FACEBOOK_REDIRECT_URI;

  if (!appId || !appSecret || !redirectUri) {
    return res.status(500).json({
      success: false,
      error: "Facebook environment variables are missing"
    });
  }

  try {
    const tokenUrl =
      "https://graph.facebook.com/v23.0/oauth/access_token" +
      "?client_id=" + encodeURIComponent(appId) +
      "&client_secret=" + encodeURIComponent(appSecret) +
      "&redirect_uri=" + encodeURIComponent(redirectUri) +
      "&code=" + encodeURIComponent(code);

    const tokenResponse = await fetch(tokenUrl);
    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenData.access_token) {
      return res.status(400).json({
        success: false,
        error: "Could not get Facebook access token",
        details: tokenData
      });
    }

    const accessToken = tokenData.access_token;

    const profileUrl =
      "https://graph.facebook.com/v23.0/me" +
      "?fields=id,name,email,picture" +
      "&access_token=" + encodeURIComponent(accessToken);

    const profileResponse = await fetch(profileUrl);
    const profileData = await profileResponse.json();

    if (!profileResponse.ok) {
      return res.status(400).json({
        success: false,
        error: "Could not get Facebook profile",
        details: profileData
      });
    }

    return res.status(200).json({
      success: true,
      message: "Facebook connected successfully",
      user: profileData
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Facebook API request failed",
      details: error.message
    });
  }
    }
