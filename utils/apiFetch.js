import { Auth } from 'googleapis';
import { auth } from '../frontend/src/firebase';

const apiFetch = async (url, options = {}) => {
  try {
    const token = await auth.currentUser.getIdToken();

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    const response = await fetch(url, {
      ...options,
      headers
    });
    if (!response.ok) {
      throw new Error('API Error: ' + response.statusText);
    }
    return response.json();
  } catch (error) {
    console.error('Error in API call:', error);
    throw error;
  }
};
export default apiFetch;
