import { useState } from 'react';

const ResumeForm = ({ resumeData, onResumeChange }) => {
  const [formData, setFormData] = useState(resumeData);

  const handleChange = (section, field, value, index = null) => {
    const updatedData = { ...formData };
    
    if (index !== null) {
      updatedData[section][index][field] = value;
    } else if (field) {
      updatedData[section][field] = value;
    } else {
      updatedData[section] = value;
    }
    
    setFormData(updatedData);
    onResumeChange(updatedData);
  };

  const addItem = (section) => {
    const updatedData = { ...formData };
    const template = getTemplateForSection(section);
    updatedData[section] = [...updatedData[section], template];
    setFormData(updatedData);
    onResumeChange(updatedData);
  };

  const removeItem = (section, index) => {
    const updatedData = { ...formData };
    updatedData[section] = updatedData[section].filter((_, i) => i !== index);
    setFormData(updatedData);
    onResumeChange(updatedData);
  };

  const getTemplateForSection = (section) => {
    switch(section) {
      case 'skills':
        return { title: '', level: '' };
      case 'experience':
        return { jobTitle: '', company: '', location: '', duration: '', responsibility: '' };
      case 'education':
        return { degree: '', university: '', location: '', graduationYear: '' };
      case 'certifications':
        return { title: '', issuingOrganization: '', year: '' };
      case 'projects':
        return { title: '', description: '', technologiesUsed: [], githubLink: '' };
      case 'achievements':
        return { title: '', year: '', extraInformation: '' };
      case 'languages':
        return { id: Date.now(), name: '' };
      case 'interests':
        return { id: Date.now(), name: '' };
      default:
        return {};
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Your Resume</h2>
      
      {/* Personal Information */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.personalInformation.fullName}
              onChange={(e) => handleChange('personalInformation', 'fullName', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.personalInformation.email}
              onChange={(e) => handleChange('personalInformation', 'email', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.personalInformation.phoneNumber}
              onChange={(e) => handleChange('personalInformation', 'phoneNumber', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.personalInformation.location}
              onChange={(e) => handleChange('personalInformation', 'location', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
            <input
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.personalInformation.linkedIn}
              onChange={(e) => handleChange('personalInformation', 'linkedIn', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
            <input
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.personalInformation.gitHub}
              onChange={(e) => handleChange('personalInformation', 'gitHub', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Professional Summary</h3>
        <textarea
          rows="4"
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          value={formData.summary}
          onChange={(e) => handleChange('summary', null, e.target.value)}
        />
      </div>

      {/* Skills */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-700">Skills</h3>
          <button
            type="button"
            onClick={() => addItem('skills')}
            className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
          >
            Add Skill
          </button>
        </div>
        {formData.skills.map((skill, index) => (
          <div key={index} className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={skill.title}
                onChange={(e) => handleChange('skills', 'title', e.target.value, index)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={skill.level}
                onChange={(e) => handleChange('skills', 'level', e.target.value, index)}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
            <button
              type="button"
              onClick={() => removeItem('skills', index)}
              className="px-3 py-2 bg-red-600 text-white rounded-md text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Experience */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-700">Work Experience</h3>
          <button
            type="button"
            onClick={() => addItem('experience')}
            className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
          >
            Add Experience
          </button>
        </div>
        {formData.experience.map((exp, index) => (
          <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={exp.jobTitle}
                  onChange={(e) => handleChange('experience', 'jobTitle', e.target.value, index)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={exp.company}
                  onChange={(e) => handleChange('experience', 'company', e.target.value, index)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={exp.location}
                  onChange={(e) => handleChange('experience', 'location', e.target.value, index)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={exp.duration}
                  onChange={(e) => handleChange('experience', 'duration', e.target.value, index)}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Responsibilities</label>
              <textarea
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={exp.responsibility}
                onChange={(e) => handleChange('experience', 'responsibility', e.target.value, index)}
              />
            </div>
            <button
              type="button"
              onClick={() => removeItem('experience', index)}
              className="px-3 py-2 bg-red-600 text-white rounded-md text-sm"
            >
              Remove Experience
            </button>
          </div>
        ))}
      </div>

      {/* Education */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-700">Education</h3>
          <button
            type="button"
            onClick={() => addItem('education')}
            className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
          >
            Add Education
          </button>
        </div>
        {formData.education.map((edu, index) => (
          <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={edu.degree}
                  onChange={(e) => handleChange('education', 'degree', e.target.value, index)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">University</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={edu.university}
                  onChange={(e) => handleChange('education', 'university', e.target.value, index)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={edu.location}
                  onChange={(e) => handleChange('education', 'location', e.target.value, index)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={edu.graduationYear}
                  onChange={(e) => handleChange('education', 'graduationYear', e.target.value, index)}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeItem('education', index)}
              className="mt-4 px-3 py-2 bg-red-600 text-white rounded-md text-sm"
            >
              Remove Education
            </button>
          </div>
        ))}
      </div>

      {/* Projects */}
      <div className="mb-8 p-4 border border-gray-200 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-700">Projects</h3>
          <button
            type="button"
            onClick={() => addItem('projects')}
            className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
          >
            Add Project
          </button>
        </div>
        {formData.projects.map((project, index) => (
          <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={project.title}
                onChange={(e) => handleChange('projects', 'title', e.target.value, index)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={project.description}
                onChange={(e) => handleChange('projects', 'description', e.target.value, index)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Technologies Used (comma separated)</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={project.technologiesUsed.join(', ')}
                onChange={(e) => handleChange('projects', 'technologiesUsed', e.target.value.split(',').map(t => t.trim()), index)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Link</label>
              <input
                type="url"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={project.githubLink}
                onChange={(e) => handleChange('projects', 'githubLink', e.target.value, index)}
              />
            </div>
            <button
              type="button"
              onClick={() => removeItem('projects', index)}
              className="px-3 py-2 bg-red-600 text-white rounded-md text-sm"
            >
              Remove Project
            </button>
          </div>
        ))}
      </div>

      {/* Other sections like Certifications, Achievements, Languages, Interests would follow similar patterns */}
      
    </div>
  );
};

export default ResumeForm;