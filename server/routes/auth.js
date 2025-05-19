// backend/routes/auth.js or wherever you handle `/api/auth/token`
router.post('/token', async (req, res) => {
  const { code } = req.body;
  const tokenUrl = 'https://auth.atlassian.com/oauth/token';
  
  try {
    const response = await axios.post(tokenUrl, {
      grant_type: 'authorization_code',
      client_id: process.env.JIRA_CLIENT_ID,
      client_secret: process.env.JIRA_CLIENT_SECRET,
      code,
      redirect_uri: process.env.JIRA_REDIRECT_URI,
    });

    res.json(response.data);
  } catch (error) {
    console.error('Token exchange failed:', error.response?.data || error.message);
    res.status(500).json({ error: 'Authentication failed' });
  }
});
