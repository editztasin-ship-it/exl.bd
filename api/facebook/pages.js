export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method not allowed"
    });
  }

  const accessToken = req.query.access_token;

  if (!accessToken) {
    return res.status(400).json({
      success: false,
      error: "Facebook access token is required"
    });
  }

  try {
    const url =
      "https://graph.facebook.com/v23.0/me/accounts" +
      "?fields=id,name,category,link,picture,access_token" +
      "&access_token=" +
      encodeURIComponent(accessToken);

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({
        success: false,
        error: "Could not get Facebook Pages",
        details: data
      });
    }

    return res.status(200).json({
      success: true,
      pages: data.data || []
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "Facebook Pages API request failed",
      details: error.message
    });
  }
}
