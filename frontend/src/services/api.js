import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

export const generatePost = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/generate`, data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail || 'Failed to generate post');
    }
    throw new Error('Network error or server is down');
  }
};
export const generateIdeas = async (category) => {
  try {
    const response = await axios.post(`${API_URL}/generate-ideas`, { category });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail || 'Failed to generate ideas');
    }
    throw new Error('Network error or server is down');
  }
};

export const enhancePost = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/enhance-post`, data);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.detail || 'Failed to enhance post');
    }
    throw new Error('Network error or server is down');
  }
};
