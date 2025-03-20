import axios from 'axios';
import { SignInData, SignUpData } from '../services/authService';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const authApi = {
  async signUp(data: SignUpData) {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Failed to sign up');
      }
      throw new Error('Network error occurred');
    }
  },

  async signIn(data: SignInData) {
    try {
      const response = await axios.post(`${API_URL}/auth/signin`, data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Invalid credentials');
      }
      throw new Error('Network error occurred');
    }
  },

  async getCurrentUser(token: string) {
    try {
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw new Error('Failed to get user data');
    }
  }
};

export default authApi;
