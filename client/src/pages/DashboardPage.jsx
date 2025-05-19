import React, { useState, useEffect } from 'react';
import { getProjects } from '../api';
import ProjectList from '../components/ProjectList';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [siteInfo, setSiteInfo] = useState({
    id: '',
    name: '',
    url: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Get the selected site from localStorage
    const siteId = localStorage.getItem('jira_site_id');
    const siteName = localStorage.getItem('jira_site_name');
    const siteUrl = localStorage.getItem('jira_site_url');
    
    if (!siteId) {
      setError('No Jira site selected. Please log in again.');
      setLoading(false);
      return;
    }
    
    setSiteInfo({
      id: siteId,
      name: siteName || 'Unknown',
      url: siteUrl || 'Unknown'
    });

    const fetchProjects = async () => {
      try {
        const response = await getProjects(siteId);
        setProjects(response.data.values || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Failed to load projects. Please try again.');
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jira_access_token');
    localStorage.removeItem('jira_site_id');
    localStorage.removeItem('jira_site_name');
    localStorage.removeItem('jira_site_url');
    navigate('/');
  };

  if (loading) return <div>Loading projects...</div>;
  if (error) return (
    <div>
      <p>{error}</p>
      <button onClick={() => navigate('/')}>Back to Login</button>
    </div>
  );

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Your Jira Projects</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <h3>Site: {siteInfo.name} ({siteInfo.url})</h3>
      {projects.length > 0 ? (
        <ProjectList projects={projects} />
      ) : (
        <p>No projects found for this site.</p>
      )}
    </div>
  );
};

export default DashboardPage;
