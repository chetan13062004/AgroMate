import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Upload a single file
export const uploadFile = async (file: File, fieldName = 'image'): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append(fieldName, file);

    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${getAuthToken()}`
      },
    });

    return response.data.url;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
};

// Upload multiple files
export const uploadFiles = async (files: File[], fieldName = 'images'): Promise<string[]> => {
  try {
    const formData = new FormData();
    files.forEach(file => {
      formData.append(fieldName, file);
    });

    const response = await axios.post(`${API_URL}/upload/multiple`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${getAuthToken()}`
      },
    });

    return response.data.urls;
  } catch (error) {
    console.error('Error uploading files:', error);
    throw new Error('Failed to upload files');
  }
};
