import express from 'express';
import axios from 'axios';

const router = express.Router();

// Token exchange endpoint
router.post('/token', async (req, res) => {
  const code = req.body.code;
  if (!code) return res.status(400).json({ error: 'Authorization code missing' });

  try {
    const response = await axios.post('https://auth.atlassian.com/oauth/token', {
      grant_type: 'authorization_code',
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
      redirect_uri: process.env.REDIRECT_URI
    });

    const { access_token } = response.data;
    res.json({ access_token });
  } catch (error) {
    console.error('Error exchanging code for token:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to exchange token', details: error.response?.data });
  }
});

// Projects endpoint
router.get('/projects', async (req, res) => {
  const authHeader = req.headers.authorization;
  const siteId = req.query.siteId;
  
  if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' });
  if (!siteId) return res.status(400).json({ error: 'Site ID is required' });

  try {
    const token = authHeader.replace('Bearer ', '');

    // Use the provided site ID directly instead of fetching accessible resources
    const cloudId = siteId;

    const projectsRes = await axios.get(`https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/project/search`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    res.json(projectsRes.data);
  } catch (error) {
    console.error('Error fetching projects:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch projects', details: error.response?.data });
  }
});

export default router;
