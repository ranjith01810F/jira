// src/components/ProjectList.jsx
import React from 'react';

const ProjectList = ({ projects }) => (
  <ul>
    {projects.map((project) => (
      <li key={project.id}>{project.name}</li>
    ))}
  </ul>
);

export default ProjectList;
