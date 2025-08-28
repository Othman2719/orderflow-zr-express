// API Configuration Management
export interface ApiConfig {
  token: string;
  apiKey: string;
  baseUrl: string;
}

const API_CONFIG_KEY = 'orderflow_api_config';
const BACKEND_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Default API configuration
const defaultConfig: ApiConfig = {
  token: "758aac85305a8379120949f780630b395905e287f8abe9e84cfab5d2c8074488",
  apiKey: "a98b913516104f8bb17e7c51f2c88ba1",
  baseUrl: "https://procolis.com/api_v1"
};

// Get API configuration from localStorage
export const getApiConfig = (): ApiConfig => {
  try {
    const saved = localStorage.getItem(API_CONFIG_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Error loading API config:', error);
  }
  return defaultConfig;
};

// Save API configuration to localStorage
export const saveApiConfig = (config: ApiConfig): void => {
  try {
    localStorage.setItem(API_CONFIG_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('Error saving API config:', error);
  }
};

// Clear API configuration
export const clearApiConfig = (): void => {
  try {
    localStorage.removeItem(API_CONFIG_KEY);
  } catch (error) {
    console.error('Error clearing API config:', error);
  }
};

// Test API connection using backend server
export const testApiConnection = async (config: ApiConfig): Promise<boolean> => {
  try {
    console.log('Testing API connection via backend server...');
    
    // Update backend configuration first
    await fetch(`${BACKEND_BASE_URL}/zr-express/config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(config)
    });

    // Test connection via backend
    const response = await fetch(`${BACKEND_BASE_URL}/zr-express/test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('API connection test successful via backend');
      return true;
    } else {
      console.log('API connection test failed via backend:', result.message);
      return false;
    }
  } catch (error) {
    console.error('Backend connection test failed:', error);
    return false;
  }
};

// Send orders to Zr Express via backend server
export const sendOrdersToZrExpress = async (orders: any[]): Promise<{ success: boolean; message: string; data?: any }> => {
  try {
    console.log(`Sending ${orders.length} orders via backend server...`);
    
    const response = await fetch(`${BACKEND_BASE_URL}/zr-express/send-orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ orders })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('Orders sent successfully via backend:', result);
      return { success: true, message: result.message, data: result.data };
    } else {
      console.error('Failed to send orders via backend:', result);
      return { success: false, message: result.message };
    }
  } catch (error) {
    console.error('Backend send orders failed:', error);
    return { success: false, message: 'Failed to connect to backend server' };
  }
};
