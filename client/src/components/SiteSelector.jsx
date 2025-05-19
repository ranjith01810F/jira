import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SiteSelector = ({ token, onSiteSelect }) => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSite, setSelectedSite] = useState('');

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const response = await axios.get('https://api.atlassian.com/oauth/token/accessible-resources', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSites(response.data || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching sites:', err);
        setError('Failed to load available Jira sites. Please try again.');
        setLoading(false);
      }
    };

    if (token) {
      fetchSites();
    }
  }, [token]);

  const handleSiteChange = (e) => {
    const siteId = e.target.value;
    const selectedSite = sites.find(site => site.id === siteId);
    setSelectedSite(siteId);
    
    if (selectedSite && onSiteSelect) {
      onSiteSelect(selectedSite);
    }
  };

  if (loading) return <div>Loading available Jira sites...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div style={{ marginBottom: '20px' }}>
      <h2>Select a Jira Site</h2>
      {sites.length > 0 ? (
        <div>
          <select 
            id="site-select" 
            onChange={handleSiteChange} 
            value={selectedSite}
            style={{ padding: '8px', minWidth: '300px' }}
          >
            <option value="">Choose a site</option>
            {sites.map(site => (
              <option key={site.id} value={site.id}>
                {site.name} ({site.url})
              </option>
            ))}
          </select>
          {selectedSite && (
            <button 
              onClick={() => onSiteSelect(sites.find(site => site.id === selectedSite))}
              style={{ marginLeft: '10px', padding: '8px 16px' }}
            >
              Continue
            </button>
          )}
        </div>
      ) : (
        <p>No Jira sites found for your account. Please make sure you have access to at least one Jira site.</p>
      )}
    </div>
  );
};

export default SiteSelector;