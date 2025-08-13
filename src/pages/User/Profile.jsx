import React, { useState, useEffect } from 'react';
import { userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  UserIcon, 
  SaveIcon, 
  GraduationCap,
  PhoneIcon,
  FileTextIcon,
  ChevronDownIcon,
  CalendarIcon,
  BookOpenIcon,
  AwardIcon
} from 'lucide-react';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    rollNumber: '',
    batchYear: '',
    departmentId: '',
    cgpa: '',
    resumeUrl: '',
    phoneNumber: '',
    currentStatus: 'NOT_PLACED'
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profileExists, setProfileExists] = useState(false); // NEW state to track existence

  useEffect(() => {
    if (user?.userId) {
      fetchDepartments();
      fetchStudentData();
    }
  }, [user?.userId]);

  const fetchDepartments = async () => {
    try {
      const response = await userAPI.getAllDepartments();
      console.log('Departments:', response.data);
      setDepartments(response.data);
      
    } catch (error) {
      console.error('Error fetching departments:', error);
      toast.error('Failed to load departments');
    }
  };

  const fetchStudentData = async () => {
    try {
      const response = await userAPI.getStudentDetails(user.userId);
      if (response.data) {
        setFormData({
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          rollNumber: response.data.rollNumber || '',
          batchYear: response.data.batchYear?.toString() || '',
          departmentId: response.data.departmentId?.toString() || '',
          cgpa: response.data.cgpa?.toString() || '',
          resumeUrl: response.data.resumeUrl || '',
          phoneNumber: response.data.phoneNumber || '',
          currentStatus: response.data.currentStatus || 'NOT_PLACED'
        });
        setProfileExists(true); // Mark that profile exists
        setIsEditing(false);
      } else {
        setProfileExists(false);
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
      setProfileExists(false); // No profile found
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      fetchStudentData(); // Reset form if canceling edit
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSubmit = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        rollNumber: formData.rollNumber,
        batchYear: parseInt(formData.batchYear),
        departmentId: parseInt(formData.departmentId),
        cgpa: parseFloat(formData.cgpa),
        resumeUrl: formData.resumeUrl,
        phoneNumber: formData.phoneNumber,
        currentStatus: formData.currentStatus
      };

      if (profileExists) {
        // Update existing profile
        await userAPI.updateStudentDetails(user.userId, dataToSubmit);
        toast.success('Profile updated successfully!');
      } else {
        // Create new profile
        console.log('Creating new profile:', dataToSubmit);
        await userAPI.saveStudentDetails(dataToSubmit);
        toast.success('Profile saved successfully!');
        setProfileExists(true);
      }
      
      await fetchStudentData();
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        'Failed to save profile'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
              <UserIcon className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Student Profile</h1>
              <p className="text-gray-600">
                {isEditing ? 'Edit your information' : 'View your profile details'}
              </p>
            </div>
          </div>
          <button
            onClick={handleEditToggle}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Personal Information
                </h2>
                
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="firstName"
                      required
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'
                      }`}
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="lastName"
                      required
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'
                      }`}
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <div className="relative">
                    <PhoneIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      name="phoneNumber"
                      required
                      pattern="[0-9]{10}"
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'
                      }`}
                      value={formData.phoneNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                  Academic Information
                </h2>
                
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number *</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      name="rollNumber"
                      required
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'
                      }`}
                      value={formData.rollNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Batch Year *</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      name="batchYear"
                      required
                      min="2000"
                      max="2100"
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'
                      }`}
                      value={formData.batchYear}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                  <div className="relative">
                    <BookOpenIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <select
                      name="departmentId"
                      required
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'
                      }`}
                      value={formData.departmentId}
                      onChange={handleChange}
                    >
                      <option value={formData.departmentId}>Select Department</option>
                      {departments.map(dept => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                    <ChevronDownIcon className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">CGPA *</label>
                  <div className="relative">
                    <AwardIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      name="cgpa"
                      step="0.01"
                      min="0"
                      max="10"
                      required
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'
                      }`}
                      value={formData.cgpa}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
                Placement Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Status</label>
                  <select
                    name="currentStatus"
                    disabled={!isEditing}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'
                    }`}
                    value={formData.currentStatus}
                    onChange={handleChange}
                  >
                    <option value="NOT_PLACED">Not Placed</option>
                  </select>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resume URL</label>
                  <div className="relative">
                    <FileTextIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="url"
                      name="resumeUrl"
                      disabled={!isEditing}
                      className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        isEditing ? 'border-gray-300' : 'border-transparent bg-gray-50'
                      }`}
                      placeholder="https://drive.google.com/..."
                      value={formData.resumeUrl}
                      onChange={handleChange}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Upload your resume to Google Drive or similar service and paste the public link here.
                  </p>
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  <SaveIcon className="h-5 w-5 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
