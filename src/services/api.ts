// src/services/api.ts
// This file handles all API calls to our backend server

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ⚠️ Change this IP based on your situation:
// Android Emulator  → 'http://10.0.2.2:5000/api'
// iOS Simulator     → 'http://localhost:5000/api'
// Real Phone        → 'http://YOUR_WIFI_IP:5000/api'
const BASE_URL = 'http://192.168.1.5:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// This runs before every request
// It automatically adds the token to every API call
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;