import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { exchangeCodeForToken } from '../api';
import SiteSelector from '../components/SiteSelector';

const CallbackPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [showSiteSelector, setShowSiteSelector] = useState(false);

  useEffect(() => {
    const code = new URLSearchParams(location.search).get('code');
    const errorParam = new URLSearchParams(location.search).get('error');
    
    if (errorParam) {
      console.error('Error from Jira:', errorParam);
      setError(`Authentication error: ${errorParam}`);
      setLoading(false);
      return;
    }
    
    if (code) {
      console.log('Received code from Jira, exchanging for token...');
      exchangeCodeForToken(code)
        .then(response => {
          // Store the token in localStorage
          const accessToken = response.data.access_token;
          localStorage.setItem('jira_access_token', accessToken);
          console.log('Token exchange successful');
          setToken(accessToken);
          setLoading(false);
          setShowSiteSelector(true);
        })
        .catch((err) => {
          console.error('Token exchange failed:', err);
          setError('Authentication failed. Please try again. Error: ' + (err.response?.data?.error || err.message));
          setLoading(false);
        });
    } else {
      setError('No authorization code received from Jira.');
      setLoading(false);
    }
  }, [location, navigate]);

  const handleSiteSelect = (site) => {
    // Store the selected site information
    localStorage.setItem('jira_site_id', site.id);
    localStorage.setItem('jira_site_name', site.name);
    localStorage.setItem('jira_site_url', site.url);
    
    console.log('Site selected, redirecting to dashboard');
    navigate('/dashboard');
  };

  if (loading) {
    return <div>Authorizing with Jira...</div>;
  }

  if (showSiteSelector && token) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>Successfully Authenticated</h1>
        <SiteSelector token={token} onSiteSelect={handleSiteSelect} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/')}>Back to Login</button>
      </div>
    );
  }

  return <div>Processing authentication...</div>;
};

export default CallbackPage;
