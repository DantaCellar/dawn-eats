// Base API Response Types
export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
}

// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  updated_at?: string;
}

export interface AuthTokens {
  access_token: string;
  token_type: string;
}

// Post Types
export interface Post {
  id: number;
  title: string;
  description?: string;
  image_url?: string;
  user_id: number;
  author: User;
  created_at: string;
  updated_at?: string;
}

export interface PostCreate {
  title: string;
  description?: string;
  image_url?: string;
}

// Recipe Types
export interface Recipe {
  id: number;
  title: string;
  description?: string;
  ingredients?: string[];
  instructions?: string;
  nutrition_info?: Record<string, any>;
  user_id: number;
  author: User;
  created_at: string;
  updated_at?: string;
}

export interface RecipeCreate {
  title: string;
  description?: string;
  ingredients?: string[];
  instructions?: string;
  nutrition_info?: Record<string, any>;
}

// Navigation Types
export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Discover: undefined;
  Post: undefined;
  Profile: undefined;
};