import React from 'react';

const LoginPage = () => {
  const handleLogin = () => {
    // Use the same client ID and redirect URI as in your .env file
    const clientId = 'wGTpCLQrCcKRdRPskNagt4GknOhyVJOi';
    const redirectUri = 'http://localhost:3000/callback';
    const scopes = [
      'read:jira-work',
      'read:jira-user',
      'read:me',
      'offline_access'
    ];
    
    // Build the authorization URL
    const authUrl = `https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=${clientId}&scope=${encodeURIComponent(scopes.join(' '))}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&prompt=consent`;

    window.location.href = authUrl;
  };

  return (
    <div style={{ textAlign: 'center', paddingTop: '100px' }}>
      <h1>Login with Jira</h1>
      <button onClick={handleLogin}>Login with Jira</button>
    </div>
  );
};

export default LoginPage;
