const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors({
  origin: ['http://localhost:8081', 'http://localhost:8080', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());

// Zr Express API configuration
const ZR_EXPRESS_CONFIG = {
  baseURL: 'https://procolis.com/api_v1',
  token: process.env.ZR_TOKEN || '758aac85305a8379120949f780630b395905e287f8abe9e84cfab5d2c8074488',
  apiKey: process.env.ZR_API_KEY || 'a98b913516104f8bb17e7c51f2c88ba1'
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'OrderFlow Backend Server is running',
    timestamp: new Date().toISOString()
  });
});

// Test Zr Express API connection
app.post('/api/zr-express/test', async (req, res) => {
  try {
    console.log('Testing Zr Express API connection...');
    
    const response = await axios.get(`${ZR_EXPRESS_CONFIG.baseURL}/token`, {
      headers: {
        'token': ZR_EXPRESS_CONFIG.token,
        'key': ZR_EXPRESS_CONFIG.apiKey
      },
      timeout: 10000
    });

    console.log('Zr Express API test successful:', response.status);
    res.json({ 
      success: true, 
      message: 'Zr Express API connection successful',
      status: response.status
    });
  } catch (error) {
    console.error('Zr Express API test failed:', error.message);
    
    // Try alternative endpoint
    try {
      const response = await axios.post(`${ZR_EXPRESS_CONFIG.baseURL}/tarification`, {}, {
        headers: {
          'Content-Type': 'application/json',
          'token': ZR_EXPRESS_CONFIG.token,
          'key': ZR_EXPRESS_CONFIG.apiKey
        },
        timeout: 10000
      });

      console.log('Alternative endpoint test successful:', response.status);
      res.json({ 
        success: true, 
        message: 'Zr Express API connection successful (alternative endpoint)',
        status: response.status
      });
    } catch (altError) {
      console.error('Alternative endpoint test failed:', altError.message);
      res.status(500).json({ 
        success: false, 
        message: 'Zr Express API connection failed',
        error: altError.message
      });
    }
  }
});

// Send orders to Zr Express
app.post('/api/zr-express/send-orders', async (req, res) => {
  try {
    const { orders } = req.body;
    
    if (!orders || !Array.isArray(orders) || orders.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No orders provided or invalid format'
      });
    }

    console.log(`Sending ${orders.length} orders to Zr Express...`);
    console.log('Orders data:', JSON.stringify(orders, null, 2));

    // Prepare colis data for Zr Express API
    const colisData = orders.map((order, index) => ({
      Tracking: `TRK${order.orderId.toString().padStart(6, '0')}`,
      TypeLivraison: order.deliveryType === "domicile" ? "0" : "1",
      TypeColis: "0",
      Confrimee: "1",
      Client: order.clientName,
      MobileA: order.phone,
      MobileB: order.phone,
      Adresse: order.address,
      IDWilaya: order.wilayaId ? order.wilayaId.toString() : "16",
      Commune: order.address ? order.address.split(',')[0] || order.address : "Alger",
      Total: order.totalPrice ? order.totalPrice.toString() : order.price.toString(),
      Note: `Order #${order.orderId} - ${order.productName}`,
      TProduit: order.productName,
      id_Externe: order.orderId.toString(),
      Source: "OrderFlow App"
    }));

    const requestBody = {
      Colis: colisData
    };

    console.log('Sending to Zr Express API:', JSON.stringify(requestBody, null, 2));

    // Send to Zr Express API
    const response = await axios.post(`${ZR_EXPRESS_CONFIG.baseURL}/add_colis`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        'token': ZR_EXPRESS_CONFIG.token,
        'key': ZR_EXPRESS_CONFIG.apiKey
      },
      timeout: 30000
    });

    console.log('Zr Express API response:', response.status, response.data);

    res.json({
      success: true,
      message: `${orders.length} orders sent to Zr Express successfully`,
      data: response.data,
      ordersProcessed: orders.length
    });

  } catch (error) {
    console.error('Error sending orders to Zr Express:', error.message);
    
    if (error.response) {
      console.error('API Error Response:', error.response.status, error.response.data);
      res.status(error.response.status).json({
        success: false,
        message: `Zr Express API error: ${error.response.status}`,
        error: error.response.data,
        ordersProcessed: 0
      });
    } else if (error.request) {
      console.error('Network Error:', error.request);
      res.status(503).json({
        success: false,
        message: 'Network error - unable to reach Zr Express API',
        error: error.message,
        ordersProcessed: 0
      });
    } else {
      console.error('Request Error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message,
        ordersProcessed: 0
      });
    }
  }
});

// Get Zr Express configuration
app.get('/api/zr-express/config', (req, res) => {
  res.json({
    baseURL: ZR_EXPRESS_CONFIG.baseURL,
    hasToken: !!ZR_EXPRESS_CONFIG.token,
    hasApiKey: !!ZR_EXPRESS_CONFIG.apiKey,
    tokenPreview: ZR_EXPRESS_CONFIG.token ? `***${ZR_EXPRESS_CONFIG.token.slice(-4)}` : null,
    apiKeyPreview: ZR_EXPRESS_CONFIG.apiKey ? `***${ZR_EXPRESS_CONFIG.apiKey.slice(-4)}` : null
  });
});

// Update Zr Express configuration
app.post('/api/zr-express/config', (req, res) => {
  const { token, apiKey, baseURL } = req.body;
  
  if (token) ZR_EXPRESS_CONFIG.token = token;
  if (apiKey) ZR_EXPRESS_CONFIG.apiKey = apiKey;
  if (baseURL) ZR_EXPRESS_CONFIG.baseURL = baseURL;

  console.log('Updated Zr Express configuration');
  
  res.json({
    success: true,
    message: 'Zr Express configuration updated successfully',
    config: {
      baseURL: ZR_EXPRESS_CONFIG.baseURL,
      hasToken: !!ZR_EXPRESS_CONFIG.token,
      hasApiKey: !!ZR_EXPRESS_CONFIG.apiKey
    }
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: error.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 OrderFlow Backend Server running on port ${PORT}`);
  console.log(`📡 Zr Express API: ${ZR_EXPRESS_CONFIG.baseURL}`);
  console.log(`🔑 Token: ${ZR_EXPRESS_CONFIG.token ? '***' + ZR_EXPRESS_CONFIG.token.slice(-4) : 'Not set'}`);
  console.log(`🔑 API Key: ${ZR_EXPRESS_CONFIG.apiKey ? '***' + ZR_EXPRESS_CONFIG.apiKey.slice(-4) : 'Not set'}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
});
