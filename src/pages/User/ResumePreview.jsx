import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

const ResumePreview = ({ resumeData }) => {
  const resumeRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: resumeRef, // ✅ New API usage
    pageStyle: `
      @page {
        size: A4;
        margin: 1cm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
        }
      }
    `,
    documentTitle: `${resumeData.personalInformation.fullName || 'Resume'}_Resume`,
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header Buttons */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Resume Preview</h2>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Download PDF
        </button>
      </div>

      {/* Resume Content */}
      <div ref={resumeRef} className="bg-white p-8 shadow-lg">
        {/* Header */}
        <div className="border-b-2 border-gray-200 pb-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            {resumeData.personalInformation.fullName}
          </h1>
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2 text-gray-600">
            <span>{resumeData.personalInformation.email}</span>
            <span>{resumeData.personalInformation.phoneNumber}</span>
            <span>{resumeData.personalInformation.location}</span>
            {resumeData.personalInformation.linkedIn && (
              <a
                href={resumeData.personalInformation.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                LinkedIn
              </a>
            )}
            {resumeData.personalInformation.gitHub && (
              <a
                href={resumeData.personalInformation.gitHub}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                GitHub
              </a>
            )}
          </div>
        </div>

        {/* Summary */}
        {resumeData.summary && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-3">
              Summary
            </h2>
            <p className="text-gray-700">{resumeData.summary}</p>
          </div>
        )}

        {/* Skills */}
        {resumeData.skills.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-3">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill, index) => (
                <div
                  key={index}
                  className="bg-gray-100 px-3 py-1 rounded-full"
                >
                  <span className="font-medium">{skill.title}</span>
                  {skill.level && (
                    <span className="text-gray-600 text-sm ml-1">
                      ({skill.level})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {resumeData.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-3">
              Experience
            </h2>
            {resumeData.experience.map((exp, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium text-gray-800">
                    {exp.jobTitle}
                  </h3>
                  <span className="text-gray-600">{exp.duration}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>{exp.company}</span>
                  <span>{exp.location}</span>
                </div>
                <p className="mt-2 text-gray-700 whitespace-pre-line">
                  {exp.responsibility}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {resumeData.education.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-3">
              Education
            </h2>
            {resumeData.education.map((edu, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium text-gray-800">
                    {edu.degree}
                  </h3>
                  <span className="text-gray-600">{edu.graduationYear}</span>
                </div>
                <div className="text-gray-700">
                  <span>{edu.university}</span>
                  {edu.location && (
                    <span className="ml-2">{edu.location}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {resumeData.projects.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-3">
              Projects
            </h2>
            {resumeData.projects.map((project, index) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium text-gray-800">
                    {project.title}
                  </h3>
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View on GitHub
                    </a>
                  )}
                </div>
                <p className="mt-1 text-gray-700 whitespace-pre-line">
                  {project.description}
                </p>
                {project.technologiesUsed.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {project.technologiesUsed.map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="bg-gray-100 px-2 py-1 rounded text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {resumeData.certifications.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-3">
              Certifications
            </h2>
            <ul className="list-disc pl-5">
              {resumeData.certifications.map((cert, index) => (
                <li key={index} className="mb-2">
                  <span className="font-medium">{cert.title}</span> -{' '}
                  {cert.issuingOrganization} ({cert.year})
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Languages */}
        {resumeData.languages.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-1 mb-3">
              Languages
            </h2>
            <div className="flex flex-wrap gap-2">
              {resumeData.languages.map((lang, index) => (
                <span
                  key={index}
                  className="bg-gray-100 px-3 py-1 rounded-full"
                >
                  {lang.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumePreview;
