import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthTokens, Post, PostCreate, Recipe, RecipeCreate } from '../types';

const API_BASE_URL = 'http://localhost:8000/api/v1';

// Token management
const TOKEN_KEY = 'auth_token';

export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

export const setAuthToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error('Error setting auth token:', error);
  }
};

export const removeAuthToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    console.error('Error removing auth token:', error);
  }
};

// API request helper
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = await getAuthToken();
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.detail || 'API request failed');
    }
    
    return data;
  } catch (error) {
    console.error(`API request error for ${endpoint}:`, error);
    throw error;
  }
};

// Auth API
export const authApi = {
  register: async (username: string, email: string, password: string): Promise<User> => {
    return apiRequest('/users/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    });
  },

  login: async (email: string, password: string): Promise<AuthTokens> => {
    return apiRequest('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  getProfile: async (): Promise<User> => {
    return apiRequest('/users/profile');
  },
};

// Posts API
export const postsApi = {
  getPosts: async (skip: number = 0, limit: number = 100): Promise<Post[]> => {
    return apiRequest(`/posts?skip=${skip}&limit=${limit}`);
  },

  createPost: async (postData: PostCreate): Promise<Post> => {
    return apiRequest('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  },

  getPost: async (postId: number): Promise<Post> => {
    return apiRequest(`/posts/${postId}`);
  },
};

// Recipes API
export const recipesApi = {
  getRecipes: async (skip: number = 0, limit: number = 100): Promise<Recipe[]> => {
    return apiRequest(`/recipes?skip=${skip}&limit=${limit}`);
  },

  createRecipe: async (recipeData: RecipeCreate): Promise<Recipe> => {
    return apiRequest('/recipes', {
      method: 'POST',
      body: JSON.stringify(recipeData),
    });
  },

  getRecipe: async (recipeId: number): Promise<Recipe> => {
    return apiRequest(`/recipes/${recipeId}`);
  },
};