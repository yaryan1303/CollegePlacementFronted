import { useState } from 'react';
import PromptForm from './pages/User/PromptForm';
import ResumePreview from './pages/User/ResumePreview';
import ResumeForm from './pages/User/ResumeForm';

const initialResumeData = {
  personalInformation: {
    fullName: '',
    email: '',
    phoneNumber: '',
    location: '',
    linkedIn: '',
    gitHub: '',
    portfolio: null,
  },
  summary: '',
  skills: [],
  experience: [],
  education: [],
  certifications: [],
  projects: [],
  achievements: [],
  languages: [],
  interests: [],
};

const ResumeGenerator = () => {
  const [resumeData, setResumeData] = useState(initialResumeData);
  const [step, setStep] = useState('prompt'); // 'prompt', 'edit', 'preview'

  const handleResumeGenerated = (data) => {
    setResumeData(data);
    setStep('edit');
  };

  const handleResumeChange = (updatedData) => {
    setResumeData(updatedData);
  };

  const handleEditComplete = () => {
    setStep('preview');
  };

  const handleBackToEdit = () => {
    setStep('edit');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        {step === 'prompt' && (
          <PromptForm onResumeGenerated={handleResumeGenerated} />
        )}

        {step === 'edit' && (
          <>
            <ResumeForm
              resumeData={resumeData}
              onResumeChange={handleResumeChange}
            />
            <div className="max-w-4xl mx-auto mt-6 flex justify-end">
              <button
                onClick={handleEditComplete}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Preview Resume
              </button>
            </div>
          </>
        )}

        {step === 'preview' && (
          <>
            <ResumePreview resumeData={resumeData} />
            <div className="max-w-4xl mx-auto mt-6 flex justify-end">
              <button
                onClick={handleBackToEdit}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 mr-4"
              >
                Back to Edit
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResumeGenerator;
