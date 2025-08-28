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
  origin: [
    'http://localhost:8081', 
    'http://localhost:8080', 
    'http://localhost:5173',
    process.env.FRONTEND_URL || 'https://your-frontend-domain.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());

// Zr Express API configuration
const ZR_EXPRESS_CONFIG = {
  baseURL: 'https://procolis.com/api_v1',
  token: process.env.ZR_TOKEN || 'ba0944108902044c2db381d57bcc8aff4cd3d621576893990e3c44e46541ee2c',
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

// Send orders to Zr Express - ULTRA SIMPLE VERSION
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

    // ULTRA SIMPLE order processing - no complex logic
    const colisData = orders.map((order, index) => {
      // Extract values with simple fallbacks - NO toString() calls
      const orderId = order.id || order.orderId || (index + 1);
      const clientName = order.clientName || "Unknown Client";
      const phone = order.phone || "";
      const address = order.address || "Unknown Address";
      const productName = order.productName || "Unknown Product";
      const deliveryType = order.deliveryType || "domicile";
      const wilayaId = order.wilayaId || 16;
      const totalPrice = order.totalPrice || order.price || 0;
      
      // Convert to strings using String() - SAFE
      const orderIdStr = String(orderId);
      const wilayaIdStr = String(wilayaId);
      const totalStr = String(totalPrice);
      
      // Get English wilaya name
      const wilayaNames = {
        1: 'Adrar - 01', 2: 'Chlef - 02', 3: 'Laghouat - 03', 4: 'Oum El Bouaghi - 04',
        5: 'Batna - 05', 6: 'Béjaïa - 06', 7: 'Biskra - 07', 8: 'Béchar - 08',
        9: 'Blida - 09', 10: 'Bouira - 10', 11: 'Tamanrasset - 11', 12: 'Tébessa - 12',
        13: 'Tlemcen - 13', 14: 'Tiaret - 14', 15: 'Tizi Ouzou - 15', 16: 'Alger - 16',
        17: 'Djelfa - 17', 18: 'Jijel - 18', 19: 'Sétif - 19', 20: 'Saïda - 20',
        21: 'Skikda - 21', 22: 'Sidi Bel Abbès - 22', 23: 'Annaba - 23', 24: 'Guelma - 24',
        25: 'Constantine - 25', 26: 'Médéa - 26', 27: 'Mostaganem - 27', 28: 'M\'Sila - 28',
        29: 'Mascara - 29', 30: 'Ouargla - 30', 31: 'Oran - 31', 32: 'El Bayadh - 32',
        33: 'Illizi - 33', 34: 'Bordj Bou Arréridj - 34', 35: 'Boumerdès - 35',
        36: 'El Tarf - 36', 37: 'Tindouf - 37', 38: 'Tissemsilt - 38', 39: 'El Oued - 39',
        40: 'Khenchela - 40', 41: 'Souk Ahras - 41', 42: 'Tipaza - 42', 43: 'Mila - 43',
        44: 'Aïn Defla - 44', 45: 'Naâma - 45', 46: 'Aïn Témouchent - 46', 47: 'Ghardaïa - 47',
        48: 'Relizane - 48', 49: 'Timimoun - 49', 50: 'Bordj Badji Mokhtar - 50',
        51: 'Ouled Djellal - 51', 52: 'Béni Abbès - 52', 53: 'In Salah - 53',
        54: 'In Guezzam - 54', 55: 'Touggourt - 55', 56: 'Djanet - 56',
        57: 'M\'Ghair - 57', 58: 'Meniaa - 58'
      };
      
      const wilayaNameEn = wilayaNames[wilayaId] || 'Alger - 16';
      
      // Simple commune extraction
      let commune = "Alger";
      if (address && address.includes(',')) {
        commune = address.split(',')[0].trim();
      } else if (address) {
        commune = address;
      }
      
      // Create the colis item
      const colisItem = {
        Tracking: `TRK${orderIdStr.padStart(6, '0')}`,
        TypeLivraison: deliveryType === "domicile" ? "0" : "1",
        TypeColis: "0",
        Confrimee: "1",
        Client: clientName,
        MobileA: phone,
        MobileB: phone,
        Adresse: address,
        IDWilaya: wilayaIdStr,
        Commune: commune,
        Total: totalStr,
        Note: `Order #${orderIdStr} - ${productName} - ${wilayaNameEn}`,
        TProduit: productName,
        id_Externe: orderIdStr,
        Source: "OrderFlow App"
      };
      
      console.log(`Processed order ${index + 1}:`, colisItem);
      return colisItem;
    });

    const requestBody = {
      Colis: colisData
    };

    console.log('Sending to Zr Express API:', JSON.stringify(requestBody, null, 2));

    // Try multiple authentication methods for sending orders
    const authMethods = [
      {
        name: 'Method 1: token and key headers',
        headers: {
          'Content-Type': 'application/json',
          'token': ZR_EXPRESS_CONFIG.token,
          'key': ZR_EXPRESS_CONFIG.apiKey
        }
      },
      {
        name: 'Method 2: Authorization header',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${ZR_EXPRESS_CONFIG.token}`,
          'X-API-Key': ZR_EXPRESS_CONFIG.apiKey
        }
      },
      {
        name: 'Method 3: Query parameters',
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          token: ZR_EXPRESS_CONFIG.token,
          key: ZR_EXPRESS_CONFIG.apiKey
        }
      }
    ];

    let response;
    let successfulMethod = null;

    for (const method of authMethods) {
      try {
        console.log(`Trying ${method.name} for sending orders...`);
        
        response = await axios.post(`${ZR_EXPRESS_CONFIG.baseURL}/add_colis`, requestBody, {
          headers: method.headers,
          params: method.params,
          timeout: 30000
        });

        console.log(`${method.name} successful:`, response.status, response.data);
        successfulMethod = method.name;
        break;
      } catch (methodError) {
        console.log(`${method.name} failed:`, methodError.message);
        if (methodError.response) {
          console.log('Error response:', methodError.response.status, methodError.response.data);
        }
        continue;
      }
    }

    if (!response) {
      throw new Error('All authentication methods failed for sending orders');
    }

    console.log('Zr Express API response:', response.status, response.data);

    res.json({
      success: true,
      message: `${orders.length} orders sent to Zr Express successfully using ${successfulMethod}`,
      data: response.data,
      ordersProcessed: orders.length,
      method: successfulMethod
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

// Webhook endpoint to receive order updates from Storeep
app.post('/api/webhook/order-updated', async (req, res) => {
  try {
    console.log('📦 Webhook received from Storeep - Order updated:', req.body);
    
    const { order, order_id, order_data, event_type } = req.body;
    
    // Handle different webhook payload formats from Storeep
    let orderData = null;
    
    if (order) {
      orderData = order;
    } else if (order_data) {
      orderData = order_data;
    } else if (req.body) {
      // If the entire body is the order data
      orderData = req.body;
    }
    
    if (!orderData) {
      console.log('❌ No order data found in webhook payload');
      return res.status(400).json({
        success: false,
        message: 'No order data found in webhook payload'
      });
    }
    
    // Convert single order to array format expected by send-orders endpoint
    const orders = Array.isArray(orderData) ? orderData : [orderData];
    
    console.log(`🔄 Processing ${orders.length} order(s) from Storeep webhook...`);
    
    // Send orders to ZR Express
    const response = await axios.post(`http://localhost:${PORT}/api/zr-express/send-orders`, {
      orders: orders
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Orders successfully sent to ZR Express via Storeep webhook');
    
    res.json({
      success: true,
      message: 'Order update received from Storeep and sent to ZR Express successfully',
      ordersProcessed: orders.length,
      webhookData: req.body
    });
    
  } catch (error) {
    console.error('❌ Storeep webhook processing error:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'Error processing Storeep webhook',
      error: error.message
    });
  }
});

// Webhook endpoint for new orders from Storeep
app.post('/api/webhook/order-created', async (req, res) => {
  try {
    console.log('🆕 Webhook received from Storeep - Order created:', req.body);
    
    // Same logic as order-updated
    const { order, order_id, order_data, event_type } = req.body;
    
    let orderData = null;
    
    if (order) {
      orderData = order;
    } else if (order_data) {
      orderData = order_data;
    } else if (req.body) {
      orderData = req.body;
    }
    
    if (!orderData) {
      console.log('❌ No order data found in webhook payload');
      return res.status(400).json({
        success: false,
        message: 'No order data found in webhook payload'
      });
    }
    
    const orders = Array.isArray(orderData) ? orderData : [orderData];
    
    console.log(`🔄 Processing ${orders.length} new order(s) from Storeep webhook...`);
    
    const response = await axios.post(`http://localhost:${PORT}/api/zr-express/send-orders`, {
      orders: orders
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ New orders successfully sent to ZR Express via Storeep webhook');
    
    res.json({
      success: true,
      message: 'New order received from Storeep and sent to ZR Express successfully',
      ordersProcessed: orders.length,
      webhookData: req.body
    });
    
  } catch (error) {
    console.error('❌ Storeep webhook processing error:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'Error processing Storeep webhook',
      error: error.message
    });
  }
});

// Webhook endpoint to receive order updates from your store
app.post('/api/webhook/order-updated', async (req, res) => {
  try {
    console.log('📦 Webhook received - Order updated:', req.body);
    
    const { order, order_id, order_data, event_type } = req.body;
    
    // Handle different webhook payload formats
    let orderData = null;
    
    if (order) {
      orderData = order;
    } else if (order_data) {
      orderData = order_data;
    } else if (req.body) {
      // If the entire body is the order data
      orderData = req.body;
    }
    
    if (!orderData) {
      console.log('❌ No order data found in webhook payload');
      return res.status(400).json({
        success: false,
        message: 'No order data found in webhook payload'
      });
    }
    
    // Convert single order to array format expected by send-orders endpoint
    const orders = Array.isArray(orderData) ? orderData : [orderData];
    
    console.log(`🔄 Processing ${orders.length} order(s) from webhook...`);
    
    // Send orders to ZR Express
    const response = await axios.post(`http://localhost:${PORT}/api/zr-express/send-orders`, {
      orders: orders
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
b    
    res.json({
      success: true,
      message: 'Order update received and sent to ZR Express successfully',
      ordersProcessed: orders.length,
      webhookData: req.body
    });
    
  } catch (error) {
    console.error('❌ Webhook processing error:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'Error processing webhook',
      error: error.message
    });
  }
});

// Webhook endpoint for order created events
app.post('/api/webhook/order-created', async (req, res) => {
  try {
    console.log('🆕 Webhook received - Order created:', req.body);
    
    // Same logic as order-updated
    const { order, order_id, order_data, event_type } = req.body;
    
    let orderData = null;
    
    if (order) {
      orderData = order;
    } else if (order_data) {
      orderData = order_data;
    } else if (req.body) {
      orderData = req.body;
    }
    
    if (!orderData) {
      console.log('❌ No order data found in webhook payload');
      return res.status(400).json({
        success: false,
        message: 'No order data found in webhook payload'
      });
    }
    
    const orders = Array.isArray(orderData) ? orderData : [orderData];
    
    console.log(`🔄 Processing ${orders.length} new order(s) from webhook...`);
    
    const response = await axios.post(`http://localhost:${PORT}/api/zr-express/send-orders`, {
      orders: orders
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ New orders successfully sent to ZR Express via webhook');
    
    res.json({
      success: true,
      message: 'New order received and sent to ZR Express successfully',
      ordersProcessed: orders.length,
      webhookData: req.body
    });
    
  } catch (error) {
    console.error('❌ Webhook processing error:', error.message);
    
    res.status(500).json({
      success: false,
      message: 'Error processing webhook',
      error: error.message
    });
  }
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
  console.log(`🚀 OrderFlow Backend Server (ULTRA FIXED) running on port ${PORT}`);
  console.log(`📡 Zr Express API: ${ZR_EXPRESS_CONFIG.baseURL}`);
  console.log(`🔑 Token: ${ZR_EXPRESS_CONFIG.token ? '***' + ZR_EXPRESS_CONFIG.token.slice(-4) : 'Not set'}`);
  console.log(`🔑 API Key: ${ZR_EXPRESS_CONFIG.apiKey ? '***' + ZR_EXPRESS_CONFIG.apiKey.slice(-4) : 'Not set'}`);
  console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
});
